import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link, NavLink } from "react-router";

import { cn } from "../cn";
import { ICON_STROKE } from "../components/icon";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Match only the exact path (for the index route). */
  end?: boolean;
};

function Wordmark({ name }: { name: string }) {
  return (
    <Link
      to="/"
      className="font-display-optical text-heading-md font-medium tracking-[-0.01em] text-ink"
    >
      {name}
    </Link>
  );
}

/**
 * Application frame. Phones get a bottom tab bar (thumb reach, one hand on a
 * shaker); large screens get a left rail. The tab bar only appears once the
 * product has at least two destinations.
 */
export function AppShell({
  academyName,
  nav,
  children,
}: {
  academyName: string;
  nav: readonly NavItem[];
  children: ReactNode;
}) {
  const showNav = nav.length > 1;

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[240px_1fr]">
      <a
        href="#main"
        className="sr-only z-50 rounded-base bg-raised px-2 py-1 text-sm font-medium text-ink focus:not-sr-only focus:fixed focus:top-1 focus:left-1"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 flex h-7 items-center border-b border-line bg-canvas px-2 lg:hidden">
        <Wordmark name={academyName} />
      </header>

      <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:gap-4 lg:border-r lg:border-line lg:px-3 lg:py-4">
        <Wordmark name={academyName} />
        {showNav && (
          <nav aria-label="Primary">
            <ul className="flex flex-col gap-0.5">
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    {...(item.end !== undefined ? { end: item.end } : {})}
                    className={({ isActive }) =>
                      cn(
                        "flex h-5 items-center gap-1.5 rounded-base px-1.5 text-sm font-medium",
                        "transition-colors duration-(--duration-fast) ease-(--ease-out)",
                        isActive
                          ? "bg-sunken text-ink"
                          : "text-ink-muted hover:bg-sunken hover:text-ink",
                      )
                    }
                  >
                    <item.icon aria-hidden size={20} strokeWidth={ICON_STROKE} />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </aside>

      <main
        id="main"
        tabIndex={-1}
        className={cn(
          "mx-auto w-full max-w-180 px-2 pt-3 outline-none sm:px-4 lg:px-6 lg:pt-6 lg:pb-8",
          showNav ? "pb-[calc(88px+env(safe-area-inset-bottom))]" : "pb-6",
        )}
      >
        {children}
      </main>

      {showNav && (
        <nav
          aria-label="Primary"
          className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-canvas pb-[env(safe-area-inset-bottom)] lg:hidden"
        >
          <ul className="mx-auto flex max-w-80 items-stretch justify-around">
            {nav.map((item) => (
              <li key={item.to} className="flex-1">
                <NavLink
                  to={item.to}
                  {...(item.end !== undefined ? { end: item.end } : {})}
                  className={({ isActive }) =>
                    cn(
                      "flex h-8 flex-col items-center justify-center gap-0.5 text-caption font-medium",
                      "transition-colors duration-(--duration-fast) ease-(--ease-out)",
                      isActive ? "text-accent-text" : "text-ink-subtle hover:text-ink",
                    )
                  }
                >
                  <item.icon aria-hidden size={24} strokeWidth={ICON_STROKE} />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
