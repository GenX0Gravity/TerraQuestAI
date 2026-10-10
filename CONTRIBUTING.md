# Contributing to TerraQuest AI 🌿

Thank you for your interest in contributing to **TerraQuest AI — Touch Grass, Not Screens**! This project is dedicated to building an open-source, offline-first outdoor companion that encourages people to disconnect from screens and connect with the real living world.

## Guiding Principles

1. **Real-World First:** Every feature must serve the goal of helping people explore outdoors, learn about biodiversity, or disconnect from devices. Avoid features that encourage endless scrolling or digital addiction.
2. **Open-Source & Local-First:** Keep local inference (Ollama, open-weight models, deterministic offline heuristics) as the primary intelligence mechanism. Never hardcode paid proprietary API keys as requirements.
3. **Privacy & Offline Resilience:** All user observations, location waypoints, and journal reflections must remain on the user's device by default (IndexedDB).
4. **Botanical & Wildlife Safety:** Never encourage users to touch unknown stinging plants (poison ivy, hogweed) or consume wild mushrooms or herbs without verified botanist inspection.

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GenX0Gravity/TerraQuestAI.git
   cd TerraQuestAI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local Ollama (Optional but recommended):**
   ```bash
   ollama run qwen2.5:3b
   ```

4. **Launch development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Run test suite:**
   ```bash
   npm run test
   ```

## Architectural Guidelines

- **Provider Abstraction:** Any new AI provider must implement the `AIProvider` interface defined in `src/lib/ai/types.ts`.
- **Database Schema:** Dexie migrations should be declared in `src/lib/db.ts` with backwards compatibility.
- **Components:** Place atomic UI primitives in `src/components/ui/` and domain features in their respective directories (`identify`, `adventure`, `pocket-mode`, `challenges`, `garden`, `journal`).

## Pull Request Checklist

- [ ] Code adheres to TypeScript strict typing (no untyped `any`).
- [ ] Unit tests added or updated in `src/test/`.
- [ ] `npm run test` passes with zero failures.
- [ ] `npm run build` succeeds without type errors or broken imports.
- [ ] Safety warnings preserved for wild species identification.

Thank you for helping people rediscover the outdoors! 🍃
