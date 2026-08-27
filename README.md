# Personal Homepage

An academic personal homepage built with React, Vite, TypeScript, and Tailwind CSS.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

Other commands: `npm run typecheck`, `npm run lint`, `npm test`.

## Edit content

All content lives in `src/data/`:

- `profile.ts` — name, photos, bio, and contact links
- `news.ts` — news items (newest first)
- `publications.ts` — publications (tags and the ★ Selected filter are derived automatically)
- `projects.ts` — selected projects
- `services.ts` — academic service groups
- `awards.ts` — awards and honors
- `notes.ts` — miscellaneous links shown under the Others section
- `customSections.ts` — register your own sections here

Place images under `public/images/` and reference them as `/images/...` (for example `/images/papers/tactile.jpg`). Put your CV in `public/` and link it from `profile.ts` (currently `cv_260827.pdf`).

## Add a custom section

Append an object to `src/data/customSections.ts`:

```ts
export const customSections: CustomSection[] = [
  {
    id: 'hobbies',
    title: 'Hobbies',
    layout: 'cards', // 'cards' | 'list' | 'paragraph'
    items: [{ title: 'Photography', description: 'Travel photos.', href: '#' }],
  },
];
```

The section renders automatically with an `id` anchor (for example `#hobbies`).

## Theme

A light/dark toggle is built in. The choice is persisted in `localStorage` and falls back to the system preference on the first visit.

## Deploy to GitHub Pages

1. Set `base` in `vite.config.ts`:
   - Project site (`https://<user>.github.io/<repo>/`): `base: '/<repo>/'`
   - User/organization site or custom domain: `base: '/'`
2. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and deploys `dist/` to GitHub Pages.
3. In the repository **Settings → Pages**, set **Source** to **GitHub Actions**.
