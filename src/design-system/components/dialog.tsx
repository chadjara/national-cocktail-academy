import { X } from "lucide-react";
import { Dialog as RadixDialog } from "radix-ui";
import { useRef, type ReactNode } from "react";

import { cn } from "../cn";
import { ICON_STROKE } from "./icon";
import { IconButton } from "./icon-button";

type OverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  /** Buttons, right-aligned on desktop, stacked full-width on phones. */
  actions?: ReactNode;
};

/**
 * Our overlays are controlled (opened from any button, not a Radix Trigger),
 * so Radix doesn't know where focus came from. Remember the opener and send
 * focus back to it on close, so keyboard and screen-reader users keep their place.
 */
function useReturnFocus() {
  const opener = useRef<HTMLElement | null>(null);
  return {
    onOpenAutoFocus: () => {
      opener.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
    },
    onCloseAutoFocus: (event: Event) => {
      if (!opener.current?.isConnected) return;
      event.preventDefault();
      opener.current.focus();
    },
  };
}

function Header({ title, description }: { title: string; description: string | undefined }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex flex-col gap-0.5">
        <RadixDialog.Title className="font-display-optical text-heading-lg text-ink">
          {title}
        </RadixDialog.Title>
        {description !== undefined ? (
          <RadixDialog.Description className="text-sm text-ink-muted">
            {description}
          </RadixDialog.Description>
        ) : (
          <RadixDialog.Description className="sr-only">{title}</RadixDialog.Description>
        )}
      </div>
      <RadixDialog.Close asChild>
        <IconButton
          label="Close"
          icon={<X aria-hidden size={20} strokeWidth={ICON_STROKE} />}
          className="-mt-1 -mr-1"
        />
      </RadixDialog.Close>
    </div>
  );
}

function Actions({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col-reverse gap-1 pt-1 sm:flex-row sm:justify-end">{children}</div>
  );
}

/** Centered modal for confirmations and short forms. */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  actions,
}: OverlayProps) {
  const returnFocus = useReturnFocus();
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 animate-fade-in bg-scrim" />
        <RadixDialog.Content
          {...returnFocus}
          className={cn(
            "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-32px)] w-[calc(100vw-32px)] max-w-60 -translate-x-1/2 -translate-y-1/2 flex-col gap-2",
            "animate-fade-in overflow-y-auto rounded-base border border-line bg-raised p-3 shadow-overlay",
          )}
        >
          <Header title={title} description={description} />
          <div className="text-base text-ink">{children}</div>
          {actions !== undefined && <Actions>{actions}</Actions>}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

/**
 * Bottom sheet on phones (thumb-reachable), right-hand panel from `md` up.
 * Used for filters and secondary detail.
 */
export function Sheet({ open, onOpenChange, title, description, children, actions }: OverlayProps) {
  const returnFocus = useReturnFocus();
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 animate-fade-in bg-scrim" />
        <RadixDialog.Content
          {...returnFocus}
          className={cn(
            "fixed z-50 flex animate-rise-in flex-col gap-2 bg-raised p-3 shadow-overlay",
            "inset-x-0 bottom-0 max-h-[88dvh] rounded-t-base border-t border-line pb-[max(24px,env(safe-area-inset-bottom))]",
            "md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-60 md:rounded-none md:border-t-0 md:border-l",
          )}
        >
          <div
            aria-hidden
            className="mx-auto -mt-1 h-0.5 w-5 rounded-full bg-line-strong md:hidden"
          />
          <Header title={title} description={description} />
          <div className="-mx-3 flex-1 overflow-y-auto px-3 text-base text-ink">{children}</div>
          {actions !== undefined && <Actions>{actions}</Actions>}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
