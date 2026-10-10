#!/usr/bin/env python3
"""
TerraQuest AI — Open-Source Species Dataset Downloader
Downloads botanical and avian datasets from Kaggle and torchvision for local model training.

Supported Datasets:
1. 'flowers102': Oxford 102 Flower Dataset (Automatic download via torchvision, no API key needed)
2. 'birds525': Kaggle 525 Bird Species Image Classification (gpiosenka/100-bird-species)
3. 'plantvillage': Kaggle PlantVillage Disease & Botanical Specimen Dataset
4. 'custom': Template structure for your own field camera photos

Usage:
    python download_dataset.py --dataset flowers102 --output-dir ./data/flowers102
    python download_dataset.py --dataset birds525 --output-dir ./data/birds525
"""

import os
import sys
import argparse
import shutil
from pathlib import Path

def download_flowers_102(output_dir: Path):
    """Downloads Oxford 102 Flowers using torchvision (no API key required)."""
    print("🌿 Downloading Oxford 102 Flowers Dataset via torchvision...")
    try:
        import torchvision
        from torchvision.datasets import Flowers102
    except ImportError:
        print("❌ Error: torchvision is not installed. Please run: pip install torchvision")
        sys.exit(1)

    raw_dir = output_dir / "raw"
    raw_dir.mkdir(parents=True, exist_ok=True)

    print("⏳ Downloading train split...")
    Flowers102(root=str(raw_dir), split="train", download=True)
    print("⏳ Downloading validation split...")
    Flowers102(root=str(raw_dir), split="val", download=True)
    print("⏳ Downloading test split...")
    Flowers102(root=str(raw_dir), split="test", download=True)

    print(f"✅ Oxford 102 Flowers downloaded successfully to: {raw_dir}")
    print("💡 You can now train on this dataset using:")
    print(f"   python training/train_classifier.py --dataset flowers102 --data-dir {raw_dir}")

def download_kaggle_dataset(dataset_slug: str, output_dir: Path):
    """Downloads a dataset from Kaggle using the Kaggle CLI API."""
    print(f"🦅 Downloading Kaggle dataset: {dataset_slug}")
    try:
        import kaggle
    except ImportError:
        print("❌ Error: kaggle package is not installed. Please run: pip install kaggle")
        sys.exit(1)

    # Check for ~/.kaggle/kaggle.json
    kaggle_config = Path.home() / ".kaggle" / "kaggle.json"
    if not kaggle_config.exists() and "KAGGLE_KEY" not in os.environ:
        print("\n⚠️ Kaggle API credentials not detected!")
        print("To download directly from Kaggle:")
        print("1. Log in to https://www.kaggle.com")
        print("2. Go to Account Settings -> API -> Click 'Create New Token'")
        print(f"3. Place the downloaded 'kaggle.json' file into: {kaggle_config}")
        print("   Or set environment variables: KAGGLE_USERNAME and KAGGLE_KEY\n")
        print("Alternatively, download the zip manually from:")
        print(f"   https://www.kaggle.com/datasets/{dataset_slug}")
        print(f"and unzip it into: {output_dir}\n")
        sys.exit(1)

    output_dir.mkdir(parents=True, exist_ok=True)
    import subprocess
    cmd = ["kaggle", "datasets", "download", "-d", dataset_slug, "-p", str(output_dir), "--unzip"]
    print(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd)
    if result.returncode == 0:
        print(f"✅ Dataset downloaded and unzipped to: {output_dir}")
    else:
        print(f"❌ Failed to download dataset. Exit code: {result.returncode}")

def create_custom_template(output_dir: Path):
    """Creates directory structure for custom user photos."""
    train_dir = output_dir / "train"
    val_dir = output_dir / "val"

    sample_classes = [
        "Common Rose",
        "American Robin",
        "White Oak",
        "Common Sunflower",
        "Monarch Butterfly",
    ]

    for c in sample_classes:
        (train_dir / c).mkdir(parents=True, exist_ok=True)
        (val_dir / c).mkdir(parents=True, exist_ok=True)

    readme_file = output_dir / "README.txt"
    readme_file.write_text(
        "Place your training images into the 'train/<species_name>/' folders,\n"
        "and validation images into the 'val/<species_name>/' folders.\n"
        "Then run: python training/train_classifier.py --data-dir " + str(output_dir) + "\n"
    )

    print(f"✅ Custom dataset template created at: {output_dir}")
    print(f"   Structure:\n   {output_dir}/train/<SpeciesName>/*.jpg\n   {output_dir}/val/<SpeciesName>/*.jpg")

def main():
    parser = argparse.ArgumentParser(description="Download nature & species datasets for TerraQuest AI")
    parser.add_argument(
        "--dataset",
        type=str,
        default="flowers102",
        choices=["flowers102", "birds525", "plantvillage", "custom"],
        help="Dataset to download (flowers102 requires no Kaggle API key; others use Kaggle)"
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default="./data",
        help="Destination directory for dataset files"
    )

    args = parser.parse_args()
    dest = Path(args.output_dir)

    if args.dataset == "flowers102":
        download_flowers_102(dest / "flowers102")
    elif args.dataset == "birds525":
        download_kaggle_dataset("gpiosenka/100-bird-species", dest / "birds525")
    elif args.dataset == "plantvillage":
        download_kaggle_dataset("abdallahalitar/plantvillage-dataset", dest / "plantvillage")
    elif args.dataset == "custom":
        create_custom_template(dest / "custom_species")

if __name__ == "__main__":
    main()
