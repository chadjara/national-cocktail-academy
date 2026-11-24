import type { Scenario } from "./schema";

/**
 * Laws on ID and intoxicated guests vary by state. These scenarios teach the
 * practice every state shares: check valid ID, never serve anyone under 21 or
 * visibly intoxicated, refuse calmly, keep guests safe, involve the manager.
 */
export const scenarios: readonly Scenario[] = [
  {
    id: "expired-license",
    title: "The expired license",
    setting:
      "Friday night. A guest who looks to be in their mid-twenties orders two margaritas and hands you a driver's license.",
    start: "check",
    nodes: [
      {
        id: "check",
        guest:
          "The photo matches and the birth date says they're 27. Then you notice the license expired last month.",
        choices: [
          {
            text: "Politely explain you can't accept an expired ID, and ask if they have another valid photo ID.",
            outcome: "best",
            feedback:
              "Right. Most bars don't accept expired ID, and in many states it isn't valid identification, whatever age it shows. A current passport or other valid government photo ID would work. Follow your state's law and your bar's policy.",
            next: "no-other-id",
          },
          {
            text: "Ask your manager to take a look.",
            outcome: "acceptable",
            feedback:
              "Bringing in a manager is never wrong. But you can handle this one: an expired ID isn't something to serve on.",
            next: "no-other-id",
          },
          {
            text: "Serve them. They're clearly over 21.",
            outcome: "unsafe",
            feedback:
              "The age printed on an expired ID doesn't make it valid. Serving on it puts you and the bar at risk. Ask for a current ID instead.",
          },
        ],
      },
      {
        id: "no-other-id",
        guest:
          "They don't have another ID with them. \"Come on, it only just expired. I'm obviously over 21.\"",
        choices: [
          {
            text: "Stay friendly and firm: without valid ID you can't serve alcohol. Offer a non-alcoholic drink or food.",
            outcome: "best",
            feedback:
              "That's it: calm, polite and consistent. Don't debate whether they look old enough. The rule is about the ID, and it's the same for everyone.",
          },
          {
            text: "Tell them they're welcome to come back with a valid ID.",
            outcome: "acceptable",
            feedback:
              "True and fair. Offering something they can have now, like a soft drink or food, keeps them welcome tonight too.",
          },
          {
            text: "Serve one drink as a compromise.",
            outcome: "unsafe",
            feedback:
              "One drink is still serving without valid ID. There's no partial version of checking ID.",
          },
        ],
      },
    ],
  },
  {
    id: "round-for-the-table",
    title: "A round for the table",
    setting:
      "A group of four sits down. One of them orders four beers. Three look well over 21; the fourth looks much younger and hasn't shown ID.",
    start: "order",
    nodes: [
      {
        id: "order",
        guest:
          "The guest ordering hands you their ID and says, \"They're all with me. We're celebrating.\"",
        choices: [
          {
            text: "Ask everyone who'll be drinking for ID before you serve the round.",
            outcome: "best",
            feedback:
              "Right. Everyone who'll drink needs to be checked, not just the person paying.",
            next: "ids",
          },
          {
            text: "Serve three beers and ask the younger guest what they'd like.",
            outcome: "acceptable",
            feedback:
              "Closer, but you haven't checked the other two, and a beer can still be passed across the table. Check everyone who'll be drinking.",
            next: "ids",
          },
          {
            text: "Serve the round. The person paying showed ID.",
            outcome: "unsafe",
            feedback:
              "Serving an adult who hands the drink to someone under 21 is still serving a minor, often called a secondary sale. Check everyone who'll drink.",
          },
        ],
      },
      {
        id: "ids",
        guest: "Three show valid IDs over 21. The fourth says they're 19 and asks for a soda.",
        choices: [
          {
            text: "Serve three beers and the soda, and keep an eye on the table through the night.",
            outcome: "best",
            feedback:
              "Exactly. If you see a drink passed to the 19-year-old, remove it and talk to the group and your manager.",
          },
          {
            text: "Tell the 19-year-old they have to leave.",
            outcome: "acceptable",
            feedback:
              "Only if your venue is 21 and over. Where guests under 21 are allowed, serve them a soft drink and watch the table.",
          },
          {
            text: "Bring a pitcher of beer for the table to share.",
            outcome: "unsafe",
            feedback:
              "A shared pitcher at a table with someone under 21 makes it easy for them to drink. Serve individual drinks to the guests who showed ID.",
          },
        ],
      },
    ],
  },
  {
    id: "one-more-round",
    title: "One more round",
    setting:
      "A regular you know well has had several drinks over the evening. Their speech is starting to slur, and they knocked over a glass a few minutes ago.",
    start: "ask",
    nodes: [
      {
        id: "ask",
        guest: 'They wave you over. "Same again, please!"',
        choices: [
          {
            text: "Quietly let them know you can't serve them more alcohol tonight, and offer water and something to eat.",
            outcome: "best",
            feedback:
              "Right. Slurred speech and spilled drinks are clear signs of intoxication. Say it privately and kindly.",
            next: "pushback",
          },
          {
            text: "Take your time getting to them, to slow them down.",
            outcome: "acceptable",
            feedback:
              "Slowing service can help earlier in the night, but they're already showing clear signs. It's time to stop serving alcohol, and to say so kindly.",
            next: "pushback",
          },
          {
            text: "Pour a smaller drink so they slow down.",
            outcome: "unsafe",
            feedback:
              "A visibly intoxicated guest can't be served any alcohol, however small the drink.",
          },
          {
            text: "Serve it. They're a regular and you know they're fine.",
            outcome: "unsafe",
            feedback:
              "Knowing someone doesn't change the law. Being a regular makes the conversation easier, not optional.",
          },
        ],
      },
      {
        id: "pushback",
        guest: "They laugh it off. \"I'm fine, I've only had a few.\"",
        choices: [
          {
            text: "Stay friendly and firm, don't debate how many they've had, and let your manager know.",
            outcome: "best",
            feedback:
              "Right. Keep it about tonight, not about them, and don't argue numbers. Telling your manager keeps the whole team on the same page.",
          },
          {
            text: "Ask your manager to talk to them.",
            outcome: "acceptable",
            feedback:
              "Involving your manager is good. You can still say no yourself first, then bring the manager in.",
          },
          {
            text: "Agree to one last drink if they promise to head home after.",
            outcome: "unsafe",
            feedback: "There's no last drink for a visibly intoxicated guest.",
          },
        ],
      },
    ],
  },
  {
    id: "the-guest-who-argues",
    title: "The guest who argues",
    setting:
      "You've stopped serving alcohol to a guest showing clear signs of intoxication. They're getting louder.",
    start: "angry",
    nodes: [
      {
        id: "angry",
        guest:
          '"This is ridiculous. I want to talk to your manager. I\'m not leaving without another drink."',
        choices: [
          {
            text: "Stay calm and quiet, say you understand they're frustrated, and get your manager.",
            outcome: "best",
            feedback:
              "Right. A calm, quiet voice lowers the temperature, and your manager backs you up.",
            next: "manager",
          },
          {
            text: "Explain every sign of intoxication you've noticed.",
            outcome: "acceptable",
            feedback:
              "Listing what you saw usually starts an argument. Keep it short: you can't serve more alcohol tonight.",
            next: "manager",
          },
          {
            text: "Raise your voice so they back down.",
            outcome: "unsafe",
            feedback:
              "Matching their energy escalates things. Calm, quiet and brief keeps everyone safer.",
          },
        ],
      },
      {
        id: "manager",
        guest:
          'Your manager comes over and backs you up. The guest says, "Fine. I\'ll go somewhere else."',
        choices: [
          {
            text: "Stay polite, offer water while they settle up, and make sure they have a safe way home.",
            outcome: "best",
            feedback:
              "Exactly. The goal is that they get home safely, not that you win the argument.",
          },
          {
            text: "Close their tab and say goodnight.",
            outcome: "acceptable",
            feedback:
              "Fine, as long as you know they're not driving. Check how they're getting home.",
          },
          {
            text: "Offer a drink to go so they leave happy.",
            outcome: "unsafe",
            feedback: "Never send alcohol with an intoxicated guest. That's still serving them.",
          },
        ],
      },
    ],
  },
  {
    id: "keys-on-the-bar",
    title: "Keys on the bar",
    setting:
      "Near closing, a guest who's had a lot to drink asks for the check and sets their car keys on the bar.",
    start: "driving",
    nodes: [
      {
        id: "driving",
        guest: "\"I'm good to drive. It's only ten minutes.\"",
        choices: [
          {
            text: "Say you're worried about them driving, and offer to call a taxi or rideshare, or a friend.",
            outcome: "best",
            feedback:
              "Right. Make it about their safety, and make the safe option easy to say yes to.",
            next: "refuses",
          },
          {
            text: "Quietly hand the keys to your manager without saying anything.",
            outcome: "acceptable",
            feedback:
              "Involving your manager is right, but taking keys without a word can start a confrontation. Talk to the guest first, and follow your bar's policy on keys.",
            next: "refuses",
          },
          {
            text: "Wish them a good night. It's their choice once they've paid.",
            outcome: "unsafe",
            feedback:
              "Bars and their staff can be held responsible for what happens after a guest leaves, and an impaired driver can hurt someone. Help them get a safe ride.",
          },
        ],
      },
      {
        id: "refuses",
        guest: "They turn down a ride and reach for their keys.",
        choices: [
          {
            text: "Get your manager right away. If they still insist on driving, the manager follows your bar's procedure, which may mean calling the police.",
            outcome: "best",
            feedback:
              "Right. Your job is to slow things down and get help. Never wrestle a guest for their keys.",
          },
          {
            text: "Ask their friends to talk them out of driving.",
            outcome: "acceptable",
            feedback:
              "Friends can help, but bring your manager in now so there's a plan if they can't.",
          },
          {
            text: "Grab the keys and refuse to give them back.",
            outcome: "unsafe",
            feedback:
              "Physically taking keys can get someone hurt and may go against your bar's policy. Get your manager and follow your procedure.",
          },
        ],
      },
    ],
  },
];

const scenarioById = new Map(scenarios.map((scenario) => [scenario.id, scenario]));

export function getScenario(id: string): Scenario | undefined {
  return scenarioById.get(id);
}

export function listScenarios(): readonly Scenario[] {
  return scenarios;
}

export type { Scenario, ScenarioChoice, ScenarioNode, ScenarioOutcome } from "./schema";
