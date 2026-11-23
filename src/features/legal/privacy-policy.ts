import { appConfig } from "~/config/app.config";

/**
 * The privacy policy as data, so every change is a readable text diff.
 * Update `lastUpdated` with any material change, and rewrite this before
 * NCA ever adds accounts, payments, analytics or a server.
 */

export const policyLastUpdated = "23 November 2026";

/** The website, named by address so the policy reads correctly wherever it's posted. */
const siteHost = appConfig.academy.publicUrl.replace(/^https:\/\//, "").replace(/\/$/, "");

export type PolicyLink = { label: string; href: string };

export type PolicyBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: readonly string[] }
  | { kind: "link"; before: string; link: PolicyLink; after: string };

export type PolicySection = { id: string; heading: string; blocks: readonly PolicyBlock[] };

export const policySummary: readonly string[] = [
  "No accounts, no analytics, no advertising and no tracking.",
  "NCA doesn't collect personal data. What you do in the app stays on your device.",
  "Nothing is sold or shared, because there is nothing to sell or share.",
];

export type StoredItem = { item: string; why: string; when: "now" | "planned" };

export const storedOnDevice: readonly StoredItem[] = [
  { item: "Saved specs", why: "So your favorites are there when you open the app.", when: "now" },
  {
    item: "Bottles marked in My Bar",
    why: "To show what you can make and what to buy next.",
    when: "now",
  },
  { item: "Units (oz or ml) and theme", why: "To remember your display preferences.", when: "now" },
  {
    item: "Whether you dismissed the install tip",
    why: "So it doesn't keep appearing.",
    when: "now",
  },
  {
    item: "Lesson progress, practice history and exam results",
    why: "To track your training as those features arrive.",
    when: "planned",
  },
  {
    item: "The name you choose for your certificate",
    why: "To print it on your certificate of completion.",
    when: "planned",
  },
];

const githubPrivacy: PolicyLink = {
  label: "GitHub's Privacy Statement",
  href: "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement",
};
const applePrivacy: PolicyLink = {
  label: "Apple's Privacy Policy",
  href: "https://www.apple.com/legal/privacy/",
};

export const policySections: readonly PolicySection[] = [
  {
    id: "who-we-are",
    heading: "Who we are",
    blocks: [
      {
        kind: "paragraph",
        text: `${appConfig.academy.name} ("NCA") publishes the NCA website at ${siteHost} and the NCA app for iPhone. ${appConfig.academy.disclaimer} In this policy, "NCA" and "we" mean ${appConfig.academy.name}.`,
      },
    ],
  },
  {
    id: "your-device",
    heading: "What stays on your device",
    blocks: [
      {
        kind: "paragraph",
        text: "NCA keeps a small amount of information so it works the way you left it. On the NCA website it's in your browser's storage (IndexedDB and localStorage). In the iPhone app it's in the app's own storage. It is never sent to us or to anyone else, and we can't see it.",
      },
      {
        kind: "paragraph",
        text: "To delete it, clear the NCA website's data in your browser settings, or delete the app. If NCA later lets you export a backup file, that file is yours: it's created on your device and goes only where you put it.",
      },
    ],
  },
  {
    id: "others",
    heading: "Information others may process",
    blocks: [
      {
        kind: "paragraph",
        text: "NCA itself collects nothing, but two companies that deliver it may process limited technical information under their own policies:",
      },
      {
        kind: "link",
        before:
          "GitHub hosts the NCA website on GitHub Pages. Like most web hosts, GitHub may log visitors' IP addresses and request details for security and to keep the service running. We don't receive or use those logs. See ",
        link: githubPrivacy,
        after: ".",
      },
      {
        kind: "link",
        before:
          "Apple distributes the iPhone app through the App Store and TestFlight. If you test through TestFlight, Apple may share with us crash reports, device and iOS details, and any feedback or screenshots you choose to send, so we can fix problems. On the App Store, Apple shares app usage and crash data with developers only if you opt in to sharing with app developers in your device settings. See ",
        link: applePrivacy,
        after: ".",
      },
      {
        kind: "paragraph",
        text: "Each spec lists the sources it came from. Those links open the source's website in your browser, and that site's own privacy policy applies.",
      },
    ],
  },
  {
    id: "no-third-parties",
    heading: "No third-party code",
    blocks: [
      {
        kind: "paragraph",
        text: "NCA doesn't load anything from other companies: no analytics, no ad networks, no social media widgets, no outside fonts. Every file comes from NCA itself, and the NCA website's security policy blocks scripts from elsewhere and stops the page from sending data to any other server.",
      },
    ],
  },
  {
    id: "age",
    heading: "Age and children",
    blocks: [
      {
        kind: "paragraph",
        text: "NCA is professional bartending training for adults of legal drinking age (21 or older in the United States). It isn't directed at children. Because NCA collects no personal data from anyone, it collects none from children.",
      },
    ],
  },
  {
    id: "rights",
    heading: "Your privacy rights",
    blocks: [
      {
        kind: "paragraph",
        text: "Privacy laws such as the California Consumer Privacy Act (CCPA/CPRA) and the EU and UK GDPR give you rights to access, correct, delete and limit the use of your personal information, and to opt out of its sale or sharing.",
      },
      {
        kind: "paragraph",
        text: "We hold no personal information about you, so there is nothing for us to access, correct, delete, sell or share. Everything NCA stores is on your device and fully under your control. We do not sell or share personal information, and never will.",
      },
    ],
  },
  {
    id: "security",
    heading: "Security",
    blocks: [
      {
        kind: "paragraph",
        text: "Information on your device is protected by your device's and browser's own security, such as your passcode. NCA has no servers or accounts, so there is no database of your information that could be breached.",
      },
    ],
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    blocks: [
      {
        kind: "paragraph",
        text: "If how NCA handles information ever changes, we'll update this page and its date first, and tell you in the app before the change takes effect.",
      },
    ],
  },
  {
    id: "contact",
    heading: "Contact",
    blocks: [
      {
        kind: "link",
        before: "Questions about this policy or about NCA? ",
        link: { label: "Get in touch here", href: appConfig.academy.contactUrl },
        after: ".",
      },
    ],
  },
];
