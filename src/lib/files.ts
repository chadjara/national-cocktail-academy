import { Directory, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

import { isNativeApp } from "./platform";

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/**
 * Hands a file the student asked for (a certificate or a backup) to the
 * system. In the app it's written to the cache and opened in the share sheet,
 * so they can save it to Files, AirDrop it or print it; nothing is sent
 * anywhere unless they choose to. In a browser it downloads.
 *
 * Returns false if the student dismissed the share sheet or saving failed.
 */
export async function saveFile(
  name: string,
  bytes: Uint8Array,
  mimeType: string,
): Promise<boolean> {
  try {
    if (isNativeApp()) {
      const { uri } = await Filesystem.writeFile({
        path: name,
        data: toBase64(bytes),
        directory: Directory.Cache,
      });
      await Share.share({ title: name, files: [uri], dialogTitle: name });
      return true;
    }
    const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: mimeType }));
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    // Give the browser a moment to start the download before releasing it.
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
    return true;
  } catch {
    return false;
  }
}
