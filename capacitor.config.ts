import type { CapacitorConfig } from "@capacitor/cli";

/**
 * The iOS app wraps the same static build the website uses (ADR-0009).
 * Everything ships inside the binary; nothing is loaded from the network.
 */
const config: CapacitorConfig = {
  appId: "com.chadjara.proof",
  appName: "Proof",
  webDir: "build/client",
  ios: {
    // The web content draws its own safe-area padding.
    contentInset: "never",
    // Charcoal behind the web view, so overscroll and launch never flash white.
    backgroundColor: "#12110f",
    limitsNavigationsToAppBoundDomains: false,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#74202e",
      showSpinner: false,
    },
  },
};

export default config;
