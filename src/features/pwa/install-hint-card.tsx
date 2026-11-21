import { Share, Smartphone } from "lucide-react";

import { Button, Card, Heading, ICON_STROKE, Text } from "~/design-system";

import { useInstallHint } from "./use-install-hint";

/**
 * Installing matters more than it looks: iOS clears storage for sites that
 * aren't on the home screen after about a week unused, and progress lives
 * only on the device.
 */
export function InstallHintCard() {
  const { platform, install, dismiss } = useInstallHint();
  if (platform === "none") return null;

  return (
    <Card as="section" className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-base bg-accent-subtle text-accent-text">
        <Smartphone aria-hidden size={24} strokeWidth={ICON_STROKE} />
      </span>
      <div className="flex flex-1 flex-col gap-0.5">
        <Heading as="h2" size="sm">
          Keep the academy on your home screen
        </Heading>
        {platform === "ios-safari" ? (
          <Text size="sm" tone="muted">
            Tap{" "}
            <Share
              aria-label="Share"
              size={16}
              strokeWidth={ICON_STROKE}
              className="inline align-[-3px]"
            />{" "}
            then <span className="font-medium text-ink">Add to Home Screen</span>. It works offline,
            and your progress stays safe on this phone.
          </Text>
        ) : (
          <Text size="sm" tone="muted">
            Install it to drill offline behind the bar. Your progress stays on this device.
          </Text>
        )}
      </div>
      <div className="flex gap-1">
        {platform === "prompt" && <Button onClick={() => void install()}>Install</Button>}
        <Button variant="ghost" onClick={() => void dismiss()}>
          Not now
        </Button>
      </div>
    </Card>
  );
}
