/**
 * Resolves URLs relative to the application's base URL.
 * Ensures compatibility with GitHub Pages (which often deploys to subdirectories like https://username.github.io/repo-name/).
 */
export function resolveUrl(path: string): string {
  if (!path) return '';
  // External or data URLs
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('//') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  // Strip leading slash if any
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In Vite, import.meta.env.BASE_URL is './' or '/repo-name/'
  const base = import.meta.env.BASE_URL || './';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  
  // If base is relative './', keep it clean
  if (prefix === './') {
    return `./${cleanPath}`;
  }
  
  return `${prefix}${cleanPath}`;
}

/**
 * Resolves iframe src attribute inside HTML strings if it's a relative path.
 */
export function resolveIframeHtml(iframeHtml: string): string {
  if (!iframeHtml) return '';
  return iframeHtml.replace(/src=["']([^"']+)["']/i, (match, srcVal) => {
    return `src="${resolveUrl(srcVal)}"`;
  });
}
