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
