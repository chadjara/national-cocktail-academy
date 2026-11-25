import { appConfig } from "~/config/app.config";

/**
 * The privacy policy for the NCA iPhone app, as data. This text must match
 * the official copy at `appConfig.academy.privacyPolicyUrl` word for word;
 * the publisher maintains that page, and any change there is mirrored here
 * (and vice versa) in the same release. Update `policyLastUpdated` with it.
 */

export const policyLastUpdated = "23 November 2026";

export type PolicyLink = { label: string; href: string };

export type PolicyBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: readonly string[] }
  | { kind: "link"; before: string; link: PolicyLink; after: string };

export type PolicySection = { id: string; heading: string; blocks: readonly PolicyBlock[] };

export const policySummary: readonly string[] = [
  "No accounts, no in-app analytics, no advertising and no tracking.",
  "NCA does not collect your saved specs, bar inventory, preferences or training records. What you do in the app stays on your device.",
  "We do not sell or share personal information for advertising, and never will. Apple-provided diagnostics and information you choose to send us are explained below.",
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
    item: "Lessons you've finished",
    why: "To show your progress through each course and where to pick up.",
    when: "now",
  },
  {
    item: "Review cards, review history and practice scores",
    why: "To schedule your Daily Review and show your personal bests.",
    when: "now",
  },
  {
    item: "Exam results",
    why: "To show which course exams you've passed and what to review.",
    when: "now",
  },
  {
    item: "The name you choose for your certificate",
    why: "To print it on your certificate of completion.",
    when: "now",
  },
  {
    item: "Backup and certificate files",
    why: "Created only when you choose to save one, and saved wherever you choose. NCA never uploads them.",
    when: "now",
  },
];

export const policySections: readonly PolicySection[] = [
  {
    id: "who-we-are",
    heading: "Who we are",
    blocks: [
      {
        kind: "paragraph",
        text: `${appConfig.academy.name} (“NCA”) publishes the NCA app for iPhone. ${appConfig.academy.disclaimer} In this policy, “NCA” and “we” mean ${appConfig.academy.name}.`,
      },
      {
        kind: "paragraph",
        text: "This policy applies only to the NCA iPhone app. It does not cover the NCA website, Bartender’s Academy website or general browsing of CJaraTech.",
      },
    ],
  },
  {
    id: "your-device",
    heading: "What stays on your device",
    blocks: [
      {
        kind: "paragraph",
        text: "NCA keeps a small amount of information in the app’s own storage so it works the way you left it. These app records are never sent to us, and we cannot see them on your device. You may separately choose to include information in feedback or a support message.",
      },
      {
        kind: "paragraph",
        text: "To delete the information stored by the app, delete the app. If NCA later lets you export a backup file, that file is yours: it is created on your device and goes only where you put it. Copies in device backups or exported files may remain until you delete them through the relevant device settings or service.",
      },
    ],
  },
  {
    id: "others",
    heading: "Information others may process",
    blocks: [
      {
        kind: "paragraph",
        text: "Apple distributes the app through the App Store and TestFlight. For App Store releases, the usage and crash information made available to us depends on Apple’s sharing settings and privacy safeguards.",
      },
      {
        kind: "paragraph",
        text: "If you test a beta version through TestFlight, Apple automatically collects and shares crash logs and usage information with us, including device and iOS details. Depending on your invitation, this can include your name and email address. If you join through a public link, your name and email address are not displayed to us through that invitation. Feedback and screenshots you choose to submit through TestFlight are also shared with us.",
      },
      {
        kind: "paragraph",
        text: "We use these reports and feedback to fix problems and improve the app, not for advertising or tracking. This platform reporting is separate from the app records stored on your device.",
      },
      {
        kind: "paragraph",
        text: "Each spec lists its sources. If you choose to open a source link, it opens an external website in your browser. That website handles information under its own privacy practices.",
      },
    ],
  },
  {
    id: "no-third-party-tracking",
    heading: "No third-party tracking",
    blocks: [
      {
        kind: "paragraph",
        text: "NCA does not include analytics, advertising networks, social media tracking widgets or externally loaded fonts. The app’s content and fonts are bundled with the app. Apple’s distribution and diagnostic services described above are separate from the app’s own features.",
      },
    ],
  },
  {
    id: "age",
    heading: "Age and children",
    blocks: [
      {
        kind: "paragraph",
        text: "NCA is professional bartending training for adults of legal drinking age (21 or older in the United States). It is not directed at children. NCA’s core app features do not collect personal data from anyone, including children. Platform reports and voluntary communications are described in this policy.",
      },
    ],
  },
  {
    id: "rights",
    heading: "Your privacy rights",
    blocks: [
      {
        kind: "paragraph",
        text: "You control the app records stored on your device. We cannot access or change those local records. Depending on where you live and the law that applies, you may have rights to access, correct or delete personal information, limit certain uses, or opt out of its sale or sharing.",
      },
      {
        kind: "paragraph",
        text: "If we have received information through diagnostics, feedback or a support request, contact us about that information or any applicable privacy rights. We do not sell personal information or share it for advertising, and never will.",
      },
    ],
  },
  {
    id: "security",
    heading: "Security",
    blocks: [
      {
        kind: "paragraph",
        text: "Information stored locally is protected by your device’s security, such as your passcode. NCA has no accounts or server-side database of your saved specs, bar inventory, preferences or training records. Diagnostic reports and support messages are separate, as described in this policy.",
      },
    ],
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    blocks: [
      {
        kind: "paragraph",
        text: `${appConfig.academy.name} reserves the right to update or modify this Privacy Policy at any time. We will post the revised policy on this page and update the “Last updated” date. Where applicable law requires additional notice or consent, we will provide that notice or obtain that consent.`,
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
      {
        kind: "paragraph",
        text: "If you contact us, we receive the message and any contact details or attachments you choose to provide. We use that information to respond and troubleshoot issues, and retain it as needed to handle your request and meet applicable obligations. Please do not include passwords or other sensitive information.",
      },
    ],
  },
];
