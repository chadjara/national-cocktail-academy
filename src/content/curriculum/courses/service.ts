import { ask, points, steps, text, tip, warning } from "../helpers";
import type { CourseInput } from "../schema";

export const service: CourseInput = {
  id: "service",
  group: "foundations",
  title: "Service & Responsibility",
  summary:
    "Taking orders, working a ticket, keeping a clean bar, checking ID and serving alcohol responsibly.",
  icon: { kind: "glass", glass: "rocks" },
  lessons: [
    {
      id: "taking-orders",
      title: "Taking orders and working a ticket",
      summary: "How to greet, take an order, and make several drinks in the right order.",
      blocks: [
        text(
          "Hospitality is half the job. Guests remember being noticed quickly more than they remember the drink. Acknowledge every guest within moments, even if it's only eye contact and 'I'll be right with you.'",
        ),
        steps("Making a round of drinks", [
          "Set out all the glasses first, so you can see the whole order.",
          "Make the drinks that hold up longest first: beer and wine, then stirred drinks.",
          "Make shaken drinks next, then anything with soda or sparkling wine last so it stays fizzy.",
          "Anything frozen or blended goes last of all.",
          "Garnish everything together and serve the round at once.",
        ]),
        tip(
          "Ask one more question",
          "When a guest orders a Martini, ask: gin or vodka, and olive or twist? A quick question saves a remake and shows you know the drink.",
        ),
        ask(
          "In a round with a Martini, a Mojito and a French 75, which do you finish last?",
          "The French 75",
          ["The Martini", "The Mojito", "It doesn't matter"],
          "Drinks topped with sparkling wine lose their fizz fastest, so they're finished last.",
        ),
      ],
    },
    {
      id: "clean-bar",
      title: "A clean bar",
      summary: "Cleaning as you go, and the hygiene habits health inspectors look for.",
      blocks: [
        points([
          "Clean as you go: wipe the bar top and rinse tins and tools between drinks.",
          "Wash your hands often, and always after handling money, trash or your face.",
          "Never touch the rim of a glass or the inside of a garnish tray.",
          "Keep the ice well for ice only: no bottles, fruit or glasses chilling in it.",
          "Label and date every prepped juice, syrup and garnish.",
        ]),
        tip(
          "Close like you'll open",
          "At the end of the night, leave the station the way you'd want to find it: stocked, wiped down, and with prep lists written for the next shift.",
        ),
        ask(
          "What can be stored in the ice well?",
          "Only ice",
          ["Bottles of white wine to chill", "Cut citrus to keep cold", "Clean glasses to frost"],
          "The ice well holds ice that goes straight into drinks. Anything else can contaminate it.",
        ),
      ],
    },
    {
      id: "responsible-service",
      title: "Responsible service",
      summary: "Checking ID, recognizing intoxication, and refusing service with care.",
      blocks: [
        text(
          "In the US, it's illegal to serve alcohol to anyone under 21 or to anyone who is visibly intoxicated. Bartenders and their employers can be held responsible for what happens after a guest leaves. Laws vary by state, and many states require a certified responsible-service course. This lesson is an introduction, not a certification.",
        ),
        steps("Checking ID", [
          "Check ID for anyone who looks under your bar's policy age, often 30 or 40.",
          "Accept only valid, unexpired, government-issued photo ID, like a driver's license or passport.",
          "Compare the photo and description to the person in front of you.",
          "Check the date of birth. If you're in any doubt, don't serve.",
        ]),
        points(
          [
            "Changes in behavior: louder, more argumentative, or overly friendly.",
            "Impaired judgment: careless with money, drinking faster.",
            "Slowed reactions: slurred speech, losing their train of thought.",
            "Loss of coordination: stumbling, spilling drinks.",
          ],
          "Signs of intoxication",
        ),
        warning(
          "Cutting someone off",
          "Be calm, private and firm. Don't argue or embarrassingly announce it. Offer water, food or a non-alcoholic drink, help arrange a safe ride home, and tell your manager.",
        ),
        ask(
          "A guest's ID is expired. What do you do?",
          "Politely refuse alcohol service",
          [
            "Serve them if they look over 21",
            "Serve them one drink only",
            "Ask a friend to vouch for them",
          ],
          "Only valid, unexpired ID counts. If you can't verify age, you can't serve alcohol.",
        ),
        ask(
          "In the US, how much alcohol is in one standard drink?",
          "About 14 grams, roughly 1½ oz of 80-proof spirit",
          [
            "About 28 grams, a double shot",
            "About 5 grams, a splash",
            "Any single glass, whatever's in it",
          ],
          "One US standard drink is about 14 g of pure alcohol: 12 oz of beer, 5 oz of wine, or 1½ oz of 80-proof spirit. Many cocktails contain more than one.",
        ),
        ask(
          "A guest is slurring and has spilled their drink. They ask for another. What's best?",
          "Calmly refuse, offer water or food, and help with a safe ride",
          [
            "Serve a weaker drink",
            "Serve one more and then cut them off",
            "Ignore them until they leave",
          ],
          "Serving a visibly intoxicated guest is illegal. Refuse kindly and help them get home safely.",
        ),
      ],
    },
  ],
};
