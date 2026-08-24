# Personal Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a React + Vite + TypeScript + Tailwind academic personal homepage (single-page, light/dark theme, data-driven sections, deployable to GitHub Pages), based on the design spec at `docs/superpowers/specs/2026-08-24-personal-homepage-design.md`.

**Architecture:** Single-page app with anchored sections. Each section is a self-contained component reading typed data from `src/data/`. Shared UI primitives (Section, Modal, TagFilter) and hooks (useTheme, useCollapsible) are reused. A `CustomSections` component renders any sections registered in `customSections.ts`.

**Tech Stack:** Vite 5, React 18, TypeScript, Tailwind CSS 3, Vitest + React Testing Library + jsdom, ESLint + Prettier, GitHub Pages deployment via GitHub Actions.

---

## File Structure

Files to be created:

| File | Responsibility |
|------|---------------|
| `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `tailwind.config.js`, `postcss.config.js`, `.eslintrc.cjs`, `.prettierrc` | Build/lint configuration |
| `index.html` | HTML shell, SEO meta tags |
| `src/main.tsx` | React entry |
| `src/index.css` | Tailwind directives + global styles + smooth scroll |
| `src/App.tsx` | Page composition |
| `src/types/index.ts` | All TypeScript data types |
| `src/data/profile.ts` | Name, bio, photos, contacts |
| `src/data/news.ts` | News items |
| `src/data/publications.ts` | Publications (placeholder/fixture data) |
| `src/data/projects.ts` | Projects |
| `src/data/services.ts` | Academic service groups |
| `src/data/talks.ts` | Talks |
| `src/data/notes.ts` | Notes links |
| `src/data/customSections.ts` | Empty array with a documented example |
| `src/hooks/useTheme.ts` | Light/dark theme state + persistence |
| `src/hooks/useCollapsible.ts` | Show more/less state |
| `src/hooks/useIntersectionVisible.ts` | IntersectionObserver hook (reserved for future) |
| `src/components/ThemeToggle.tsx` | Theme switch button |
| `src/components/Section.tsx` | Shared section wrapper |
| `src/components/Navbar.tsx` | Sticky anchor nav |
| `src/components/ProfilePhoto.tsx` | Click-to-rotate portrait |
| `src/components/ContactIcons.tsx` | Contact links + email copy + WeChat modal |
| `src/components/Bio.tsx` | Portrait + name + bio + contacts |
| `src/components/News.tsx` | Collapsible news list |
| `src/components/TagFilter.tsx` | Controlled tag button group |
| `src/components/PublicationCard.tsx` | One publication row |
| `src/components/Publications.tsx` | Filtered publication list |
| `src/components/ProjectCard.tsx` | One project row |
| `src/components/Projects.tsx` | Project list |
| `src/components/Services.tsx` | Service groups |
| `src/components/Talks.tsx` | Talks list |
| `src/components/Notes.tsx` | Notes link list |
| `src/components/CustomSections.tsx` | Renders data-driven custom sections |
| `src/components/Modal.tsx` | Reusable accessible modal |
| `src/components/BackToTop.tsx` | Scroll-to-top button |
| `src/components/Footer.tsx` | Footer |
| `src/test/setup.ts` | Vitest setup (jest-dom matchers) |
| `src/test/fixtures.ts` | Shared test fixtures |
| `src/**/*.test.tsx` | Component/hook tests |
| `.github/workflows/deploy.yml` | GitHub Pages deploy workflow |

Test note: Tests live next to the code they test (`Component.test.tsx` in the same folder), except shared setup and fixtures under `src/test/`.

---

## Task 1: Scaffold the Vite project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`

- [ ] **Step 1: Create project files manually (skip interactive scaffolding)**

Create `package.json`:

```json
{
  "name": "personal-homepage",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write .",
    "typecheck": "tsc -b --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.8",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.18.0",
    "@typescript-eslint/parser": "^7.18.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.9",
    "jsdom": "^24.1.1",
    "postcss": "^8.4.40",
    "prettier": "^3.3.3",
    "tailwindcss": "^3.4.7",
    "typescript": "^5.5.4",
    "vite": "^5.3.5",
    "vitest": "^2.0.5"
  }
}
```

Create `vite.config.ts`:

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages project sites, set this to '/<repo-name>/'.
  // Use '/' when deploying to a custom domain.
  base: './',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
  },
});
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Name — Personal Homepage</title>
    <meta name="description" content="Personal homepage of Your Name, Ph.D. student researching robotic manipulation and tactile perception." />
    <meta property="og:title" content="Your Name — Personal Homepage" />
    <meta property="og:description" content="Ph.D. student researching robotic manipulation and tactile perception." />
    <meta property="og:type" content="website" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
```

Create `src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

Create `src/App.tsx`:

```tsx
export default function App() {
  return <div>Hello world</div>;
}
```

Create `src/index.css` (Tailwind added properly in Task 2; placeholder for now):

```css
html {
  scroll-behavior: smooth;
}
body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

- [ ] **Step 2: Install dependencies**

Run: `cd /home/amdin/agent/mypage && npm install`
Expected: installs without errors, `node_modules/` and `package-lock.json` created.

- [ ] **Step 3: Verify dev server boots**

Run: `npm run dev`
Expected: Vite prints a local URL (e.g. `http://localhost:5173`) and compiles without error. Stop with Ctrl+C once confirmed.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite React TypeScript project"
```

---

## Task 2: Configure Tailwind CSS and global styles

**Files:**
- Create: `tailwind.config.js`, `postcss.config.js`, `.prettierrc`, `.eslintrc.cjs`
- Modify: `src/index.css`

- [ ] **Step 1: Create Tailwind config**

Create `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#2563eb',
          dark: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
};
```

Create `postcss.config.js`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 2: Replace `src/index.css` with Tailwind directives and globals**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

section {
  scroll-margin-top: 72px;
}

body {
  @apply bg-white text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-100;
}
```

- [ ] **Step 3: Create Prettier and ESLint configs**

Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

Create `.eslintrc.cjs`:

```js
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
};
```

- [ ] **Step 4: Verify build works with Tailwind**

Run: `npm run build`
Expected: build succeeds, `dist/` produced, no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: configure Tailwind, Prettier, ESLint and global styles"
```

---

## Task 3: Set up Vitest and shared test infrastructure

**Files:**
- Create: `src/test/setup.ts`, `src/test/fixtures.ts`

- [ ] **Step 1: Create test setup**

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 2: Create shared fixtures**

Create `src/test/fixtures.ts`:

```ts
import type { Profile, Publication, Project, NewsItem } from '../types';

export const profileFixture: Profile = {
  nameEn: 'Jane Doe',
  nameZh: '杜娟',
  photos: ['/images/profile/a.jpg', '/images/profile/b.jpg'],
  bio: 'Ph.D. student at Example University working on robotic manipulation.',
  contacts: [
    { type: 'email', label: 'Email', href: 'jane@example.com' },
    { type: 'github', label: 'GitHub', href: 'https://github.com/jane' },
    { type: 'scholar', label: 'Google Scholar', href: 'https://scholar.example.com' },
  ],
};

export const publicationsFixture: Publication[] = [
  {
    title: 'Tactile Grasping Paper',
    authors: ['Alice Smith', 'Jane Doe', 'Bob Lee'],
    venue: 'CoRL 2026',
    tags: ['Tactile', 'Grasping'],
    selected: true,
    links: { paper: 'https://paper.example.com/1', code: 'https://github.com/x/1' },
  },
  {
    title: 'Manipulation Paper',
    authors: ['Jane Doe', 'Carol Wang'],
    venue: 'ICRA 2026',
    tags: ['Manipulation'],
    links: { paper: 'https://paper.example.com/2' },
  },
  {
    title: 'Other Paper',
    authors: ['Dan Brown'],
    venue: 'arXiv 2025',
    tags: ['Other'],
    links: { paper: 'https://paper.example.com/3' },
  },
];

export const projectsFixture: Project[] = [
  {
    title: 'Project One',
    description: 'First project description.',
    links: { code: 'https://github.com/x/p1' },
  },
  {
    title: 'Project Two',
    description: 'Second project description.',
    links: { report: 'https://example.com/report' },
  },
];

export const newsFixture: NewsItem[] = [
  { date: 'Aug 2026', content: 'Paper accepted to CoRL 2026.' },
  { date: 'May 2026', content: 'Gave a talk at Workshop.' },
  { date: 'Feb 2026', content: 'Started internship.' },
  { date: 'Jan 2026', content: 'New preprint.' },
  { date: 'Dec 2025', content: 'Award.' },
];
```

Note: `fixtures.ts` imports from `../types` which does not exist yet. The next task creates it.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "test: add Vitest setup and shared fixtures"
```

---

## Task 4: Define TypeScript types

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Write the type definitions**

Create `src/types/index.ts`:

```ts
export type ContactType =
  | 'email'
  | 'scholar'
  | 'github'
  | 'twitter'
  | 'wechat'
  | 'cv'
  | 'link';

export interface ContactLink {
  type: ContactType;
  label: string;
  href: string;
  qrcode?: string;
}

export interface Profile {
  nameEn: string;
  nameZh: string;
  photos: string[];
  bio: string;
  contacts: ContactLink[];
}

export interface NewsItem {
  date: string;
  content: string;
}

export interface PublicationLinks {
  paper?: string;
  code?: string;
  project?: string;
  dataset?: string;
}

export interface Publication {
  title: string;
  authors: string[];
  venue: string;
  venueType?: 'conference' | 'journal' | 'preprint';
  tags: string[];
  selected?: boolean;
  thumbnail?: string;
  links: PublicationLinks;
  abstract?: string;
}

export interface ProjectLinks {
  code?: string;
  report?: string;
  demo?: string;
}

export interface Project {
  title: string;
  description: string;
  thumbnail?: string;
  links: ProjectLinks;
}

export interface ServiceGroup {
  heading: string;
  items: string[];
}

export interface Talk {
  date: string;
  title: string;
  host: string;
  replay?: string;
}

export interface NoteLink {
  title: string;
  href: string;
  description?: string;
}

export type CustomSectionLayout = 'cards' | 'list' | 'paragraph';

export interface CustomItem {
  title?: string;
  description?: string;
  thumbnail?: string;
  href?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  layout: CustomSectionLayout;
  items: CustomItem[];
}
```

- [ ] **Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: succeeds with no errors.

- [ ] **Step 3: Run tests to confirm infra works (no test files yet, Vitest exits 0)**

Run: `npm test`
Expected: "No test files found" message but exit code 0 (Vitest run with no files may exit with code 1 in some versions — if it exits 1, that's acceptable at this stage; the first real test lands in Task 5).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add core TypeScript types"
```

---

## Task 5: Implement useTheme hook

**Files:**
- Create: `src/hooks/useTheme.ts`, `src/hooks/useTheme.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/hooks/useTheme.test.tsx`:

```tsx
import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('defaults to light when no preference and no system preference', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('reads stored theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggles theme and persists to localStorage', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useTheme.test.tsx`
Expected: FAIL — module `./useTheme` not found.

- [ ] **Step 3: Implement useTheme**

Create `src/hooks/useTheme.ts`:

```ts
import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  // matchMedia may be unavailable in non-browser environments (e.g. jsdom).
  if (typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useTheme.test.tsx`
Expected: PASS, 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add useTheme hook with persistence"
```

---

## Task 6: Implement useCollapsible hook

**Files:**
- Create: `src/hooks/useCollapsible.ts`, `src/hooks/useCollapsible.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/hooks/useCollapsible.test.ts`:

```ts
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useCollapsible } from './useCollapsible';

describe('useCollapsible', () => {
  it('starts collapsed and reports hidden count', () => {
    const { result } = renderHook(() => useCollapsible(10, 4));
    expect(result.current.expanded).toBe(false);
    expect(result.current.visibleCount).toBe(4);
    expect(result.current.hiddenCount).toBe(6);
  });

  it('shows all items when expanded', () => {
    const { result } = renderHook(() => useCollapsible(10, 4));
    act(() => result.current.toggle());
    expect(result.current.expanded).toBe(true);
    expect(result.current.visibleCount).toBe(10);
    expect(result.current.hiddenCount).toBe(0);
  });

  it('does not need expanding when total <= initial', () => {
    const { result } = renderHook(() => useCollapsible(3, 4));
    expect(result.current.visibleCount).toBe(3);
    expect(result.current.hiddenCount).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useCollapsible.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement useCollapsible**

Create `src/hooks/useCollapsible.ts`:

```ts
import { useCallback, useMemo, useState } from 'react';

export function useCollapsible(total: number, initialVisible: number) {
  const [expanded, setExpanded] = useState(false);

  const visibleCount = expanded ? total : Math.min(total, initialVisible);
  const hiddenCount = Math.max(0, total - visibleCount);

  const toggle = useCallback(() => setExpanded((prev) => !prev), []);

  return useMemo(
    () => ({ expanded, visibleCount, hiddenCount, toggle }),
    [expanded, visibleCount, hiddenCount, toggle],
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useCollapsible.test.ts`
Expected: PASS, 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add useCollapsible hook"
```

---

## Task 7: Implement useIntersectionVisible hook (reserved)

**Files:**
- Create: `src/hooks/useIntersectionVisible.ts`

This hook is provided for future lazy media (e.g. autoplaying video). It is not consumed in v1.

- [ ] **Step 1: Write the hook**

Create `src/hooks/useIntersectionVisible.ts`:

```ts
import { useEffect, useRef, useState } from 'react';

export function useIntersectionVisible<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    }, options);
    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return { ref, visible };
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add useIntersectionVisible hook for future lazy media"
```

---

## Task 8: Create data files

**Files:**
- Create: `src/data/profile.ts`, `src/data/news.ts`, `src/data/publications.ts`, `src/data/projects.ts`, `src/data/services.ts`, `src/data/talks.ts`, `src/data/notes.ts`, `src/data/customSections.ts`

These are content files the user will edit. They use clearly marked placeholder content.

- [ ] **Step 1: Create profile data**

Create `src/data/profile.ts`:

```ts
import type { Profile } from '../types';

export const profile: Profile = {
  nameEn: 'Your Name',
  nameZh: '你的名字',
  photos: [
    '/images/profile/photo1.jpg',
    '/images/profile/photo2.jpg',
    '/images/profile/photo3.jpg',
  ],
  bio: 'I am a Ph.D. student at [Your University], advised by Prof. [Advisor]. My research focuses on robotic manipulation and tactile perception.',
  contacts: [
    { type: 'email', label: 'Email', href: 'you@example.com' },
    { type: 'scholar', label: 'Google Scholar', href: 'https://scholar.google.com/' },
    { type: 'github', label: 'GitHub', href: 'https://github.com/yourusername' },
    { type: 'twitter', label: 'X', href: 'https://twitter.com/yourusername' },
    {
      type: 'wechat',
      label: 'WeChat',
      href: '#',
      qrcode: '/images/qrcode/wechat.png',
    },
    { type: 'cv', label: 'CV', href: '/cv.pdf' },
  ],
};
```

- [ ] **Step 2: Create news data**

Create `src/data/news.ts`:

```ts
import type { NewsItem } from '../types';

export const news: NewsItem[] = [
  { date: 'Aug 2026', content: 'One paper accepted to CoRL 2026.' },
  { date: 'May 2026', content: 'Gave an invited talk at Example Workshop.' },
  { date: 'Feb 2026', content: 'Started a research internship.' },
  { date: 'Jan 2026', content: 'New preprint on tactile sensing released.' },
  { date: 'Dec 2025', content: 'Received an outstanding reviewer award.' },
];
```

- [ ] **Step 3: Create publications data**

Create `src/data/publications.ts`:

```ts
import type { Publication } from '../types';

export const publications: Publication[] = [
  {
    title: 'Example Tactile Manipulation Paper',
    authors: ['Coauthor One', 'Your Name', 'Coauthor Two'],
    venue: 'CoRL 2026',
    venueType: 'conference',
    tags: ['Tactile', 'Manipulation'],
    selected: true,
    thumbnail: '/images/papers/tactile.jpg',
    links: {
      paper: 'https://example.com/paper1',
      code: 'https://github.com/yourname/paper1',
      project: 'https://example.com/project1',
    },
  },
  {
    title: 'Example Grasping Paper',
    authors: ['Your Name', 'Coauthor Three'],
    venue: 'ICRA 2026',
    venueType: 'conference',
    tags: ['Grasping'],
    links: { paper: 'https://example.com/paper2', code: 'https://github.com/yourname/paper2' },
  },
  {
    title: 'Example Preprint',
    authors: ['Your Name', 'Coauthor Four'],
    venue: 'arXiv 2025',
    venueType: 'preprint',
    tags: ['Tactile'],
    links: { paper: 'https://example.com/paper3' },
  },
];
```

- [ ] **Step 4: Create projects data**

Create `src/data/projects.ts`:

```ts
import type { Project } from '../types';

export const projects: Project[] = [
  {
    title: 'Example Project One',
    description: 'A short description of an open-source robotics project.',
    thumbnail: '/images/projects/project1.jpg',
    links: { code: 'https://github.com/yourname/project1', report: 'https://example.com/report1' },
  },
  {
    title: 'Example Project Two',
    description: 'A short description of another project.',
    thumbnail: '/images/projects/project2.jpg',
    links: { code: 'https://github.com/yourname/project2' },
  },
];
```

- [ ] **Step 5: Create services data**

Create `src/data/services.ts`:

```ts
import type { ServiceGroup } from '../types';

export const services: ServiceGroup[] = [
  {
    heading: 'Conference Reviewing',
    items: ['ICRA 2024–2026', 'IROS 2025', 'CoRL 2025'],
  },
  {
    heading: 'Journal Reviewing',
    items: ['IEEE Robotics and Automation Letters', 'IEEE Transactions on Robotics'],
  },
];
```

- [ ] **Step 6: Create talks data**

Create `src/data/talks.ts`:

```ts
import type { Talk } from '../types';

export const talks: Talk[] = [
  {
    date: 'May 2026',
    title: 'Tactile Perception for Robotic Manipulation',
    host: 'Example University Robotics Seminar',
    replay: 'https://example.com/replay1',
  },
  {
    date: 'Oct 2025',
    title: 'Dexterous Hands and Touch',
    host: 'Example Workshop at IROS',
  },
];
```

- [ ] **Step 7: Create notes data**

Create `src/data/notes.ts`:

```ts
import type { NoteLink } from '../types';

export const notes: NoteLink[] = [
  {
    title: 'Graduate Course Notes — Robot Learning',
    href: 'https://example.com/notes1',
    description: 'Scribbled notes from a robot learning course.',
  },
  {
    title: 'Undergraduate Notes Repository',
    href: 'https://github.com/yourname/notes',
  },
];
```

- [ ] **Step 8: Create customSections data with a documented example (empty by default)**

Create `src/data/customSections.ts`:

```ts
import type { CustomSection } from '../types';

/**
 * Register additional homepage sections here. Each entry renders as its own
 * section with an anchor link in the navbar automatically.
 *
 * Layout options:
 *   - 'cards': grid of thumbnail cards with title/description/link
 *   - 'list':  bulleted list of titled items with descriptions
 *   - 'paragraph': single block of paragraph text per item
 *
 * Example:
 * export const customSections: CustomSection[] = [
 *   {
 *     id: 'hobbies',
 *     title: 'Hobbies',
 *     layout: 'cards',
 *     items: [
 *       { title: 'Photography', description: 'Travel photos.', href: '#' },
 *     ],
 *   },
 * ];
 */
export const customSections: CustomSection[] = [];
```

- [ ] **Step 9: Typecheck**

Run: `npm run typecheck`
Expected: succeeds.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add typed content data files"
```

---

## Task 9: Implement Section wrapper and Modal primitives

**Files:**
- Create: `src/components/Section.tsx`, `src/components/Modal.tsx`, `src/components/Modal.test.tsx`

- [ ] **Step 1: Implement Section**

Create `src/components/Section.tsx`:

```tsx
import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="mb-10 scroll-mt-20">
      <h2 className="mb-4 border-b border-slate-200 pb-2 text-2xl font-semibold dark:border-slate-700">
        {title}
      </h2>
      {children}
    </section>
  );
}
```

- [ ] **Step 2: Write the failing Modal test**

Create `src/components/Modal.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders children when open', () => {
    render(
      <Modal open onClose={vi.fn()} title="Test">
        <p>Modal content</p>
      </Modal>,
    );
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Test">
        <p>content</p>
      </Modal>,
    );
    await userEvent.click(screen.getByTestId('modal-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Test">
        <p>content</p>
      </Modal>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal open={false} onClose={vi.fn()} title="Test">
        <p>hidden</p>
      </Modal>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/components/Modal.test.tsx`
Expected: FAIL — Modal not found.

- [ ] **Step 4: Implement Modal**

Create `src/components/Modal.tsx`:

```tsx
import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      data-testid="modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-3 top-2 text-xl leading-none text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          ×
        </button>
        <h3 className="mb-3 text-lg font-semibold">{title}</h3>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/Modal.test.tsx`
Expected: PASS, 4 tests passing.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Section wrapper and Modal primitive"
```

---

## Task 10: Implement ThemeToggle and ProfilePhoto

**Files:**
- Create: `src/components/ThemeToggle.tsx`, `src/components/ProfilePhoto.tsx`, `src/components/ProfilePhoto.test.tsx`

- [ ] **Step 1: Implement ThemeToggle**

Create `src/components/ThemeToggle.tsx`:

```tsx
interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="rounded px-2 py-1 text-sm hover:bg-white/10"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
```

- [ ] **Step 2: Write the failing ProfilePhoto test**

Create `src/components/ProfilePhoto.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ProfilePhoto } from './ProfilePhoto';

describe('ProfilePhoto', () => {
  const photos = ['/a.jpg', '/b.jpg', '/c.jpg'];

  it('renders the first photo initially', () => {
    render(<ProfilePhoto photos={photos} alt="Jane" />);
    const img = screen.getByAltText('Jane') as HTMLImageElement;
    expect(img.src).toContain('/a.jpg');
  });

  it('cycles to the next photo on click', async () => {
    render(<ProfilePhoto photos={photos} alt="Jane" />);
    const img = screen.getByAltText('Jane') as HTMLImageElement;
    await userEvent.click(img);
    expect(img.src).toContain('/b.jpg');
    await userEvent.click(img);
    expect(img.src).toContain('/c.jpg');
    await userEvent.click(img);
    expect(img.src).toContain('/a.jpg');
  });

  it('is still accessible when there are no photos', () => {
    render(<ProfilePhoto photos={[]} alt="Jane" />);
    expect(screen.queryByAltText('Jane')).toBeNull();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/components/ProfilePhoto.test.tsx`
Expected: FAIL — ProfilePhoto not found.

- [ ] **Step 4: Implement ProfilePhoto**

Create `src/components/ProfilePhoto.tsx`:

```tsx
import { useState } from 'react';

interface ProfilePhotoProps {
  photos: string[];
  alt: string;
}

export function ProfilePhoto({ photos, alt }: ProfilePhotoProps) {
  const [index, setIndex] = useState(0);
  if (photos.length === 0) return null;
  const current = photos[index % photos.length];

  return (
    <img
      src={current}
      alt={alt}
      loading="lazy"
      onClick={() => setIndex((i) => (i + 1) % photos.length)}
      className="h-48 w-40 cursor-pointer rounded-md object-cover shadow-sm transition hover:opacity-90"
    />
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/ProfilePhoto.test.tsx`
Expected: PASS, 3 tests passing.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add ThemeToggle and ProfilePhoto"
```

---

## Task 11: Implement ContactIcons

**Files:**
- Create: `src/components/ContactIcons.tsx`, `src/components/ContactIcons.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/ContactIcons.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContactIcons } from './ContactIcons';
import { profileFixture } from '../test/fixtures';

describe('ContactIcons', () => {
  it('renders links for each contact', () => {
    render(<ContactIcons contacts={profileFixture.contacts} />);
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/jane',
    );
  });

  it('renders a WeChat button that opens a QR modal', async () => {
    const contacts = [
      { type: 'wechat' as const, label: 'WeChat', href: '#', qrcode: '/qr.png' },
    ];
    render(<ContactIcons contacts={contacts} />);
    const btn = screen.getByRole('button', { name: /wechat/i });
    await userEvent.click(btn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByAltText('WeChat QR code')).toHaveAttribute('src', '/qr.png');
  });

  it('copies email to clipboard and shows confirmation', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const contacts = [{ type: 'email' as const, label: 'Email', href: 'jane@example.com' }];
    render(<ContactIcons contacts={contacts} />);
    await userEvent.click(screen.getByRole('button', { name: /email/i }));
    expect(writeText).toHaveBeenCalledWith('jane@example.com');
    expect(await screen.findByText(/copied/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ContactIcons.test.tsx`
Expected: FAIL — ContactIcons not found.

- [ ] **Step 3: Implement ContactIcons**

Create `src/components/ContactIcons.tsx`:

```tsx
import { useState } from 'react';
import type { ContactLink } from '../types';
import { Modal } from './Modal';

interface ContactIconsProps {
  contacts: ContactLink[];
}

const ICONS: Record<ContactLink['type'], string> = {
  email: '✉️',
  scholar: '📚',
  github: '💻',
  twitter: '🐦',
  wechat: '💬',
  cv: '📄',
  link: '🔗',
};

export function ContactIcons({ contacts }: ContactIconsProps) {
  const [wechatOpen, setWechatOpen] = useState(false);
  const [wechatQr, setWechatQr] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);

  const handleEmail = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable; fall back to mailto.
      window.location.href = `mailto:${address}`;
    }
  };

  return (
    <div className="relative flex flex-wrap gap-x-5 gap-y-2 text-sm">
      {contacts.map((c) => {
        if (c.type === 'email') {
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => handleEmail(c.href)}
              className="text-accent hover:underline dark:text-accent-dark"
            >
              <span aria-hidden="true">{ICONS.email}</span> {c.label}
            </button>
          );
        }
        if (c.type === 'wechat') {
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => {
                setWechatQr(c.qrcode);
                setWechatOpen(true);
              }}
              className="text-accent hover:underline dark:text-accent-dark"
            >
              <span aria-hidden="true">{ICONS.wechat}</span> {c.label}
            </button>
          );
        }
        return (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith('http') ? '_blank' : undefined}
            rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="text-accent hover:underline dark:text-accent-dark"
          >
            <span aria-hidden="true">{ICONS[c.type]}</span> {c.label}
          </a>
        );
      })}
      {copied && (
        <span
          role="status"
          className="absolute -bottom-6 left-0 rounded bg-slate-800 px-2 py-0.5 text-xs text-white dark:bg-slate-200 dark:text-slate-900"
        >
          Email copied!
        </span>
      )}
      <Modal
        open={wechatOpen}
        onClose={() => setWechatOpen(false)}
        title="WeChat"
      >
        {wechatQr && (
          <img
            src={wechatQr}
            alt="WeChat QR code"
            className="mx-auto h-48 w-48 rounded object-contain"
          />
        )}
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-300">
          Scan to add me on WeChat
        </p>
      </Modal>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ContactIcons.test.tsx`
Expected: PASS, 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add ContactIcons with email copy and WeChat QR modal"
```

---

## Task 12: Implement Bio

**Files:**
- Create: `src/components/Bio.tsx`, `src/components/Bio.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/Bio.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Bio } from './Bio';
import { profileFixture } from '../test/fixtures';

describe('Bio', () => {
  it('renders name, Chinese name, bio text, and contact links', () => {
    render(<Bio profile={profileFixture} />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('杜娟')).toBeInTheDocument();
    expect(
      screen.getByText(/Ph.D. student at Example University/),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
  });

  it('renders the profile photo with alt text equal to the English name', () => {
    render(<Bio profile={profileFixture} />);
    expect(screen.getByAltText('Jane Doe')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Bio.test.tsx`
Expected: FAIL — Bio not found.

- [ ] **Step 3: Implement Bio**

Create `src/components/Bio.tsx`:

```tsx
import type { Profile } from '../types';
import { ContactIcons } from './ContactIcons';
import { ProfilePhoto } from './ProfilePhoto';

interface BioProps {
  profile: Profile;
}

export function Bio({ profile }: BioProps) {
  return (
    <div className="mb-10 flex flex-col items-start gap-7 sm:flex-row">
      <div className="shrink-0">
        <ProfilePhoto photos={profile.photos} alt={profile.nameEn} />
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold">
          {profile.nameEn}{' '}
          <span className="font-normal text-slate-600 dark:text-slate-300">
            {profile.nameZh}
          </span>
        </h1>
        <p className="mt-3 leading-relaxed">{profile.bio}</p>
        <div className="mt-4">
          <ContactIcons contacts={profile.contacts} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Bio.test.tsx`
Expected: PASS, 2 tests passing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Bio section"
```

---

## Task 13: Implement News

**Files:**
- Create: `src/components/News.tsx`, `src/components/News.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/News.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { News } from './News';
import { newsFixture } from '../test/fixtures';

describe('News', () => {
  it('renders the section title', () => {
    render(<News items={newsFixture} />);
    expect(screen.getByRole('heading', { name: 'News' })).toBeInTheDocument();
  });

  it('shows 4 items initially and a show-more toggle', () => {
    render(<News items={newsFixture} />);
    expect(screen.getByText('Paper accepted to CoRL 2026.')).toBeInTheDocument();
    expect(screen.queryByText('Award.')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show more/i })).toBeInTheDocument();
  });

  it('expands and collapses', async () => {
    render(<News items={newsFixture} />);
    await userEvent.click(screen.getByRole('button', { name: /show more/i }));
    expect(screen.getByText('Award.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /show less/i }));
    expect(screen.queryByText('Award.')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/News.test.tsx`
Expected: FAIL — News not found.

- [ ] **Step 3: Implement News**

Create `src/components/News.tsx`:

```tsx
import type { NewsItem } from '../types';
import { useCollapsible } from '../hooks/useCollapsible';
import { Section } from './Section';

interface NewsProps {
  items: NewsItem[];
}

const INITIAL_VISIBLE = 4;

export function News({ items }: NewsProps) {
  const { expanded, visibleCount, toggle } = useCollapsible(items.length, INITIAL_VISIBLE);
  const visible = items.slice(0, visibleCount);

  return (
    <Section id="news" title="News">
      <ul className="space-y-1.5 leading-relaxed">
        {visible.map((item, i) => (
          <li key={`${item.date}-${i}`} className="text-sm">
            <span className="mr-2 font-semibold">[{item.date}]</span>
            {item.content}
          </li>
        ))}
      </ul>
      {items.length > INITIAL_VISIBLE && (
        <button
          type="button"
          onClick={toggle}
          className="mt-2 text-sm text-accent hover:underline dark:text-accent-dark"
        >
          {expanded ? 'Show less ▴' : `Show more ▾ (${items.length - INITIAL_VISIBLE})`}
        </button>
      )}
    </Section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/News.test.tsx`
Expected: PASS, 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add News section with collapse"
```

---

## Task 14: Implement TagFilter

**Files:**
- Create: `src/components/TagFilter.tsx`, `src/components/TagFilter.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/TagFilter.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TagFilter } from './TagFilter';

describe('TagFilter', () => {
  const tags = [
    { label: 'All', value: 'all', count: 5 },
    { label: 'Tactile', value: 'Tactile', count: 2 },
    { label: 'Grasping', value: 'Grasping', count: 1 },
  ];

  it('renders each tag with its count', () => {
    render(<TagFilter tags={tags} value="all" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /All \(5\)/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tactile \(2\)/ })).toBeInTheDocument();
  });

  it('calls onChange with the tag value when clicked', async () => {
    const onChange = vi.fn();
    render(<TagFilter tags={tags} value="all" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /Grasping/ }));
    expect(onChange).toHaveBeenCalledWith('Grasping');
  });

  it('marks the active tag with aria-pressed', () => {
    render(<TagFilter tags={tags} value="Tactile" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Tactile/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/TagFilter.test.tsx`
Expected: FAIL — TagFilter not found.

- [ ] **Step 3: Implement TagFilter**

Create `src/components/TagFilter.tsx`:

```tsx
export interface TagFilterTag {
  label: string;
  value: string;
  count: number;
}

interface TagFilterProps {
  tags: TagFilterTag[];
  value: string;
  onChange: (value: string) => void;
}

export function TagFilter({ tags, value, onChange }: TagFilterProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {tags.map((tag) => {
        const active = tag.value === value;
        return (
          <button
            key={tag.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(tag.value)}
            className={`rounded-full px-3 py-1 text-xs transition ${
              active
                ? 'bg-accent text-white dark:bg-accent-dark'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {tag.label} ({tag.count})
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/TagFilter.test.tsx`
Expected: PASS, 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add TagFilter component"
```

---

## Task 15: Implement PublicationCard

**Files:**
- Create: `src/components/PublicationCard.tsx`, `src/components/PublicationCard.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/PublicationCard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PublicationCard } from './PublicationCard';
import { publicationsFixture } from '../test/fixtures';

describe('PublicationCard', () => {
  it('renders title, venue, and authors', () => {
    render(<PublicationCard publication={publicationsFixture[0]} ownName="Jane Doe" />);
    expect(screen.getByText('Tactile Grasping Paper')).toBeInTheDocument();
    expect(screen.getByText('CoRL 2026')).toBeInTheDocument();
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
  });

  it('highlights the owner name in bold and underline', () => {
    render(<PublicationCard publication={publicationsFixture[0]} ownName="Jane Doe" />);
    const own = screen.getByText('Jane Doe');
    expect(own.tagName).toBe('STRONG');
    expect(own).toHaveClass('underline');
  });

  it('renders only present links', () => {
    render(<PublicationCard publication={publicationsFixture[1]} ownName="Jane Doe" />);
    expect(screen.getByRole('link', { name: 'Paper' })).toHaveAttribute(
      'href',
      'https://paper.example.com/2',
    );
    expect(screen.queryByRole('link', { name: 'Code' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Project' })).toBeNull();
  });

  it('renders the thumbnail when present', () => {
    const pub = { ...publicationsFixture[0], thumbnail: '/thumb.jpg' };
    render(<PublicationCard publication={pub} ownName="Jane Doe" />);
    expect(screen.getByAltText('Tactile Grasping Paper thumbnail')).toHaveAttribute(
      'src',
      '/thumb.jpg',
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/PublicationCard.test.tsx`
Expected: FAIL — PublicationCard not found.

- [ ] **Step 3: Implement PublicationCard**

Create `src/components/PublicationCard.tsx`:

```tsx
import type { Publication } from '../types';

interface PublicationCardProps {
  publication: Publication;
  ownName: string;
}

const LINK_LABELS: { key: keyof Publication['links']; label: string }[] = [
  { key: 'paper', label: 'Paper' },
  { key: 'code', label: 'Code' },
  { key: 'project', label: 'Project' },
  { key: 'dataset', label: 'Dataset' },
];

export function PublicationCard({ publication, ownName }: PublicationCardProps) {
  const { title, authors, venue, tags, thumbnail, links } = publication;

  return (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row">
      {thumbnail && (
        <img
          src={thumbnail}
          alt={`${title} thumbnail`}
          loading="lazy"
          className="h-24 w-36 shrink-0 rounded object-cover"
        />
      )}
      <div className="text-sm leading-relaxed">
        <div className="font-semibold">{title}</div>
        <div className="text-slate-700 dark:text-slate-300">
          {authors.map((a, i) => {
            const isOwn = a.trim().toLowerCase() === ownName.trim().toLowerCase();
            return (
              <span key={a + i}>
                {i > 0 && ', '}
                {isOwn ? <strong className="underline">{a}</strong> : a}
              </span>
            );
          })}
        </div>
        <div className="italic text-slate-600 dark:text-slate-400">{venue}</div>
        <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600 dark:bg-slate-700 dark:text-slate-300"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 text-accent dark:text-accent-dark">
          {LINK_LABELS.filter(({ key }) => links[key]).map(({ key, label }) => (
            <a
              key={key}
              href={links[key]}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              [{label}]
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/PublicationCard.test.tsx`
Expected: PASS, 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add PublicationCard with author highlighting"
```

---

## Task 16: Implement Publications (filtering logic)

**Files:**
- Create: `src/components/Publications.tsx`, `src/components/Publications.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/Publications.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Publications } from './Publications';
import { publicationsFixture } from '../test/fixtures';

describe('Publications', () => {
  it('renders the section title and all publications initially', () => {
    render(<Publications publications={publicationsFixture} ownName="Jane Doe" />);
    expect(screen.getByRole('heading', { name: 'Publications' })).toBeInTheDocument();
    expect(screen.getByText('Tactile Grasping Paper')).toBeInTheDocument();
    expect(screen.getByText('Manipulation Paper')).toBeInTheDocument();
    expect(screen.getByText('Other Paper')).toBeInTheDocument();
  });

  it('aggregates tags with counts including All', () => {
    render(<Publications publications={publicationsFixture} ownName="Jane Doe" />);
    expect(screen.getByRole('button', { name: /All \(3\)/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tactile \(1\)/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Manipulation \(1\)/ })).toBeInTheDocument();
  });

  it('filters publications by tag', async () => {
    render(<Publications publications={publicationsFixture} ownName="Jane Doe" />);
    await userEvent.click(screen.getByRole('button', { name: /Tactile/ }));
    expect(screen.getByText('Tactile Grasping Paper')).toBeInTheDocument();
    expect(screen.queryByText('Manipulation Paper')).not.toBeInTheDocument();
    expect(screen.queryByText('Other Paper')).not.toBeInTheDocument();
  });

  it('filters to selected publications when ★ Selected is toggled', async () => {
    render(<Publications publications={publicationsFixture} ownName="Jane Doe" />);
    await userEvent.click(screen.getByRole('button', { name: /Selected/ }));
    expect(screen.getByText('Tactile Grasping Paper')).toBeInTheDocument();
    expect(screen.queryByText('Manipulation Paper')).not.toBeInTheDocument();
  });

  it('shows a visible count', () => {
    render(<Publications publications={publicationsFixture} ownName="Jane Doe" />);
    expect(screen.getByText(/Showing 3 of 3/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Publications.test.tsx`
Expected: FAIL — Publications not found.

- [ ] **Step 3: Implement Publications**

Create `src/components/Publications.tsx`:

```tsx
import { useMemo, useState } from 'react';
import type { Publication } from '../types';
import { PublicationCard } from './PublicationCard';
import { Section } from './Section';
import { TagFilter, type TagFilterTag } from './TagFilter';

interface PublicationsProps {
  publications: Publication[];
  ownName: string;
}

const ALL = 'all';
const SELECTED = '__selected__';

export function Publications({ publications, ownName }: PublicationsProps) {
  const [activeTag, setActiveTag] = useState<string>(ALL);
  const [selectedOnly, setSelectedOnly] = useState(false);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const pub of publications) {
      for (const tag of pub.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return counts;
  }, [publications]);

  const tags: TagFilterTag[] = useMemo(() => {
    const base: TagFilterTag[] = [
      { label: 'All', value: ALL, count: publications.length },
      ...[...tagCounts.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([value, count]) => ({ label: value, value, count })),
    ];
    const selectedCount = publications.filter((p) => p.selected).length;
    if (selectedCount > 0) {
      base.push({ label: '★ Selected', value: SELECTED, count: selectedCount });
    }
    return base;
  }, [publications, tagCounts]);

  const visible = useMemo(() => {
    return publications.filter((p) => {
      if (selectedOnly && !p.selected) return false;
      if (activeTag !== ALL && !p.tags.includes(activeTag)) return false;
      return true;
    });
  }, [publications, activeTag, selectedOnly]);

  const handleTagChange = (value: string) => {
    if (value === SELECTED) {
      setSelectedOnly((prev) => !prev);
    } else {
      setActiveTag(value);
    }
  };

  const activeValue = selectedOnly ? SELECTED : activeTag;

  return (
    <Section id="publications" title="Publications">
      <TagFilter tags={tags} value={activeValue} onChange={handleTagChange} />
      <p className="mb-3 text-xs text-slate-500">
        Showing {visible.length} of {publications.length}
      </p>
      <div>
        {visible.map((pub) => (
          <PublicationCard key={pub.title} publication={pub} ownName={ownName} />
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Publications.test.tsx`
Expected: PASS, 5 tests passing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Publications with tag and selected filtering"
```

---

## Task 17: Implement Projects

**Files:**
- Create: `src/components/ProjectCard.tsx`, `src/components/Projects.tsx`, `src/components/ProjectCard.test.tsx`

- [ ] **Step 1: Write the failing ProjectCard test**

Create `src/components/ProjectCard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectCard } from './ProjectCard';
import { projectsFixture } from '../test/fixtures';

describe('ProjectCard', () => {
  it('renders title, description, and links', () => {
    render(<ProjectCard project={projectsFixture[0]} />);
    expect(screen.getByText('Project One')).toBeInTheDocument();
    expect(screen.getByText('First project description.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Code' })).toHaveAttribute(
      'href',
      'https://github.com/x/p1',
    );
  });

  it('omits absent links', () => {
    render(<ProjectCard project={projectsFixture[1]} />);
    expect(screen.queryByRole('link', { name: 'Code' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Report' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ProjectCard.test.tsx`
Expected: FAIL — ProjectCard not found.

- [ ] **Step 3: Implement ProjectCard**

Create `src/components/ProjectCard.tsx`:

```tsx
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const LINK_LABELS: { key: keyof Project['links']; label: string }[] = [
  { key: 'code', label: 'Code' },
  { key: 'report', label: 'Report' },
  { key: 'demo', label: 'Demo' },
];

export function ProjectCard({ project }: ProjectCardProps) {
  const { title, description, thumbnail, links } = project;
  return (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row">
      {thumbnail && (
        <img
          src={thumbnail}
          alt={`${title} thumbnail`}
          loading="lazy"
          className="h-24 w-36 shrink-0 rounded object-cover"
        />
      )}
      <div className="text-sm leading-relaxed">
        <div className="font-semibold">{title}</div>
        <div className="text-slate-700 dark:text-slate-300">{description}</div>
        <div className="mt-1 flex flex-wrap gap-x-3 text-accent dark:text-accent-dark">
          {LINK_LABELS.filter(({ key }) => links[key]).map(({ key, label }) => (
            <a
              key={key}
              href={links[key]}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              [{label}]
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ProjectCard.test.tsx`
Expected: PASS, 2 tests passing.

- [ ] **Step 5: Implement Projects**

Create `src/components/Projects.tsx`:

```tsx
import type { Project } from '../types';
import { ProjectCard } from './ProjectCard';
import { Section } from './Section';

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <Section id="projects" title="Selected Projects">
      {projects.map((p) => (
        <ProjectCard key={p.title} project={p} />
      ))}
    </Section>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Projects section as vertical list"
```

---

## Task 18: Implement Services, Talks, and Notes

**Files:**
- Create: `src/components/Services.tsx`, `src/components/Talks.tsx`, `src/components/Notes.tsx`

- [ ] **Step 1: Implement Services**

Create `src/components/Services.tsx`:

```tsx
import type { ServiceGroup } from '../types';
import { Section } from './Section';

interface ServicesProps {
  groups: ServiceGroup[];
}

export function Services({ groups }: ServicesProps) {
  return (
    <Section id="services" title="Academic Services">
      <div className="grid gap-6 sm:grid-cols-2">
        {groups.map((group) => (
          <div key={group.heading}>
            <h3 className="mb-2 text-sm font-semibold">{group.heading}</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Implement Talks**

Create `src/components/Talks.tsx`:

```tsx
import type { Talk } from '../types';
import { Section } from './Section';

interface TalksProps {
  talks: Talk[];
}

export function Talks({ talks }: TalksProps) {
  return (
    <Section id="talks" title="Talks">
      <ul className="space-y-2 text-sm">
        {talks.map((talk) => (
          <li key={talk.date + talk.title}>
            <span className="mr-2 font-semibold">[{talk.date}]</span>
            <span className="font-medium">{talk.title}</span>
            <span className="text-slate-600 dark:text-slate-400"> — {talk.host}</span>
            {talk.replay && (
              <a
                href={talk.replay}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-accent hover:underline dark:text-accent-dark"
              >
                [replay]
              </a>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
```

- [ ] **Step 3: Implement Notes**

Create `src/components/Notes.tsx`:

```tsx
import type { NoteLink } from '../types';
import { Section } from './Section';

interface NotesProps {
  notes: NoteLink[];
}

export function Notes({ notes }: NotesProps) {
  return (
    <Section id="notes" title="Course Notes">
      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
        {notes.map((note) => (
          <li key={note.href}>
            <a
              href={note.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline dark:text-accent-dark"
            >
              {note.title}
            </a>
            {note.description && <span className="ml-2">— {note.description}</span>}
          </li>
        ))}
      </ul>
    </Section>
  );
}
```

- [ ] **Step 4: Typecheck and run all tests**

Run: `npm run typecheck && npm test`
Expected: no type errors; all existing tests still pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Services, Talks, and Notes sections"
```

---

## Task 19: Implement CustomSections

**Files:**
- Create: `src/components/CustomSections.tsx`, `src/components/CustomSections.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/CustomSections.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CustomSections } from './CustomSections';
import type { CustomSection } from '../types';

const sections: CustomSection[] = [
  {
    id: 'hobbies',
    title: 'Hobbies',
    layout: 'cards',
    items: [
      { title: 'Photography', description: 'Travel photos.', href: 'https://example.com' },
      { title: 'Reading', description: 'Sci-fi books.' },
    ],
  },
  {
    id: 'awards',
    title: 'Awards',
    layout: 'list',
    items: [{ title: 'Best Paper', description: 'At a venue, 2025' }],
  },
  {
    id: 'misc',
    title: 'Misc',
    layout: 'paragraph',
    items: [{ description: 'A paragraph of text.' }],
  },
];

describe('CustomSections', () => {
  it('renders nothing for an empty array', () => {
    const { container } = render(<CustomSections sections={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders each section with an id anchor and title', () => {
    render(<CustomSections sections={sections} />);
    expect(screen.getByRole('heading', { name: 'Hobbies' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Awards' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Misc' })).toBeInTheDocument();
    const hobbiesSection = document.getElementById('hobbies');
    expect(hobbiesSection).not.toBeNull();
  });

  it('renders card layout with links', () => {
    render(<CustomSections sections={sections} />);
    const photo = screen.getByText('Photography');
    expect(photo.closest('a')).toHaveAttribute('href', 'https://example.com');
    expect(screen.getByText('Travel photos.')).toBeInTheDocument();
  });

  it('renders list layout', () => {
    render(<CustomSections sections={sections} />);
    expect(screen.getByText('Best Paper')).toBeInTheDocument();
    expect(screen.getByText('At a venue, 2025')).toBeInTheDocument();
  });

  it('renders paragraph layout', () => {
    render(<CustomSections sections={sections} />);
    expect(screen.getByText('A paragraph of text.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/CustomSections.test.tsx`
Expected: FAIL — CustomSections not found.

- [ ] **Step 3: Implement CustomSections**

Create `src/components/CustomSections.tsx`:

```tsx
import type { CustomSection } from '../types';
import { Section } from './Section';

interface CustomSectionsProps {
  sections: CustomSection[];
}

export function CustomSections({ sections }: CustomSectionsProps) {
  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => (
        <Section key={section.id} id={section.id} title={section.title}>
          {section.layout === 'cards' && <CardLayout items={section.items} />}
          {section.layout === 'list' && <ListLayout items={section.items} />}
          {section.layout === 'paragraph' && <ParagraphLayout items={section.items} />}
        </Section>
      ))}
    </>
  );
}

function CardLayout({ items }: { items: CustomSection['items'] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item, i) => {
        const body = (
          <>
            {item.thumbnail && (
              <img
                src={item.thumbnail}
                alt={item.title ?? ''}
                loading="lazy"
                className="mb-2 h-28 w-full rounded object-cover"
              />
            )}
            {item.title && <div className="font-semibold">{item.title}</div>}
            {item.description && (
              <div className="text-sm text-slate-600 dark:text-slate-300">{item.description}</div>
            )}
          </>
        );
        const cls =
          'block rounded border border-slate-200 p-3 hover:shadow-sm dark:border-slate-700';
        return item.href ? (
          <a
            key={i}
            href={item.href}
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={cls}
          >
            {body}
          </a>
        ) : (
          <div key={i} className={cls}>
            {body}
          </div>
        );
      })}
    </div>
  );
}

function ListLayout({ items }: { items: CustomSection['items'] }) {
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
      {items.map((item, i) => (
        <li key={i}>
          {item.title && <span className="font-medium">{item.title}</span>}
          {item.title && item.description && ' — '}
          {item.description}
        </li>
      ))}
    </ul>
  );
}

function ParagraphLayout({ items }: { items: CustomSection['items'] }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed">
      {items.map((item, i) => (
        <p key={i}>{item.description}</p>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/CustomSections.test.tsx`
Expected: PASS, 5 tests passing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add data-driven CustomSections with three layouts"
```

---

## Task 20: Implement Navbar

**Files:**
- Create: `src/components/Navbar.tsx`, `src/components/Navbar.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/Navbar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Navbar } from './Navbar';
import type { CustomSection } from '../types';

const custom: CustomSection[] = [
  { id: 'hobbies', title: 'Hobbies', layout: 'list', items: [] },
];

describe('Navbar', () => {
  it('renders all fixed section links', () => {
    render(
      <Navbar
        theme="light"
        onToggleTheme={() => {}}
        nameEn="Jane Doe"
        customSections={[]}
      />,
    );
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '#about');
    expect(screen.getByRole('link', { name: /publications/i })).toHaveAttribute(
      'href',
      '#publications',
    );
    expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute('href', '#projects');
  });

  it('appends custom section links', () => {
    render(
      <Navbar
        theme="light"
        onToggleTheme={() => {}}
        nameEn="Jane Doe"
        customSections={custom}
      />,
    );
    expect(screen.getByRole('link', { name: 'Hobbies' })).toHaveAttribute('href', '#hobbies');
  });

  it('renders the theme toggle button', () => {
    render(
      <Navbar
        theme="dark"
        onToggleTheme={() => {}}
        nameEn="Jane Doe"
        customSections={[]}
      />,
    );
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Navbar.test.tsx`
Expected: FAIL — Navbar not found.

- [ ] **Step 3: Implement Navbar**

Create `src/components/Navbar.tsx`:

```tsx
import type { CustomSection } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  nameEn: string;
  customSections: CustomSection[];
}

const FIXED_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#news', label: 'News' },
  { href: '#publications', label: 'Publications' },
  { href: '#projects', label: 'Projects' },
  { href: '#services', label: 'Services' },
  { href: '#talks', label: 'Talks' },
  { href: '#notes', label: 'Notes' },
];

export function Navbar({ theme, onToggleTheme, nameEn, customSections }: NavbarProps) {
  const links = [
    ...FIXED_LINKS,
    ...customSections.map((s) => ({ href: `#${s.id}`, label: s.title })),
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-2.5">
        <span className="mr-auto text-sm font-semibold">{nameEn}</span>
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-slate-700 hover:text-accent dark:text-slate-200 dark:hover:text-accent-dark"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Navbar.test.tsx`
Expected: PASS, 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add sticky Navbar with custom section links"
```

---

## Task 21: Implement Footer and BackToTop

**Files:**
- Create: `src/components/Footer.tsx`, `src/components/BackToTop.tsx`, `src/components/BackToTop.test.tsx`

- [ ] **Step 1: Implement Footer**

Create `src/components/Footer.tsx`:

```tsx
interface FooterProps {
  name: string;
}

export function Footer({ name }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
      <span>© {year} {name}</span>
      <span className="mx-2">·</span>
      <a href="#top" className="hover:text-accent dark:hover:text-accent-dark">
        Back to top ↑
      </a>
    </footer>
  );
}
```

- [ ] **Step 2: Write the failing BackToTop test**

Create `src/components/BackToTop.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { BackToTop } from './BackToTop';

describe('BackToTop', () => {
  afterEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it('is hidden before the user scrolls past one viewport', () => {
    Object.defineProperty(window, 'innerHeight', { value: 500, configurable: true });
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    render(<BackToTop />);
    expect(screen.queryByRole('link', { name: /back to top/i })).toBeNull();
  });

  it('appears after scrolling past one viewport and links to top', () => {
    Object.defineProperty(window, 'innerHeight', { value: 500, configurable: true });
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    render(<BackToTop />);
    Object.defineProperty(window, 'scrollY', { value: 600, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    const link = screen.getByRole('link', { name: /back to top/i });
    expect(link).toHaveAttribute('href', '#top');
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/components/BackToTop.test.tsx`
Expected: FAIL — BackToTop not found.

- [ ] **Step 4: Implement BackToTop**

Create `src/components/BackToTop.tsx`:

```tsx
import { useEffect, useState } from 'react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <a
      href="#top"
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-30 rounded-full bg-accent px-3 py-2 text-sm text-white shadow-lg transition hover:opacity-90 dark:bg-accent-dark"
    >
      ↑
    </a>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/BackToTop.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Footer and BackToTop"
```

---

## Task 22: Compose App and wire everything together

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace App.tsx**

Replace `src/App.tsx` with:

```tsx
import { Navbar } from './components/Navbar';
import { Bio } from './components/Bio';
import { News } from './components/News';
import { Publications } from './components/Publications';
import { Projects } from './components/Projects';
import { Services } from './components/Services';
import { Talks } from './components/Talks';
import { Notes } from './components/Notes';
import { CustomSections } from './components/CustomSections';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { useTheme } from './hooks/useTheme';
import { profile } from './data/profile';
import { news } from './data/news';
import { publications } from './data/publications';
import { projects } from './data/projects';
import { services } from './data/services';
import { talks } from './data/talks';
import { notes } from './data/notes';
import { customSections } from './data/customSections';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div id="top" className="min-h-screen">
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        nameEn={profile.nameEn}
        customSections={customSections}
      />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div id="about">
          <Bio profile={profile} />
        </div>
        <News items={news} />
        <Publications publications={publications} ownName={profile.nameEn} />
        <Projects projects={projects} />
        <Services groups={services} />
        <Talks talks={talks} />
        <Notes notes={notes} />
        <CustomSections sections={customSections} />
      </main>
      <Footer name={profile.nameEn} />
      <BackToTop />
    </div>
  );
}
```

- [ ] **Step 2: Run typecheck, tests, and build**

Run: `npm run typecheck && npm test && npm run build`
Expected: all pass; `dist/` produced.

- [ ] **Step 3: Run the dev server for a visual smoke check**

Run: `npm run dev`
Open the printed URL. Verify: sections render in order, nav links scroll, theme toggle switches palettes, News expands, Publications filters work. Stop with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: compose App with all sections and theme"
```

---

## Task 23: Add placeholder assets and README

**Files:**
- Create: `public/favicon.svg`, `public/images/profile/.gitkeep`, `public/images/papers/.gitkeep`, `public/images/projects/.gitkeep`, `public/images/qrcode/.gitkeep`, `README.md`

- [ ] **Step 1: Create asset directories and favicon**

Run:
```bash
mkdir -p public/images/profile public/images/papers public/images/projects public/images/qrcode
touch public/images/profile/.gitkeep public/images/papers/.gitkeep public/images/projects/.gitkeep public/images/qrcode/.gitkeep
```

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#2563eb"/><text x="16" y="22" font-size="18" text-anchor="middle" fill="#fff" font-family="system-ui" font-weight="700">Y</text></svg>
```

- [ ] **Step 2: Create README**

Create `README.md`:

```markdown
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

## Edit content

All content lives in `src/data/`:

- `profile.ts` — name, photo, bio, contact links
- `news.ts` — news items
- `publications.ts` — publications (tags and Selected are auto-derived)
- `projects.ts` — projects
- `services.ts` — academic service groups
- `talks.ts` — talks
- `notes.ts` — course notes links
- `customSections.ts` — add your own sections here

Place images under `public/images/` and reference them as `/images/...`.

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

## Deploy to GitHub Pages

1. Set the `base` in `vite.config.ts`. For a project site at `https://<user>.github.io/<repo>/`, use `base: '/<repo>/'`. For a custom domain or user/organization site, use `base: '/'`.
2. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and deploys `dist/` to GitHub Pages.
3. In the repository Settings → Pages, set Source to "GitHub Actions".
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: add placeholder asset dirs, favicon, and README"
```

---

## Task 24: Add GitHub Pages deployment workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create the workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "ci: add GitHub Pages deployment workflow"
```

---

## Task 25: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Run full quality gate**

Run: `npm run lint && npm run typecheck && npm test && npm run build`
Expected: lint passes (warnings allowed), typecheck passes, all tests pass, build succeeds.

- [ ] **Step 2: Visual review**

Run: `npm run preview`
Open the printed URL. Confirm each section renders, dark/light toggle works, and the anchor nav scrolls correctly.

- [ ] **Step 3: Confirm against the spec**

Cross-check the built site against `docs/superpowers/specs/2026-08-24-personal-homepage-design.md` section 2 (Scope): bio, contact bar, news, publications, projects, services, talks, notes, custom sections, footer, back-to-top, theme toggle — all present. Travels/collaboration are intentionally absent (out of scope).

- [ ] **Step 4: Final commit (only if any fixes were made)**

```bash
git add -A
git commit -m "chore: final verification fixes"
```

If nothing changed, skip the commit. The plan is complete.
