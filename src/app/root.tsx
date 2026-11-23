import "~/lib/zod-setup";

import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { appConfig } from "~/config/app.config";
import { AppShell, Button, ErrorState, ICON_STROKE, ToastProvider } from "~/design-system";
import { useAppLaunch } from "~/features/app-shell/use-app-launch";
import { themeBootScript } from "~/features/theme/theme";

import frauncesLatin from "@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2?url";
import interLatin from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";

import type { Route } from "./+types/root";
import "./app.css";
import { primaryNav } from "./navigation";

export const links: Route.LinksFunction = () => [
  // Preload the two Latin font files so text renders once, in the right face,
  // with no swap-induced layout shift.
  { rel: "preload", href: interLatin, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "preload", href: frauncesLatin, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="description" content={appConfig.academy.tagline} />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function RailFooter() {
  return (
    <Link to="/privacy" className="underline decoration-1 underline-offset-[3px] hover:text-ink">
      Privacy policy
    </Link>
  );
}

function Frame({ children }: { children: ReactNode }) {
  useAppLaunch();
  return (
    <AppShell academyName={appConfig.academy.name} nav={primaryNav} railFooter={<RailFooter />}>
      {children}
    </AppShell>
  );
}

/**
 * What index.html shows before React takes over: just the page background,
 * so nothing flashes. In the app the launch screen covers this moment.
 */
export function HydrateFallback() {
  return <div className="min-h-dvh bg-canvas" />;
}

export default function App() {
  return (
    <ToastProvider>
      <Frame>
        <Outlet />
      </Frame>
    </ToastProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Unknown error";

  return (
    <ToastProvider>
      <AppShell academyName={appConfig.academy.name} nav={primaryNav}>
        <ErrorState
          headingLevel="h1"
          className="mt-4"
          icon={<AlertTriangle aria-hidden size={24} strokeWidth={ICON_STROKE} />}
          title="Something broke on our side"
          description={
            <>
              <p>
                Your progress is stored on this device and hasn't been touched. Reload to try again.
              </p>
              {import.meta.env.DEV && (
                <pre className="mt-1 text-caption whitespace-pre-wrap">{detail}</pre>
              )}
            </>
          }
          action={<Button onClick={() => window.location.reload()}>Reload</Button>}
        />
      </AppShell>
    </ToastProvider>
  );
}
