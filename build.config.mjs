/**
 * Build-time settings shared by Vite, React Router and the post-build step.
 *
 * BASE_PATH is the URL prefix the site is served from. GitHub Pages project
 * sites live under `/<repo>/`; a custom domain uses `/`.
 *
 * @param {string | undefined} raw
 * @returns {string}
 */
export function normalizeBasePath(raw) {
  const value = (raw ?? "/").trim();
  if (value === "" || value === "/") return "/";
  return `/${value.replace(/^\/+|\/+$/g, "")}/`;
}

export const basePath = normalizeBasePath(process.env.BASE_PATH);

export const buildClientDir = "build/client";
