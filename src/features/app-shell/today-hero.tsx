import { appConfig } from "~/config/app.config";
import { getScenePhoto, scenePhotoSrc } from "~/content/photos";
import { PageHeader } from "~/design-system";

const todayPhoto = getScenePhoto("today");
const heroImage = todayPhoto
  ? { src: scenePhotoSrc(todayPhoto.id), alt: todayPhoto.alt, tone: "oxblood" as const }
  : undefined;

/** The hero at the top of Today: the academy's name over a photo of the bar. */
export function TodayHero() {
  return (
    <PageHeader
      title={appConfig.academy.name}
      lede={appConfig.academy.tagline}
      {...(heroImage ? { image: heroImage } : {})}
    />
  );
}

/**
 * Inlined into <head>: marks the document when the app opens on Today, so the
 * page that loads before React can show Today's hero straight from the HTML
 * (see HydrateFallback in root.tsx). Every other screen opens on a blank page.
 * Its hash is added to the CSP at build time.
 */
export const startPageBootScript = `(function(){var p=location.pathname;if(p==="/"||p==="/index.html")document.documentElement.setAttribute("data-start","today")})();`;
