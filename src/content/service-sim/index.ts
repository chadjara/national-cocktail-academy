import type { GuestMoment } from "./schema";

/**
 * Decisions that interrupt a shift. They follow the Service & Responsibility
 * course and the Glassware & Ice course, and say where practice varies by state
 * or by bar.
 */
export const guestMoments: readonly GuestMoment[] = [
  {
    id: "id-in-a-rush",
    situation:
      "It's a packed Saturday. A guest hands you an ID while three others wave for your attention. The photo looks a little different from the person in front of you.",
    choices: [
      {
        text: "Take a few seconds: compare the photo, birth date and description carefully, and ask for a second ID if you're still unsure.",
        outcome: "best",
        feedback:
          "Right. A rush is when mistakes happen. Checking ID properly takes seconds and protects you and the bar.",
      },
      {
        text: "Call your manager over to check it.",
        outcome: "acceptable",
        feedback:
          "Never wrong to ask, but you can check it yourself first. Compare the photo and details, then ask for a second ID if you're unsure.",
      },
      {
        text: "Wave them through. You're too busy to check closely.",
        outcome: "unsafe",
        feedback:
          "Being busy doesn't change the law. Serving someone under 21 on a doubtful ID is never worth the seconds saved.",
      },
    ],
  },
  {
    id: "double-to-finish",
    situation:
      'A guest who\'s been getting louder and starting to slur asks for a double to "finish the night strong."',
    choices: [
      {
        text: "Kindly tell them you can't serve them more alcohol tonight, offer water and food, and let your manager know.",
        outcome: "best",
        feedback:
          "Right. Slurring and getting louder are clear signs. Say no privately and kindly, and keep your manager in the loop.",
      },
      {
        text: "Offer them a non-alcoholic drink instead.",
        outcome: "acceptable",
        feedback:
          "A good offer, but be clear that you've stopped serving them alcohol, and tell your manager.",
      },
      {
        text: "Pour a single instead of a double.",
        outcome: "unsafe",
        feedback: "A visibly intoxicated guest can't be served any alcohol, whatever the size.",
      },
    ],
  },
  {
    id: "ticket-for-cut-off-guest",
    situation:
      "A server hands you a ticket for two cocktails for a guest you stopped serving earlier.",
    choices: [
      {
        text: "Don't make it. Tell the server the guest has been cut off, and make sure the manager knows.",
        outcome: "best",
        feedback:
          "Exactly. A cut-off applies however the order reaches the bar. The whole team needs to know.",
      },
      {
        text: "Ask the server to check with the manager first.",
        outcome: "acceptable",
        feedback:
          "Involving the manager is good, but you already know the answer: don't make drinks for a guest who's been cut off.",
      },
      {
        text: "Make it. The server took the order, so it's on them.",
        outcome: "unsafe",
        feedback:
          "Whoever pours the drink is serving it. A cut-off guest can't be served alcohol through anyone.",
      },
    ],
  },
  {
    id: "nut-allergy",
    situation:
      "A guest says they have a nut allergy and asks whether the Mai Tai is safe for them.",
    choices: [
      {
        text: "Tell them it isn't: the Mai Tai contains orgeat, an almond syrup. Suggest a drink without nuts, and check with your manager if you're unsure of any ingredient.",
        outcome: "best",
        feedback:
          "Right. Knowing your specs keeps guests safe. Orgeat is almond syrup, and it's in many tiki drinks.",
      },
      {
        text: "Suggest a different drink without saying why.",
        outcome: "acceptable",
        feedback:
          "It avoids the risk, but tell them why. They need to know orgeat contains almond so they can avoid it elsewhere.",
      },
      {
        text: "Tell them it's fine; there aren't any nuts in a Mai Tai.",
        outcome: "unsafe",
        feedback:
          "The Mai Tai's orgeat is an almond syrup. Never guess about allergies: check the spec, and ask your manager when unsure.",
      },
    ],
  },
  {
    id: "chip-in-the-ice",
    situation: "During a rush, a glass chips against the edge of your ice well.",
    choices: [
      {
        text: "Stop using that well. Burn the ice by melting it all with hot water, clean the bin, and refill it.",
        outcome: "best",
        feedback:
          "Right. Glass in ice is invisible. The only safe fix is to melt it all and start again.",
      },
      {
        text: "Switch to another well and tell your manager so the ice gets burned.",
        outcome: "acceptable",
        feedback:
          "Good, as long as nobody uses that well until the ice has been burned and the bin cleaned.",
      },
      {
        text: "Scoop out the ice near the chip and keep going.",
        outcome: "unsafe",
        feedback: "Glass shards can be anywhere in the bin and can't be seen. Burn all of the ice.",
      },
    ],
  },
  {
    id: "borrowed-id",
    situation:
      "A guest's ID shows someone who looks similar, but the height and eye color on it don't match the person in front of you.",
    choices: [
      {
        text: "Politely decline the ID and don't serve alcohol. Follow your bar's policy for suspected borrowed or fake IDs, which may mean getting the manager.",
        outcome: "best",
        feedback:
          "Right. When the description doesn't match, the ID isn't theirs. What to do with the ID itself varies by state and bar.",
      },
      {
        text: "Ask them a question about the ID, like their zip code, before deciding.",
        outcome: "acceptable",
        feedback:
          "A useful check, but the mismatch you can see already tells you enough not to serve.",
      },
      {
        text: "Serve them. The birth date says they're 24.",
        outcome: "unsafe",
        feedback: "An ID only proves age for the person it belongs to. A borrowed ID is no ID.",
      },
    ],
  },
  {
    id: "shot-with-the-guest",
    situation: "A friendly regular buys a round of shots and insists you take one with them.",
    choices: [
      {
        text: "Thank them, decline the shot, and offer to toast with water or a soda.",
        outcome: "best",
        feedback:
          "Right. Most bars don't allow staff to drink on shift, and some states prohibit it. A toast with a soft drink keeps it friendly.",
      },
      {
        text: "Tell them you'll have one with them after your shift.",
        outcome: "acceptable",
        feedback:
          "It keeps you sober now, but don't make promises about after work. A simple, friendly no is enough.",
      },
      {
        text: "Take the shot so they feel welcome.",
        outcome: "unsafe",
        feedback:
          "Drinking on shift impairs your judgment for every decision that follows, and it's against most bars' policies.",
      },
    ],
  },
  {
    id: "stacking-at-last-call",
    situation:
      'At last call, a guest who seems fine orders four shots for themselves "to beat the cutoff."',
    choices: [
      {
        text: "Explain you can serve them one drink at a time, per house policy, and offer water.",
        outcome: "best",
        feedback:
          "Right. Stacked drinks at last call mean several drinks in minutes. Many bars, and some states, limit how many drinks one guest can be served at once.",
      },
      {
        text: "Serve two and keep an eye on them.",
        outcome: "acceptable",
        feedback:
          "Better than four, but your bar's policy, and in some states the law, may allow only one at a time. Know your house rule.",
      },
      {
        text: "Serve all four so they can drink them before close.",
        outcome: "unsafe",
        feedback:
          "Four shots in minutes can take a guest from fine to intoxicated just as they head home.",
      },
    ],
  },
];

export function listGuestMoments(): readonly GuestMoment[] {
  return guestMoments;
}

export type { GuestMoment } from "./schema";
