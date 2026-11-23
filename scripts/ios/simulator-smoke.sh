#!/usr/bin/env bash
# iOS simulator smoke test, in two phases so the simulator can settle while
# Xcode builds (a freshly booted CI simulator takes minutes before
# SpringBoard accepts launches):
#
#   simulator-smoke.sh boot <out-dir>             create and boot a fresh iPhone simulator
#   simulator-smoke.sh run  <out-dir> <App.app>   install, launch, and check the app
#
# "run" waits for the "[proof] ready" line the web app prints once React has
# hydrated inside WKWebView. Capacitor forwards the web console to the app's
# stdout (not the unified log), so that's what is captured. A screenshot is
# saved for humans to look at.
set -euo pipefail

PHASE="${1:?usage: simulator-smoke.sh boot|run <out-dir> [App.app]}"
OUT_DIR="${2:?missing out-dir}"
BUNDLE_ID="com.chadjara.proof"
mkdir -p "$OUT_DIR"

boot() {
  # Newest iOS runtime, newest iPhone device type it supports.
  read -r RUNTIME DEVICE_TYPE < <(xcrun simctl list --json | python3 -c '
import json, sys
data = json.load(sys.stdin)
runtimes = [r for r in data["runtimes"] if r["platform"] == "iOS" and r["isAvailable"]]
runtime = sorted(runtimes, key=lambda r: [int(p) for p in r["version"].split(".")])[-1]
iphones = [d for d in runtime["supportedDeviceTypes"] if d["productFamily"] == "iPhone"]
print(runtime["identifier"], iphones[-1]["identifier"])
')
  DEVICE_ID=$(xcrun simctl create "Proof smoke test" "$DEVICE_TYPE" "$RUNTIME")
  echo "$DEVICE_ID" > "$OUT_DIR/device-id"
  echo "Created $DEVICE_TYPE on $RUNTIME: $DEVICE_ID"
  xcrun simctl boot "$DEVICE_ID"
  echo "Booting in the background while the app builds."
}

run() {
  local app_path="${1:?missing App.app}"
  local device_id
  device_id=$(cat "$OUT_DIR/device-id")

  xcrun simctl bootstatus "$device_id" -b || true
  xcrun simctl install "$device_id" "$app_path"

  xcrun simctl spawn "$device_id" log stream --level debug --style compact \
    --predicate 'process == "App"' > "$OUT_DIR/device.log" 2>&1 &
  local log_pid=$!
  trap 'kill '"$log_pid"' 2>/dev/null || true' EXIT

  local console="$OUT_DIR/console.log"
  local launched=false
  for attempt in $(seq 1 16); do
    if xcrun simctl launch --terminate-running-process \
      --stdout="$console" --stderr="$OUT_DIR/stderr.log" \
      "$device_id" "$BUNDLE_ID"; then
      launched=true
      break
    fi
    echo "Launch attempt $attempt refused; SpringBoard is still starting. Retrying in 15s."
    sleep 15
  done
  if [ "$launched" != true ]; then
    echo "::error::The simulator refused to launch the app for 4 minutes."
    exit 1
  fi

  for _ in $(seq 1 30); do
    if grep -q "\[proof\] ready" "$console" 2>/dev/null; then break; fi
    sleep 2
  done
  sleep 2
  xcrun simctl io "$device_id" screenshot "$OUT_DIR/launch.png"

  echo "--- App console (Capacitor) ---"
  cat "$console" 2>/dev/null || true

  if ! grep -q "\[proof\] ready" "$console" 2>/dev/null; then
    echo "::error::The web app never reported ready. stderr and the last system log lines follow."
    cat "$OUT_DIR/stderr.log" 2>/dev/null || true
    tail -40 "$OUT_DIR/device.log"
    exit 1
  fi
  echo "App launched and the web app hydrated."

  # Capacitor prefixes forwarded console.error calls with "[error]".
  if grep -E "\[error\]" "$console"; then
    echo "::error::JavaScript errors were logged during launch (see above)."
    exit 1
  fi
}

case "$PHASE" in
  boot) boot ;;
  run) run "${3:-}" ;;
  *) echo "Unknown phase: $PHASE" >&2; exit 2 ;;
esac
