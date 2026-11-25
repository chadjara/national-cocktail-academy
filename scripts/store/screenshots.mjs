/**
 * Generates the App Store screenshots: captioned panels built around real
 * captures of the production build, with sample progress restored through the
 * app's own backup screen (see seed.ts). Run with `pnpm store:screenshots`;
 * pass --skip-build to reuse the current build.
 *
 * Output: store/app-store/screenshots/<device>/<nn-name>.jpg at the exact
 * sizes App Store Connect asks for, plus a contact sheet for review.
 */
import { execSync, spawn } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";
import sharp from "sharp";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../..", import.meta.url));
const outDir = `${root}store/app-store`;
const PORT = 4180;
const BASE = `http://localhost:${String(PORT)}`;

/**
 * Each set at App Store Connect's size. `screen` is the device in points;
 * `top` and `bottom` are its status bar and home indicator, drawn around the
 * capture the way the app's safe-area padding places it on a real device.
 *
 * @typedef {{ id: string, size: [number, number], screen: [number, number], scale: number,
 *   top: number, bottom: number, frame: "island" | "notch" | "ipad" }} Device
 * @type {Device[]}
 */
const DEVICES = [
  {
    id: "iphone-6.9",
    size: [1320, 2868],
    screen: [440, 956],
    scale: 3,
    top: 62,
    bottom: 34,
    frame: "island",
  },
  {
    id: "iphone-6.5",
    size: [1284, 2778],
    screen: [428, 926],
    scale: 3,
    top: 47,
    bottom: 34,
    frame: "notch",
  },
  {
    id: "ipad-13",
    size: [2064, 2752],
    screen: [1032, 1376],
    scale: 2,
    top: 24,
    bottom: 20,
    frame: "ipad",
  },
];

/** @typedef {import("@playwright/test").Page} Page */
/** @typedef {typeof import("./seed")} Seed */

/**
 * The storyboard. Every claim in a caption is checked against the app: the
 * counts come from the content, and the rules from the config.
 *
 * @type {{ id: string, tone: string, headline: string, sub: string, data: "student" | "graduate",
 *   path: string, act?: (page: Page, seed: Seed) => Promise<void> }[]}
 */
const PANELS = [
  {
    id: "01-today",
    tone: "#6a1c29",
    headline: "Learn to bartend.",
    sub: "A complete bartending program. Free, offline, no account.",
    data: "student",
    path: "/",
  },
  {
    id: "02-courses",
    tone: "#2e2a26",
    headline: "15 courses. 111 lessons.",
    sub: "Tools, glassware, technique, garnishes and service, then every family of classics.",
    data: "student",
    path: "/learn",
  },
  {
    id: "03-lesson",
    tone: "#7a1626",
    headline: "Every classic, spec by spec.",
    sub: "Glass, ice, method and garnish, in ounces or milliliters.",
    data: "student",
    path: "/learn/martinis-and-manhattans/negroni",
  },
  {
    id: "04-library",
    tone: "#86401f",
    headline: "105 specs in your pocket.",
    sub: "The IBA official list plus modern classics. Search by name or ingredient.",
    data: "student",
    path: "/library",
  },
  {
    id: "05-review",
    tone: "#1f5a3a",
    headline: "Practice until it sticks.",
    sub: "Daily review brings each spec back right before you'd forget it.",
    data: "student",
    path: "/practice/review",
    act: async (page) => {
      await page.getByRole("button", { name: "Show answer" }).click();
    },
  },
  {
    id: "06-exam",
    tone: "#2f4a5e",
    headline: "Prove it on the exam.",
    sub: "Every course ends with an exam. Pass with 80%, retake any time.",
    data: "student",
    path: "/learn/garnishes/exam",
    act: async (page, seed) => {
      await page.getByRole("button", { name: "Start the exam" }).click();
      // Show a question with its right answer chosen. Generated questions are
      // skipped past, since only authored ones can be looked up.
      for (let i = 0; i < 9; i += 1) {
        const radios = page.getByRole("radio");
        await radios.first().waitFor();
        const labels = await radios.evaluateAll((els) =>
          els.map((el) => el.parentElement?.textContent.trim() ?? ""),
        );
        const answer = seed.authoredAnswer(labels);
        const index = answer === undefined ? -1 : labels.indexOf(answer);
        if (index >= 0) {
          await radios.nth(index).click();
          return;
        }
        await radios.first().click();
        await page.getByRole("button", { name: "Next question" }).click();
      }
      throw new Error("No authored question came up in the exam.");
    },
  },
  {
    id: "07-service-sim",
    tone: "#0f5257",
    headline: "Run a real shift.",
    sub: "The Service Sim: drinks from memory, guests to handle, a clock running.",
    data: "student",
    path: "/capstone",
    act: async (page, seed) => {
      await page.getByRole("button", { name: "Start the shift" }).click();
      // The ticket card is labelled "<label>: <drink>".
      const ticket = await page
        .locator('[aria-label^="Shift"][aria-label*=": "]')
        .first()
        .getAttribute("aria-label");
      const drink = ticket?.split(": ").at(-1) ?? "";
      const names = seed.specIngredientNames(drink);
      let tapped = 0;
      for (const name of names) {
        const chip = page.getByRole("button", { name, exact: true });
        if ((await chip.count()) > 0) {
          await chip.click();
          tapped += 1;
        }
      }
      if (tapped === 0) throw new Error(`No ingredients tapped for "${drink}".`);
    },
  },
  {
    id: "08-certificate",
    tone: "#844515",
    headline: "Earn your certificate.",
    sub: "Pass every exam and the Service Sim, then save it as a PDF.",
    data: "graduate",
    path: "/certificate",
  },
];

/** @param {string} path @returns {Promise<string>} */
async function dataUrl(path, type = "image/png") {
  return `data:${type};base64,${(await readFile(path)).toString("base64")}`;
}

/** Loads seed.ts through Vite so it can import the app's content and services. */
async function loadSeed() {
  const server = await createServer({
    configFile: false,
    root,
    logLevel: "error",
    appType: "custom",
    server: { middlewareMode: true, hmr: false },
    optimizeDeps: { noDiscovery: true, include: [] },
    resolve: { alias: { "~": `${root}src` } },
    define: {
      __APP_VERSION__: JSON.stringify(
        JSON.parse(await readFile(`${root}package.json`, "utf8")).version,
      ),
    },
  });
  const seed = /** @type {Seed} */ (await server.ssrLoadModule("/scripts/store/seed.ts"));
  return { seed, close: () => server.close() };
}

/** @returns {Promise<() => void>} */
async function startServer() {
  const child = spawn(process.execPath, ["scripts/serve.mjs"], {
    cwd: root,
    env: { ...process.env, PORT: String(PORT) },
    stdio: ["ignore", "pipe", "inherit"],
  });
  await new Promise((resolve, reject) => {
    child.stdout.on("data", (chunk) => {
      if (String(chunk).includes("Serving")) resolve(undefined);
    });
    child.on("exit", (code) => reject(new Error(`Preview server exited (${String(code)})`)));
  });
  return () => child.kill();
}

/** @param {Page} page @param {string} json */
async function restore(page, json) {
  await page.goto(`${BASE}/settings`);
  await page.locator('input[aria-label="Backup file"]').setInputFiles({
    name: "nca-backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(json),
  });
  await page.getByRole("button", { name: "Restore", exact: true }).click();
  await page.getByText("Backup restored", { exact: true }).waitFor();
}

/** @param {Page} page */
async function settle(page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  // Lazy images below the fold never load; only the ones on screen matter.
  await page.waitForFunction(() =>
    [...document.images]
      .filter((img) => img.getBoundingClientRect().top < window.innerHeight)
      .every((img) => img.complete),
  );
  await page.waitForTimeout(300);
}

/**
 * Captures every panel's screen on one device.
 * @param {import("@playwright/test").Browser} browser @param {Device} device @param {Seed} seed
 * @returns {Promise<Map<string, Buffer>>}
 */
async function capture(browser, device, seed) {
  const [width, height] = device.screen;
  const context = await browser.newContext({
    viewport: { width, height: height - device.top - device.bottom },
    deviceScaleFactor: device.scale,
    reducedMotion: "reduce",
    colorScheme: "light",
  });
  const page = await context.newPage();
  /** @type {string[]} */
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  const now = new Date();
  const backups = {
    student: JSON.stringify(seed.studentBackup(now)),
    graduate: JSON.stringify(seed.graduateBackup(now)),
  };
  /** @type {Map<string, Buffer>} */
  const shots = new Map();
  /** @type {string | undefined} */
  let restored;
  for (const panel of PANELS) {
    if (restored !== panel.data) {
      await restore(page, backups[panel.data]);
      restored = panel.data;
    }
    await page.goto(`${BASE}${panel.path}`);
    await settle(page);
    if (panel.act) {
      await panel.act(page, seed);
      await settle(page);
    }
    shots.set(panel.id, await page.screenshot());
  }
  await context.close();
  if (errors.length > 0) throw new Error(`Console errors on ${device.id}:\n${errors.join("\n")}`);
  return shots;
}

const STATUS_ICONS = `
<svg viewBox="0 0 18 12" width="18" height="12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
<svg viewBox="0 0 16 12" width="16" height="12"><path d="M8 2.6c2.3 0 4.4.9 6 2.4l1.2-1.3A10.2 10.2 0 0 0 8 .8 10.2 10.2 0 0 0 .8 3.7L2 5a8.5 8.5 0 0 1 6-2.4Zm0 3.6c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.6 6.6 0 0 0 8 4.4c-1.8 0-3.4.7-4.6 1.8l1.2 1.3c.9-.8 2.1-1.3 3.4-1.3Zm0 3.6c.4 0 .8.2 1.1.4L8 11.6 6.9 10.2c.3-.2.7-.4 1.1-.4Z"/></svg>
<svg viewBox="0 0 27 13" width="27" height="13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2"/><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" opacity=".5"/></svg>`;

/**
 * Lays one capture into its captioned panel.
 * @param {import("@playwright/test").Page} page @param {Device} device
 * @param {(typeof PANELS)[number]} panel @param {Buffer} shot @param {{ fraunces: string, inter: string }} fonts
 */
async function compose(page, device, panel, shot, fonts) {
  const [W, H] = device.size;
  const [sw, sh] = device.screen;
  const ipad = device.frame === "ipad";
  const bezel = ipad ? 18 : 14;
  const radius = ipad ? 20 : device.frame === "island" ? 58 : 42;
  const u = W / 1320; // type scale: the 6.9" iPhone is the reference
  const headline = ipad ? 132 : 118 * u;
  const sub = ipad ? 52 : 50 * u;
  const html = `<!doctype html><html><head><style>
@font-face { font-family: Fraunces; src: url(${fonts.fraunces}) format("woff2"); font-weight: 100 900; }
@font-face { font-family: Inter; src: url(${fonts.inter}) format("woff2"); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; }
html, body { width: ${String(W)}px; height: ${String(H)}px; overflow: hidden; }
body { background: radial-gradient(130% 70% at 50% 0%, color-mix(in srgb, ${panel.tone} 78%, #ffffff) 0%, ${panel.tone} 55%, color-mix(in srgb, ${panel.tone} 70%, #000000) 100%); color: #fff; font-family: Inter, sans-serif; position: relative; }
.cap { position: absolute; left: 0; right: 0; top: ${String(ipad ? 150 : 150 * u)}px; padding: 0 ${String(ipad ? 220 : 96 * u)}px; text-align: center; }
h1 { font-family: Fraunces, serif; font-variation-settings: "opsz" 144; font-weight: 400; font-size: ${String(headline)}px; line-height: 1.04; letter-spacing: -0.02em; text-wrap: balance; }
p { margin-top: ${String(ipad ? 34 : 30 * u)}px; font-size: ${String(sub)}px; line-height: 1.3; color: rgb(255 255 255 / 0.86); text-wrap: balance; }
.device { position: absolute; transform-origin: top left; width: ${String(sw + bezel * 2)}px; height: ${String(sh + bezel * 2)}px; padding: ${String(bezel)}px; border-radius: ${String(radius + bezel)}px; background: #121110; box-shadow: 0 0 0 1.5px #3a3733 inset, 0 30px 80px rgb(0 0 0 / 0.45); }
.screen { position: relative; width: ${String(sw)}px; height: ${String(sh)}px; border-radius: ${String(radius)}px; overflow: hidden; background: #f5f1e9; display: flex; flex-direction: column; }
.status { height: ${String(device.top)}px; flex: none; display: flex; align-items: ${ipad ? "center" : "flex-end"}; justify-content: space-between; padding: 0 ${String(ipad ? 22 : 34)}px ${String(ipad ? 0 : device.frame === "island" ? 17 : 13)}px; color: #1d1a17; font: 600 ${String(ipad ? 14 : 17)}px Inter, sans-serif; position: relative; }
.status .icons { display: flex; gap: 6px; align-items: center; fill: currentColor; }
.island { position: absolute; left: 50%; top: 11px; width: 126px; height: 37px; margin-left: -63px; border-radius: 20px; background: #000; }
.notch { position: absolute; left: 50%; top: 0; width: 210px; height: 31px; margin-left: -105px; border-radius: 0 0 20px 20px; background: #000; }
.shot { display: block; width: ${String(sw)}px; height: ${String(sh - device.top - device.bottom)}px; flex: none; }
.home { height: ${String(device.bottom)}px; flex: none; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 8px; }
.home span { width: ${String(ipad ? 300 : 140)}px; height: 5px; border-radius: 3px; background: #1d1a17; }
</style></head><body>
<div class="cap"><h1>${panel.headline}</h1><p>${panel.sub}</p></div>
<div class="device" id="device"><div class="screen">
  <div class="status"><span>9:41</span>${device.frame === "island" ? '<i class="island"></i>' : device.frame === "notch" ? '<i class="notch"></i>' : ""}<span class="icons">${STATUS_ICONS}</span></div>
  <img class="shot" src="data:image/png;base64,${shot.toString("base64")}">
  <div class="home"><span></span></div>
</div></div>
<script>
// Called once the fonts are in, so the caption is measured at its real size.
window.layout = () => {
  const cap = document.querySelector(".cap").getBoundingClientRect();
  const device = document.getElementById("device");
  const deviceTop = cap.bottom + ${String(ipad ? 110 : 100 * u)};
  const room = { w: ${String(W)} * ${String(ipad ? 0.84 : 0.82)}, h: ${String(H)} - deviceTop - ${String(ipad ? 120 : 110 * u)} };
  const fit = Math.min(room.w / device.offsetWidth, room.h / device.offsetHeight);
  device.style.transform = "scale(" + fit + ")";
  device.style.left = (${String(W)} - device.offsetWidth * fit) / 2 + "px";
  device.style.top = deviceTop + "px";
};
</script></body></html>`;
  /** @type {Error[]} */
  const failures = [];
  const onError = (/** @type {Error} */ error) => failures.push(error);
  page.on("pageerror", onError);
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    /** @type {Window & { layout?: () => void }} */ (window).layout?.();
  });
  page.off("pageerror", onError);
  if (failures.length > 0) throw failures[0];
  const png = await page.screenshot({ type: "png" });
  return sharp(png)
    .flatten({ background: "#000000" })
    .toColorspace("srgb")
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toBuffer();
}

/** @param {Map<string, Map<string, Buffer>>} sets */
async function contactSheet(sets) {
  const thumbH = 560;
  /** @type {import("sharp").OverlayOptions[]} */
  const tiles = [];
  let y = 40;
  let width = 0;
  for (const [, panels] of sets) {
    let x = 40;
    for (const [, jpg] of panels) {
      const tile = await sharp(jpg)
        .resize({ height: thumbH })
        .toBuffer({ resolveWithObject: true });
      tiles.push({ input: tile.data, left: x, top: y });
      x += tile.info.width + 24;
    }
    width = Math.max(width, x + 16);
    y += thumbH + 40;
  }
  return sharp({ create: { width, height: y, channels: 3, background: "#e9e4da" } })
    .composite(tiles)
    .jpeg({ quality: 85 })
    .toBuffer();
}

if (!process.argv.includes("--skip-build")) execSync("pnpm build", { cwd: root, stdio: "inherit" });

const { seed, close: closeVite } = await loadSeed();
const stopServer = await startServer();
const browser = await chromium.launch();
try {
  const fonts = {
    fraunces: await dataUrl(
      `${root}node_modules/@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2`,
      "font/woff2",
    ),
    inter: await dataUrl(
      `${root}node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2`,
      "font/woff2",
    ),
  };
  await rm(`${outDir}/screenshots`, { recursive: true, force: true });
  /** @type {Map<string, Map<string, Buffer>>} */
  const sets = new Map();
  for (const device of DEVICES) {
    const shots = await capture(browser, device, seed);
    const composer = await browser.newPage({
      viewport: { width: device.size[0], height: device.size[1] },
      deviceScaleFactor: 1,
    });
    await mkdir(`${outDir}/screenshots/${device.id}`, { recursive: true });
    /** @type {Map<string, Buffer>} */
    const panels = new Map();
    for (const panel of PANELS) {
      const shot = shots.get(panel.id);
      if (!shot) throw new Error(`Missing capture ${panel.id}`);
      const jpg = await compose(composer, device, panel, shot, fonts);
      await writeFile(`${outDir}/screenshots/${device.id}/${panel.id}.jpg`, jpg);
      panels.set(panel.id, jpg);
    }
    await composer.close();
    sets.set(device.id, panels);
    console.log(`${device.id}: ${String(panels.size)} screenshots`);
  }
  await writeFile(`${outDir}/contact-sheet.jpg`, await contactSheet(sets));
} finally {
  await browser.close();
  stopServer();
  await closeVite();
}
