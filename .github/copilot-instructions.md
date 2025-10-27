<!--
Guidance for AI coding agents working on this repository.
Keep this short, concrete, and tied to files/actions that humans will run.
-->

# Copilot instructions — Multi-Model AI Chat App Starter

Goal: Make minimal, safe, and idiomatic changes to this Vite + React starter so features integrate cleanly.

Key facts (quick):
- Framework: React 19 + Vite (see `package.json` scripts: `dev`, `build`, `preview`).
- Styling: Tailwind CSS (see `index.css` + `tailwindcss` dep). Use utility classes in JSX.
- Models: `src/models.json` contains the canonical list of model metadata (id, name, provider).
- Entry: `src/main.jsx` mounts the app; `src/App.jsx` is the root UI component.

Where to make changes
- UI components: create new files under `src/` (e.g. `src/components/`). Import from `src/App.jsx` or `src/main.jsx`.
- Model metadata: update `src/models.json`. Each entry must include `id`, `name`, and `provider`. Example:
  {
    "id": "gpt-4o-mini",
    "name": "GPT-4o Mini",
    "provider": "OpenAI"
  }
- Static assets: put them into `public/` and reference by absolute path from the app.

Build & dev workflows (explicit)
- Start dev server with: `npm run dev` (Vite dev server with HMR). Use this for iterative UI work.
- Build production bundle: `npm run build` then `npm run preview` to test the build locally.
- Lint: `npm run lint` (ESLint configured at repo root; keep generated code lint-clean).

Project-specific conventions and patterns
- Keep the codebase minimal and focused: UI lives in `src/`, metadata in `src/models.json`, and styles via Tailwind.
- When adding features that call LLMs or services, prefer adding an abstration module (e.g. `src/lib/models.js`) rather than scattering fetch logic across components.
- Model ids in `models.json` are authoritative and used to populate selectors—do not change ids lightly.
- Use Tailwind classnames directly in JSX (see `src/App.jsx` for examples of layout classes).

Integration points & external deps
- pdf rendering: `react-pdf` + `pdfjs-dist` are included — if you add PDF features, follow the `react-pdf` docs and confirm `pdfjs-dist` loader configuration.
- Vite React plugin (`@vitejs/plugin-react`) is present; avoid adding Webpack-specific config.

Examples to follow
- Layout example: `src/App.jsx` uses a centered column with Tailwind utilities (copy structure for new pages).
- Mounting example: `src/main.jsx` shows the standard `createRoot(...).render(<StrictMode>...)` pattern—follow for new entry points.

What not to change without a human review
- `package.json` scripts and dependency versions (unless bumping for a clear reason).
- `src/models.json` id fields — changing these is a breaking change for UI and upstream integrations.

If you need more context
- Read `README.md` for high-level template info.
- Look at `index.html` and files under `public/` for how static assets are used.

If you create new runtime behavior
- Add a brief note in `README.md` and update the top-level `README` or add a short comment near the modified files.

Short checklist for PRs created by an AI
1. Ensure `npm run dev` still starts the dev server.
2. Run `npm run lint` and fix lint errors.
3. Update `src/models.json` only when adding new models; preserve existing `id` values.
4. Leave a short PR description explaining the change and where to look in the code.

---
If any of this is unclear or you need more repository-specific examples (e.g., where to wire a provider or how models.json is used at runtime), ask for the exact code location to inspect and I will update these instructions.
