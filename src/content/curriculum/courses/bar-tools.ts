import { ask, points, steps, text, tip, warning } from "../helpers";
import type { CourseInput } from "../schema";

export const barTools: CourseInput = {
  id: "bar-tools",
  group: "foundations",
  title: "Bar Tools",
  summary:
    "The sixteen tools on every professional station: what each one does, how to hold it, and the habits that keep you fast and clean.",
  icon: { kind: "tool", tool: "jigger" },
  lessons: [
    {
      id: "your-station",
      title: "Your station",
      summary: "How a well is laid out, and why everything has one home.",
      blocks: [
        text(
          "A bartender's station is a small workshop. Behind every busy bar, each person works from a well: an ice bin in the middle, the most-poured bottles in a rail in front of it, and the tools laid out on a bar mat within one step.",
          "Speed behind the bar doesn't come from moving fast. It comes from never searching. Every tool, bottle and garnish has one home, and it goes back there the moment you're done with it. Bartenders call this mise en place: everything in its place before the first guest sits down.",
        ),
        { kind: "tools", tools: ["bar-mat", "speed-pourer", "ice-scoop"] },
        steps("Setting up before a shift", [
          "Fill the ice well with fresh ice and put the scoop in its holder, never buried in the ice.",
          "Fit speed pourers to the well bottles, all spouts facing the same way.",
          "Juice citrus, make syrups and cut garnishes. Label and date everything.",
          "Lay out jiggers, shakers, strainers and spoons on the bar mat in the same order every shift.",
          "Stock glassware, napkins and straws so you never leave the well mid-order.",
        ]),
        tip(
          "Same layout, every shift",
          "Pick a layout and keep it. When the jigger is always to the right of the tins, your hand finds it without your eyes, and that's how a bartender makes four drinks while talking to a fifth guest.",
        ),
        ask(
          "Where does the ice scoop live during service?",
          "In its holder, outside the ice",
          [
            "Buried in the ice so it stays cold",
            "In the sink between uses",
            "In an empty pint glass",
          ],
          "A scoop left in the ice means a handle your hands have touched is sitting in the ice that goes into drinks. Keep it in a holder outside the ice.",
        ),
        ask(
          "What does mise en place mean behind the bar?",
          "Everything prepped and in its home before service",
          [
            "Cleaning the station at the end of the night",
            "Making drinks in the order tickets arrive",
            "Pouring without a jigger",
          ],
          "Mise en place is French for 'everything in its place'. Prep is finished and every tool has a home before the first guest arrives.",
        ),
      ],
    },
    {
      id: "measuring",
      title: "Measuring with a jigger",
      summary: "Accurate pours are the difference between a recipe and a guess.",
      blocks: [
        text(
          "A cocktail is a balance of strong, sweet, sour and bitter. A quarter ounce too much lime and a Daiquiri is sharp; too little and it's flat. Professionals measure every pour, every time, with a jigger.",
          "The standard US jigger has a 1 oz cup on one end and a 2 oz cup on the other, with lines inside for ¼, ½ and ¾ oz (some have 1½ oz too). In the US a standard shot is 1½ oz.",
        ),
        { kind: "tools", tools: ["jigger"] },
        steps("A clean, accurate pour", [
          "Hold the jigger between your index and middle fingers, level, over the tin, not over the bar.",
          "Pour until the liquid reaches the rim, so the surface sits level with the edge.",
          "Tip it into the tin with a flick of the wrist, so it empties completely.",
          "Pour in the same order on every drink, so you never miss an ingredient or double one.",
        ]),
        tip(
          "Fill to the rim",
          "Measuring to just below the rim shorts every drink. Fill the jigger to the brim. If you spill, you're pouring too fast.",
        ),
        ask(
          "What is a standard shot of spirit in the US?",
          "1½ oz",
          ["1 oz", "2 oz", "¾ oz"],
          "The US standard is 1½ oz (about 45 ml). Many sours call for 2 oz.",
        ),
        ask(
          "When is a jigger pour accurate?",
          "When the liquid is level with the rim",
          [
            "When it's just below the rim",
            "When it spills over a little",
            "Whenever it looks close",
          ],
          "Fill the jigger right to the rim. Stopping short shorts every drink, and spilling over wastes product.",
        ),
      ],
    },
    {
      id: "shakers",
      title: "Shakers",
      summary: "The Boston shaker and the cobbler: how they seal, and how to open them.",
      blocks: [
        text(
          "Shaking chills, dilutes and aerates a drink in about twelve seconds. Two shakers dominate. The Boston shaker is two metal tins, one large and one small, used in almost every professional bar. The cobbler has a built-in strainer and cap and is more common at home.",
        ),
        { kind: "tools", tools: ["boston-shaker", "cobbler-shaker"] },
        steps("Using a Boston shaker", [
          "Fill the small tin with ice, then pour in the ingredients.",
          "Set the large tin over it at a slight angle and give it one firm tap to seal.",
          "Hold both tins, large tin toward you, small tin toward the guest, and shake hard.",
          "To open, hold it with the small tin on top and strike the large tin with the heel of your hand where the two tins meet.",
        ]),
        tip(
          "Why the angle matters",
          "Sealing the tins at an angle leaves a gap on one side. That's where you strike to break the seal. A straight-on seal is much harder to open.",
        ),
        warning(
          "Point it away from guests",
          "Always shake with the small tin pointing away from guests and coworkers. If the seal fails mid-shake, the drink flies away from people, not at them.",
        ),
        ask(
          "Which shaker do most professional bars use?",
          "The Boston shaker, two metal tins",
          ["The cobbler shaker", "A mason jar", "A French shaker with a glass base"],
          "Boston tins are faster to build in, open and rinse, and nothing gets stuck in a built-in strainer.",
        ),
        ask(
          "How do you break the seal on a Boston shaker?",
          "Strike the large tin where the two tins meet",
          ["Twist the tins apart", "Run it under hot water", "Tap the bottom on the bar"],
          "A firm hit with the heel of the hand on the large tin, at the gap left by the angled seal, pops it open.",
        ),
      ],
    },
    {
      id: "strainers",
      title: "Strainers",
      summary: "Hawthorne, julep and fine strainers, and when to double strain.",
      blocks: [
        text(
          "A strainer keeps the ice in the tin and everything else out of the glass. The type you reach for depends on whether the drink was shaken or stirred, and how smooth it should be.",
        ),
        { kind: "tools", tools: ["hawthorne-strainer", "julep-strainer", "fine-strainer"] },
        points([
          "Hawthorne strainer: fits over a shaker tin. Use it for shaken drinks.",
          "Julep strainer: sits inside a mixing glass. Use it for stirred drinks.",
          "Fine strainer: held under the main strainer to catch ice chips, pulp and herbs.",
          "Double straining: Hawthorne and fine strainer together, for drinks served up or with muddled herbs.",
        ]),
        tip(
          "Close the gate",
          "Push the Hawthorne's front edge (the gate) forward to tighten the gap against the tin. A closed gate holds back more ice chips and fruit.",
        ),
        ask(
          "Which strainer goes with a mixing glass?",
          "Julep strainer",
          ["Hawthorne strainer", "Fine strainer on its own", "No strainer"],
          "The julep strainer is shaped to sit inside a mixing glass. The Hawthorne's spring is made to fit a shaker tin.",
        ),
        ask(
          "Why would you double strain a Gin Basil Smash?",
          "To catch the bits of muddled basil and ice chips",
          ["To make it colder", "To add more dilution", "Because it is stirred"],
          "Muddled herbs leave fragments that get stuck in teeth. A fine strainer under the Hawthorne catches them.",
        ),
      ],
    },
    {
      id: "spoon-glass-muddler",
      title: "Barspoon, mixing glass and muddler",
      summary: "The tools for stirred drinks and for pressing fruit and herbs.",
      blocks: [
        text(
          "Stirred drinks need a heavy mixing glass and a long barspoon. The weight of the glass keeps it steady, and the twisted handle of the spoon lets it spin smoothly between your fingers. The muddler is for pressing: it releases juice from fruit and oil from herbs.",
        ),
        { kind: "tools", tools: ["mixing-glass", "barspoon", "muddler"] },
        steps("Stirring like a professional", [
          "Fill the mixing glass two-thirds with ice, then add the ingredients.",
          "Hold the spoon between your thumb and first two fingers, like a pencil, with the back of the bowl against the glass.",
          "Push and pull with your fingers so the spoon glides around the inside of the glass. Ice and spoon move as one.",
          "Stir for about 20 to 30 seconds, then strain with a julep strainer.",
        ]),
        warning(
          "Press, don't pound",
          "Mint and basil turn bitter when they're shredded. Press herbs gently with the muddler and twist. Save real force for citrus and sugar, as in a Caipirinha.",
        ),
        ask(
          "About how much is one barspoon?",
          "5 ml, about a teaspoon",
          ["15 ml, about a tablespoon", "30 ml, about an ounce", "1 ml, a few drops"],
          "A barspoon holds about 5 ml (⅙ oz). Recipes use it for strong ingredients like maraschino or absinthe.",
        ),
        ask(
          "How should you muddle fresh mint?",
          "Press gently and twist to release the oils",
          [
            "Pound it hard until it's a paste",
            "Chop it first with a knife",
            "Shake it without muddling",
          ],
          "Gentle pressure releases mint's aromatic oils. Shredding the leaves releases bitter, grassy flavors.",
        ),
      ],
    },
    {
      id: "knives-and-citrus",
      title: "Knives, peelers and the citrus press",
      summary: "Cutting garnishes and juicing citrus safely and to order.",
      blocks: [
        text(
          "Fresh citrus is the heartbeat of a cocktail bar. Bottled juice tastes flat and cooked. Professionals juice lemons and limes every day and use them within the shift. The garnish tools turn the same fruit into twists, wheels and spirals.",
        ),
        { kind: "tools", tools: ["citrus-press", "peeler", "channel-knife", "paring-knife"] },
        points([
          "Juice citrus fresh daily. Lime loses its brightness within hours.",
          "A Y-peeler cuts wide twists fast. Take the zest, not the bitter white pith.",
          "A channel knife cuts long, thin spirals.",
          "Cut on a board, never in your hand, and keep the knife sharp.",
        ]),
        warning(
          "Knife safety",
          "A dull knife is the dangerous one: it slips. Cut away from your body, curl your fingertips under on the hand holding the fruit, and never leave a knife in the sink where someone can't see it.",
        ),
        ask(
          "What part of the citrus peel do you want in a twist?",
          "The colored zest, with as little white pith as possible",
          ["The white pith", "The whole peel with some flesh", "Only the seeds and flesh"],
          "The zest holds the aromatic oils. The pith underneath is bitter.",
        ),
        ask(
          "How long is fresh lime juice at its best?",
          "Within the same day",
          ["About a week", "About a month refrigerated", "Indefinitely if refrigerated"],
          "Lime juice changes flavor within hours. Juice what you need for the shift and keep it cold.",
        ),
      ],
    },
    {
      id: "tools-review",
      title: "Tools review",
      summary: "Check you can pick the right tool for the job.",
      blocks: [
        text(
          "Before moving on, make sure you can pick the right tool for each job without thinking.",
        ),
        ask(
          "You're making a Manhattan. Which pair of tools do you reach for?",
          "Mixing glass and barspoon",
          [
            "Boston shaker and Hawthorne strainer",
            "Muddler and highball glass",
            "Blender and ice scoop",
          ],
          "A Manhattan is all spirit and vermouth, so it's stirred in a mixing glass and strained with a julep strainer.",
        ),
        ask(
          "You're making a Whiskey Sour. Which strainer goes over the tin?",
          "Hawthorne strainer",
          ["Julep strainer", "No strainer", "A coffee filter"],
          "Shaken drinks are strained with a Hawthorne, which is made to fit over a shaker tin.",
        ),
        ask(
          "A guest's Mojito needs the mint pressed. Which tool?",
          "Muddler",
          ["Barspoon", "Channel knife", "Citrus press"],
          "The muddler presses mint and sugar gently in the glass to release the oils.",
        ),
        ask(
          "Which tool cuts the long spiral of peel on a Horse's Neck?",
          "Channel knife",
          ["Y-peeler", "Muddler", "Fine strainer"],
          "A channel knife cuts a long, thin continuous spiral. A Y-peeler cuts wide, short twists.",
        ),
        ask(
          "Which is the only thing that should touch the ice in the ice well?",
          "The ice scoop",
          ["A clean glass", "A jigger", "A clean hand"],
          "Scooping with a glass risks chipping it into the ice, and hands contaminate it. Only the scoop goes in.",
        ),
      ],
    },
  ],
};
