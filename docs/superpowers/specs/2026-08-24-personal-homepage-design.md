# Personal Homepage — Design Spec

- **Date:** 2026-08-24
- **Owner:** User (Ph.D. student, research in robotic manipulation and tactile perception)
- **Reference site:** https://tonyfang.net/
- **Status:** Approved — ready for implementation plan

## 1. Goal

Build a clean, modern **academic personal homepage** as a React single-page application. It presents the owner's bio, research output, projects, academic service, talks, and notes, while leaving room for custom sections the owner may add later.

The site is English-only except for the owner's Chinese name shown next to the English name. It ships with a light/dark theme toggle and is deployed to GitHub Pages as a static site.

## 2. Scope

**In scope (first version):**

- Header / bio (portrait + name + one-paragraph bio + contact icons), styled strictly after the reference site
- Contact bar with email (click-to-copy), Google Scholar, GitHub, Twitter/X, WeChat (QR code modal), CV
- News — reverse-chronological, collapsible
- Publications — thumbnail + text entries, tag filtering, Selected ★ toggle
- Selected Projects — vertical list (thumbnail left, text right, same style as publications)
- Academic Services — grouped bulleted lists (conference / journal reviewing)
- Talks — dated list with host and optional replay link
- Course Notes / Blog — list of links
- Custom sections — data-driven placeholder mechanism so new sections can be added without touching components
- Footer with back-to-top
- Light/dark theme toggle (respects system preference on first visit)

**Out of scope (first version):**

- Travels / 3D globe section (not selected; can be added later as a custom section)
- Collaboration / mentoring roster (not selected)
- Blog system with its own routing/post pages — the Notes section is a static link list for now
- Server-side rendering, backend, analytics integration (a view counter can be added later)
- Internationalization beyond English

## 3. Tech Stack

- **Build tool:** Vite
- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS (`darkMode: 'class'`)
- **Testing:** Vitest + React Testing Library (lightweight — rendering and logic tests only, no E2E)
- **Code quality:** ESLint + Prettier
- **Deployment:** GitHub Pages via GitHub Actions (build → publish `dist/` to `gh-pages`)

## 4. Architecture

Single-page scrolling layout. A sticky top navigation bar links to anchored sections. Each section is a self-contained component that reads its data from a corresponding file in `src/data/`. Components do not own content; they render typed data.

### 4.1 Directory Structure

```
mypage/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── .github/workflows/deploy.yml
├── .gitignore
├── public/
│   ├── images/
│   │   ├── profile/        # rotating portrait photos
│   │   ├── papers/         # publication thumbnails
│   │   ├── projects/       # project thumbnails
│   │   └── qrcode/         # WeChat QR code
│   ├── cv.pdf
│   └── favicon.ico
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── components/
    │   ├── Navbar.tsx
    │   ├── Bio.tsx
    │   ├── ContactIcons.tsx
    │   ├── ProfilePhoto.tsx
    │   ├── Section.tsx           # shared section wrapper (title + rule)
    │   ├── News.tsx
    │   ├── Publications.tsx
    │   ├── PublicationCard.tsx
    │   ├── TagFilter.tsx
    │   ├── Projects.tsx
    │   ├── ProjectCard.tsx
    │   ├── Services.tsx
    │   ├── Talks.tsx
    │   ├── Notes.tsx
    │   ├── CustomSections.tsx    # renders all registered custom sections
    │   ├── Footer.tsx
    │   ├── ThemeToggle.tsx
    │   ├── BackToTop.tsx
    │   └── Modal.tsx             # reusable modal (WeChat QR, etc.)
    ├── data/
    │   ├── profile.ts
    │   ├── news.ts
    │   ├── publications.ts
    │   ├── projects.ts
    │   ├── services.ts
    │   ├── talks.ts
    │   ├── notes.ts
    │   └── customSections.ts     # extension point — starts empty/example
    ├── hooks/
    │   ├── useTheme.ts
    │   ├── useCollapsible.ts
    │   └── useIntersectionVisible.ts   # reserved for lazy media
    └── types/
        └── index.ts
```

### 4.2 Component Boundaries

- **`Section`** — presentational wrapper: takes `id`, `title`, children; renders the section heading with a bottom border. All sections use it for visual consistency.
- **`Navbar`** — sticky, anchor links generated from a list; includes `ThemeToggle`. Custom sections are appended to the nav automatically from `customSections.ts`.
- **`Bio`** — composes `ProfilePhoto` + name + bio paragraph + `ContactIcons`.
- **`ContactIcons`** — renders `profile.contacts`; handles email copy-to-clipboard and WeChat QR modal.
- **`Publications`** — aggregates tags from data, owns filter state, renders matching `PublicationCard`s.
- **`TagFilter`** — generic controlled button group (used only by Publications initially).
- **`CustomSections`** — maps over the `customSections` array and renders each via a small dispatcher supporting `cards`, `list`, and `paragraph` layouts.

Each component is a unit with one job, a clear props interface, and no shared mutable state. Cross-cutting behavior (theme, collapsible state) lives in hooks.

## 5. Data Model

All types exported from `src/types/index.ts`. Data files export typed arrays/objects.

```ts
type ContactType = 'email' | 'scholar' | 'github' | 'twitter' | 'wechat' | 'cv' | 'link';

interface ContactLink {
  type: ContactType;
  label: string;
  href: string;
  qrcode?: string;   // for wechat — image shown in modal
}

interface Profile {
  nameEn: string;
  nameZh: string;
  photos: string[];          // rotating portrait set
  bio: string;               // one paragraph
  contacts: ContactLink[];
}

interface NewsItem {
  date: string;              // display string, newest first in file
  content: string;
}

interface Publication {
  title: string;
  authors: string[];
  venue: string;
  venueType?: 'conference' | 'journal' | 'preprint';
  tags: string[];
  selected?: boolean;
  thumbnail?: string;
  links: { paper?: string; code?: string; project?: string; dataset?: string };
  abstract?: string;
}

interface Project {
  title: string;
  description: string;
  thumbnail?: string;
  links: { code?: string; report?: string; demo?: string };
}

interface ServiceGroup {
  heading: string;           // e.g. 'Conference Reviewing'
  items: string[];
}

interface Talk {
  date: string;
  title: string;
  host: string;
  replay?: string;
}

interface NoteLink {
  title: string;
  href: string;
  description?: string;
}

type CustomSectionLayout = 'cards' | 'list' | 'paragraph';

interface CustomItem {
  title?: string;
  description?: string;
  thumbnail?: string;
  href?: string;
}

interface CustomSection {
  id: string;
  title: string;
  layout: CustomSectionLayout;
  items: CustomItem[];
}
```

### 5.1 Data-driven Behaviors

- **Author highlighting:** `PublicationCard` bolds and underlines any author whose name matches `profile.nameEn` (matched by normalized name string). No per-entry JSX needed.
- **Tag filtering:** `Publications` computes the tag list and counts from the publications array at render. Adding a new tag in data automatically surfaces it in the filter. A `★ Selected` toggle shows only publications with `selected: true`. A live "Showing N of M" label is displayed.
- **News collapse:** all items live in data; `News` renders the first `INITIAL_VISIBLE` (4) and exposes Show more / Show less.
- **Custom sections:** pushing a new `CustomSection` into `customSections.ts` renders it on the page and inserts an anchor link into the navbar. The file ships with one commented-out example to document the shape.

## 6. Visual & Layout Design

- **Overall:** single column, centered, max content width ~820px, generous vertical spacing, neutral palette with a blue accent. Matches the reference site's academic aesthetic.
- **Bio:** vertical portrait on the left (roughly 160×200px, rounded, click-to-rotate); name (English large, Chinese beside it in lighter weight) + one-paragraph bio + icon contact row on the right.
- **Publications & Projects:** horizontal entries — thumbnail (120px wide) on the left, text on the right; title bold, authors with own name highlighted, venue italic, links below.
- **Projects:** vertical list, same entry style as publications (not a card grid).
- **Tags:** small pill buttons; active filter filled in accent color, inactive gray.
- **Section headings:** larger bold text with a thin bottom border, consistent across all sections.
- **Footer:** centered copyright and back-to-top link.
- **Dark mode:** `#0f172a`-style dark background, light gray text, same accent color. Placeholder/dashed custom-section styling is visible in both themes.

## 7. Interactions

- **Smooth scroll navigation:** `scroll-behavior: smooth` on the document root; sections use `scroll-margin-top` to account for the sticky navbar.
- **Sticky navbar:** translucent backdrop blur; active section highlighting is a nice-to-have but not required for v1.
- **Portrait rotation:** `ProfilePhoto` cycles index through `photos` on click.
- **Email:** clicking copies the address to clipboard and shows a transient "Copied!" tooltip.
- **WeChat:** opens a `Modal` with the QR code image; modal closes on overlay click or ESC.
- **Back-to-top:** appears after scrolling past one viewport; fixed at bottom-right.
- **Lazy media:** all images use `loading="lazy"`. A `useIntersectionVisible` hook is provided for future autoplaying media.

## 8. Theming

- Tailwind `darkMode: 'class'`; the `dark` class is toggled on `<html>`.
- `useTheme` hook:
  1. On mount, read `localStorage.theme`; if absent, fall back to `window.matchMedia('(prefers-color-scheme: dark)')`.
  2. Apply the class and keep a React state.
  3. On toggle, update state, the class, and `localStorage.theme`.
- Accent color and any shared tokens are defined in `tailwind.config.js` so re-theming is a one-file change.

## 9. Accessibility & SEO

- Icon-only links have `aria-label`s.
- Modal traps focus minimally (close on ESC / overlay; first focusable element focused on open) and has `role="dialog"`, `aria-modal`.
- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<section id="...">`, `<footer>`.
- `index.html` contains a descriptive `<title>`, `<meta name="description">`, Open Graph tags, and a favicon.
- Since this is a static SPA, all primary content is present in the initial render for crawlability.

## 10. Build & Deployment

- **Scripts:** `dev`, `build`, `preview`, `lint`, `typecheck`, `test`.
- **Vite `base`:** set to `'/<repo-name>/'` for project pages; documented so it can be changed to `'/'` for a custom domain.
- **GitHub Actions workflow (`.github/workflows/deploy.yml`):** on push to `main`, install, build, and deploy `dist/` to `gh-pages`. Use the official `actions/deploy-pages` action chain (configure Pages source to GitHub Actions).
- **Assets:** `cv.pdf`, favicon, and images live in `public/`; content images are referenced by absolute path.

## 11. Testing

Use Vitest + React Testing Library. Keep tests focused:

- Each component renders correctly with fixture data (smoke tests).
- `PublicationCard` highlights the owner's name and renders all present links; absent links are not rendered.
- `Publications` tag filter and Selected toggle produce the correct visible subset and count.
- `News` collapse shows the correct number before/after toggle.
- `useTheme` reads/writes localStorage and toggles the class.
- `CustomSections` registers nav anchors and renders each layout type.

No E2E tests for v1.

## 12. Code Quality

- ESLint with `@typescript-eslint` and `eslint-plugin-react-hooks`; Prettier for formatting.
- A `lint` and `typecheck` script run before build locally; CI can run them (optional for v1, the deploy workflow is mandatory).

## 13. Extension Points

- **Add a section:** append a `CustomSection` object to `src/data/customSections.ts`; it renders automatically and appears in the nav.
- **Add a publication/news item/project:** append an object to the corresponding data file; no component edits required.
- **Add a new contact type:** extend `ContactType` and add an icon/mapping in `ContactIcons.tsx`.
- **Change colors:** edit `tailwind.config.js`.
- **Travel globe, mentoring, blog routes:** can be added as future custom sections or top-level components without restructuring the app.

## 14. Out of Scope / Future

- Travels interactive globe (d3 / TopoJSON)
- Collaboration & mentoring rosters
- Full blog with markdown/MDX routing
- Server-side rendering
- Analytics/view counter
- Internationalization switcher
