import { ask, points, steps, text, tip, warning } from "../helpers";
import type { CourseInput } from "../schema";

export const glasswareAndIce: CourseInput = {
  id: "glassware-and-ice",
  group: "foundations",
  title: "Glassware & Ice",
  summary:
    "Which glass each style of drink goes in and why, how to chill and handle glassware, and the four kinds of ice a bar runs on.",
  icon: { kind: "glass", glass: "coupe" },
  lessons: [
    {
      id: "why-glassware-matters",
      title: "Why glassware matters",
      summary: "A glass is a tool. It sets the temperature, the aroma and the size of the drink.",
      blocks: [
        text(
          "Guests drink with their eyes and nose before they taste anything. The glass decides how a drink looks, how fast it warms, how much aroma reaches the nose, and how much room there is for ice and mixer.",
          "The pattern is simple once you see it. Drinks served up, with no ice, go in stemmed glasses so your hand doesn't warm them. Drinks on ice go in sturdy, flat-bottomed glasses. Long drinks with a mixer go in tall glasses.",
        ),
        points(
          [
            "Up (no ice): a stemmed glass, chilled. Cocktail glass or coupe.",
            "On the rocks: a short, heavy rocks glass.",
            "Long, with a mixer: a tall highball or Collins.",
            "Sparkling: a flute or wine glass, to show off and keep the bubbles.",
          ],
          "The pattern",
        ),
        ask(
          "Why are drinks served up put in stemmed glasses?",
          "So the guest's hand doesn't warm the drink",
          [
            "Because they hold more liquid",
            "Because stems are cheaper to make",
            "So the ice stays in place",
          ],
          "A drink with no ice starts warming the moment it's poured. Holding the stem keeps your hand's heat away from it.",
        ),
        ask(
          "A spirit with a mixer, served over plenty of ice, goes in what kind of glass?",
          "A tall glass, like a highball",
          ["A coupe", "A flute", "A cocktail glass"],
          "Long drinks need room for ice and mixer, so they go in a highball or Collins.",
        ),
      ],
    },
    {
      id: "up-glasses",
      title: "Stemmed glasses",
      summary: "The cocktail glass, coupe, flute and wine glass.",
      blocks: [
        text(
          "Stemmed glassware is for drinks that are served cold without ice, and for sparkling wine. Each shape has its reasons.",
        ),
        {
          kind: "glasses",
          items: [
            {
              glass: "cocktail",
              use: "The V-shaped classic, often called a Martini glass. For stirred and shaken drinks served up: Martini, Manhattan, Daiquiri, Cosmopolitan.",
            },
            {
              glass: "coupe",
              use: "A shallow, rounded bowl. Spills less than a V-shape, so many bars use it for anything served up, from a Margarita to a Clover Club.",
            },
            {
              glass: "flute",
              use: "Tall and narrow to keep bubbles lively. For Champagne cocktails: French 75, Mimosa, Bellini.",
            },
            {
              glass: "wine",
              use: "A large bowl with room for ice and aroma. For the Aperol Spritz and the Kir.",
            },
          ],
        },
        tip(
          "Cocktail glass or coupe?",
          "They do the same job and many bars swap one for the other. The coupe is easier to carry without spilling. Follow your bar's house standard; the spec in this app shows the classic choice.",
        ),
        ask(
          "Why is a flute tall and narrow?",
          "It keeps the bubbles lively for longer",
          ["So it holds more ice", "So it fits more garnish", "So it warms the drink faster"],
          "A narrow surface lets less carbonation escape, and the height shows off the rising bubbles.",
        ),
        ask(
          "Which glass does an Aperol Spritz traditionally go in?",
          "A wine glass with ice",
          ["A flute", "A coupe", "A copper mug"],
          "The Spritz is served over ice in a large wine glass, with room for the Prosecco, Aperol and soda.",
        ),
      ],
    },
    {
      id: "rocks-and-tall-glasses",
      title: "Rocks, tall and specialty glasses",
      summary: "Glasses for drinks served on ice, and a few that belong to one drink.",
      blocks: [
        {
          kind: "glasses",
          items: [
            {
              glass: "rocks",
              use: "Also called an Old Fashioned glass. Short and heavy for spirit-forward drinks on ice: Old Fashioned, Negroni, Black Russian.",
            },
            {
              glass: "highball",
              use: "Tall, around 10 to 12 oz. For a spirit and a mixer: Gin & Tonic, Cuba Libre, Paloma.",
            },
            {
              glass: "collins",
              use: "Taller and narrower than a highball. For drinks lengthened with soda: John Collins, Mojito, Ramos Gin Fizz.",
            },
            {
              glass: "copper-mug",
              use: "Belongs to the Moscow Mule. The metal feels ice-cold in the hand.",
            },
            {
              glass: "julep-cup",
              use: "A metal cup packed with crushed ice for the Mint Julep. It frosts over on the outside.",
            },
            {
              glass: "hurricane",
              use: "A curvy, tall glass for frozen and tropical drinks like the Piña Colada.",
            },
            {
              glass: "irish-coffee",
              use: "A heat-proof stemmed glass with a handle, for Irish Coffee and other hot drinks.",
            },
          ],
        },
        ask(
          "Which glass is also called an Old Fashioned glass?",
          "The rocks glass",
          ["The Collins glass", "The coupe", "The highball"],
          "The short, heavy rocks glass takes its other name from the drink most often served in it.",
        ),
        ask(
          "A Moscow Mule is traditionally served in…",
          "A copper mug",
          ["A julep cup", "A flute", "An Irish coffee glass"],
          "The copper mug was part of the Moscow Mule's original marketing in the 1940s and is still its signature.",
        ),
        ask(
          "What is the difference between a highball and a Collins glass?",
          "A Collins is taller and narrower",
          ["A highball has a stem", "A Collins is short and wide", "There is no difference at all"],
          "Both are tall glasses for long drinks. The Collins is taller and slimmer, which suits soda-topped drinks.",
        ),
      ],
    },
    {
      id: "chilling-and-handling",
      title: "Chilling and handling glassware",
      summary: "Cold glasses, clean hands, and what to do when a glass breaks.",
      blocks: [
        text(
          "A drink served up in a warm glass loses its chill in a minute. Professionals chill every stemmed glass before pouring, either in a glass freezer or by filling it with ice and water while they make the drink, then dumping it just before straining.",
        ),
        steps("Handling glassware like a pro", [
          "Hold stemmed glasses by the stem and tumblers by the base. Never touch the rim, where the guest's lips go.",
          "Check every glass for chips, cracks and lipstick before it's filled.",
          "Carry glasses upright, never stacked inside each other.",
          "Never scoop ice with a glass. It can chip, and a glass chip in ice is invisible.",
        ]),
        warning(
          "If a glass breaks near the ice",
          "Stop using the ice well immediately. Melt all of the ice with hot water, clean and dry the bin, then refill it. This is called burning the ice. You can't safely pick glass out of ice.",
        ),
        ask(
          "A glass breaks over the ice well. What do you do?",
          "Stop service from that well and melt all of the ice",
          [
            "Pick out the pieces you can see and carry on",
            "Scoop out the top layer of ice",
            "Warn guests and keep serving",
          ],
          "Glass shards in ice are invisible. Burn the ice: melt it all with hot water, clean the bin, refill it.",
        ),
        ask(
          "Where do you hold a stemmed glass?",
          "By the stem",
          ["By the rim", "By the bowl", "Anywhere, as long as your hands are clean"],
          "The stem keeps fingerprints and warmth off the bowl, and your hands away from where the guest drinks.",
        ),
      ],
    },
    {
      id: "ice",
      title: "Ice is an ingredient",
      summary: "Cubes, a large cube, crushed ice, or none, and why fresh ice matters.",
      blocks: [
        text(
          "Ice is the most-used ingredient behind any bar. It chills the drink and adds water as it melts, and that water is part of the recipe. Ice that's wet, small or old melts too fast and gives you a thin, watery drink.",
        ),
        points(
          [
            "Cubed ice: the everyday cube for shaking, stirring and most drinks on the rocks.",
            "One large cube: melts slowly. Used for spirit-forward drinks like an Oaxaca Old Fashioned.",
            "Crushed ice: chills fast and dilutes fast. Juleps, Mai Tais, swizzles.",
            "Served up: no ice in the glass. The drink was chilled in the tin or mixing glass.",
          ],
          "The four ways a drink is served",
        ),
        tip(
          "Fresh ice in the glass",
          "Never pour the ice from your shaker into the glass. It's broken and half-melted. Strain over fresh ice instead.",
        ),
        ask(
          "Why does crushed ice suit a Mint Julep?",
          "It chills fast and frosts the cup, and the melt opens up a strong drink",
          [
            "It melts more slowly than cubes",
            "It adds sweetness",
            "It keeps the mint out of the straw",
          ],
          "Crushed ice has lots of surface. It chills fast, frosts the metal cup and dilutes the bourbon into an easy sipper.",
        ),
        ask(
          "After shaking a Whiskey Sour to serve on the rocks, what goes in the glass?",
          "Fresh ice",
          ["The ice from the shaker", "No ice", "Crushed ice from the tin"],
          "Shaker ice is broken and wet and melts fast. Strain the drink over fresh ice.",
        ),
      ],
    },
    {
      id: "glass-and-ice-drill",
      title: "Glass and ice drill",
      summary: "Match well-known drinks to their glass and ice.",
      blocks: [
        text(
          "Every question below comes from the spec in the Library. Learn these and you'll know the glass and ice for most drinks a guest will ever order.",
        ),
        {
          kind: "drill",
          cocktailIds: [
            "dry-martini",
            "margarita",
            "old-fashioned",
            "gin-and-tonic",
            "mojito",
            "moscow-mule",
            "mint-julep",
            "french-75",
            "spritz",
            "pina-colada",
            "negroni",
            "irish-coffee",
          ],
          facets: ["glass", "ice"],
          mode: "rotate",
        },
      ],
    },
  ],
};
