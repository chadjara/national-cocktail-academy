import { ask, points, text, tip } from "../helpers";
import type { CourseInput } from "../schema";

/**
 * Spirits & Products. Facts here are legal definitions (mostly the US federal
 * standards of identity, plus the Mexican, Scottish, Irish and French rules
 * for their own spirits) or knowledge every reference agrees on. Anything that
 * varies by brand or bar is said to vary.
 */
export const spirits: CourseInput = {
  id: "spirits",
  group: "foundations",
  title: "Spirits & Products",
  summary:
    "What's in the bottles: how spirits are made, what legally makes a bourbon or a tequila, and the liqueurs, vermouths and bitters behind every classic.",
  icon: { kind: "glass", glass: "rocks" },
  lessons: [
    {
      id: "how-spirits-are-made",
      title: "How spirits are made",
      summary: "Fermentation, distillation, aging, and what proof means.",
      blocks: [
        text(
          "Every spirit starts as something sweet or starchy: grain, sugarcane, agave, grapes, apples. Yeast ferments the sugar into a low-alcohol wash, like a rough beer or wine. Distillation then heats that wash and collects the alcohol vapor, which boils at a lower temperature than water, to make a much stronger spirit.",
          "What happens next shapes the flavor. Some spirits are bottled unaged and clear. Others rest in wooden barrels, usually oak, which adds color and flavors like vanilla, caramel and spice.",
        ),
        points(
          [
            "Pot stills distill one batch at a time and keep more of the base ingredient's flavor.",
            "Column stills run continuously and can reach a higher proof, giving a lighter spirit.",
            "Proof is twice the alcohol by volume (ABV) in the US: 80 proof is 40% ABV.",
            "Most spirits sold in the US must be bottled at 80 proof or more.",
          ],
          "The basics",
        ),
        ask(
          "A bottle is labeled 100 proof. What is its ABV?",
          "50%",
          ["100%", "40%", "25%"],
          "In the US, proof is twice the ABV, so 100 proof is 50% alcohol by volume.",
        ),
        ask(
          "What does a barrel add to a spirit?",
          "Color and flavors like vanilla, caramel and spice",
          ["Alcohol", "Sugar for fermentation", "Carbonation"],
          "Unaged spirits are clear. Time in oak adds color and flavor, and softens the spirit.",
        ),
      ],
    },
    {
      id: "vodka-and-gin",
      title: "Vodka and gin",
      summary: "The neutral spirit, and the one that must taste of juniper.",
      blocks: [
        text(
          "Vodka is a neutral spirit: distilled to a very high proof so that little of the base ingredient's flavor remains. It can be made from anything fermentable, most often grain or potatoes, and sometimes grapes. Brands differ in texture and subtle flavor.",
          "Gin starts as a neutral spirit too, flavored with botanicals. By law in the US, juniper must be its main flavor. Beyond juniper, every gin chooses its own: citrus peel, coriander, angelica, orris and many more.",
        ),
        points(
          [
            "London dry: a style, not a place. Botanicals are added by redistillation, and no flavoring is added afterward.",
            "Old Tom: a slightly sweeter style, used in the Tom Collins and Martinez.",
            "Contemporary gins: juniper still leads, but other botanicals are more forward.",
          ],
          "Gin styles you'll see behind the bar",
        ),
        ask(
          "What flavor must lead in a gin?",
          "Juniper",
          ["Citrus", "Anise", "Vanilla"],
          "Juniper is the defining flavor of gin. Other botanicals vary by brand.",
        ),
        ask(
          "Where must London dry gin be made?",
          "Anywhere; it's a style, not a place",
          ["Only in London", "Only in England", "Only in the United Kingdom"],
          "London dry describes how the gin is made: botanicals by redistillation and nothing added afterward. It can be made anywhere.",
        ),
      ],
    },
    {
      id: "rum",
      title: "Rum",
      summary: "Sugarcane spirits, from white rum to rhum agricole.",
      blocks: [
        text(
          "Rum is distilled from sugarcane products: most often molasses, sometimes fresh cane juice or cane syrup. It's made all over the world, and rules for aging and labeling vary from country to country, so the label is a guide rather than a guarantee of style.",
        ),
        points(
          [
            "White rum: unaged or lightly aged, then often filtered clear. The Daiquiri and Mojito rum.",
            "Gold and aged rums: time in oak adds color and depth.",
            "Dark and black rums: rich, often with added caramel or molasses. The Dark 'n' Stormy rum.",
            "Rhum agricole: made from fresh cane juice, grassy and bright. Associated with Martinique.",
            "Cachaça: Brazil's cane-juice spirit, the base of the Caipirinha.",
          ],
          "Styles behind the bar",
        ),
        tip(
          "Follow the spec",
          "Tiki drinks often call for a specific style, like Jamaican or demerara rum, because each tastes different. Swapping one rum for another changes the drink.",
        ),
        ask(
          "What is rum distilled from?",
          "Sugarcane products, such as molasses or cane juice",
          ["Agave", "Malted barley", "Grapes"],
          "All rum comes from sugarcane: most from molasses, some from fresh juice or syrup.",
        ),
        ask(
          "What makes rhum agricole different?",
          "It's made from fresh sugarcane juice instead of molasses",
          [
            "It's aged at least ten years",
            "It's flavored with spices",
            "It's made from beet sugar",
          ],
          "Rhum agricole is distilled from fresh cane juice, which gives it a grassy, vegetal character.",
        ),
      ],
    },
    {
      id: "tequila-and-mezcal",
      title: "Tequila and mezcal",
      summary: "Agave spirits, the 100% agave label, and the aging classes.",
      blocks: [
        text(
          "Tequila is made from blue Weber agave, in Jalisco and designated areas of a few other Mexican states. Mezcal is the wider family of agave spirits: it can be made from many species of agave, and the hearts are traditionally roasted in earthen pits, which gives many mezcals their smoky character.",
          'Read the label. "100% agave" means all the sugar came from agave. Tequila without that statement, often called mixto, needs only 51% agave sugars; the rest can come from other sugars.',
        ),
        points(
          [
            "Blanco (silver): unaged or rested less than two months.",
            "Reposado: aged in oak at least two months and less than a year.",
            "Añejo: aged in oak at least one year and less than three.",
            "Extra añejo: aged in oak at least three years.",
          ],
          "Tequila aging classes",
        ),
        ask(
          'What does "100% agave" on a tequila label mean?',
          "All of the sugar came from agave",
          ["It's aged 100 days", "It's 100 proof", "It's made from 100 agave plants"],
          "100% agave tequila is fermented only from agave sugars. Mixto can include up to 49% other sugars.",
        ),
        ask(
          "How long is a reposado aged?",
          "At least two months and less than a year",
          ["Not at all", "At least three years", "Exactly one year"],
          "Reposado means rested: two to twelve months in oak.",
        ),
        ask(
          "What gives many mezcals their smoky flavor?",
          "Roasting the agave in earthen pits",
          ["Adding liquid smoke", "Aging in charred barrels", "Distilling over a wood fire"],
          "Traditional mezcal roasts the agave hearts in pits fired with wood, and the smoke carries into the spirit.",
        ),
      ],
    },
    {
      id: "american-whiskey",
      title: "American whiskey",
      summary: "What legally makes a bourbon, a straight whiskey and a rye.",
      blocks: [
        text(
          "Whiskey is distilled from a fermented mash of grain and usually aged in wood. American whiskey styles are defined by federal law, and bourbon has the best-known rules.",
        ),
        points(
          [
            "Made in the United States.",
            "Made from a mash of at least 51% corn.",
            "Distilled to no more than 160 proof.",
            "Aged in new, charred oak containers, entering at no more than 125 proof.",
            "Bottled at 80 proof or more.",
            "Nothing added but water to bring it to strength: no coloring or flavoring.",
          ],
          "To be called bourbon",
        ),
        points(
          [
            'Bourbon has no minimum aging time. "Straight" bourbon must be aged at least two years.',
            "Rye whiskey follows the same rules with at least 51% rye instead of corn. It's usually spicier and drier.",
            "Tennessee whiskey is filtered through maple charcoal before aging, under Tennessee law.",
          ],
          "Related styles",
        ),
        tip(
          "Kentucky isn't required",
          "Most bourbon is made in Kentucky, but bourbon can be made anywhere in the US.",
        ),
        ask(
          "What must a bourbon's mash be made of?",
          "At least 51% corn",
          ["At least 51% rye", "100% malted barley", "Any grain at all"],
          "Bourbon's mash must be at least 51% corn. Rye whiskey's must be at least 51% rye.",
        ),
        ask(
          "What must bourbon be aged in?",
          "New, charred oak containers",
          ["Used wine barrels", "Stainless steel tanks", "Any wooden barrel"],
          "Bourbon is aged in new charred oak, which is why used bourbon barrels go on to age Scotch, rum and tequila.",
        ),
        ask(
          "Does bourbon have to be made in Kentucky?",
          "No, anywhere in the United States",
          ["Yes, only in Kentucky", "Only in Kentucky or Tennessee", "Only in the South"],
          "Bourbon must be made in the US. Most of it comes from Kentucky, but that's not required.",
        ),
      ],
    },
    {
      id: "scotch-and-irish",
      title: "Scotch and Irish whiskey",
      summary: "Single malts, blends, peat, and the three-year rule.",
      blocks: [
        text(
          "Scotch whisky must be made and aged in Scotland, for at least three years in oak casks. Irish whiskey must be made and aged on the island of Ireland, also for at least three years. Scotland usually spells it whisky; Ireland and the US usually spell it whiskey.",
        ),
        points(
          [
            "Single malt Scotch: 100% malted barley, distilled in pot stills at a single distillery.",
            "Blended Scotch: a blend of malt whiskies and grain whiskies. Most Scotch sold is blended.",
            "Peated whisky: barley dried over peat smoke. Islay single malts are known for it.",
          ],
          "Scotch on the back bar",
        ),
        tip(
          "Blends are for mixing; peat is a seasoning",
          "Specs like the Rusty Nail and Penicillin call for blended Scotch as the base. The Penicillin then floats a little peated Islay Scotch on top for smoke.",
        ),
        ask(
          "What's the minimum age for Scotch whisky?",
          "Three years in oak",
          ["No minimum", "Two years", "Ten years"],
          "Scotch must be aged at least three years in oak casks in Scotland. Irish whiskey has the same minimum.",
        ),
        ask(
          "What makes a Scotch a single malt?",
          "100% malted barley, from one distillery",
          [
            "It's from one barrel",
            "It's aged a single year",
            "It's made from a single grain of any kind",
          ],
          "Single malt means only malted barley, distilled in pot stills, all at one distillery. It can blend many barrels from that distillery.",
        ),
        ask(
          "Where does the smoky flavor in a peated whisky come from?",
          "Barley dried over peat smoke",
          ["Charred barrels", "Added smoke flavoring", "A long aging time"],
          "Peat smoke from drying the malted barley carries into the whisky. Islay is the region best known for it.",
        ),
      ],
    },
    {
      id: "brandy",
      title: "Brandy",
      summary: "Spirits from fruit: Cognac, Calvados, pisco and more.",
      blocks: [
        text(
          "Brandy is distilled from fermented fruit, most often grapes. Cognac, from the region around the town of Cognac in France, is the best known, and it's labeled by its minimum age.",
        ),
        points(
          [
            "VS: aged at least two years.",
            "VSOP: aged at least four years.",
            "XO: aged at least ten years.",
          ],
          "Cognac age labels",
        ),
        points(
          [
            "Armagnac: another French grape brandy, from Gascony.",
            "Calvados: apple (and pear) brandy from Normandy.",
            "Applejack: American apple brandy, used in the Jack Rose.",
            "Pisco: grape brandy from Peru and Chile, the base of the Pisco Sour.",
            "Grappa: made in Italy from pomace, the skins and seeds left after winemaking.",
          ],
          "Other brandies",
        ),
        ask(
          "Which Cognac label means the youngest spirit?",
          "VS",
          ["VSOP", "XO", "Hors d'âge"],
          "VS is aged at least two years, VSOP at least four, and XO at least ten.",
        ),
        ask(
          "What is Calvados made from?",
          "Apples, and sometimes pears",
          ["Grapes", "Sugarcane", "Plums"],
          "Calvados is the apple brandy of Normandy, and it may include pears.",
        ),
      ],
    },
    {
      id: "liqueurs-vermouth-bitters",
      title: "Liqueurs, vermouth, amari and bitters",
      summary: "The modifiers that turn a spirit into a cocktail.",
      blocks: [
        text(
          "Most classic cocktails are a base spirit plus a modifier. Knowing what each modifier is tells you how it will behave in a drink.",
        ),
        points(
          [
            "Liqueur: a spirit sweetened and flavored with fruit, herbs, spices or nuts. Triple sec, maraschino, Chartreuse, coffee liqueur.",
            "Vermouth: a wine flavored with botanicals and fortified with spirit. Dry (white) vermouth goes in a Martini; sweet (red) vermouth in a Manhattan or Negroni.",
            "Amaro: Italian for bitter. Bitter herbal liqueurs such as Campari, Aperol, Fernet-Branca and Amaro Nonino.",
            "Cocktail bitters: highly concentrated, used in dashes to season a drink. Angostura, Peychaud's, orange bitters.",
          ],
          "The modifiers",
        ),
        tip(
          "Vermouth is wine",
          "Once opened, vermouth oxidizes like any wine. Keep it in the refrigerator and use it within a few weeks.",
        ),
        ask(
          "What is vermouth?",
          "A fortified wine flavored with botanicals",
          ["A whiskey liqueur", "A type of gin", "A bitter made from roots"],
          "Vermouth is wine, fortified with spirit and flavored with herbs and spices. That's why it belongs in the fridge once opened.",
        ),
        ask(
          "How are cocktail bitters like Angostura used?",
          "A few dashes, to season the drink",
          ["As the base spirit", "Poured by the ounce", "Only as a garnish spray"],
          "Bitters are very concentrated. A dash or two adds depth the way salt and pepper season food.",
        ),
        ask(
          "Which of these is a liqueur?",
          "Triple sec",
          ["Rye whiskey", "Dry vermouth", "London dry gin"],
          "Triple sec is an orange liqueur: a spirit that's been sweetened and flavored.",
        ),
      ],
    },
    {
      id: "spirits-review",
      title: "Spirits review",
      summary: "Check you can tell what's in the bottle.",
      blocks: [
        text("One question on each part of the course."),
        ask(
          "A guest asks what makes their drink a bourbon and not just whiskey. Which is part of the answer?",
          "It's at least 51% corn and aged in new charred oak",
          ["It's made in Kentucky", "It's aged at least ten years", "It's made from malted barley"],
          "Bourbon is made in the US from at least 51% corn and aged in new charred oak. Kentucky is common but not required.",
        ),
        ask(
          "Which tequila has been aged the longest?",
          "Añejo",
          ["Blanco", "Reposado"],
          "Añejo is aged one to three years. Reposado is two to twelve months, and blanco is unaged or rested briefly.",
        ),
        ask(
          "Which spirit is defined by juniper?",
          "Gin",
          ["Vodka", "Rum", "Pisco"],
          "Juniper must be gin's leading flavor.",
        ),
        ask(
          "Which Cognac has been aged at least ten years?",
          "XO",
          ["VS", "VSOP", "Every Cognac"],
          "XO is aged at least ten years; VSOP at least four; VS at least two.",
        ),
        ask(
          "What's the base of a Caipirinha, and what's it made from?",
          "Cachaça, from fresh sugarcane juice",
          ["Rum, from molasses", "Pisco, from grapes", "Mezcal, from agave"],
          "Cachaça is Brazil's sugarcane-juice spirit.",
        ),
      ],
    },
  ],
};
