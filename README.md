# Allps AI — Strategy & Planning Launcher

Interactive launcher for all Allps AI strategy and planning mockups.
Intended for the **Management team**. PIN-protected by default.

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Changing the Access PIN

Edit `src/launcher.config.js` and update the `accessPin` field:

```js
accessPin: '5678',  // Change to your desired 4-digit PIN
```

Set `accessPin: null` to disable PIN protection entirely.

> ⚠️ Do NOT commit a sensitive PIN to a public GitHub repository.
> Consider making this repository private, or use an environment variable approach.

## Adding a New Mockup

### Option A — Use the Mockup Manager (recommended)
Run the local `allps-mockup-manager` app and push directly from the UI.

### Option B — Manual

1. Add your `.jsx` or `.html` file to `src/mockups/`
2. Add an entry to `src/mockups-registry.json`:

```json
{
  "id": "unique-kebab-id",
  "title": "Human Readable Title",
  "description": "What does this artefact show?",
  "category": "Product Roadmap",
  "tags": ["tag1", "tag2"],
  "type": "react",
  "file": "YourComponentFilename",
  "status": "draft",
  "addedAt": "2025-01-01",
  "addedBy": "Your Name"
}
```

3. Commit and push — Vercel auto-deploys.

## Deployment

Push to `main` — Vercel auto-deploys from the connected repository.
Keep this repository **private** since it contains management-facing artefacts.
