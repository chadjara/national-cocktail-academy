import { ask, points, steps, text, tip, warning } from "../helpers";
import type { CourseInput } from "../schema";

export const technique: CourseInput = {
  id: "technique",
  group: "foundations",
  title: "Technique",
  summary:
    "Build order, shaking, stirring, building, muddling, straining and finishing: the moves behind every drink, and when to use each.",
  icon: { kind: "tool", tool: "boston-shaker" },
  lessons: [
    {
      id: "build-order",
      title: "Build order",
      summary: "Ice, then the spirit, then everything else, the same way on every drink.",
      blocks: [
        text(
          "Most bars build drinks starting with ice and the spirit. Fill the glass or tin with ice, pour the base spirit, then add the modifiers, juices and syrups. Then shake, stir or top it. It's fast, it keeps everything cold from the first pour, and the most important ingredient never gets forgotten.",
          "The exact order varies from bar to bar, so learn your house way. What matters is that you build every drink the same way, every time. That's how you avoid missing an ingredient or pouring one twice when the bar is busy.",
        ),
        steps("A typical build", [
          "Ice in the glass or shaker tin.",
          "The base spirit.",
          "Liqueurs and modifiers, like vermouth or triple sec.",
          "Juices, syrups and dashes of bitters.",
          "Shake or stir and strain, or top with the mixer for a built drink.",
        ]),
        tip(
          "Several drinks at once",
          "Ice all the glasses or tins first. Then pour the same ingredient into each one before moving on to the next, so every drink in the round gets the same build.",
        ),
        ask(
          "In most bars, what goes into a highball glass first?",
          "Ice",
          ["The mixer", "The garnish", "Nothing; the glass is filled at the end"],
          "Ice first, then the spirit, then the mixer. A glass full of ice keeps the drink cold from the first pour.",
        ),
        ask(
          "Why build every drink in the same order?",
          "So nothing gets missed or poured twice",
          ["It's required by law", "It makes the drink stronger", "It uses less ice"],
          "A consistent build is a habit your hands follow even when you're busy, so every ingredient goes in once.",
        ),
      ],
    },
    {
      id: "shaking",
      title: "Shaking",
      summary: "When to shake, how hard and how long, and the dry shake for egg white.",
      blocks: [
        text(
          "Shaking is violent on purpose. It chills fast, adds water, and whips air into the drink, giving it a lively, frothy texture. That's right for drinks with citrus, juice, dairy, egg or other ingredients that need to be fully mixed.",
          "The bartender's rule: if a drink has citrus, juice, cream or egg, shake it. If it is all spirits, liqueurs, vermouth and bitters, stir it.",
        ),
        steps("A good shake", [
          "Fill the tin with plenty of ice, about two-thirds full or more.",
          "Seal it and shake hard, so the ice travels the full length of the tin.",
          "Shake for about 10 to 15 seconds, until the outside of the tin is frosty and painfully cold.",
          "Open and strain right away; don't let it sit on the ice.",
        ]),
        points(
          [
            "Dry shake: shake without ice first, then add ice and shake again. Whips egg white into a thick foam.",
            "Reverse dry shake: shake with ice, strain out the ice, then shake again without it. Many bartenders find it gives a better foam.",
          ],
          "Egg white drinks",
        ),
        warning(
          "Raw egg",
          "Use fresh, pasteurized egg white where you can. Many bars tell guests when a drink contains raw egg.",
        ),
        ask(
          "A drink contains lime juice and simple syrup. Shake or stir?",
          "Shake",
          ["Stir", "Build in the glass", "Blend"],
          "Citrus drinks are shaken to mix them fully and give them a lively texture.",
        ),
        ask(
          "What is a dry shake?",
          "Shaking without ice to whip egg white into a foam",
          ["Shaking with crushed ice", "Shaking an empty tin to chill it", "Stirring without ice"],
          "Egg white foams best without ice in the tin. Dry shake first, then shake again with ice to chill.",
        ),
      ],
    },
    {
      id: "stirring",
      title: "Stirring",
      summary: "Why spirit-forward drinks are stirred, and what good dilution looks like.",
      blocks: [
        text(
          "Stirring chills and dilutes a drink gently without adding air. The result is clear, silky and heavy on the tongue, which is exactly what a Martini or Manhattan should be. Shake one and it turns cloudy, thin and full of ice chips.",
        ),
        steps("Stirring a drink", [
          "Fill a mixing glass about two-thirds with fresh, dry ice, then add the ingredients.",
          "Stir smoothly for 20 to 30 seconds. Listen: a good stir is nearly silent.",
          "Taste with a straw: it should be cold and smooth, not hot with alcohol, and not watery.",
          "Strain with a julep strainer into a chilled glass.",
        ]),
        ask(
          "Why is a Manhattan stirred, not shaken?",
          "Stirring keeps it clear and silky, without air bubbles",
          ["Shaking makes it too sweet", "Stirring makes it colder", "It's faster to stir"],
          "All-spirit drinks are stirred for a clear, silky texture. Shaking clouds them with tiny bubbles and ice chips.",
        ),
        ask(
          "About how long do you stir a drink with cubed ice?",
          "20 to 30 seconds",
          ["3 to 5 seconds", "2 minutes", "Until the ice is fully melted"],
          "Stirring is gentler than shaking, so it takes longer to chill and dilute properly.",
        ),
      ],
    },
    {
      id: "building",
      title: "Building",
      summary: "Making a drink directly in the glass, and keeping the bubbles in a highball.",
      blocks: [
        text(
          "Built drinks are made straight in the glass they're served in. It's the fastest method and suits highballs, simple duos and drinks topped with something sparkling.",
        ),
        steps("Building a highball", [
          "Fill the glass to the top with fresh ice. More ice melts slower, not faster.",
          "Pour the spirit.",
          "Top with the mixer, poured gently down the inside of the glass or a barspoon to keep the bubbles.",
          "Give one gentle lift with a barspoon from the bottom. Don't stir hard; it knocks the fizz out.",
          "Garnish and serve.",
        ]),
        tip(
          "Full glass of ice",
          "A glass full of ice stays cold, so the ice melts slowly. A few cubes in a warm glass melt fast and water the drink down.",
        ),
        ask(
          "How should you mix a Gin & Tonic once the tonic is in?",
          "One gentle lift with a barspoon",
          ["Stir hard for 20 seconds", "Shake it in a tin", "Don't mix it at all"],
          "Gentle mixing keeps the carbonation. Hard stirring knocks out the bubbles.",
        ),
        ask(
          "Why fill a highball glass to the top with ice?",
          "More ice keeps the drink colder and melts more slowly",
          ["So you can use less mixer", "So the glass doesn't tip over", "To make it look bigger"],
          "A full glass of ice chills itself and melts slowly. A half-full glass dilutes faster.",
        ),
      ],
    },
    {
      id: "muddling",
      title: "Muddling",
      summary: "Releasing juice and oils from fruit and herbs without bitterness.",
      blocks: [
        text(
          "Muddling presses fruit, herbs or sugar to release juice and oils into the drink. How hard you press depends on what you're muddling.",
        ),
        points([
          "Herbs (Mojito, Mint Julep): press gently a few times. The goal is aroma, not a paste.",
          "Citrus with sugar (Caipirinha): press firmly to release the juice, and the sugar scrapes oil from the peel.",
          "Fruit (Whiskey Smash, Gin Basil Smash): press until the juice runs, then shake and double strain.",
        ]),
        steps("Muddling a Mojito", [
          "Put the mint and sugar in the bottom of the glass.",
          "Add the lime juice, then press the mint gently with the muddler, twisting a little.",
          "Add the rum and ice, then top with soda.",
        ]),
        ask(
          "Which drink needs firm muddling of lime and sugar?",
          "Caipirinha",
          ["Mojito", "Mint Julep", "Gin & Tonic"],
          "A Caipirinha muddles lime wedges hard with sugar to release both the juice and the oils from the peel.",
        ),
      ],
    },
    {
      id: "straining-and-finishing",
      title: "Straining and finishing",
      summary: "Double straining, floats, layers, toppers and rinses.",
      blocks: [
        text(
          "The last few seconds of a drink are often what guests remember. These finishing techniques show up throughout the family courses.",
        ),
        points(
          [
            "Double strain: Hawthorne plus a fine strainer, for smooth drinks without ice chips or herb bits.",
            "Top: add soda or sparkling wine last, after straining, so it stays fizzy.",
            "Float: pour a small amount gently over the back of a barspoon so it sits on top (Dark 'n' Stormy, Penicillin, Irish Coffee cream).",
            "Layer: pour heavier ingredients first so they settle into bands (Tequila Sunrise).",
            "Rinse: coat the inside of the glass with a strong spirit and pour out the excess (Sazerac with absinthe).",
          ],
          "Finishing techniques",
        ),
        ask(
          "How do you float dark rum on a Dark 'n' Stormy?",
          "Pour it slowly over the back of a barspoon onto the top",
          [
            "Shake it in with the ginger beer",
            "Pour it in first, under the ice",
            "Stir it in well",
          ],
          "Pouring gently over a spoon spreads the rum across the top so it sits on the ginger beer.",
        ),
        ask(
          "What does it mean to rinse a glass with absinthe?",
          "Coat the inside with absinthe and pour out the excess",
          [
            "Wash the glass with water after use",
            "Fill the glass with absinthe and serve",
            "Add absinthe at the end as a float",
          ],
          "A rinse leaves just a film of the spirit for aroma. It's how the Sazerac gets its absinthe.",
        ),
      ],
    },
    {
      id: "dilution-and-temperature",
      title: "Dilution and temperature",
      summary: "Water from ice is an ingredient. Learn to taste when a drink is ready.",
      blocks: [
        text(
          "Every cold cocktail is part water. As you shake or stir, melting ice adds water that softens the alcohol and opens up the flavors. A shaken sour typically gains around a quarter to a third of its volume in water; a stirred drink a little less. Too little and the drink is hot and harsh. Too much and it's thin.",
          "That's why measuring the time you shake or stir matters as much as measuring the ingredients. It's also why you use fresh, dry ice, and why you serve the drink the moment it's done.",
        ),
        points([
          "Shake: about 10 to 15 seconds, colder and more diluted, with air.",
          "Stir: about 20 to 30 seconds, gentler, silky, no air.",
          "Blend and swizzle: lots of crushed ice, very cold, very diluted. For strong tropical drinks.",
          "Taste every drink with a straw before it goes out.",
        ]),
        ask(
          "A stirred Manhattan tastes hot and harsh. What happened?",
          "It wasn't stirred long enough, so it's under-diluted",
          ["It was stirred too long", "It needed more vermouth", "The glass was too cold"],
          "Too little dilution leaves the alcohol harsh. Stir longer next time.",
        ),
      ],
    },
    {
      id: "method-drill",
      title: "Method drill",
      summary: "Shake, stir, build, blend or swizzle? Pick the right method for classic drinks.",
      blocks: [
        text(
          "Think about what's in the drink. Citrus, juice, cream or egg means shake. All spirits means stir, or build it over ice in the glass.",
        ),
        {
          kind: "drill",
          cocktailIds: [
            "daiquiri",
            "dry-martini",
            "gin-and-tonic",
            "whiskey-sour",
            "manhattan",
            "pina-colada",
            "cosmopolitan",
            "negroni",
            "queens-park-swizzle",
            "old-fashioned",
            "moscow-mule",
            "espresso-martini",
          ],
          facets: ["method"],
          mode: "rotate",
        },
      ],
    },
  ],
};
