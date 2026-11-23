#!/usr/bin/env bash
# Boots an iPhone simulator, installs the Debug build, launches it, and checks
# for the "[proof] ready" line the web app prints once React has hydrated
# inside WKWebView. Capacitor forwards the web console to the app's stdout
# (not the unified log), so that's what we capture. The system log is kept
# for diagnosis, and a screenshot is saved for humans to look at.
set -euo pipefail

APP_PATH="${1:?usage: simulator-smoke.sh path/to/App.app}"
BUNDLE_ID="com.chadjara.proof"
OUT_DIR="${2:-ios-smoke}"
mkdir -p "$OUT_DIR"

DEVICE_ID=$(xcrun simctl list devices available --json | python3 -c '
import json, sys
devices = json.load(sys.stdin)["devices"]
for runtime in sorted(devices, reverse=True):
    if "iOS" not in runtime:
        continue
    for device in devices[runtime]:
        if device["name"].startswith("iPhone") and device["isAvailable"]:
            print(device["udid"]); sys.exit(0)
sys.exit("No available iPhone simulator")
')
echo "Using simulator $DEVICE_ID"

xcrun simctl boot "$DEVICE_ID" || true
xcrun simctl bootstatus "$DEVICE_ID" -b
xcrun simctl install "$DEVICE_ID" "$APP_PATH"

xcrun simctl spawn "$DEVICE_ID" log stream --level debug --style compact \
  --predicate 'process == "App"' > "$OUT_DIR/device.log" 2>&1 &
LOG_PID=$!
trap 'kill $LOG_PID 2>/dev/null || true' EXIT

CONSOLE="$OUT_DIR/console.log"
xcrun simctl launch --terminate-running-process \
  --stdout="$CONSOLE" --stderr="$OUT_DIR/stderr.log" \
  "$DEVICE_ID" "$BUNDLE_ID"

for _ in $(seq 1 30); do
  if grep -q "\[proof\] ready" "$CONSOLE" 2>/dev/null; then break; fi
  sleep 2
done
sleep 2
xcrun simctl io "$DEVICE_ID" screenshot "$OUT_DIR/launch.png"

echo "--- App console (Capacitor) ---"
cat "$CONSOLE" 2>/dev/null || true

if ! grep -q "\[proof\] ready" "$CONSOLE" 2>/dev/null; then
  echo "::error::The web app never reported ready. stderr and the last system log lines follow."
  cat "$OUT_DIR/stderr.log" 2>/dev/null || true
  tail -40 "$OUT_DIR/device.log"
  exit 1
fi
echo "App launched and the web app hydrated."

# Capacitor prefixes forwarded console.error calls with "[error]".
if grep -E "\[error\]" "$CONSOLE"; then
  echo "::error::JavaScript errors were logged during launch (see above)."
  exit 1
fi
