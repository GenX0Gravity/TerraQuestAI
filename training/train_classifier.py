#!/usr/bin/env python3
"""
TerraQuest AI — Open-Source Species Classifier Training Pipeline
Fine-tunes lightweight vision backbones (MobileNetV3 / EfficientNet) on Kaggle or open datasets.

Features:
- Transfer learning with pretrained ImageNet weights
- Nature-specific data augmentation (flips, random rotation, color jitter)
- Cosine Annealing learning rate scheduler & AdamW optimizer
- Top-1 and Top-5 accuracy validation tracking
- Automatic export to ONNX format (for fast client-side or edge runtime)
- Automatic export of `species_classes.json` taxonomy mapping

Usage:
    # Train on Oxford 102 Flowers:
    python train_classifier.py --dataset flowers102 --epochs 10 --batch-size 32

    # Train on Kaggle Birds 525 or custom ImageFolder:
    python train_classifier.py --data-dir ./data/birds525 --model mobilenet_v3_large --epochs 15
"""

import os
import sys
import json
import time
import argparse
from pathlib import Path

try:
    import torch
    import torch.nn as nn
    import torch.optim as optim
    from torch.utils.data import DataLoader, Dataset
    import torchvision
    from torchvision import transforms, models
    from torchvision.datasets import ImageFolder, Flowers102
    from PIL import Image
except ImportError as e:
    print(f"❌ Missing required ML dependencies: {e}")
    print("Please install requirements: pip install -r training/requirements.txt")
    sys.exit(1)


# Oxford Flowers 102 class mapping (standard benchmark names)
FLOWER_NAMES_102 = [
    "pink primrose", "hard-leaved pocket orchid", "canterbury bells", "sweet pea", "english marigold",
    "tiger lily", "moon orchid", "bird of paradise", "monkshood", "globe thistle", "snapdragon",
    "colt's foot", "king protea", "spear thistle", "yellow iris", "globe-flower", "purple coneflower",
    "peruvian lily", "balloon flower", "giant white arum lily", "fire lily", "pincushion flower",
    "fritillary", "red ginger", "grape hyacinth", "corn poppy", "prince of wales feathers",
    "stemless gentian", "artichoke", "sweet william", "carnation", "garden phlox", "love in the mist",
    "mexican aster", "alpine sea holly", "ruby-lipped cattleya", "cape plumbago", "stemless lady's slipper",
    "siam tulip", "lenten rose", "barbeton daisy", "daffodil", "sword lily", "poinsettia", "bolero deep blue",
    "wallflower", "marigold", "buttercup", "oxeye daisy", "common dandelion", "petunia", "wild pansy",
    "primula", "sunflower", "pelargonium", "bishop of llandaff", "gaura", "geranium", "orange dahlia",
    "pink-yellow dahlia", "cautleya spicata", "japanese anemone", "black-eyed susan", "silverbush",
    "californian poppy", "osteospermum", "spring crocus", "bearded iris", "windflower", "tree poppy",
    "gazania", "azalea", "water lily", "rose", "thorn apple", "morning glory", "passion flower", "lotus",
    "toad lily", "anthurium", "frangipani", "clematis", "hibiscus", "columbine", "desert-rose", "tree mallow",
    "magnolia", "cyclamen", "watercress", "canna lily", "hippeastrum", "bee balm", "ball moss", "foxglove",
    "bougainvillea", "camellia", "mallow", "mexican petunia", "bromelia", "blanket flower", "trumpet creeper",
    "blackberry lily"
]


def get_transforms():
    """Returns training and validation transforms optimized for nature photographs."""
    train_transform = transforms.Compose([
        transforms.RandomResizedCrop(224, scale=(0.7, 1.0)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.05),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    val_transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    return train_transform, val_transform


def build_model(model_name: str, num_classes: int):
    """Builds a vision model with a custom classification head."""
    print(f"📦 Loading pretrained backbone: {model_name}...")
    if model_name == "mobilenet_v3_large":
        model = models.mobilenet_v3_large(weights=models.MobileNet_V3_Large_Weights.DEFAULT)
        in_features = model.classifier[3].in_features
        model.classifier[3] = nn.Sequential(
            nn.Dropout(p=0.3),
            nn.Linear(in_features, num_classes)
        )
    elif model_name == "efficientnet_b0":
        model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
        in_features = model.classifier[1].in_features
        model.classifier[1] = nn.Sequential(
            nn.Dropout(p=0.3),
            nn.Linear(in_features, num_classes)
        )
    elif model_name == "resnet50":
        model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
        in_features = model.fc.in_features
        model.fc = nn.Sequential(
            nn.Dropout(p=0.4),
            nn.Linear(in_features, num_classes)
        )
    else:
        raise ValueError(f"Unsupported model architecture: {model_name}")

    return model


def train_one_epoch(model, loader, criterion, optimizer, scaler, device):
    """Trains the model for one epoch with mixed precision if available."""
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0

    for inputs, labels in loader:
        inputs, labels = inputs.to(device), labels.to(device)
        optimizer.zero_grad()

        if device.type == "cuda":
            with torch.amp.autocast(device_type="cuda"):
                outputs = model(inputs)
                loss = criterion(outputs, labels)
            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()
        else:
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

        running_loss += loss.item() * inputs.size(0)
        _, preds = torch.max(outputs, 1)
        correct += torch.sum(preds == labels.data).item()
        total += labels.size(0)

    epoch_loss = running_loss / total
    epoch_acc = (correct / total) * 100.0
    return epoch_loss, epoch_acc


def validate(model, loader, criterion, device):
    """Evaluates top-1 and top-5 accuracy on validation data."""
    model.eval()
    running_loss = 0.0
    correct_top1 = 0
    correct_top5 = 0
    total = 0

    with torch.no_grad():
        for inputs, labels in loader:
            inputs, labels = inputs.to(device), labels.to(device)
            outputs = model(inputs)
            loss = criterion(outputs, labels)

            running_loss += loss.item() * inputs.size(0)
            total += labels.size(0)

            # Top-1 accuracy
            _, preds = torch.max(outputs, 1)
            correct_top1 += torch.sum(preds == labels.data).item()

            # Top-5 accuracy
            if outputs.size(1) >= 5:
                _, top5_preds = outputs.topk(5, 1, largest=True, sorted=True)
                correct_top5 += sum([labels[i] in top5_preds[i] for i in range(labels.size(0))])
            else:
                correct_top5 = correct_top1

    epoch_loss = running_loss / total
    top1_acc = (correct_top1 / total) * 100.0
    top5_acc = (correct_top5 / total) * 100.0
    return epoch_loss, top1_acc, top5_acc


def export_onnx(model, num_classes: int, output_path: Path):
    """Exports the trained model to ONNX format for edge and browser inference."""
    print(f"⚡ Exporting model to ONNX: {output_path}...")
    model.eval()
    dummy_input = torch.randn(1, 3, 224, 224)
    torch.onnx.export(
        model.to("cpu"),
        dummy_input,
        str(output_path),
        export_params=True,
        opset_version=14,
        do_constant_folding=True,
        input_names=["input"],
        output_names=["output"],
        dynamic_axes={"input": {0: "batch_size"}, "output": {0: "batch_size"}}
    )
    print(f"✅ ONNX model successfully saved ({output_path.stat().st_size / (1024 * 1024):.2f} MB)")


def main():
    parser = argparse.ArgumentParser(description="Train TerraQuest AI Species Classifier")
    parser.add_argument("--dataset", type=str, default="flowers102", choices=["flowers102", "imagefolder"])
    parser.add_argument("--data-dir", type=str, default="./data/flowers102/raw")
    parser.add_argument("--model", type=str, default="mobilenet_v3_large", choices=["mobilenet_v3_large", "efficientnet_b0", "resnet50"])
    parser.add_argument("--epochs", type=int, default=10)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--lr", type=float, default=1e-3)
    parser.add_argument("--output-dir", type=str, default="./models")

    args = parser.parse_args()
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"\n🌿 TerraQuest AI — Species Classifier Training")
    print(f"Device: {device} ({torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU'})")

    train_tf, val_tf = get_transforms()
    class_names = []

    if args.dataset == "flowers102":
        print(f"Loading Oxford Flowers 102 dataset from {args.data_dir}...")
        train_dataset = Flowers102(root=args.data_dir, split="train", download=True, transform=train_tf)
        val_dataset = Flowers102(root=args.data_dir, split="val", download=True, transform=val_tf)
        num_classes = 102
        class_names = FLOWER_NAMES_102
    else:
        train_path = Path(args.data_dir) / "train"
        val_path = Path(args.data_dir) / "val"
        if not train_path.exists():
            raise FileNotFoundError(f"Training directory not found: {train_path}")
        train_dataset = ImageFolder(str(train_path), transform=train_tf)
        val_dataset = ImageFolder(str(val_path if val_path.exists() else train_path), transform=val_tf)
        num_classes = len(train_dataset.classes)
        class_names = train_dataset.classes

    train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True, num_workers=2 if os.name != 'nt' else 0)
    val_loader = DataLoader(val_dataset, batch_size=args.batch_size, shuffle=False, num_workers=2 if os.name != 'nt' else 0)

    print(f"Classes: {num_classes} | Train samples: {len(train_dataset)} | Val samples: {len(val_dataset)}")

    model = build_model(args.model, num_classes).to(device)
    criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
    optimizer = optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=args.epochs)
    scaler = torch.amp.GradScaler('cuda') if device.type == "cuda" else None

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    best_val_acc = 0.0
    print("\n🚀 Starting Training...")
    start_time = time.time()

    for epoch in range(1, args.epochs + 1):
        epoch_start = time.time()
        train_loss, train_acc = train_one_epoch(model, train_loader, criterion, optimizer, scaler, device)
        val_loss, top1_acc, top5_acc = validate(model, val_loader, criterion, device)
        scheduler.step()
        epoch_duration = time.time() - epoch_start

        print(
            f"Epoch [{epoch:02d}/{args.epochs:02d}] ({epoch_duration:.1f}s) "
            f"Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.2f}% | "
            f"Val Loss: {val_loss:.4f} | Val Top-1: {top1_acc:.2f}% | Val Top-5: {top5_acc:.2f}%"
        )

        if top1_acc > best_val_acc:
            best_val_acc = top1_acc
            torch.save(model.state_dict(), output_dir / f"{args.model}_best.pt")

    total_time = time.time() - start_time
    print(f"\n🎉 Training Complete in {total_time / 60:.2f} mins! Best Val Accuracy: {best_val_acc:.2f}%")

    # Export classes dictionary
    classes_json = output_dir / "species_classes.json"
    with open(classes_json, "w") as f:
        class_meta = [
            {
                "index": idx,
                "commonName": name.title(),
                "category": "plant" if "flower" in args.dataset.lower() else "bird"
            }
            for idx, name in enumerate(class_names)
        ]
        json.dump(class_meta, f, indent=2)
    print(f"📋 Class dictionary saved to: {classes_json}")

    # Export ONNX
    onnx_path = output_dir / f"{args.model}_species_classifier.onnx"
    export_onnx(model, num_classes, onnx_path)


if __name__ == "__main__":
    main()
