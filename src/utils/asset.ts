/**
 * Prefix a root-absolute asset path (e.g. "/images/foo.png") with the Vite
 * base URL so it resolves correctly on GitHub Pages project sites
 * (BASE_URL = "/repo/"). External URLs, hashes, and data URIs are returned
 * unchanged.
 */
export function withBase(path: string): string {
  if (
    !path ||
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('//') ||
    path.startsWith('data:') ||
    path.startsWith('#') ||
    path.startsWith('mailto:')
  ) {
    return path;
  }
  if (!path.startsWith('/')) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}
