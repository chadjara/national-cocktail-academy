#!/usr/bin/env bash
# Boots an iPhone simulator, installs the Debug build, launches it, and checks
# the device log for the "[proof] ready" line the web app prints once React
# has hydrated inside WKWebView. Saves a screenshot for humans to look at.
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

xcrun simctl launch "$DEVICE_ID" "$BUNDLE_ID"

for _ in $(seq 1 30); do
  if grep -q "\[proof\] ready" "$OUT_DIR/device.log"; then break; fi
  sleep 2
done
sleep 2
xcrun simctl io "$DEVICE_ID" screenshot "$OUT_DIR/launch.png"

if grep -q "\[proof\] ready" "$OUT_DIR/device.log"; then
  echo "App launched and the web app hydrated:"
  grep "\[proof\]" "$OUT_DIR/device.log" | tail -3
else
  echo "::error::The web app never reported ready. Last log lines:"
  tail -60 "$OUT_DIR/device.log"
  exit 1
fi

if grep -E "\[error\]" "$OUT_DIR/device.log"; then
  echo "::error::JavaScript errors were logged during launch (see above)."
  exit 1
fi
