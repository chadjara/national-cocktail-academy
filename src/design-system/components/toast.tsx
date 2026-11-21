import { X } from "lucide-react";
import { Toast as RadixToast } from "radix-ui";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { cn } from "../cn";
import { ICON_STROKE } from "./icon";

export type ToastTone = "neutral" | "success" | "danger";

export type ToastInput = {
  title: string;
  description?: string;
  tone?: ToastTone;
  action?: { label: string; altText: string; onAction: () => void };
  /** Milliseconds. Pass Infinity for a toast the user must dismiss. */
  duration?: number;
};

type ToastEntry = ToastInput & { id: number };

type ToastContextValue = { show: (toast: ToastInput) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>.");
  return context;
}

const toneBar: Record<ToastTone, string> = {
  neutral: "before:bg-ink-subtle",
  success: "before:bg-success",
  danger: "before:bg-danger",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const show = useCallback((toast: ToastInput) => {
    setToasts((current) => [...current, { ...toast, id: Date.now() + Math.random() }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider swipeDirection="down" duration={5000}>
        {children}
        {toasts.map((toast) => (
          <RadixToast.Root
            key={toast.id}
            {...(toast.duration !== undefined ? { duration: toast.duration } : {})}
            onOpenChange={(open) => {
              if (!open) remove(toast.id);
            }}
            className={cn(
              "relative flex animate-rise-in items-start gap-2 overflow-hidden rounded-base border border-line bg-raised py-2 pr-1 pl-2.5 shadow-overlay",
              "before:absolute before:inset-y-0 before:left-0 before:w-0.5",
              toneBar[toast.tone ?? "neutral"],
              "data-[swipe=end]:animate-fade-in data-[swipe=move]:translate-y-(--radix-toast-swipe-move-y)",
            )}
          >
            <div className="flex flex-1 flex-col gap-0.5 pt-0.5">
              <RadixToast.Title className="text-sm font-semibold text-ink">
                {toast.title}
              </RadixToast.Title>
              {toast.description !== undefined && (
                <RadixToast.Description className="text-sm text-ink-muted">
                  {toast.description}
                </RadixToast.Description>
              )}
            </div>
            {toast.action && (
              <RadixToast.Action
                altText={toast.action.altText}
                onClick={toast.action.onAction}
                className="h-4.5 shrink-0 rounded-base px-1.5 text-sm font-semibold text-accent-text hover:bg-sunken"
              >
                {toast.action.label}
              </RadixToast.Action>
            )}
            <RadixToast.Close
              aria-label="Dismiss"
              className="inline-flex size-4.5 shrink-0 items-center justify-center rounded-base text-ink-muted hover:bg-sunken"
            >
              <X aria-hidden size={16} strokeWidth={ICON_STROKE} />
            </RadixToast.Close>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport
          className={cn(
            "fixed inset-x-2 bottom-[calc(88px+env(safe-area-inset-bottom))] z-50 flex flex-col gap-1 outline-none",
            "md:right-3 md:bottom-3 md:left-auto md:w-50",
          )}
        />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}
