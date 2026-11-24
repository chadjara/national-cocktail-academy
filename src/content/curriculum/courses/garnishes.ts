import { ask, points, steps, text, tip, warning } from "../helpers";
import type { CourseInput } from "../schema";

export const garnishes: CourseInput = {
  id: "garnishes",
  group: "foundations",
  title: "Garnishes",
  summary:
    "Twists, wheels, wedges, cherries, olives, herbs and rims: how to cut them, when each one belongs, and how to keep them safe.",
  icon: { kind: "tool", tool: "peeler" },
  lessons: [
    {
      id: "why-garnish",
      title: "What a garnish is for",
      summary: "A garnish adds aroma or flavor, or tells the guest what's in the glass.",
      blocks: [
        text(
          "A good garnish does a job. A lemon twist adds bright citrus oil to the surface of a Martini, so the first thing the guest smells is lemon. Grated nutmeg on an Alexander adds spice and warmth. A lime wedge on a Gin & Tonic lets the guest decide how much lime they want.",
          "A garnish that does nothing, like an unrelated flower or a pile of fruit, just gets in the way. The rule professionals follow is simple: a garnish should be edible, and it should belong to the drink.",
        ),
        points([
          "Aroma: citrus oils, mint, grated spice.",
          "Flavor: a salt rim, an olive, a cherry.",
          "Choice: a wedge the guest can squeeze or leave.",
          "Signal: it tells the guest and the server what the drink is.",
        ]),
        ask(
          "Why does a Dry Martini get a lemon twist?",
          "The lemon oils add aroma to the surface of the drink",
          ["It sweetens the drink", "It adds lemon juice", "It's only decoration"],
          "Expressing a twist sprays citrus oil across the drink. The aroma is the first thing the guest notices.",
        ),
      ],
    },
    {
      id: "twists",
      title: "Twists and citrus oils",
      summary: "Cutting a twist, expressing the oils, and when to discard it.",
      blocks: [
        text(
          "The twist is the most important garnish in classic bartending. The oil in citrus zest is intensely aromatic, and a quick squeeze over the glass sprays a fine mist of it across the drink.",
        ),
        { kind: "tools", tools: ["peeler", "channel-knife"] },
        steps("Cutting and expressing a twist", [
          "Peel a strip about the size of your thumb with a Y-peeler, mostly zest and as little white pith as possible.",
          "Trim the edges with a paring knife for a neat shape, if your bar does.",
          "Hold it skin side down, a few inches above the drink, and pinch it firmly so the oils spray over the surface.",
          "Run the skin around the rim if the recipe calls for it, then drop it in or discard it.",
        ]),
        points(
          [
            "Express and drop in: Dry Martini, Boulevardier, Old Pal.",
            "Express and discard: Sazerac. The oils stay, the peel goes.",
            "Long spiral hung inside the glass: Horse's Neck, Brandy Crusta.",
            "Flamed orange twist: Oaxaca Old Fashioned. Warm the peel over a flame, then squeeze through the flame.",
          ],
          "Four ways a twist is used",
        ),
        warning(
          "Flaming twists",
          "Hold the match or lighter between the peel and the glass, keep it well away from your face and hair, and never flame near a high-proof spill on the bar.",
        ),
        ask(
          "How is the lemon zest finished on a Sazerac?",
          "The oils are expressed over the drink and the peel is discarded",
          ["Dropped in the glass", "Muddled into the drink", "Flamed and dropped in"],
          "The classic Sazerac keeps the lemon aroma but not the peel. Express it and throw it away.",
        ),
        ask(
          "Which side of the twist faces the drink when you express it?",
          "The colored skin side",
          ["The white pith side", "Either side", "Neither; you squeeze it over the sink"],
          "The oils are in the colored zest. Facing it toward the drink sprays them across the surface.",
        ),
      ],
    },
    {
      id: "wheels-wedges-slices",
      title: "Wheels, wedges and slices",
      summary: "Cutting citrus garnishes, and which drinks get which cut.",
      blocks: [
        text(
          "Citrus cut into wheels, wedges and slices is the workhorse garnish for long drinks and sours. Cut them before service, keep them covered and cold, and use them the same shift.",
        ),
        steps("Cutting wedges", [
          "Wash the fruit. Cut off both ends.",
          "Halve the fruit lengthwise, then lay each half flat.",
          "Cut each half lengthwise into three or four wedges.",
          "Make a small cut across the middle of the flesh so the wedge sits on the rim.",
        ]),
        points(
          [
            "Wedge, for the guest to squeeze: Gin & Tonic, Cuba Libre, Dark 'n' Stormy.",
            "Wheel, a thin round floated or perched on the rim: Gimlet, Tommy's Margarita.",
            "Half slice, a half-moon tucked into the glass: Negroni, Americano, Whiskey Sour.",
          ],
          "Which cut goes where",
        ),
        ask(
          "Why does a Cuba Libre get a lime wedge, not a twist?",
          "So the guest can squeeze in more lime juice if they want",
          [
            "Because lime twists are bitter",
            "Because the wedge is cheaper",
            "Because it's served up",
          ],
          "A wedge is a garnish the guest can use. Squeezing it adds fresh juice to the drink.",
        ),
        ask(
          "What is the classic garnish on a Negroni?",
          "A half orange slice",
          ["A lime wedge", "A cocktail cherry", "A mint sprig"],
          "The orange slice echoes the bitter orange of the Campari.",
        ),
      ],
    },
    {
      id: "cherries-olives-picks",
      title: "Cherries, olives and picks",
      summary: "The garnishes that sit in the glass, and how to serve them neatly.",
      blocks: [
        text(
          "Cherries and olives go on a cocktail pick or straight into the glass. Use a good cocktail cherry, dark and preserved in syrup, rather than the bright red kind, which adds little but color.",
        ),
        points([
          "Cocktail cherry: Manhattan, Old Fashioned, Whiskey Sour.",
          "Green olive: Dry Martini, one or three on a pick. Odd numbers are a bar tradition.",
          "Three coffee beans: Espresso Martini, floated on the foam.",
          "Always use tongs or a pick. Fingers never touch a garnish that goes into a drink.",
        ]),
        ask(
          "What is the classic garnish on a Manhattan?",
          "A cocktail cherry",
          ["A lime wedge", "A green olive", "Grated nutmeg"],
          "A dark cocktail cherry is the traditional Manhattan garnish.",
        ),
        ask(
          "How many coffee beans go on an Espresso Martini?",
          "Three",
          ["One", "Five", "None; it gets cocoa powder"],
          "Three coffee beans floated on the foam is the standard garnish.",
        ),
      ],
    },
    {
      id: "herbs-spices-rims",
      title: "Herbs, spices and rims",
      summary: "Mint sprigs, grated spice, and salt and sugar rims done properly.",
      blocks: [
        text(
          "Herbs and spices garnish by aroma. A mint sprig sits right where the guest's nose goes when they sip. Grated nutmeg sits on the foam of a creamy drink. A rim adds flavor to every sip.",
        ),
        steps("A proper half salt rim", [
          "Run a lime wedge around the outside of half the rim only.",
          "Hold the glass sideways and roll the wet outer edge in salt on a small plate.",
          "Tap off the loose salt. Keep salt off the inside of the glass, where it would fall into the drink.",
          "Do the rim before you make the drink, so the glass is ready when you strain.",
        ]),
        points([
          "Mint sprig: give it a light slap between your palms to wake up the aroma, then set it next to the straw.",
          "Nutmeg: grate fresh over the top of the drink. Alexander, Porto Flip.",
          "Half rim: lets the guest choose salt or no salt with each sip.",
        ]),
        ask(
          "Why is a Margarita given only a half salt rim?",
          "So the guest can choose to sip with or without salt",
          ["To use less salt", "Because salt melts the ice", "Because it's served on the rocks"],
          "A half rim lets the guest decide sip by sip. Always ask if they want salt at all.",
        ),
        ask(
          "Where does the salt go on a salt rim?",
          "On the outside edge of the glass only",
          ["Inside and outside the rim", "Inside the rim only", "Stirred into the drink"],
          "Salt on the inside falls into the drink and makes it salty. Keep it on the outside edge.",
        ),
        ask(
          "What garnish goes on an Alexander?",
          "Freshly grated nutmeg",
          ["A lemon twist", "A mint sprig", "A salt rim"],
          "Nutmeg's warm spice is the classic finish for cream drinks like the Alexander.",
        ),
      ],
    },
    {
      id: "garnish-prep-and-hygiene",
      title: "Garnish prep and food safety",
      summary: "Garnishes are food. Prep, store and handle them like food.",
      blocks: [
        text(
          "Garnishes go into a drink a guest puts in their mouth. Health inspectors treat them as food, and so should you.",
        ),
        points([
          "Wash all fruit and herbs before cutting.",
          "Cut garnishes before service and keep them covered and cold in a garnish tray.",
          "Handle garnishes with tongs or picks, never bare fingers.",
          "Throw out cut fruit at the end of the night unless your bar's procedures say otherwise.",
          "Keep herbs in water like cut flowers, and away from the heat of the bar.",
        ]),
        tip(
          "Prep for the night you'll have",
          "Cut for the volume you expect, not more. Fresh fruit cut halfway through the night looks better than a tray of dried-out wedges.",
        ),
        ask(
          "How should a bartender pick up a garnish?",
          "With tongs or a pick",
          ["With clean fingers", "With the ice scoop", "With a barspoon"],
          "Health codes treat garnishes as ready-to-eat food. Tongs or picks keep hands off them.",
        ),
      ],
    },
    {
      id: "garnish-drill",
      title: "Garnish drill",
      summary: "Match classic drinks to their garnish.",
      blocks: [
        text("Every question is drawn from the spec in the Library."),
        {
          kind: "drill",
          cocktailIds: [
            "dry-martini",
            "manhattan",
            "negroni",
            "margarita",
            "espresso-martini",
            "mojito",
            "gin-and-tonic",
            "old-fashioned",
            "alexander",
            "pina-colada",
            "whiskey-sour",
            "horses-neck",
          ],
          facets: ["garnish"],
          mode: "rotate",
        },
      ],
    },
  ],
};
