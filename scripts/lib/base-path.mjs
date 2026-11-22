import { access, readdir, rename, rmdir, stat } from "node:fs/promises";
import { join } from "node:path";

/** @param {string} path */
async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Moves everything in `from` into `to`, merging directories that exist in
 * both. Two files at the same path is a real conflict, so it throws.
 *
 * @param {string} from
 * @param {string} to
 */
async function moveInto(from, to) {
  for (const entry of await readdir(from)) {
    const source = join(from, entry);
    const target = join(to, entry);
    if (!(await exists(target))) {
      await rename(source, target);
    } else if ((await stat(source)).isDirectory() && (await stat(target)).isDirectory()) {
      await moveInto(source, target);
    } else {
      throw new Error(`Refusing to overwrite ${target} while hoisting base-path output.`);
    }
  }
  await rmdir(from);
}

/**
 * With a non-root basename, React Router writes prerendered pages under
 * `<buildDir>/<basename>/…` while assets and the SPA fallback stay at the
 * root. Static hosts serve `<buildDir>` *at* the base path, so those pages
 * must live at the root too. Moves them up; a no-op for basePath "/".
 *
 * @param {string} buildDir
 * @param {string} basePath normalized, e.g. "/proof-bartending-academy/"
 * @returns {Promise<boolean>} whether anything was moved
 */
export async function hoistBasePathOutput(buildDir, basePath) {
  const segment = basePath.replace(/^\/+|\/+$/g, "");
  if (segment === "") return false;
  const nested = join(buildDir, segment);
  if (!(await exists(nested))) return false;
  await moveInto(nested, buildDir);
  // A nested base like "/a/b/" leaves an empty "a/" behind.
  const [first] = segment.split("/");
  if (
    first !== undefined &&
    first !== segment &&
    (await readdir(join(buildDir, first))).length === 0
  ) {
    await rmdir(join(buildDir, first));
  }
  return true;
}

/**
 * Fails the build if the home page isn't where the host will look for it.
 *
 * @param {string} buildDir
 */
export async function assertHomePageAtRoot(buildDir) {
  if (!(await exists(join(buildDir, "index.html")))) {
    throw new Error(
      `Expected ${join(buildDir, "index.html")}. Prerendered pages are not at the site root, so the host would serve 404s.`,
    );
  }
}
