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
