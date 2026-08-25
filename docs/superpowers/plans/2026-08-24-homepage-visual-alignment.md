# Homepage Visual Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing React personal homepage visually match the reference site (tonyfang.net) item-by-item — Lato typography, card layout, circular profile photo, pill icons, timeline news, table-style publications with tags/honors/venue pills, three-column footer, fixed circular theme toggle, and light/dark themes driven by `data-theme`.

**Architecture:** Keep the data-driven React + Vite + TypeScript + Tailwind architecture. Replace Tailwind-only utility styling with a dedicated global stylesheet (`src/index.css`) that defines CSS custom properties (design tokens) and component classes ported faithfully from the reference `stylesheet.css`. Tailwind stays for layout utilities; `darkMode` becomes the `[data-theme="dark"]` selector. Components are rewritten to emit the reference's class names and structure. No new runtime dependencies — all icons are CSS `mask-image` SVGs.

**Tech Stack:** Vite 5, React 18, TypeScript (strict), Tailwind CSS 3.4.7, Vitest + React Testing Library + jsdom, GitHub Pages.

**Out of scope:** Travels (globe + gallery), Mentoring (student cards). The `CustomSections` extension mechanism stays.

---

## File Structure

**Modified:**
- `tailwind.config.js` — `darkMode: ['class', '[data-theme="dark"]']`, accent colors `#1772d0`/`#60a5fa`.
- `index.html` — Lato font preconnect/preload + stylesheet, no-FOUC inline theme script, title/meta.
- `src/index.css` — expanded with design tokens, body gradient, Lato typography, and all component classes (cards, headings, profile, news timeline, publications rows/tags/honors/links, filter buttons, footer, theme toggle, dark overrides).
- `src/hooks/useTheme.ts` — set `data-theme` attribute instead of `.dark` class.
- `src/types/index.ts` — structured authors, tag categories, venue type, honor, expanded link kinds, photo captions.
- `src/App.tsx` — remove Navbar; fixed ThemeToggle; 800px content; no floating BackToTop.
- `src/components/Section.tsx` — card shell with left-accent heading.
- `src/components/ThemeToggle.tsx` — fixed 38px circular button with inline SVG moon/sun.
- `src/components/Bio.tsx` — gradient hero card, text-left/photo-right, contact pills row.
- `src/components/ProfilePhoto.tsx` — circular photo + caption + swap/pulse animation.
- `src/components/ContactIcons.tsx` — pill buttons with CSS-mask SVG icons; email opens a copy modal; WeChat opens QR modal.
- `src/components/News.tsx` — date pills, timeline, hairline toggle, initial 5.
- `src/components/Publications.tsx` — "Filter by topic:" label, category-colored buttons, Selected amber, total count, legend.
- `src/components/PublicationCard.tsx` — 25/75 row, image + category tags below, selected amber row + badge + left bar, venue pill, honor badge, structured authors, button links with icons, abstract.
- `src/components/ProjectCard.tsx` / `src/components/Projects.tsx` — same row style as publications.
- `src/components/Services.tsx` / `src/components/Talks.tsx` / `src/components/Notes.tsx` / `src/components/CustomSections.tsx` — inherit card typography.
- `src/components/Footer.tsx` — three-column grid with back-to-top pill + SVG.
- `src/components/Modal.tsx` — token-based surface styles.
- `src/data/*.ts` — exercise new type fields.

**Created:**
- `src/components/PublicationsFilter.tsx` — the topic filter row (replaces generic TagFilter for publications).

**Deleted:**
- `src/components/Navbar.tsx` + `src/components/Navbar.test.tsx`
- `src/components/TagFilter.tsx` + `src/components/TagFilter.test.tsx`
- `src/components/BackToTop.tsx` + `src/components/BackToTop.test.tsx`

**Tests:** All component tests are co-located (`src/components/<Name>.test.tsx`, `src/hooks/useTheme.test.tsx`). Vitest config has `css: false`, so tests assert structure/roles/text/behavior, not computed styles.

---

## Task 1: Theme foundation — Tailwind config + useTheme attribute

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/hooks/useTheme.ts`
- Test: `src/hooks/useTheme.test.tsx`

- [ ] **Step 1: Update the failing test to expect `data-theme`**

Replace `src/hooks/useTheme.test.tsx` with:

```tsx
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  it('defaults to light and sets no data-theme attribute when light', () => {
    localStorage.clear();
    window.matchMedia = () => ({ matches: false }) as MediaQueryList;
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('persists dark preference and sets data-theme="dark"', () => {
    localStorage.clear();
    window.matchMedia = () => ({ matches: true }) as MediaQueryList;
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('toggles the data-theme attribute', () => {
    localStorage.clear();
    window.matchMedia = () => ({ matches: false }) as MediaQueryList;
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useTheme.test.tsx`
Expected: FAIL — current hook toggles the `dark` class, not `data-theme`.

- [ ] **Step 3: Update `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#1772d0',
          dark: '#60a5fa',
        },
      },
      fontFamily: {
        sans: ['Lato', 'Verdana', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 4: Update `src/hooks/useTheme.ts`**

```ts
import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
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
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/hooks/useTheme.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.js src/hooks/useTheme.ts src/hooks/useTheme.test.tsx
git commit -m "feat(theme): drive dark mode via data-theme attribute"
```

---

## Task 2: index.html — Lato font, no-FOUC script, meta

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="preload"
      as="style"
      href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,800;1,400&display=swap"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,800;1,400&display=swap"
    />
    <title>Your Name — Personal Homepage</title>
    <meta
      name="description"
      content="Personal homepage of Your Name, Ph.D. student researching robotic manipulation and tactile perception."
    />
    <meta property="og:title" content="Your Name — Personal Homepage" />
    <meta
      property="og:description"
      content="Ph.D. student researching robotic manipulation and tactile perception."
    />
    <meta property="og:type" content="website" />
    <script>
      (function () {
        try {
          var saved = localStorage.getItem('theme');
          var prefersDark =
            window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches;
          var theme = saved || (prefersDark ? 'dark' : 'light');
          if (theme === 'dark')
            document.documentElement.setAttribute('data-theme', 'dark');
        } catch (e) {}
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Verify build picks up the file**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(html): add Lato font and no-FOUC theme script"
```

---

## Task 3: Global stylesheet — tokens, body, typography, cards, headings

**Files:**
- Modify: `src/index.css`

This task adds the design tokens and the generic card/heading shell. Component-specific classes (profile, news, publications, footer, toggle) are added in later tasks, but the file is written here in full so later tasks only append to clearly-marked sections. To keep tasks independent, later tasks will use `Edit` to insert their blocks at the marked `/* COMPONENT STYLES */` anchor.

- [ ] **Step 1: Replace `src/index.css` with the token + base layer**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ==========================================================================
   Design tokens
   ========================================================================== */
:root {
  --accent: #1772d0;
  --accent-hover: #f09228;
  --accent-soft: rgba(23, 114, 208, 0.1);
  --accent-warm-soft: rgba(240, 146, 40, 0.08);

  --ink-900: #0f172a;
  --ink-800: #1e293b;
  --ink-700: #334155;
  --ink-600: #475569;
  --ink-500: #64748b;
  --ink-400: #94a3b8;
  --ink-body: #2b2b2b;

  --bg: #eef1f6;
  --card: #ffffff;
  --border: rgba(15, 23, 42, 0.07);

  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-md: 0 10px 30px rgba(15, 23, 42, 0.07);
  --shadow-lg: 0 12px 34px rgba(15, 23, 42, 0.08);

  --radius-card: 14px;
  --radius-sm: 6px;

  --card-head-start: #f8fafc;
  --card-head-end: #ffffff;
  --card-separator: #e4e9ef;
  --selected-row-bg: #ffffd0;
  --selected-row-accent: rgba(245, 158, 11, 0.6);
  --link-pill-bg: #ffffff;
  --link-pill-border: #d8dee6;
  --link-pill-ink: #1f2937;
  --link-pill-hover-bg: #f0f7ff;
  --filter-btn-bg: #ffffff;
  --filter-btn-border: rgba(15, 23, 42, 0.14);
  --filter-btn-ink: #334155;
  --muted-bg: #f8fafc;
  --heading-ink: #111827;
  --photo-caption-ink: #5c6370;
}

html[data-theme='dark'] {
  --accent: #60a5fa;
  --accent-hover: #fbbf24;
  --accent-soft: rgba(96, 165, 250, 0.13);
  --accent-warm-soft: rgba(251, 191, 36, 0.09);

  --ink-900: #f8fafc;
  --ink-800: #f1f5f9;
  --ink-700: #e2e8f0;
  --ink-600: #cbd5e1;
  --ink-500: #a3b0c2;
  --ink-400: #94a3b8;
  --ink-body: #e5e7eb;

  --bg: #0b1220;
  --card: #121a2b;
  --border: rgba(148, 163, 184, 0.16);

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.45);
  --shadow-md: 0 10px 30px rgba(0, 0, 0, 0.55);
  --shadow-lg: 0 14px 40px rgba(0, 0, 0, 0.6);

  --card-head-start: #141d30;
  --card-head-end: #121a2b;
  --card-separator: rgba(148, 163, 184, 0.14);
  --selected-row-bg: rgba(250, 204, 21, 0.08);
  --selected-row-accent: rgba(250, 204, 21, 0.55);
  --link-pill-bg: #182338;
  --link-pill-border: rgba(148, 163, 184, 0.22);
  --link-pill-ink: #e2e8f0;
  --link-pill-hover-bg: #1c2a44;
  --filter-btn-bg: #182338;
  --filter-btn-border: rgba(148, 163, 184, 0.22);
  --filter-btn-ink: #cbd5e1;
  --muted-bg: #141d30;
  --heading-ink: #f1f5f9;
  --photo-caption-ink: #94a3b8;
}

/* ==========================================================================
   Base
   ========================================================================== */
html {
  scroll-behavior: smooth;
}
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

body {
  background-color: var(--bg);
  background-image: radial-gradient(
      1100px 420px at 18% -80px,
      var(--accent-soft) 0%,
      rgba(23, 114, 208, 0) 60%
    ),
    radial-gradient(
      900px 380px at 92% 120px,
      var(--accent-warm-soft) 0%,
      rgba(240, 146, 40, 0) 60%
    );
  background-attachment: fixed;
  background-repeat: no-repeat;
  color: var(--ink-body);
  padding: 12px 14px 32px;
  font-family: Lato, Verdana, Helvetica, sans-serif;
  font-size: 15px;
  line-height: 1.65;
}

a {
  color: var(--accent);
  text-decoration: none;
}
a:hover,
a:focus {
  color: var(--accent-hover);
  text-decoration: none;
}

.site-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

/* ==========================================================================
   Card shell + section heading
   ========================================================================== */
.site-section {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm), var(--shadow-md);
  overflow: hidden;
  margin-bottom: 20px;
}

.site-section-body {
  padding: 20px;
}

.site-section-head {
  padding: 20px;
  background: linear-gradient(
    180deg,
    var(--card-head-start) 0%,
    var(--card-head-end) 55%
  );
  border-bottom: 1px solid var(--card-separator);
}

.section-heading {
  font-family: Lato, Verdana, Helvetica, sans-serif;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: var(--heading-ink);
  padding-left: 12px;
  margin: 0;
  border-left: 4px solid var(--accent);
  line-height: 1.25;
}

.site-section p {
  line-height: 1.68;
  color: var(--ink-body);
}
.site-section ul {
  margin: 0.4em 0 0.5em;
  padding-left: 1.35em;
}
.site-section li {
  margin-bottom: 0.55em;
  line-height: 1.62;
  color: var(--ink-body);
}
.site-section li::marker {
  color: var(--accent);
}

/* Prose links inside sections */
.prose-link {
  color: var(--accent);
  font-weight: 500;
  border-bottom: 1px solid rgba(23, 114, 208, 0.28);
  transition: color 0.15s ease, border-color 0.15s ease;
}
.prose-link:hover,
.prose-link:focus {
  color: #0f5ba8;
  border-bottom-color: #0f5ba8;
}

/* COMPONENT STYLES — later tasks insert blocks above this line. */
```

- [ ] **Step 2: Verify the build still compiles**

Run: `npx tsc --noEmit`
Expected: no errors (CSS changes don't affect TS).

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat(styles): add design tokens, body gradient, card shell"
```

---

## Task 4: Remove Navbar and floating BackToTop; App shell + fixed ThemeToggle

**Files:**
- Delete: `src/components/Navbar.tsx`, `src/components/Navbar.test.tsx`
- Delete: `src/components/BackToTop.tsx`, `src/components/BackToTop.test.tsx`
- Modify: `src/components/ThemeToggle.tsx`
- Test: `src/components/ThemeToggle.test.tsx`
- Modify: `src/App.tsx`

The reference has no top navbar and no floating back-to-top button (back-to-top lives in the footer). The theme toggle is a fixed 38px circular button at top-right.

- [ ] **Step 1: Delete the navbar and floating back-to-top**

Run:
```bash
git rm src/components/Navbar.tsx src/components/Navbar.test.tsx src/components/BackToTop.tsx src/components/BackToTop.test.tsx
```

- [ ] **Step 2: Write the ThemeToggle test**

Replace `src/components/ThemeToggle.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('renders a fixed toggle button with an accessible label', () => {
    render(<ThemeToggle theme="light" onToggle={vi.fn()} />);
    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('theme-toggle');
  });

  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn();
    render(<ThemeToggle theme="light" onToggle={onToggle} />);
    await userEvent.click(
      screen.getByRole('button', { name: /switch to dark mode/i }),
    );
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('announces light mode when theme is dark', () => {
    render(<ThemeToggle theme="dark" onToggle={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: /switch to light mode/i }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/components/ThemeToggle.test.tsx`
Expected: FAIL — current component uses emoji and no `theme-toggle` class.

- [ ] **Step 4: Replace `src/components/ThemeToggle.tsx`**

```tsx
interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title="Toggle theme"
    >
      <svg className="icon-moon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      <svg className="icon-sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    </button>
  );
}
```

- [ ] **Step 5: Append theme-toggle CSS to `src/index.css`**

Insert immediately before the `/* COMPONENT STYLES */` anchor:

```css
/* ==========================================================================
   Theme toggle
   ========================================================================== */
.theme-toggle {
  position: fixed;
  top: 14px;
  right: 14px;
  width: 38px;
  height: 38px;
  padding: 0;
  border-radius: 999px;
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--ink-700);
  cursor: pointer;
  box-shadow: var(--shadow-sm), 0 6px 18px rgba(15, 23, 42, 0.08);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  transition: transform 0.15s ease, box-shadow 0.15s ease,
    background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
.theme-toggle:hover,
.theme-toggle:focus-visible {
  transform: translateY(-1px);
  color: var(--accent);
  border-color: rgba(96, 165, 250, 0.45);
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.15);
  outline: none;
}
.theme-toggle svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.theme-toggle .icon-sun {
  display: none;
}
.theme-toggle .icon-moon {
  display: block;
}
html[data-theme='dark'] .theme-toggle .icon-sun {
  display: block;
}
html[data-theme='dark'] .theme-toggle .icon-moon {
  display: none;
}
```

- [ ] **Step 6: Replace `src/App.tsx`**

```tsx
import { Bio } from './components/Bio';
import { News } from './components/News';
import { Publications } from './components/Publications';
import { Projects } from './components/Projects';
import { Services } from './components/Services';
import { Talks } from './components/Talks';
import { Notes } from './components/Notes';
import { CustomSections } from './components/CustomSections';
import { Footer } from './components/Footer';
import { ThemeToggle } from './components/ThemeToggle';
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
    <div id="top" className="site-container">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <main className="py-4">
        <header id="about" className="scroll-mt-20">
          <Bio profile={profile} />
        </header>
        <News items={news} />
        <Publications publications={publications} ownName={profile.nameEn} />
        <Projects projects={projects} />
        <Services groups={services} />
        <Talks talks={talks} />
        <Notes notes={notes} />
        <CustomSections sections={customSections} />
      </main>
      <Footer name={profile.nameEn} />
    </div>
  );
}
```

- [ ] **Step 7: Run tests**

Run: `npx vitest run src/components/ThemeToggle.test.tsx`
Expected: PASS. The full suite will fail at this point (other components still import deleted Navbar/BackToTop or use old Section markup) — that's expected; those are fixed in later tasks. Run just the ThemeToggle test here.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor: remove navbar/back-to-top, add fixed theme toggle, app shell"
```

---

## Task 5: Section card component

**Files:**
- Modify: `src/components/Section.tsx`
- Test: `src/components/Section.test.tsx`

- [ ] **Step 1: Write the Section test**

Create `src/components/Section.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Section } from './Section';

describe('Section', () => {
  it('renders a card with a left-accent heading and body', () => {
    render(
      <Section id="news" title="News">
        <p>body</p>
      </Section>,
    );
    const section = screen.getByRole('region', { name: 'News' });
    expect(section).toHaveClass('site-section');
    expect(screen.getByText('News')).toHaveClass('section-heading');
    expect(screen.getByText('body')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Section.test.tsx`
Expected: FAIL — current Section uses bottom-border heading, no card classes.

- [ ] **Step 3: Replace `src/components/Section.tsx`**

```tsx
import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
  /** Render the heading inside a gradient "head" row (used by tables). */
  head?: boolean;
}

export function Section({ id, title, children, head = false }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="site-section">
      {head ? (
        <div className="site-section-head">
          <h2 id={`${id}-heading`} className="section-heading">
            {title}
          </h2>
          {children}
        </div>
      ) : (
        <div className="site-section-body">
          <h2 id={`${id}-heading`} className="section-heading">
            {title}
          </h2>
          {children}
        </div>
      )}
    </section>
  );
}
```

Note: the `head` variant is used by Publications where the filter belongs inside the gradient head cell. For News/Services/etc., the default `site-section-body` applies.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Section.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Section.tsx src/components/Section.test.tsx
git commit -m "feat(section): card shell with left-accent heading"
```

---

## Task 6: Extend the data model (types)

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Replace `src/types/index.ts`**

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

export interface ProfilePhoto {
  src: string;
  caption: string;
}

export interface Profile {
  nameEn: string;
  nameZh: string;
  photos: ProfilePhoto[];
  bio: string;
  contacts: ContactLink[];
}

export interface NewsItem {
  date: string;
  content: string;
}

/** Topic categories drive the colored tag/filter styling. */
export type TagCategory =
  | 'policy'
  | 'grasping'
  | 'manipulation'
  | 'data'
  | 'other';

export interface Tag {
  label: string;
  category: TagCategory;
}

export type VenueType = 'conference' | 'journal' | 'preprint';

export interface Venue {
  name: string;
  type: VenueType;
}

export interface Author {
  name: string;
  url?: string;
  isOwn?: boolean;
  equalContrib?: boolean;
  corresponding?: boolean;
}

export type PublicationLinkKind =
  | 'paper'
  | 'code'
  | 'project'
  | 'twitter'
  | 'dataset'
  | 'demo'
  | 'report'
  | 'generic';

export interface PublicationLink {
  kind: PublicationLinkKind;
  href: string;
  label?: string;
}

export type Honor = 'oral' | 'best';

export interface Publication {
  title: string;
  authors: Author[];
  venue: Venue;
  tags: Tag[];
  selected?: boolean;
  honor?: Honor;
  thumbnail?: string;
  links: PublicationLink[];
  /** Non-link note shown next to links, e.g. "code coming soon". */
  note?: string;
  abstract?: string;
}

export type ProjectLinkKind = 'code' | 'report' | 'demo' | 'project' | 'generic';

export interface ProjectLink {
  kind: ProjectLinkKind;
  href: string;
  label?: string;
}

export interface Project {
  title: string;
  description: string;
  thumbnail?: string;
  links: ProjectLink[];
}

export interface ServiceGroup {
  heading: string;
  items: string[];
}

export interface Talk {
  date: string;
  title: string;
  host: string;
  hostUrl?: string;
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

- [ ] **Step 2: Verify the type errors surface (data files not yet migrated)**

Run: `npx tsc --noEmit`
Expected: errors in `src/data/publications.ts`, `src/data/projects.ts`, `src/components/*` that consume the old shape. These are fixed in Tasks 7 and onward. Do NOT commit yet — the project won't compile until Tasks 7–17 are done. Proceed immediately to Task 7.

---

## Task 7: Update placeholder data to the new model

**Files:**
- Modify: `src/data/profile.ts`
- Modify: `src/data/publications.ts`
- Modify: `src/data/projects.ts`

- [ ] **Step 1: Replace `src/data/profile.ts`**

```ts
import type { Profile } from '../types';

export const profile: Profile = {
  nameEn: 'Your Name',
  nameZh: '你的名字',
  photos: [
    {
      src: '/images/profile/photo1.jpg',
      caption: 'Photo at Campus (2026)<br/>Credit to Your Friend',
    },
    {
      src: '/images/profile/photo2.jpg',
      caption: 'Photo at Conference (2025)',
    },
    {
      src: '/images/profile/photo3.jpg',
      caption: 'Photo in the Lab',
    },
  ],
  bio: 'I am a Ph.D. student at [Your University], advised by Prof. [Advisor]. My research focuses on robotic manipulation and tactile perception.',
  contacts: [
    { type: 'email', label: 'Email', href: 'you@example.com' },
    {
      type: 'scholar',
      label: 'Google Scholar',
      href: 'https://scholar.google.com/',
    },
    { type: 'github', label: 'GitHub', href: 'https://github.com/yourusername' },
    { type: 'twitter', label: 'X', href: 'https://twitter.com/yourusername' },
    {
      type: 'wechat',
      label: 'WeChat',
      href: '#',
      qrcode: '/images/qrcode/wechat.png',
    },
    { type: 'cv', label: 'CV (07/2026)', href: '/cv.pdf' },
  ],
};
```

- [ ] **Step 2: Replace `src/data/publications.ts`**

```ts
import type { Publication } from '../types';

export const publications: Publication[] = [
  {
    title: 'Example Tactile Manipulation Paper',
    authors: [
      { name: 'Coauthor One' },
      { name: 'Your Name', isOwn: true, equalContrib: true },
      { name: 'Coauthor Two' },
    ],
    venue: { name: 'CoRL 2026', type: 'conference' },
    tags: [
      { label: 'Tactile', category: 'manipulation' },
      { label: 'Manipulation', category: 'manipulation' },
    ],
    selected: true,
    honor: 'oral',
    thumbnail: '/images/papers/tactile.jpg',
    links: [
      { kind: 'paper', href: 'https://example.com/paper1' },
      { kind: 'code', href: 'https://github.com/yourname/paper1' },
      { kind: 'project', href: 'https://example.com/project1' },
    ],
    note: 'code coming soon',
    abstract:
      'We propose a method for tactile-rich robotic manipulation. This placeholder abstract demonstrates the justified paragraph shown below each paper.',
  },
  {
    title: 'Example Grasping Paper',
    authors: [
      { name: 'Your Name', isOwn: true },
      { name: 'Coauthor Three' },
    ],
    venue: { name: 'ICRA 2026', type: 'conference' },
    tags: [{ label: 'Grasping', category: 'grasping' }],
    thumbnail: '/images/papers/grasping.jpg',
    links: [
      { kind: 'paper', href: 'https://example.com/paper2' },
      { kind: 'code', href: 'https://github.com/yourname/paper2' },
    ],
    abstract: 'A grasping paper placeholder.',
  },
  {
    title: 'Example Preprint on Data Collection',
    authors: [
      { name: 'Your Name', isOwn: true, corresponding: true },
      { name: 'Coauthor Four' },
    ],
    venue: { name: 'arXiv 2025', type: 'preprint' },
    tags: [
      { label: 'Dataset', category: 'data' },
      { label: 'Generalization', category: 'other' },
    ],
    links: [{ kind: 'paper', href: 'https://example.com/paper3' }],
    abstract: 'A data-collection preprint placeholder.',
  },
];
```

- [ ] **Step 3: Replace `src/data/projects.ts`**

```ts
import type { Project } from '../types';

export const projects: Project[] = [
  {
    title: 'Example Project One',
    description:
      'A short description of an open-source robotics project, shown as a justified paragraph below the link row.',
    thumbnail: '/images/projects/project1.jpg',
    links: [
      { kind: 'code', href: 'https://github.com/yourname/project1' },
      { kind: 'report', href: 'https://example.com/report1' },
    ],
  },
  {
    title: 'Example Project Two',
    description: 'A short description of another project.',
    thumbnail: '/images/projects/project2.jpg',
    links: [{ kind: 'code', href: 'https://github.com/yourname/project2' }],
  },
];
```

- [ ] **Step 4: Confirm data files type-check**

Run: `npx tsc --noEmit`
Expected: errors now only in components that still reference old shapes (PublicationCard, Publications, ProjectCard, Projects, Bio, ProfilePhoto). Those are fixed next.

- [ ] **Step 5: Commit**

```bash
git add src/types/index.ts src/data/profile.ts src/data/publications.ts src/data/projects.ts
git commit -m "feat(types): structured authors, tags, venues, honors, links"
```

(The build is intentionally red between Tasks 6 and the component tasks; this commit keeps types and data consistent.)

---

## Task 8: ProfilePhoto — circular, caption, swap animation

**Files:**
- Modify: `src/components/ProfilePhoto.tsx`
- Test: `src/components/ProfilePhoto.test.tsx`

- [ ] **Step 1: Write the test**

Replace `src/components/ProfilePhoto.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ProfilePhoto } from './ProfilePhoto';
import type { ProfilePhoto as ProfilePhotoType } from '../types';

const photos: ProfilePhotoType[] = [
  { src: '/a.jpg', caption: 'First photo' },
  { src: '/b.jpg', caption: 'Second photo' },
];

describe('ProfilePhoto', () => {
  it('renders the first photo as a circular clickable image', () => {
    render(<ProfilePhoto photos={photos} alt="Your Name" />);
    const img = screen.getByRole('button', { name: /rotate profile photo/i });
    expect(img).toBeInTheDocument();
    const im = img.querySelector('img');
    expect(im).toHaveAttribute('src', '/a.jpg');
    expect(im).toHaveAttribute('alt', 'Your Name');
    expect(screen.getByText('First photo')).toBeInTheDocument();
  });

  it('swaps photo and caption on click', async () => {
    render(<ProfilePhoto photos={photos} alt="Your Name" />);
    await userEvent.click(
      screen.getByRole('button', { name: /rotate profile photo/i }),
    );
    const im = screen
      .getByRole('button', { name: /rotate profile photo/i })
      .querySelector('img');
    expect(im).toHaveAttribute('src', '/b.jpg');
    expect(screen.getByText('Second photo')).toBeInTheDocument();
  });

  it('renders nothing when there are no photos', () => {
    const { container } = render(<ProfilePhoto photos={[]} alt="x" />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ProfilePhoto.test.tsx`
Expected: FAIL — current component expects `string[]` and renders no caption.

- [ ] **Step 3: Replace `src/components/ProfilePhoto.tsx`**

```tsx
import { useState } from 'react';
import type { ProfilePhoto as ProfilePhotoType } from '../types';

interface ProfilePhotoProps {
  photos: ProfilePhotoType[];
  alt: string;
}

export function ProfilePhoto({ photos, alt }: ProfilePhotoProps) {
  const [index, setIndex] = useState(0);
  const [swapping, setSwapping] = useState(false);
  const [pulse, setPulse] = useState(false);

  if (photos.length === 0) return null;
  const current = photos[index % photos.length];

  const handleClick = () => {
    if (photos.length < 2) {
      setPulse(true);
      window.setTimeout(() => setPulse(false), 500);
      return;
    }
    setSwapping(true);
    window.setTimeout(() => {
      setIndex((i) => (i + 1) % photos.length);
      setSwapping(false);
      setPulse(true);
      window.setTimeout(() => setPulse(false), 500);
    }, 180);
  };

  const imgClass = [
    'profile-photo',
    swapping ? 'is-photo-swapping' : '',
    pulse ? 'is-photo-pulse' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="profile-photo-col">
      <button
        type="button"
        className="profile-photo-button"
        aria-label="Rotate profile photo"
        onClick={handleClick}
      >
        <img src={current.src} alt={alt} loading="lazy" className={imgClass} />
      </button>
      <p
        className={`profile-caption${swapping ? ' is-caption-swapping' : ''}`}
        dangerouslySetInnerHTML={{ __html: current.caption }}
      />
    </div>
  );
}
```

The caption uses `dangerouslySetInnerHTML` because reference captions contain a `<br/>` (e.g. "Photo @ ...<br/>Credit to ..."). Captions come from the local data file (trusted), so this is safe.

- [ ] **Step 4: Append profile photo CSS**

Insert before the `/* COMPONENT STYLES */` anchor in `src/index.css`:

```css
/* ==========================================================================
   Profile photo
   ========================================================================== */
.profile-photo-col {
  width: 34%;
  text-align: center;
}
.profile-photo-button {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}
.profile-photo {
  display: block;
  margin: 0 auto;
  width: 100%;
  max-width: 220px;
  aspect-ratio: 1 / 1;
  height: auto;
  object-fit: cover;
  border-radius: 50%;
  box-shadow:
    0 0 0 1px rgba(15, 23, 42, 0.06),
    0 10px 28px rgba(15, 23, 42, 0.14);
  transition:
    opacity 0.22s ease,
    transform 0.22s cubic-bezier(0.2, 0.7, 0.3, 1),
    box-shadow 0.22s ease;
}
.profile-photo-button:hover .profile-photo {
  transform: scale(1.02);
  box-shadow:
    0 0 0 1px rgba(23, 114, 208, 0.28),
    0 14px 34px rgba(15, 23, 42, 0.18);
}
.profile-photo.is-photo-swapping {
  opacity: 0;
  transform: scale(0.96);
}
.profile-photo.is-photo-pulse {
  animation: profile-photo-pulse 0.5s ease-out;
}
@keyframes profile-photo-pulse {
  0% {
    transform: scale(1);
  }
  35% {
    transform: scale(1.06);
  }
  100% {
    transform: scale(1);
  }
}
.profile-caption {
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--photo-caption-ink);
  font-style: italic;
  letter-spacing: 0.01em;
  margin: 10px auto 0;
  max-width: 220px;
  transition: opacity 0.22s ease;
}
.profile-caption.is-caption-swapping {
  opacity: 0;
}
html[data-theme='dark'] .profile-photo {
  box-shadow:
    0 0 0 1px rgba(148, 163, 184, 0.18),
    0 10px 28px rgba(0, 0, 0, 0.55);
}
html[data-theme='dark'] .profile-photo-button:hover .profile-photo {
  box-shadow:
    0 0 0 1px rgba(96, 165, 250, 0.36),
    0 14px 34px rgba(0, 0, 0, 0.65);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/ProfilePhoto.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/ProfilePhoto.tsx src/components/ProfilePhoto.test.tsx src/index.css
git commit -m "feat(profile): circular photo with caption and swap animation"
```

---

## Task 9: ContactIcons — pill buttons with mask icons + email modal

**Files:**
- Modify: `src/components/ContactIcons.tsx`
- Test: `src/components/ContactIcons.test.tsx`

- [ ] **Step 1: Write the test**

Replace `src/components/ContactIcons.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContactIcons } from './ContactIcons';
import type { ContactLink } from '../types';

const contacts: ContactLink[] = [
  { type: 'email', label: 'Email', href: 'you@example.com' },
  { type: 'github', label: 'GitHub', href: 'https://github.com/you' },
  {
    type: 'wechat',
    label: 'WeChat',
    href: '#',
    qrcode: '/images/qrcode.png',
  },
];

describe('ContactIcons', () => {
  it('renders external links as anchor pills with the profile-link class', () => {
    render(<ContactIcons contacts={contacts} />);
    const github = screen.getByRole('link', { name: 'GitHub' });
    expect(github).toHaveAttribute('href', 'https://github.com/you');
    expect(github).toHaveClass('profile-link', 'profile-link-github');
  });

  it('opens the email modal when the email pill is activated', async () => {
    render(<ContactIcons contacts={contacts} />);
    await userEvent.click(screen.getByRole('button', { name: 'Email' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('you@example.com')).toBeInTheDocument();
  });

  it('opens the WeChat modal with the QR code', async () => {
    render(<ContactIcons contacts={contacts} />);
    await userEvent.click(screen.getByRole('button', { name: 'WeChat' }));
    const qr = screen.getByAltText('WeChat QR code');
    expect(qr).toHaveAttribute('src', '/images/qrcode.png');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ContactIcons.test.tsx`
Expected: FAIL — current component copies email on click and uses emoji.

- [ ] **Step 3: Replace `src/components/ContactIcons.tsx`**

```tsx
import { useEffect, useRef, useState } from 'react';
import type { ContactLink } from '../types';
import { Modal } from './Modal';

interface ContactIconsProps {
  contacts: ContactLink[];
}

export function ContactIcons({ contacts }: ContactIconsProps) {
  const [wechatOpen, setWechatOpen] = useState(false);
  const [wechatQr, setWechatQr] = useState<string | undefined>();
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const copyEmail = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      window.location.href = `mailto:${address}`;
      return;
    }
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <p className="profile-links">
      {contacts.map((c) => {
        if (c.type === 'email') {
          return (
            <button
              key={c.label}
              type="button"
              className={`profile-link profile-link-${c.type}`}
              onClick={() => {
                setEmailAddress(c.href);
                setEmailOpen(true);
              }}
            >
              {c.label}
            </button>
          );
        }
        if (c.type === 'wechat') {
          return (
            <button
              key={c.label}
              type="button"
              className="profile-link profile-link-wechat"
              onClick={() => {
                setWechatQr(c.qrcode);
                setWechatOpen(true);
              }}
            >
              {c.label}
            </button>
          );
        }
        const isExternal = c.href.startsWith('http');
        return (
          <a
            key={c.label}
            href={c.href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className={`profile-link profile-link-${c.type}`}
          >
            {c.label}
          </a>
        );
      })}

      <Modal
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        title="Contact via Email"
      >
        {emailAddress && (
          <div className="email-modal-body">
            <p className="email-modal-subtitle">
              Click the address to copy it to your clipboard.
            </p>
            <button
              type="button"
              className="email-row"
              onClick={() => copyEmail(emailAddress)}
            >
              <span className="email-address">{emailAddress}</span>
              <span className="email-copy">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        )}
      </Modal>

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
    </p>
  );
}
```

- [ ] **Step 4: Append profile-link CSS**

Insert before the `/* COMPONENT STYLES */` anchor:

```css
/* ==========================================================================
   Profile contact pills
   ========================================================================== */
.profile-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 10px;
  margin: 0;
  padding: 14px 0 4px;
}
.profile-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  background: var(--link-pill-bg);
  border: 1px solid var(--link-pill-border);
  color: var(--link-pill-ink) !important;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-decoration: none;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  cursor: pointer;
  transition: transform 0.12s ease, border-color 0.12s ease,
    color 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
}
.profile-link::before {
  content: '';
  display: inline-block;
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  background-color: currentColor;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
}
.profile-link:hover,
.profile-link:focus {
  color: var(--accent) !important;
  border-color: rgba(23, 114, 208, 0.55);
  background: var(--link-pill-hover-bg);
  box-shadow: 0 2px 6px rgba(23, 114, 208, 0.14);
  transform: translateY(-1px);
}
.profile-link-email::before {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='5' width='18' height='14' rx='2' ry='2'/><polyline points='3 7 12 13 21 7'/></svg>");
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='5' width='18' height='14' rx='2' ry='2'/><polyline points='3 7 12 13 21 7'/></svg>");
}
.profile-link-scholar::before {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'><path d='M12 3 1 9l11 6 9-4.91V17h2V9L12 3z'/><path d='M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z'/></svg>");
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'><path d='M12 3 1 9l11 6 9-4.91V17h2V9L12 3z'/><path d='M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z'/></svg>");
}
.profile-link-github::before {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'><path d='M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.02c-3.2.7-3.87-1.37-3.87-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.07 0 0 .97-.31 3.17 1.18.92-.26 1.9-.39 2.88-.39s1.96.13 2.88.39c2.2-1.49 3.17-1.18 3.17-1.18.62 1.6.23 2.78.11 3.07.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.35.78 1.04.78 2.1v3.11c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z'/></svg>");
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'><path d='M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.02c-3.2.7-3.87-1.37-3.87-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.07 0 0 .97-.31 3.17 1.18.92-.26 1.9-.39 2.88-.39s1.96.13 2.88.39c2.2-1.49 3.17-1.18 3.17-1.18.62 1.6.23 2.78.11 3.07.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.35.78 1.04.78 2.1v3.11c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z'/></svg>");
}
.profile-link-twitter::before {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'><path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'/></svg>");
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'><path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'/></svg>");
}
.profile-link-wechat::before {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'><path d='M8.69 2C4.44 2 1 4.94 1 8.57c0 2.08 1.16 3.92 2.97 5.12L3 17l3.67-1.86c.65.18 1.34.29 2.02.29.22 0 .44-.01.65-.03-.22-.67-.34-1.37-.34-2.1 0-3.67 3.47-6.65 7.76-6.65.27 0 .53.01.79.04C16.8 4.04 13.1 2 8.69 2zm-2.6 4.14c.59 0 1.07.48 1.07 1.07 0 .59-.48 1.07-1.07 1.07-.59 0-1.07-.48-1.07-1.07 0-.59.48-1.07 1.07-1.07zm5.2 0c.59 0 1.07.48 1.07 1.07 0 .59-.48 1.07-1.07 1.07-.59 0-1.07-.48-1.07-1.07 0-.59.48-1.07 1.07-1.07zM17 8c-3.87 0-7 2.69-7 6s3.13 6 7 6c.68 0 1.34-.08 1.96-.24L21.5 21l-.86-2.41C22.05 17.47 23 15.82 23 14c0-3.31-2.69-6-6-6zm-2.5 4.14c.47 0 .86.38.86.86s-.38.86-.86.86-.86-.39-.86-.86.39-.86.86-.86zm4.28 0c.48 0 .86.38.86.86s-.39.86-.86.86-.86-.39-.86-.86c0-.47.39-.86.86-.86z'/></svg>");
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'><path d='M8.69 2C4.44 2 1 4.94 1 8.57c0 2.08 1.16 3.92 2.97 5.12L3 17l3.67-1.86c.65.18 1.34.29 2.02.29.22 0 .44-.01.65-.03-.22-.67-.34-1.37-.34-2.1 0-3.67 3.47-6.65 7.76-6.65.27 0 .53.01.79.04C16.8 4.04 13.1 2 8.69 2zm-2.6 4.14c.59 0 1.07.48 1.07 1.07 0 .59-.48 1.07-1.07 1.07-.59 0-1.07-.48-1.07-1.07 0-.59.48-1.07 1.07-1.07zm5.2 0c.59 0 1.07.48 1.07 1.07 0 .59-.48 1.07-1.07 1.07-.59 0-1.07-.48-1.07-1.07 0-.59.48-1.07 1.07-1.07zM17 8c-3.87 0-7 2.69-7 6s3.13 6 7 6c.68 0 1.34-.08 1.96-.24L21.5 21l-.86-2.41C22.05 17.47 23 15.82 23 14c0-3.31-2.69-6-6-6zm-2.5 4.14c.47 0 .86.38.86.86s-.38.86-.86.86-.86-.39-.86-.86.39-.86.86-.86zm4.28 0c.48 0 .86.38.86.86s-.39.86-.86.86-.86-.39-.86-.86c0-.47.39-.86.86-.86z'/></svg>");
}
.profile-link-cv::before {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/><line x1='8' y1='13' x2='16' y2='13'/><line x1='8' y1='17' x2='14' y2='17'/></svg>");
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/><line x1='8' y1='13' x2='16' y2='13'/><line x1='8' y1='17' x2='14' y2='17'/></svg>");
}
.profile-link-link::before {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'/><polyline points='15 3 21 3 21 9'/><line x1='10' y1='14' x2='21' y2='3'/></svg>");
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'/><polyline points='15 3 21 3 21 9'/><line x1='10' y1='14' x2='21' y2='3'/></svg>");
}

.email-modal-body {
  display: grid;
  gap: 10px;
}
.email-modal-subtitle {
  margin: 0;
  font-size: 13px;
  color: var(--ink-600);
}
.email-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--muted-bg);
  font: inherit;
  cursor: pointer;
  color: var(--ink-800);
}
.email-row:hover {
  border-color: rgba(23, 114, 208, 0.45);
}
.email-address {
  font-weight: 600;
}
.email-copy {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--accent);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/ContactIcons.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/ContactIcons.tsx src/components/ContactIcons.test.tsx src/index.css
git commit -m "feat(contact): pill buttons with mask icons and email/wechat modals"
```

---

## Task 10: Bio hero card

**Files:**
- Modify: `src/components/Bio.tsx`
- Test: `src/components/Bio.test.tsx`

- [ ] **Step 1: Write the test**

Replace `src/components/Bio.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Bio } from './Bio';
import { profile } from '../data/profile';

describe('Bio', () => {
  it('renders the hero with name, intro, photo and contacts', () => {
    render(<Bio profile={profile} />);
    const card = screen
      .getByText(profile.nameEn)
      .closest('.profile-hero') as HTMLElement;
    expect(card).toBeInTheDocument();
    expect(screen.getByText(profile.nameZh)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /rotate profile photo/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Email' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Bio.test.tsx`
Expected: FAIL — current Bio has no `.profile-hero` wrapper and photo is on the left.

- [ ] **Step 3: Replace `src/components/Bio.tsx`**

```tsx
import type { Profile } from '../types';
import { ContactIcons } from './ContactIcons';
import { ProfilePhoto } from './ProfilePhoto';

interface BioProps {
  profile: Profile;
}

export function Bio({ profile }: BioProps) {
  return (
    <div className="profile-hero">
      <div className="profile-hero-row">
        <div className="profile-text-col">
          <p className="profile-name-row">
            <span className="name-en">{profile.nameEn}</span>{' '}
            <span className="name-cn">{profile.nameZh}</span>
          </p>
          <p className="profile-intro">{profile.bio}</p>
        </div>
        <ProfilePhoto photos={profile.photos} alt={profile.nameEn} />
      </div>
      <div className="profile-links-cell">
        <ContactIcons contacts={profile.contacts} />
      </div>
    </div>
  );
}
```

Note: `profile.bio` is plain text in the placeholder data. If the user later wants inline links, they can replace it with JSX; for now it renders as a text paragraph matching the data model.

- [ ] **Step 4: Append hero CSS**

Insert before the `/* COMPONENT STYLES */` anchor:

```css
/* ==========================================================================
   Profile hero
   ========================================================================== */
.profile-hero {
  background: linear-gradient(180deg, #fafbfc 0%, #ffffff 55%, #ffffff 100%);
  border-radius: var(--radius-card);
  border: 1px solid var(--border);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.9) inset,
    var(--shadow-sm),
    var(--shadow-lg);
  overflow: hidden;
  margin-bottom: 22px;
}
.profile-hero-row {
  display: flex;
  align-items: center;
}
.profile-text-col {
  flex: 1;
  padding: 28px 18px 24px 32px;
  min-width: 0;
}
.profile-photo-col {
  padding: 28px 32px 24px 8px;
}
.profile-name-row {
  text-align: center;
  margin: 2px 0 22px;
  font-size: clamp(28px, 4.2vw, 38px);
  letter-spacing: -0.015em;
  line-height: 1.2;
}
.name-en {
  font-weight: 800;
  color: #1a1a1a;
}
.name-cn {
  font-weight: 700;
  color: var(--ink-700);
  margin-left: 0.35em;
  letter-spacing: 0.02em;
}
.profile-intro {
  text-align: justify;
  hyphens: auto;
  -webkit-hyphens: auto;
  line-height: 1.72;
  font-size: 15px;
  color: var(--ink-body);
  margin: 10px 0 6px;
}
.profile-links-cell {
  border-top: 1px solid var(--card-separator);
  padding: 4px 28px 22px;
}
@media (max-width: 640px) {
  .profile-hero-row {
    flex-direction: column-reverse;
  }
  .profile-text-col {
    padding: 22px 22px 20px;
  }
  .profile-photo-col {
    width: 100%;
    padding: 22px 22px 8px;
  }
  .profile-links-cell {
    padding: 4px 22px 20px;
  }
  .profile-intro {
    text-align: left;
  }
}
html[data-theme='dark'] .profile-hero {
  background: linear-gradient(180deg, #16203a 0%, #121a2b 100%);
  border-color: var(--border);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.03) inset,
    var(--shadow-sm),
    var(--shadow-md);
}
html[data-theme='dark'] .name-en {
  color: var(--ink-900);
}
html[data-theme='dark'] .name-cn {
  color: var(--ink-600);
}
html[data-theme='dark'] .profile-intro {
  color: var(--ink-700);
}
html[data-theme='dark'] .profile-links-cell {
  border-top-color: var(--card-separator);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/Bio.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/Bio.tsx src/components/Bio.test.tsx src/index.css
git commit -m "feat(bio): gradient hero card with contact pills row"
```

---

## Task 11: News — date pills, timeline, hairline toggle (initial 5)

**Files:**
- Modify: `src/components/News.tsx`
- Test: `src/components/News.test.tsx`

- [ ] **Step 1: Write the test**

Replace `src/components/News.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { News } from './News';
import type { NewsItem } from '../types';

const items: NewsItem[] = Array.from({ length: 8 }, (_, i) => ({
  date: `2026-0${i + 1}`,
  content: `News item number ${i + 1}`,
}));

describe('News', () => {
  it('shows 5 items initially with a collapsed list and an expand toggle', () => {
    render(<News items={items} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getByRole('list')).toHaveAttribute('data-collapsed', 'true');
    expect(
      screen.getByRole('button', { name: /show earlier news/i }),
    ).toBeInTheDocument();
  });

  it('expands to all items when toggled', async () => {
    render(<News items={items} />);
    await userEvent.click(
      screen.getByRole('button', { name: /show earlier news/i }),
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(8);
    expect(
      screen.getByRole('button', { name: /show less/i }),
    ).toBeInTheDocument();
  });

  it('renders no toggle when there are 5 or fewer items', () => {
    render(<News items={items.slice(0, 4)} />);
    expect(
      screen.queryByRole('button', { name: /show/i }),
    ).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/News.test.tsx`
Expected: FAIL — current component shows 4 items, no `data-collapsed`, toggle says "Show more".

- [ ] **Step 3: Replace `src/components/News.tsx`**

```tsx
import type { NewsItem } from '../types';
import { useCollapsible } from '../hooks/useCollapsible';
import { Section } from './Section';

interface NewsProps {
  items: NewsItem[];
}

const INITIAL_VISIBLE = 5;

export function News({ items }: NewsProps) {
  const { expanded, visibleCount, toggle } = useCollapsible(
    items.length,
    INITIAL_VISIBLE,
  );
  const visible = items.slice(0, visibleCount);
  const hasMore = items.length > INITIAL_VISIBLE;

  return (
    <Section id="news" title="News">
      <ul
        className="news-list"
        data-collapsed={hasMore && !expanded ? 'true' : 'false'}
      >
        {visible.map((item, i) => {
          const isLastVisible = hasMore && !expanded && i === visible.length - 1;
          return (
            <li
              key={`${item.date}-${i}`}
              className={[
                hasMore && !expanded && i >= INITIAL_VISIBLE
                  ? 'is-news-collapsed'
                  : '',
                isLastVisible ? 'is-news-last-visible' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="news-date">{item.date}</span>
              <span
                className="news-body"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </li>
          );
        })}
      </ul>
      {hasMore && (
        <button
          type="button"
          className="news-toggle"
          aria-expanded={expanded}
          onClick={toggle}
        >
          <span className="news-toggle-label">
            {expanded ? 'Show less' : 'Show earlier news'}
          </span>
          <svg
            className="news-toggle-chevron"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}
    </Section>
  );
}
```

News `content` may contain inline links (e.g. `<a href="..."><b>Title</b></a> is accepted...`) like the reference. Content comes from the trusted local data file, so `dangerouslySetInnerHTML` is used to render it. The placeholder `src/data/news.ts` currently uses plain strings, which still render correctly.

- [ ] **Step 4: Append news CSS**

Insert before the `/* COMPONENT STYLES */` anchor:

```css
/* ==========================================================================
   News
   ========================================================================== */
.news-list {
  list-style: none;
  padding: 6px 0 4px;
  margin: 0;
  position: relative;
}
.news-list::before {
  content: '';
  position: absolute;
  left: 74px;
  top: 6px;
  bottom: 6px;
  width: 1px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--border) 8%,
    var(--border) 92%,
    transparent 100%
  );
  pointer-events: none;
}
.news-list > li {
  position: relative;
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 14px;
  padding: 7px 0;
  align-items: baseline;
  line-height: 1.6;
  color: var(--ink-body);
}
.news-list > li::before {
  content: '';
  position: absolute;
  left: 70px;
  top: 14px;
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--card);
  border: 2px solid var(--accent);
  box-shadow: 0 0 0 3px var(--card);
  z-index: 1;
}
.news-date {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--ink-700);
  background: var(--muted-bg);
  border: 1px solid var(--border);
  white-space: nowrap;
  justify-self: start;
  line-height: 1.4;
}
.news-body {
  min-width: 0;
}
.news-body b {
  font-weight: 700;
  color: var(--ink-800);
}
.news-list[data-collapsed='true'] > li.is-news-collapsed {
  display: none;
}
.news-list[data-collapsed='true'] > li.is-news-last-visible::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 26px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    var(--card) 100%
  );
  pointer-events: none;
}
.news-toggle {
  margin: 16px auto 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: max-content;
  padding: 6px 14px 6px 13px;
  border-radius: 999px;
  background: var(--muted-bg);
  border: 1px solid var(--border);
  color: var(--ink-700);
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  position: relative;
  transition: transform 0.12s ease, background 0.12s ease,
    border-color 0.12s ease, color 0.12s ease, box-shadow 0.12s ease;
}
.news-toggle::before,
.news-toggle::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 80px;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--border),
    transparent
  );
  pointer-events: none;
}
.news-toggle::before {
  right: 100%;
  margin-right: 12px;
}
.news-toggle::after {
  left: 100%;
  margin-left: 12px;
  background: linear-gradient(
    to left,
    transparent,
    var(--border),
    transparent
  );
}
.news-toggle:hover,
.news-toggle:focus-visible {
  transform: translateY(-1px);
  color: var(--accent);
  border-color: rgba(23, 114, 208, 0.45);
  box-shadow: 0 3px 10px rgba(15, 23, 42, 0.08);
  outline: none;
}
.news-toggle-chevron {
  width: 13px;
  height: 13px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.2s ease;
}
.news-toggle[aria-expanded='true'] .news-toggle-chevron {
  transform: rotate(180deg);
}
@media (max-width: 520px) {
  .news-list::before,
  .news-list > li::before {
    display: none;
  }
  .news-list > li {
    grid-template-columns: 1fr;
    gap: 4px;
    padding: 8px 0;
  }
  .news-toggle::before,
  .news-toggle::after {
    width: 40px;
  }
}
html[data-theme='dark'] .news-date {
  background: rgba(148, 163, 184, 0.1);
}
html[data-theme='dark'] .news-list > li::before {
  background: var(--card);
  box-shadow: 0 0 0 3px var(--card);
}
html[data-theme='dark'] .news-toggle {
  background: rgba(148, 163, 184, 0.1);
}
html[data-theme='dark']
  .news-list[data-collapsed='true']
  > li.is-news-last-visible::after {
  background: linear-gradient(
    to bottom,
    rgba(18, 26, 43, 0) 0%,
    var(--card) 100%
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/News.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/News.tsx src/components/News.test.tsx src/index.css
git commit -m "feat(news): timeline with date pills and hairline toggle"
```

---

## Task 12: PublicationsFilter — "Filter by topic:" with category colors

**Files:**
- Create: `src/components/PublicationsFilter.tsx`
- Test: `src/components/PublicationsFilter.test.tsx`
- Delete: `src/components/TagFilter.tsx`, `src/components/TagFilter.test.tsx`

- [ ] **Step 1: Delete the old generic filter**

Run:
```bash
git rm src/components/TagFilter.tsx src/components/TagFilter.test.tsx
```

- [ ] **Step 2: Write the filter test**

Create `src/components/PublicationsFilter.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PublicationsFilter } from './PublicationsFilter';
import type { TagCategory } from '../types';

const buttons: { label: string; value: string; count: number; category?: TagCategory | 'selected' }[] = [
  { label: 'All', value: 'all', count: 3 },
  { label: 'Selected', value: 'selected', count: 1, category: 'selected' },
  { label: 'Grasping', value: 'Grasping', count: 1, category: 'grasping' },
];

describe('PublicationsFilter', () => {
  it('renders the label and buttons with count badges', () => {
    render(
      <PublicationsFilter
        buttons={buttons}
        value="all"
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Filter by topic:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /all/i })).toHaveClass(
      'is-active',
    );
    expect(screen.getByText('1', { selector: '.pub-filter-count' })).toBeInTheDocument();
  });

  it('marks the Selected button with the amber class', () => {
    render(
      <PublicationsFilter buttons={buttons} value="selected" onChange={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: /selected/i })).toHaveClass(
      'pub-filter-btn-selected',
      'is-active',
    );
  });

  it('calls onChange with the button value', async () => {
    const onChange = vi.fn();
    render(
      <PublicationsFilter buttons={buttons} value="all" onChange={onChange} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /grasping/i }));
    expect(onChange).toHaveBeenCalledWith('Grasping');
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/components/PublicationsFilter.test.tsx`
Expected: FAIL — component does not exist.

- [ ] **Step 4: Create `src/components/PublicationsFilter.tsx`**

```tsx
import type { TagCategory } from '../types';

export interface FilterButton {
  label: string;
  value: string;
  count: number;
  category?: TagCategory | 'selected';
}

interface PublicationsFilterProps {
  buttons: FilterButton[];
  value: string;
  onChange: (value: string) => void;
}

export function PublicationsFilter({
  buttons,
  value,
  onChange,
}: PublicationsFilterProps) {
  return (
    <div className="publications-filter">
      <span className="publications-filter-label">Filter by topic:</span>
      <div className="publications-filter-buttons">
        {buttons.map((btn) => {
          const active = btn.value === value;
          const classes = [
            'pub-filter-btn',
            btn.category === 'selected' ? 'pub-filter-btn-selected' : '',
            btn.category && btn.category !== 'selected'
              ? `pub-filter-btn-category pub-filter-btn-${btn.category}`
              : '',
            active ? 'is-active' : '',
            btn.count === 0 ? 'is-empty' : '',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <button
              key={btn.value}
              type="button"
              className={classes}
              data-category={btn.category && btn.category !== 'selected' ? btn.category : undefined}
              aria-pressed={active}
              onClick={() => onChange(btn.value)}
            >
              <span>{btn.label}</span>
              <span className="pub-filter-count">{btn.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Append filter CSS**

Insert before the `/* COMPONENT STYLES */` anchor:

```css
/* ==========================================================================
   Publications filter
   ========================================================================== */
.publications-filter {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 10px;
}
.publications-filter-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ink-600);
}
.publications-filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 7px;
}
.pub-filter-btn {
  font: inherit;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: var(--filter-btn-ink);
  background: var(--filter-btn-bg);
  border: 1px solid var(--filter-btn-border);
  border-radius: 999px;
  padding: 4px 6px 4px 11px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
  line-height: 1.5;
  transition: transform 0.12s ease, box-shadow 0.12s ease,
    background-color 0.12s ease, border-color 0.12s ease, color 0.12s ease;
}
.pub-filter-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 18px;
  padding: 0 6px;
  font-size: 10px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--ink-600);
  background: rgba(15, 23, 42, 0.07);
  border-radius: 999px;
}
.pub-filter-btn.is-active .pub-filter-count {
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
}
.pub-filter-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(15, 23, 42, 0.1);
  border-color: rgba(15, 23, 42, 0.28);
}
.pub-filter-btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
.pub-filter-btn.is-active {
  background: #1e293b;
  color: #f8fafc;
  border-color: #1e293b;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.18);
}
.pub-filter-btn[data-category='policy'].is-active {
  background: #2563eb;
  border-color: #2563eb;
}
.pub-filter-btn[data-category='grasping'].is-active {
  background: #059669;
  border-color: #059669;
}
.pub-filter-btn[data-category='manipulation'].is-active {
  background: #dc2626;
  border-color: #dc2626;
}
.pub-filter-btn[data-category='data'].is-active {
  background: #7c3aed;
  border-color: #7c3aed;
}
.pub-filter-btn[data-category='other'].is-active {
  background: #64748b;
  border-color: #64748b;
}
.pub-filter-btn-selected {
  color: #78350f;
  border-color: rgba(217, 119, 6, 0.45);
  background: linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%);
}
.pub-filter-btn-selected:hover {
  border-color: rgba(217, 119, 6, 0.75);
}
.pub-filter-btn-selected.is-active {
  background: #d97706;
  border-color: #d97706;
  color: #fff;
  box-shadow: 0 2px 6px rgba(217, 119, 6, 0.28);
}
.pub-total-count {
  display: inline-flex;
  align-items: baseline;
  justify-content: center;
  min-width: 1.8em;
  margin-left: 0.45em;
  padding: 0 0.55em;
  font-size: 0.52em;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--ink-600);
  background: rgba(15, 23, 42, 0.07);
  border-radius: 999px;
  vertical-align: 0.45em;
}
.publications-legend {
  line-height: 1.65;
  color: var(--ink-700);
  margin: 0 0 2px;
  font-size: 13px;
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run src/components/PublicationsFilter.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(publications): topic filter with category colors"
```

---

## Task 13: PublicationCard — table-style row, tags, venue, honor, links, abstract

**Files:**
- Modify: `src/components/PublicationCard.tsx`
- Test: `src/components/PublicationCard.test.tsx`

- [ ] **Step 1: Write the test**

Replace `src/components/PublicationCard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PublicationCard } from './PublicationCard';
import type { Publication } from '../types';

const base: Publication = {
  title: 'A Tactile Paper',
  authors: [
    { name: 'Coauthor One' },
    { name: 'Your Name', isOwn: true, equalContrib: true },
    { name: 'Advisor', corresponding: true },
  ],
  venue: { name: 'CoRL 2026', type: 'conference' },
  tags: [
    { label: 'Tactile', category: 'manipulation' },
    { label: 'Manipulation', category: 'manipulation' },
  ],
  selected: true,
  honor: 'oral',
  thumbnail: '/img.jpg',
  links: [
    { kind: 'paper', href: '/paper.pdf' },
    { kind: 'code', href: '/code' },
  ],
  note: 'code coming soon',
  abstract: 'An abstract.',
};

describe('PublicationCard', () => {
  it('renders a selected row with badge, tags, venue pill, honor, authors, links and abstract', () => {
    render(<PublicationCard publication={base} ownName="Your Name" />);
    const row = screen
      .getByText('A Tactile Paper')
      .closest('.paper-row') as HTMLElement;
    expect(row).toHaveClass('paper-row-selected');
    expect(screen.getByText('Selected')).toHaveClass('selected-badge');
    expect(screen.getByText('Tactile')).toHaveClass(
      'paper-tag',
      'paper-tag-manipulation',
    );
    expect(screen.getByText('CoRL 2026')).toHaveClass('venue-conference');
    expect(screen.getByText(/oral/i)).toHaveClass('paper-honor');
    // own name bold + equal-contrib marker
    expect(screen.getByText('Your Name').closest('b')).not.toBeNull();
    expect(screen.getByText('*', { selector: '.author-marker' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^paper$/i })).toHaveClass(
      'paper-link-paper',
    );
    expect(screen.getByText('code coming soon')).toHaveClass('paper-link-note');
    expect(screen.getByText('An abstract.')).toBeInTheDocument();
  });

  it('renders a non-selected row without selected styling', () => {
    const p: Publication = {
      ...base,
      selected: false,
      honor: undefined,
      thumbnail: undefined,
      tags: [{ label: 'Grasping', category: 'grasping' }],
      links: [{ kind: 'paper', href: '/p' }],
      note: undefined,
      abstract: undefined,
    };
    render(<PublicationCard publication={p} ownName="Your Name" />);
    const row = screen
      .getByText('A Tactile Paper')
      .closest('.paper-row') as HTMLElement;
    expect(row).not.toHaveClass('paper-row-selected');
    expect(screen.queryByText('Selected')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/PublicationCard.test.tsx`
Expected: FAIL — old card uses the previous model.

- [ ] **Step 3: Replace `src/components/PublicationCard.tsx`**

```tsx
import type { Publication, PublicationLinkKind } from '../types';

interface PublicationCardProps {
  publication: Publication;
  ownName: string;
}

const LINK_LABELS: Record<PublicationLinkKind, string> = {
  paper: 'paper',
  code: 'code',
  project: 'project page',
  twitter: 'X',
  dataset: 'dataset',
  demo: 'demo',
  report: 'report',
  generic: 'link',
};

export function PublicationCard({ publication }: PublicationCardProps) {
  const {
    title,
    authors,
    venue,
    tags,
    selected,
    honor,
    thumbnail,
    links,
    note,
    abstract,
  } = publication;

  return (
    <article
      className={`paper-row${selected ? ' paper-row-selected' : ''}`}
    >
      <div className="paper-media-cell">
        {thumbnail && (
          <div className="paper-media-stack">
            <div className="paper-media-figure">
              <img
                src={thumbnail}
                alt={`${title} teaser`}
                loading="lazy"
                width={160}
              />
            </div>
            {tags.length > 0 && (
              <div className="paper-tags-overlay">
                {tags.map((tag) => (
                  <span
                    key={tag.label}
                    className={`paper-tag paper-tag-${tag.category}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        {selected && <span className="selected-badge">Selected</span>}
      </div>
      <div className="paper-content-cell">
        <div className="paper-venue">
          <em className={`venue-${venue.type}`}>{venue.name}</em>
          {honor && (
            <span
              className={`paper-honor${
                honor === 'best' ? ' paper-honor-best' : ''
              }`}
            >
              {honor === 'best' ? 'Best Paper' : 'Oral'}
            </span>
          )}
        </div>
        <h3 className="paper-title">
          {links[0]?.kind === 'paper' && links[0]?.href ? (
            <a href={links[0].href} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        <div className="paper-authors">
          {authors.map((author, i) => {
            const sep = i < authors.length - 1 ? ', ' : '';
            const marker = author.equalContrib ? (
              <sup className="author-marker">*</sup>
            ) : author.corresponding ? (
              <sup className="author-marker">#</sup>
            ) : null;
            const content = (
              <>
                {author.isOwn ? <b>{author.name}</b> : author.name}
                {marker}
                {sep}
              </>
            );
            return author.url ? (
              <a
                key={author.name + i}
                href={author.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </a>
            ) : (
              <span key={author.name + i}>{content}</span>
            );
          })}
        </div>
        {links.length > 0 && (
          <div className="paper-links">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`paper-link paper-link-${link.kind}`}
              >
                {link.label ?? LINK_LABELS[link.kind]}
              </a>
            ))}
            {note && <span className="paper-link-note">{note}</span>}
          </div>
        )}
        {abstract && <p className="paper-abstract">{abstract}</p>}
      </div>
    </article>
  );
}
```

The `ownName` prop is no longer required because authors carry an explicit `isOwn` flag (the prop stays in the interface above for call-site compatibility but is not used — actually, remove it). Update the component signature to omit `ownName`; the Publications container will stop passing it in Task 14.

Correct the interface:

```tsx
interface PublicationCardProps {
  publication: Publication;
}
```

and call as `<PublicationCard publication={pub} />`.

- [ ] **Step 4: Append publication row CSS**

Insert before the `/* COMPONENT STYLES */` anchor. This block is large; insert it verbatim:

```css
/* ==========================================================================
   Publication / project rows
   ========================================================================== */
.paper-row {
  display: grid;
  grid-template-columns: 25% 75%;
  border-bottom: 1px solid var(--card-separator);
}
.paper-row:last-child {
  border-bottom: none;
}
.paper-media-cell {
  position: relative;
  padding: 18px 14px 18px 20px;
  background: linear-gradient(180deg, var(--card-head-start) 0%, var(--card) 100%);
}
.paper-content-cell {
  padding: 18px 20px 22px 14px;
  color: var(--ink-600);
}
.paper-media-stack {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  max-width: 100%;
}
.paper-media-figure {
  display: block;
  width: fit-content;
  max-width: 100%;
  margin: 0;
}
.paper-media-stack img {
  display: block;
  width: 160px;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid #dde3ea;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.09);
  background: #f8fafc;
}
.paper-tags-overlay {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 5px;
  max-width: 160px;
}
.paper-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 7px 3px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.35;
  color: #1e293b;
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-left-width: 2px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
}
.paper-tag::before {
  content: '';
  width: 4px;
  height: 4px;
  border-radius: 1px;
  background: currentColor;
  opacity: 0.4;
}
.paper-tag-policy {
  background: linear-gradient(165deg, #e8f4fd 0%, #dbeafe 100%);
  border-left-color: #2563eb;
  color: #1e3a5f;
}
.paper-tag-grasping {
  background: linear-gradient(165deg, #ecfdf3 0%, #d1fae5 100%);
  border-left-color: #059669;
  color: #064e3b;
}
.paper-tag-manipulation {
  background: linear-gradient(165deg, #fef2f2 0%, #fee2e2 100%);
  border-left-color: #dc2626;
  color: #7f1d1d;
}
.paper-tag-data {
  background: linear-gradient(165deg, #f3e8ff 0%, #ede9fe 100%);
  border-left-color: #7c3aed;
  color: #4c1d95;
}
.paper-tag-other {
  background: linear-gradient(165deg, #f8fafc 0%, #eef2f7 100%);
  border-left-color: #64748b;
  color: #334155;
}
.paper-venue {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--ink-600);
  margin: 0 0 8px;
}
.paper-venue em {
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border-radius: 5px;
  border: 1px solid rgba(37, 99, 235, 0.18);
  color: #1e3a8a;
  background: linear-gradient(165deg, #eef4ff 0%, #e0ebff 100%);
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.02em;
}
.paper-venue em.venue-journal {
  background: linear-gradient(165deg, #f5f3ff 0%, #ede9fe 100%);
  border-color: rgba(124, 58, 237, 0.22);
  color: #5b21b6;
}
.paper-venue em.venue-preprint {
  background: linear-gradient(165deg, #f8fafc 0%, #eef2f7 100%);
  border-color: rgba(71, 85, 105, 0.22);
  color: #475569;
}
.paper-honor {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #7c2d12;
  background: linear-gradient(135deg, #fde68a 0%, #fdba74 55%, #fb923c 100%);
  border: 1px solid rgba(194, 65, 12, 0.35);
  box-shadow:
    0 2px 6px rgba(234, 88, 12, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
  overflow: hidden;
}
.paper-honor::before {
  content: '';
  width: 11px;
  height: 11px;
  flex-shrink: 0;
  background-color: currentColor;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'><path d='M13.5 1a.75.75 0 0 0-1.28-.53C9.2 3.5 6 7.2 6 11.5 6 15.64 9.36 19 13.5 19S21 15.64 21 11.5c0-2.3-.94-4.16-2.1-5.47-.32-.37-.93-.18-.98.31-.16 1.5-1.13 2.63-2.24 2.8-.4.06-.72-.3-.66-.7.2-1.36.4-3.62-1.52-6.45z'/></svg>");
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'><path d='M13.5 1a.75.75 0 0 0-1.28-.53C9.2 3.5 6 7.2 6 11.5 6 15.64 9.36 19 13.5 19S21 15.64 21 11.5c0-2.3-.94-4.16-2.1-5.47-.32-.37-.93-.18-.98.31-.16 1.5-1.13 2.63-2.24 2.8-.4.06-.72-.3-.66-.7.2-1.36.4-3.62-1.52-6.45z'/></svg>");
}
.paper-honor::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    transparent 0%,
    transparent 40%,
    rgba(255, 255, 255, 0.55) 50%,
    transparent 60%,
    transparent 100%
  );
  transform: translateX(-100%);
  animation: paper-honor-shimmer 3.6s ease-in-out infinite;
  pointer-events: none;
}
@keyframes paper-honor-shimmer {
  0%,
  40% {
    transform: translateX(-100%);
  }
  55% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(100%);
  }
}
.paper-honor-best {
  color: #7f1d1d;
  background: linear-gradient(135deg, #fde68a 0%, #fca5a5 55%, #ef4444 100%);
  border-color: rgba(153, 27, 27, 0.45);
  box-shadow:
    0 2px 6px rgba(185, 28, 28, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
.paper-honor-best::before {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M8 21h8'/><path d='M12 17v4'/><path d='M7 4h10v4a5 5 0 0 1-10 0z'/><path d='M7 4H4a2 2 0 0 0 0 4h3'/><path d='M17 4h3a2 2 0 0 1 0 4h-3'/></svg>");
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M8 21h8'/><path d='M12 17v4'/><path d='M7 4h10v4a5 5 0 0 1-10 0z'/><path d='M7 4H4a2 2 0 0 0 0 4h3'/><path d='M17 4h3a2 2 0 0 1 0 4h-3'/></svg>");
}
.paper-title {
  font-size: 19px;
  font-weight: 800;
  line-height: 1.3;
  margin: 0 0 4px;
  color: #020617;
}
.paper-title a {
  color: #020617;
}
.paper-title a:hover {
  color: var(--accent);
}
.paper-authors {
  font-size: 14px;
  line-height: 1.7;
  color: #4b5563;
  margin: 2px 0 8px;
  letter-spacing: 0.005em;
}
.paper-authors b {
  color: #0f172a;
  font-weight: 700;
}
.author-marker {
  font-size: 0.75em;
  margin-left: 1px;
}
.paper-links {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 8px;
  margin: 4px 0 2px;
}
.paper-links a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 11px;
  border-radius: 6px;
  background: var(--link-pill-bg);
  border: 1px solid var(--link-pill-border);
  color: var(--link-pill-ink) !important;
  font-size: 12px;
  font-weight: 600 !important;
  letter-spacing: 0.02em;
  text-decoration: none;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: transform 0.12s ease, border-color 0.12s ease,
    color 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
}
.paper-links a::before {
  content: '';
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  background-color: var(--ink-500);
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
  transition: background-color 0.12s ease;
}
.paper-link-paper::before {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/><line x1='8' y1='13' x2='16' y2='13'/><line x1='8' y1='17' x2='14' y2='17'/></svg>");
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/><line x1='8' y1='13' x2='16' y2='13'/><line x1='8' y1='17' x2='14' y2='17'/></svg>");
}
.paper-link-code::before {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><polyline points='16 18 22 12 16 6'/><polyline points='8 6 2 12 8 18'/></svg>");
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><polyline points='16 18 22 12 16 6'/><polyline points='8 6 2 12 8 18'/></svg>");
}
.paper-link-project::before {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><line x1='2' y1='12' x2='22' y2='12'/><path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/></svg>");
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><line x1='2' y1='12' x2='22' y2='12'/><path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/></svg>");
}
.paper-link-twitter::before {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'><path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'/></svg>");
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'><path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'/></svg>");
}
.paper-link-dataset::before {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><ellipse cx='12' cy='5' rx='9' ry='3'/><path d='M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5'/><path d='M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6'/></svg>");
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><ellipse cx='12' cy='5' rx='9' ry='3'/><path d='M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5'/><path d='M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6'/></svg>");
}
.paper-link-demo::before {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'><polygon points='6 4 20 12 6 20 6 4'/></svg>");
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'><polygon points='6 4 20 12 6 20 6 4'/></svg>");
}
.paper-link-report::before {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'/><rect x='8' y='2' width='8' height='4' rx='1' ry='1'/><polyline points='9 14 11 16 15 12'/></svg>");
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'/><rect x='8' y='2' width='8' height='4' rx='1' ry='1'/><polyline points='9 14 11 16 15 12'/></svg>");
}
.paper-link-generic::before {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'/><polyline points='15 3 21 3 21 9'/><line x1='10' y1='14' x2='21' y2='3'/></svg>");
  -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'/><polyline points='15 3 21 3 21 9'/><line x1='10' y1='14' x2='21' y2='3'/></svg>");
}
.paper-links a:hover {
  color: var(--accent) !important;
  border-color: rgba(23, 114, 208, 0.55);
  background: var(--link-pill-hover-bg);
  box-shadow: 0 2px 6px rgba(23, 114, 208, 0.14);
  transform: translateY(-1px);
}
.paper-links a:hover::before {
  background-color: var(--accent);
}
.paper-link-note {
  display: inline-flex;
  align-items: center;
  padding: 4px 11px;
  border-radius: 6px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
  font-style: italic;
  border: 1px dashed #cbd5e1;
}
.paper-abstract {
  margin-top: 0.65em;
  line-height: 1.68;
  text-align: justify;
  color: #5a6578;
  font-size: 14px;
}
.selected-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 3;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: #92400e;
  background: linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%);
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid rgba(217, 119, 6, 0.45);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
  pointer-events: none;
}

/* Selected row treatment */
.paper-row-selected .paper-media-cell {
  background: linear-gradient(
    125deg,
    #fffbeb 0%,
    #fffef5 35%,
    #fffdf8 70%,
    #fffef9 100%
  );
  box-shadow:
    inset 4px 0 0 0 #f59e0b,
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
.paper-row-selected .paper-content-cell {
  background: linear-gradient(
    125deg,
    #fffbeb 0%,
    #fffef5 35%,
    #fffdf8 70%,
    #fffef9 100%
  );
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    inset 0 0 0 1px rgba(245, 158, 11, 0.18);
  border-bottom-color: rgba(217, 119, 6, 0.22);
}
.paper-row-selected .paper-title {
  font-size: 20px;
  color: #0c1222;
}
.paper-row-selected .paper-media-stack img {
  border-color: rgba(217, 119, 6, 0.4);
  box-shadow:
    0 4px 16px rgba(180, 83, 9, 0.14),
    0 2px 6px rgba(15, 23, 42, 0.08);
}

@media (max-width: 640px) {
  .paper-row {
    grid-template-columns: 1fr;
  }
  .paper-media-cell {
    padding: 16px 16px 0;
    background: var(--card);
  }
  .paper-content-cell {
    padding: 14px 16px 20px;
  }
  .paper-row-selected .paper-media-cell {
    box-shadow: inset 4px 0 0 0 #f59e0b;
  }
}

/* Dark theme row overrides */
html[data-theme='dark'] .paper-media-cell {
  background: linear-gradient(180deg, #141d30 0%, #121a2b 100%);
}
html[data-theme='dark'] .paper-media-stack img {
  background: #182338;
  border-color: rgba(148, 163, 184, 0.22);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}
html[data-theme='dark'] .paper-title,
html[data-theme='dark'] .paper-title a {
  color: var(--ink-900);
}
html[data-theme='dark'] .paper-authors {
  color: var(--ink-600);
}
html[data-theme='dark'] .paper-authors b {
  color: var(--ink-900);
}
html[data-theme='dark'] .paper-venue {
  color: var(--ink-700);
}
html[data-theme='dark'] .paper-content-cell,
html[data-theme='dark'] .paper-abstract {
  color: var(--ink-700);
}
html[data-theme='dark'] .paper-links a {
  background: var(--link-pill-bg);
  border-color: var(--link-pill-border);
  color: var(--link-pill-ink) !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
html[data-theme='dark'] .paper-links a::before {
  background-color: var(--ink-500);
}
html[data-theme='dark'] .paper-links a:hover {
  background: var(--link-pill-hover-bg);
  border-color: rgba(96, 165, 250, 0.45);
}
html[data-theme='dark'] .paper-link-note {
  background: rgba(148, 163, 184, 0.1);
  border-color: rgba(148, 163, 184, 0.25);
  color: var(--ink-500);
}
html[data-theme='dark'] .paper-row-selected .paper-media-cell,
html[data-theme='dark'] .paper-row-selected .paper-content-cell {
  background: linear-gradient(
    125deg,
    rgba(250, 204, 21, 0.1) 0%,
    rgba(250, 204, 21, 0.06) 40%,
    rgba(250, 204, 21, 0.04) 100%
  ) !important;
  box-shadow:
    inset 4px 0 0 0 #eab308,
    inset 0 0 0 1px rgba(250, 204, 21, 0.18);
}
html[data-theme='dark'] .paper-row-selected .paper-title {
  color: var(--ink-900);
}
html[data-theme='dark'] .selected-badge {
  color: #fde68a;
  background: linear-gradient(
    180deg,
    rgba(250, 204, 21, 0.18) 0%,
    rgba(217, 119, 6, 0.22) 100%
  );
  border-color: rgba(250, 204, 21, 0.35);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/PublicationCard.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/PublicationCard.tsx src/components/PublicationCard.test.tsx src/index.css
git commit -m "feat(publications): table-style rows with tags, venue, honors, links"
```

---

## Task 14: Publications container — head cell, filter, legend, count

**Files:**
- Modify: `src/components/Publications.tsx`
- Test: `src/components/Publications.test.tsx`

- [ ] **Step 1: Write the test**

Replace `src/components/Publications.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Publications } from './Publications';
import { publications } from '../data/publications';

describe('Publications', () => {
  it('renders the heading with total count, legend and all papers', () => {
    render(<Publications publications={publications} />);
    expect(screen.getByText('Publications')).toBeInTheDocument();
    expect(
      screen.getByLabelText('total publications'),
    ).toHaveTextContent(String(publications.length));
    expect(
      screen.getByText(/denotes equal contribution/i),
    ).toBeInTheDocument();
    publications.forEach((p) => {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    });
  });

  it('filters by the Selected topic', async () => {
    render(<Publications publications={publications} />);
    await userEvent.click(
      screen.getByRole('button', { name: /selected/i }),
    );
    const selectedTitles = publications
      .filter((p) => p.selected)
      .map((p) => p.title);
    const otherTitles = publications
      .filter((p) => !p.selected)
      .map((p) => p.title);
    selectedTitles.forEach((t) =>
      expect(screen.getByText(t)).toBeInTheDocument(),
    );
    otherTitles.forEach((t) =>
      expect(screen.queryByText(t)).not.toBeInTheDocument(),
    );
  });

  it('filters by a tag category label', async () => {
    render(<Publications publications={publications} />);
    await userEvent.click(
      screen.getByRole('button', { name: /grasping/i }),
    );
    expect(
      screen.getByText('Example Grasping Paper'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Example Tactile Manipulation Paper'),
    ).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Publications.test.tsx`
Expected: FAIL — old container still uses TagFilter and the old PublicationCard props.

- [ ] **Step 3: Replace `src/components/Publications.tsx`**

```tsx
import { useMemo, useState } from 'react';
import type { Publication, TagCategory } from '../types';
import { PublicationCard } from './PublicationCard';
import { PublicationsFilter, type FilterButton } from './PublicationsFilter';

interface PublicationsProps {
  publications: Publication[];
}

const CATEGORY_ORDER: TagCategory[] = [
  'policy',
  'manipulation',
  'grasping',
  'data',
  'other',
];

const ALL = 'all';
const SELECTED = 'selected';

export function Publications({ publications }: PublicationsProps) {
  const [active, setActive] = useState<string>(ALL);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const pub of publications) {
      for (const tag of pub.tags) {
        counts.set(tag.label, (counts.get(tag.label) ?? 0) + 1);
      }
    }
    return counts;
  }, [publications]);

  const tagCategory = useMemo(() => {
    const map = new Map<string, TagCategory>();
    for (const pub of publications) {
      for (const tag of pub.tags) map.set(tag.label, tag.category);
    }
    return map;
  }, [publications]);

  const filterButtons: FilterButton[] = useMemo(() => {
    const selectedCount = publications.filter((p) => p.selected).length;
    const tagEntries = [...tagCounts.entries()].sort((a, b) => {
      const ca = tagCategory.get(a[0]);
      const cb = tagCategory.get(b[0]);
      const orderDiff =
        CATEGORY_ORDER.indexOf(ca as TagCategory) -
        CATEGORY_ORDER.indexOf(cb as TagCategory);
      if (orderDiff !== 0) return orderDiff;
      return a[0].localeCompare(b[0]);
    });
    return [
      { label: 'All', value: ALL, count: publications.length },
      ...(selectedCount > 0
        ? [
            {
              label: 'Selected',
              value: SELECTED,
              count: selectedCount,
              category: 'selected' as const,
            },
          ]
        : []),
      ...tagEntries.map(([label, count]) => ({
        label,
        value: label,
        count,
        category: tagCategory.get(label) as TagCategory,
      })),
    ];
  }, [publications, tagCounts, tagCategory]);

  const visible = useMemo(() => {
    if (active === ALL) return publications;
    if (active === SELECTED) return publications.filter((p) => p.selected);
    return publications.filter((p) => p.tags.some((t) => t.label === active));
  }, [publications, active]);

  return (
    <section
      id="publications"
      aria-labelledby="publications-heading"
      className="site-section"
    >
      <div className="site-section-head">
        <h2 id="publications-heading" className="section-heading">
          Publications
          <span
            className="pub-total-count"
            aria-label="total publications"
          >
            {publications.length}
          </span>
        </h2>
        <p className="publications-legend">
          * denotes equal contribution. # denotes corresponding author(s).
        </p>
        <PublicationsFilter
          buttons={filterButtons}
          value={active}
          onChange={setActive}
        />
      </div>
      <div className="paper-rows">
        {visible.map((pub) => (
          <PublicationCard key={pub.title} publication={pub} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Publications.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Publications.tsx src/components/Publications.test.tsx
git commit -m "feat(publications): head cell with count, legend and topic filter"
```

---

## Task 15: Projects — same row styling as publications

**Files:**
- Modify: `src/components/ProjectCard.tsx`
- Test: `src/components/ProjectCard.test.tsx`
- Modify: `src/components/Projects.tsx`
- Test: `src/components/Projects.test.tsx`

- [ ] **Step 1: Write the ProjectCard test**

Replace `src/components/ProjectCard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectCard } from './ProjectCard';
import type { Project } from '../types';

const project: Project = {
  title: 'Example Project One',
  description: 'A short description.',
  thumbnail: '/p.jpg',
  links: [
    { kind: 'code', href: '/code' },
    { kind: 'report', href: '/report' },
  ],
};

describe('ProjectCard', () => {
  it('renders a paper-style row with image, title, description and links', () => {
    render(<ProjectCard project={project} />);
    const row = screen
      .getByText('Example Project One')
      .closest('.paper-row') as HTMLElement;
    expect(row).toBeInTheDocument();
    expect(screen.getByAltText(/teaser/)).toHaveAttribute('src', '/p.jpg');
    expect(screen.getByRole('link', { name: /^code$/i })).toHaveClass(
      'paper-link-code',
    );
    expect(screen.getByText('A short description.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ProjectCard.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Replace `src/components/ProjectCard.tsx`**

```tsx
import type { Project, ProjectLinkKind } from '../types';

interface ProjectCardProps {
  project: Project;
}

const LINK_LABELS: Record<ProjectLinkKind, string> = {
  code: 'code',
  report: 'report',
  demo: 'demo',
  project: 'project page',
  generic: 'link',
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { title, description, thumbnail, links } = project;
  return (
    <article className="paper-row">
      <div className="paper-media-cell">
        {thumbnail && (
          <div className="paper-media-stack">
            <div className="paper-media-figure">
              <img
                src={thumbnail}
                alt={`${title} teaser`}
                loading="lazy"
                width={160}
              />
            </div>
          </div>
        )}
      </div>
      <div className="paper-content-cell">
        <h3 className="paper-title">{title}</h3>
        {links.length > 0 && (
          <div className="paper-links">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`paper-link paper-link-${link.kind}`}
              >
                {link.label ?? LINK_LABELS[link.kind]}
              </a>
            ))}
          </div>
        )}
        <p className="paper-abstract">{description}</p>
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Update `src/components/Projects.tsx` to use the card-shell section**

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
      <div className="paper-rows">
        {projects.map((p) => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </div>
    </Section>
  );
}
```

The `paper-rows` wrapper needs no extra CSS — the last `.paper-row` already removes its bottom border, and the section body provides padding.

- [ ] **Step 5: Update the Projects test**

Replace `src/components/Projects.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Projects } from './Projects';
import { projects } from '../data/projects';

describe('Projects', () => {
  it('renders all projects inside a card', () => {
    render(<Projects projects={projects} />);
    expect(
      screen.getByRole('region', { name: 'Selected Projects' }),
    ).toHaveClass('site-section');
    projects.forEach((p) =>
      expect(screen.getByText(p.title)).toBeInTheDocument(),
    );
  });
});
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/components/ProjectCard.test.tsx src/components/Projects.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/ProjectCard.tsx src/components/ProjectCard.test.tsx src/components/Projects.tsx src/components/Projects.test.tsx
git commit -m "feat(projects): align project rows with publication row style"
```

---

## Task 16: Services, Talks, Notes, CustomSections — card typography alignment

**Files:**
- Modify: `src/components/Services.tsx`
- Modify: `src/components/Talks.tsx`
- Test: `src/components/Talks.test.tsx`
- Modify: `src/components/Notes.tsx`
- Modify: `src/components/CustomSections.tsx`

These already use `Section`, so they inherit the card. The adjustments: Services stacks groups vertically with bold subheadings (reference style) rather than a 2-col grid; Talks bolds the bracketed date; Notes and CustomSections keep their markup but gain `.prose-link` styling for external links (already global). Update Services to stacked groups.

- [ ] **Step 1: Update `src/components/Services.tsx`**

```tsx
import type { ServiceGroup } from '../types';
import { Section } from './Section';

interface ServicesProps {
  groups: ServiceGroup[];
}

export function Services({ groups }: ServicesProps) {
  return (
    <Section id="services" title="Academic Services">
      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.heading}>
            <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
              {group.heading}
            </h3>
            <ul className="services-list">
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

- [ ] **Step 2: Update `src/components/Talks.tsx`**

```tsx
import type { Talk } from '../types';
import { Section } from './Section';

interface TalksProps {
  talks: Talk[];
}

export function Talks({ talks }: TalksProps) {
  return (
    <Section id="talks" title="Talks">
      <ul className="talks-list">
        {talks.map((talk) => (
          <li key={talk.date + talk.title}>
            <b className="talk-date">[{talk.date}]</b>{' '}
            <span className="font-medium">{talk.title}</span>
            {talk.hostUrl ? (
              <>
                {' — '}
                <a
                  href={talk.hostUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="prose-link"
                >
                  {talk.host}
                </a>
              </>
            ) : (
              <span className="text-slate-600 dark:text-slate-400">
                {' — '}
                {talk.host}
              </span>
            )}
            {talk.replay && (
              <a
                href={talk.replay}
                target="_blank"
                rel="noopener noreferrer"
                className="prose-link ml-2"
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

- [ ] **Step 3: Update the Talks test**

Replace `src/components/Talks.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Talks } from './Talks';
import type { Talk } from '../types';

const talks: Talk[] = [
  { date: '2026-03', title: 'A Talk', host: 'MIT', hostUrl: 'https://mit.edu', replay: '/r' },
];

describe('Talks', () => {
  it('renders bold date, title, linked host and replay link', () => {
    render(<Talks talks={talks} />);
    expect(screen.getByText('[2026-03]')).toHaveClass('talk-date');
    expect(screen.getByText('A Talk')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'MIT' })).toHaveAttribute(
      'href',
      'https://mit.edu',
    );
    expect(screen.getByRole('link', { name: '[replay]' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Update Notes to use prose-link**

In `src/components/Notes.tsx`, change the `<a>` className from `text-accent hover:underline dark:text-accent-dark` to `prose-link` (keep the external target/rel).

- [ ] **Step 5: CustomSections inherits card styles — no structural change needed.** Verify `CustomSections.tsx` still wraps content in `Section` (it does). The existing ListLayout/CardLayout/ParagraphLayout render inside `.site-section-body`, so they inherit the card. No code change required.

- [ ] **Step 6: Append small lists CSS**

Insert before the `/* COMPONENT STYLES */` anchor:

```css
/* ==========================================================================
   Services / Talks lists
   ========================================================================== */
.services-list,
.talks-list {
  margin: 0.2em 0 0;
  padding-left: 1.35em;
}
.services-list li,
.talks-list li {
  margin-bottom: 0.5em;
  line-height: 1.62;
  color: var(--ink-body);
}
.talk-date {
  font-weight: 700;
  color: var(--ink-800);
}
```

- [ ] **Step 7: Run the affected tests**

Run: `npx vitest run src/components/Services.test.tsx src/components/Talks.test.tsx src/components/Notes.test.tsx src/components/CustomSections.test.tsx`
Expected: PASS. If `Services.test.tsx` currently asserts the 2-col grid class, update it to assert the stacked `space-y-4` container and the bold `h3` instead.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "style(sections): align services, talks, notes, custom sections"
```

---

## Task 17: Footer — three-column grid with back-to-top pill

**Files:**
- Modify: `src/components/Footer.tsx`
- Test: `src/components/Footer.test.tsx`

- [ ] **Step 1: Write the test**

Replace `src/components/Footer.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders copyright, back-to-top pill, and template credit', () => {
    render(<Footer name="Your Name" />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('site-footer');
    expect(footer.textContent).toMatch(/©\s*\d{4}\s*Your Name/);
    const top = screen.getByRole('link', { name: /back to top/i });
    expect(top).toHaveAttribute('href', '#top');
    expect(top).toHaveClass('footer-top-link');
    expect(
      screen.getByRole('link', { name: /this template/i }),
    ).toHaveAttribute(
      'href',
      'https://github.com/jonbarron/jonbarron_website',
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Footer.test.tsx`
Expected: FAIL — current footer is single-line.

- [ ] **Step 3: Replace `src/components/Footer.tsx`**

```tsx
interface FooterProps {
  name: string;
}

export function Footer({ name }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="site-footer-row">
        <div className="site-footer-col site-footer-col-left">
          © {year} {name}
        </div>
        <div className="site-footer-col site-footer-col-center">
          <a
            href="#top"
            className="footer-top-link"
            aria-label="Back to top"
            title="Back to top"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <polyline points="6 15 12 9 18 15" />
            </svg>
            <span>Back to top</span>
          </a>
        </div>
        <div className="site-footer-col site-footer-col-right">
          Built on{' '}
          <a
            href="https://github.com/jonbarron/jonbarron_website"
            target="_blank"
            rel="noopener noreferrer"
          >
            this template
          </a>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Append footer CSS**

Insert before the `/* COMPONENT STYLES */` anchor:

```css
/* ==========================================================================
   Footer
   ========================================================================== */
.site-footer {
  margin-top: 8px;
  padding-top: 18px;
  border-top: 1px solid var(--border);
  font-size: 12px;
  color: var(--ink-500);
  letter-spacing: 0.015em;
}
.site-footer-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  padding: 4px 4px 6px;
}
.site-footer-col-left {
  text-align: left;
}
.site-footer-col-center {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}
.site-footer-col-right {
  text-align: right;
}
.site-footer a {
  color: var(--ink-600);
  font-weight: 500;
  border-bottom: 1px solid transparent;
  transition: color 0.15s ease, border-color 0.15s ease;
}
.site-footer a:hover {
  color: var(--accent);
  border-bottom-color: rgba(23, 114, 208, 0.45);
}
.footer-top-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px 5px 10px;
  border-radius: 999px;
  background: var(--muted-bg);
  border: 1px solid var(--border);
  color: var(--ink-700) !important;
  font-weight: 700;
  font-size: 11.5px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-decoration: none;
  box-shadow: var(--shadow-sm);
  transition: transform 0.12s ease, color 0.12s ease,
    background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
}
.footer-top-link:hover {
  transform: translateY(-1px);
  color: var(--accent) !important;
  border-color: rgba(23, 114, 208, 0.45);
  box-shadow: 0 3px 10px rgba(15, 23, 42, 0.08);
  border-bottom-color: var(--border);
}
.footer-top-link svg {
  width: 12px;
  height: 12px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
@media (max-width: 640px) {
  .site-footer-row {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .site-footer-col-left,
  .site-footer-col-right {
    text-align: center;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/Footer.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/Footer.tsx src/components/Footer.test.tsx src/index.css
git commit -m "feat(footer): three-column layout with back-to-top pill"
```

---

## Task 18: Modal token styling + remove the COMPONENT STYLES anchor

**Files:**
- Modify: `src/components/Modal.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Update Modal classes to use tokens**

Replace the hard-coded `bg-white dark:bg-slate-800` panel and overlay with token-friendly classes. In `src/components/Modal.tsx`, change the panel `className` to:

```tsx
className="relative max-w-md rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--ink-body)] shadow-xl"
```

Keep the existing overlay, close button, and focus/escape logic unchanged.

- [ ] **Step 2: Remove the anchor comment**

In `src/index.css`, delete the line `/* COMPONENT STYLES — later tasks insert blocks above this line. */` since all component blocks are now in place.

- [ ] **Step 3: Verify the modal test still passes**

Run: `npx vitest run src/components/Modal.test.tsx`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/Modal.tsx src/index.css
git commit -m "style(modal): use theme tokens"
```

---

## Task 19: Repair remaining tests and run full verification

**Files:**
- Modify: any test files still asserting old markup

- [ ] **Step 1: Run the full test suite and capture failures**

Run: `npx vitest run`
Expected: a small number of failures in tests that still reference removed components or old class names.

- [ ] **Step 2: Repair each failing test**

Known likely fixes:
- `src/components/CustomSections.test.tsx`: still passes; only update if it asserts removed classes. The `Section` card now renders `site-section`/`section-heading` — adjust assertions if they check for `border-b`.
- Any import of `TagFilter` or `Navbar` or `BackToTop`: remove the import and the related assertions.
- `src/components/Notes.test.tsx`: the link class is now `prose-link`.
- `src/components/Services.test.tsx`: assert the stacked heading instead of a 2-col grid.

Re-run `npx vitest run` after each fix until all tests pass.

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors. If a component still passes `ownName` to `PublicationCard`, remove it (the prop was removed in Task 13).

- [ ] **Step 4: Lint**

Run: `npx eslint src --max-warnings=0`
Expected: no errors. Fix unused imports (e.g. the removed `ownName`, any leftover `TagFilter` imports).

- [ ] **Step 5: Production build**

Run: `npm run build`
Expected: builds successfully to `dist/`.

- [ ] **Step 6: Visual smoke test**

Run: `npm run dev`, open the local URL, and verify against the reference:
- Fixed circular theme toggle top-right; toggling swaps moon/sun and colors without a flash.
- Hero card: name centered in left column, circular photo right, contact pill row below divider.
- News: date pills, timeline dots, centered toggle with hairlines, 5 initially.
- Publications: heading with count badge, legend, "Filter by topic:" row with category colors and amber Selected; selected paper has amber row, "Selected" badge, 4px amber bar, venue pill, Oral shimmer badge, bold own name with `*`/`#`, icon link pills, abstract.
- Projects: same row style.
- Footer: three columns with back-to-top pill.
- Toggle dark mode and confirm all surfaces follow the dark palette.

- [ ] **Step 7: Commit any fixes**

```bash
git add -A
git commit -m "test: repair suite after visual alignment"
```

---

## Self-Review

**Spec coverage:**
- Tailwind/data-theme foundation — Task 1
- Lato font + no-FOUC script — Task 2
- Tokens, body gradient, cards, headings — Task 3
- No navbar; fixed circular toggle; 800px shell — Task 4
- Section card — Task 5
- Structured data model — Tasks 6–7
- Circular photo + caption + swap — Task 8
- Contact pill icons + email/wechat modals — Task 9
- Hero card — Task 10
- News timeline + hairline toggle, initial 5 — Task 11
- Topic filter with category colors + amber Selected + count — Task 12
- Publication rows: image+tags, selected amber, venue pills, honor, authors, link icons, abstract — Tasks 13–14
- Projects same row style — Task 15
- Services/Talks/Notes/CustomSections typography — Task 16
- Three-column footer + back-to-top pill — Task 17
- Modal tokens — Task 18
- Full test/typecheck/lint/build verification — Task 19
- Out of scope (Travels, Mentoring): intentionally absent.

**Placeholder scan:** No `TODO`/`TBD`/"implement later". Every code step contains complete code. The only inline-note pattern is the data-driven `note: 'code coming soon'`, which is real rendered content, not a plan placeholder.

**Type consistency:**
- `PublicationLink.kind: PublicationLinkKind` matches `LINK_LABELS` keys in `PublicationCard.tsx` (`paper|code|project|twitter|dataset|demo|report|generic`) and the CSS `.paper-link-*` classes.
- `ProjectLink.kind: ProjectLinkKind` matches `LINK_LABELS` in `ProjectCard.tsx` (`code|report|demo|project|generic`) and shares the same CSS classes.
- `TagCategory` (`policy|grasping|manipulation|data|other`) matches `.paper-tag-*` and `.pub-filter-btn[data-category="..."]` selectors.
- `VenueType` (`conference|journal|preprint`) matches `.venue-*` classes.
- `Honor` (`oral|best`) matches `.paper-honor` / `.paper-honor-best`.
- `Profile.photos: ProfilePhoto[]` (`{src, caption}`) matches `ProfilePhoto` props.
- `ContactType` union matches `.profile-link-*` classes (email, scholar, github, twitter, wechat, cv, link).
- `Section` `head` prop is used only by Publications (which renders its own head cell in Task 14); all other sections use the default body.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-24-homepage-visual-alignment.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?

