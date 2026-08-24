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
