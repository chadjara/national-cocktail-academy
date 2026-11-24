import { ask, points, text, tip, warning } from "../helpers";
import type { CourseInput } from "../schema";
import { familyCourse } from "./family-course";

export const sours: CourseInput = familyCourse({
  id: "sours",
  title: "Sours",
  summary:
    "The most important family in bartending: spirit, citrus and sugar in balance. Master it and you can make hundreds of drinks.",
  icon: { kind: "glass", glass: "coupe" },
  family: "sour",
  intro: {
    id: "the-sour-template",
    title: "The sour template",
    summary: "Strong, sour and sweet: the balance behind the Daiquiri, Margarita and Whiskey Sour.",
    blocks: [
      text(
        "A sour is a spirit balanced with citrus and something sweet. That's it. The Daiquiri is rum, lime and sugar. The Whiskey Sour is whiskey, lemon and sugar. Learn the balance once and you can make a sour from any spirit on the back bar.",
        "A reliable starting point is 2 oz of spirit, ¾ oz of citrus and ¾ oz of simple syrup. Taste, then adjust. The classic specs in this course move away from that template on purpose, and each lesson shows you how.",
      ),
      points(
        [
          "Shaken hard, because citrus needs to be fully mixed and aerated.",
          "Served up in a chilled coupe or cocktail glass, or on the rocks with fresh ice.",
          "Lemon usually pairs with whiskey and brandy; lime with rum, tequila and often gin.",
          "When the sweetener is an orange liqueur, like in a Margarita or Sidecar, the sour is called a daisy.",
          "Some sours add egg white for a silky foam. They're dry shaken first.",
        ],
        "What sours have in common",
      ),
      tip(
        "Taste your citrus",
        "Limes and lemons vary from week to week. If the drink is too sharp, add a little syrup; if it's cloying, a little citrus. Measuring precisely is what lets you make that adjustment on purpose.",
      ),
      ask(
        "What three things make up a sour?",
        "Spirit, citrus and something sweet",
        ["Spirit, vermouth and bitters", "Spirit, soda and ice", "Spirit, cream and sugar"],
        "Spirit, citrus and sweetener in balance is the whole sour family.",
      ),
      ask(
        "A sour that uses orange liqueur as its sweetener is called…",
        "A daisy",
        ["A fizz", "A smash", "A highball"],
        "Margarita is Spanish for daisy. The Sidecar and Cosmopolitan follow the same pattern.",
      ),
      ask(
        "How are sours mixed?",
        "Shaken with ice",
        ["Stirred with ice", "Built in the glass", "Blended"],
        "Citrus drinks are shaken to mix, chill and aerate them.",
      ),
    ],
  },
  drinks: [
    {
      id: "daiquiri",
      focus:
        "The purest sour: rum, lime and sugar. Bartenders often judge a new colleague by their Daiquiri, because there's nothing to hide behind.",
    },
    {
      id: "margarita",
      focus:
        "A tequila daisy: tequila, orange liqueur and lime. Ask every guest whether they want salt, and salt only half the rim.",
    },
    {
      id: "whiskey-sour",
      focus:
        "Bourbon, lemon, sugar and egg white. Dry shake for a thick, silky foam, then shake again with ice and strain over fresh ice.",
    },
    {
      id: "sidecar",
      focus:
        "The brandy daisy: Cognac, orange liqueur and lemon, served up. Equal-ish parts make it tart and bracing.",
    },
    {
      id: "gimlet",
      focus:
        "Gin, lime and sugar. Equal citrus and syrup keep it bright, and a lime wheel finishes it.",
    },
    {
      id: "cosmopolitan",
      focus:
        "Citrus vodka, orange liqueur, lime and cranberry. The cranberry is there for color and a little tartness, not to make it a juice.",
    },
    {
      id: "pisco-sour",
      focus:
        "Pisco, lemon, sugar and egg white, dry shaken. A few drops of Angostura on the foam add aroma and color.",
    },
    {
      id: "last-word",
      focus:
        "A rare equal-parts sour: gin, green Chartreuse, maraschino and lime. The liqueurs do the sweetening.",
    },
  ],
});

export const martinisAndManhattans: CourseInput = familyCourse({
  id: "martinis-and-manhattans",
  title: "Martinis & Manhattans",
  summary:
    "Stirred, spirit-forward drinks built on vermouth: the Martini, the Manhattan and the Negroni family. Judged on balance and dilution.",
  icon: { kind: "glass", glass: "cocktail" },
  family: "spirit-forward",
  intro: {
    id: "stirred-and-spirit-forward",
    title: "Stirred and spirit-forward",
    summary: "Spirit plus vermouth, stirred to a silky chill.",
    blocks: [
      text(
        "This family is a base spirit softened with an aromatized wine, usually vermouth, sometimes with a dash of bitters or a bitter liqueur like Campari. There's no citrus juice, so they're stirred, not shaken, and served clear, cold and silky.",
        "Two vermouths matter most. Dry vermouth is pale and crisp and goes in a Martini. Sweet vermouth is red and rich and goes in a Manhattan and a Negroni. Vermouth is wine: refrigerate it after opening and use it within a few weeks, or it turns stale.",
      ),
      points(
        [
          "Stirred with ice in a mixing glass, then strained with a julep strainer.",
          "Usually served up in a chilled cocktail glass or coupe.",
          "The Negroni is often built over ice in a rocks glass instead.",
          "Garnished with a citrus twist, an olive or a cherry.",
        ],
        "What this family has in common",
      ),
      warning(
        "Store vermouth cold",
        "An opened bottle of vermouth left on the back bar oxidizes within weeks and tastes flat and sour. Keep it in the refrigerator.",
      ),
      ask(
        "Why are Martinis and Manhattans stirred?",
        "They contain no citrus, so stirring keeps them clear and silky",
        [
          "Shaking would make them too cold",
          "Stirring makes them sweeter",
          "They have egg white in them",
        ],
        "Drinks of only spirits and wines are stirred for a clear, silky texture.",
      ),
      ask(
        "Which vermouth goes in a classic Manhattan?",
        "Sweet (red) vermouth",
        ["Dry (white) vermouth", "No vermouth", "Either one, it doesn't matter"],
        "The Manhattan is rye or bourbon with sweet vermouth and Angostura bitters.",
      ),
      ask(
        "How should an opened bottle of vermouth be stored?",
        "In the refrigerator",
        ["On the back bar", "In the ice well", "In a warm, dark cabinet"],
        "Vermouth is a wine and oxidizes once opened. Cold slows that down.",
      ),
    ],
  },
  drinks: [
    {
      id: "dry-martini",
      focus:
        "Gin and dry vermouth, stirred and served very cold. Always ask: gin or vodka, olive or twist? 'Dry' means less vermouth.",
    },
    {
      id: "manhattan",
      focus:
        "Rye, sweet vermouth and Angostura, stirred and served up with a cherry. A bourbon Manhattan is common too; ask.",
    },
    {
      id: "negroni",
      focus:
        "Equal parts gin, Campari and sweet vermouth, built over ice with an orange slice. Bitter, sweet and strong.",
    },
    {
      id: "boulevardier",
      focus:
        "A Negroni with bourbon in place of gin, here with a little more whiskey. Served up with orange zest.",
    },
    {
      id: "martinez",
      focus:
        "The Martini's sweeter ancestor: gin, sweet vermouth, a touch of maraschino and orange bitters.",
    },
    {
      id: "vieux-carre",
      focus:
        "New Orleans in a glass: rye, Cognac, sweet vermouth, Bénédictine and Peychaud's bitters, stirred.",
    },
  ],
});

export const oldFashioneds: CourseInput = familyCourse({
  id: "old-fashioneds",
  title: "Old Fashioneds",
  summary:
    "Spirit, sugar, bitters and water: the original definition of a cocktail, and the family that shows off a good whiskey.",
  icon: { kind: "glass", glass: "rocks" },
  family: "old-fashioned",
  intro: {
    id: "the-original-cocktail",
    title: "The original cocktail",
    summary: "Spirit, sugar, bitters and water, and how the Old Fashioned got its name.",
    blocks: [
      text(
        "In the early 1800s a 'cocktail' meant one thing: spirit, sugar, water and bitters. As bartenders started adding liqueurs and other flourishes, guests who wanted the plain version asked for an old-fashioned cocktail. The name stuck.",
        "These drinks are almost all spirit, so the quality of the base matters. Sugar rounds off the edges, bitters season it like salt and pepper, and dilution from the ice opens it up.",
      ),
      points(
        [
          "Spirit, a little sugar, bitters, and dilution from ice.",
          "Built or stirred, never shaken.",
          "Served in a rocks glass, often over one large cube that melts slowly.",
          "Finished with a citrus twist, its oils expressed over the drink.",
        ],
        "What this family has in common",
      ),
      ask(
        "What are the four parts of the original cocktail?",
        "Spirit, sugar, water and bitters",
        [
          "Spirit, citrus, sugar and soda",
          "Spirit, vermouth, bitters and ice",
          "Spirit, cream, sugar and coffee",
        ],
        "The 1806 definition of a cocktail was spirit, sugar, water and bitters: the Old Fashioned.",
      ),
      ask(
        "Why serve an Old Fashioned over one large cube?",
        "It melts slowly, so the drink dilutes gradually",
        [
          "It makes the drink sweeter",
          "It's cheaper than cubed ice",
          "It keeps the garnish in place",
        ],
        "A large cube has less surface area for its size, so it chills without watering the drink down quickly.",
      ),
    ],
  },
  drinks: [
    {
      id: "old-fashioned",
      focus:
        "Bourbon, a sugar cube, Angostura and a splash of water. Dissolve the sugar first, then add the whiskey and ice.",
    },
    {
      id: "sazerac",
      focus:
        "New Orleans' signature drink: an absinthe rinse, then Cognac, sugar and Peychaud's, served without ice. Express the lemon and discard it.",
    },
    {
      id: "oaxaca-old-fashioned",
      focus:
        "A modern classic from Death & Co: reposado tequila and mezcal, agave syrup and bitters, finished with a flamed orange twist.",
    },
    {
      id: "toronto",
      focus:
        "Rye with a little Fernet-Branca, sugar and bitters. The Fernet adds a bitter, minty backbone. Served up.",
    },
  ],
});

export const highballs: CourseInput = familyCourse({
  id: "highballs",
  title: "Highballs",
  summary:
    "A spirit lengthened with a mixer over ice. The most-ordered drinks at any bar, and the easiest to do badly.",
  icon: { kind: "glass", glass: "highball" },
  family: "highball",
  intro: {
    id: "spirit-and-mixer",
    title: "Spirit and mixer",
    summary: "Built in the glass, cold and fizzy.",
    blocks: [
      text(
        "A highball is a spirit topped with a mixer over ice: Gin & Tonic, Rum & Coke, Vodka Soda. Because they're simple, guests notice when they're done badly: warm, flat or too strong.",
        "The ratio is usually one part spirit to two or three parts mixer. Build it in a chilled glass full of fresh ice, pour the mixer gently to keep the bubbles, and give it just one gentle lift with a spoon.",
      ),
      points(
        [
          "Built in the glass, not shaken.",
          "A tall glass filled to the top with fresh ice.",
          "Mixers cold, and opened fresh: flat tonic ruins a Gin & Tonic.",
          "A citrus wedge or wheel the guest can squeeze.",
        ],
        "What this family has in common",
      ),
      ask(
        "What's the usual ratio of spirit to mixer in a highball?",
        "About 1 part spirit to 2–3 parts mixer",
        [
          "Equal parts spirit and mixer",
          "3 parts spirit to 1 part mixer",
          "1 part spirit to 10 parts mixer",
        ],
        "Around one to two or three keeps the spirit present without overpowering the mixer.",
      ),
      ask(
        "How do you keep a highball fizzy?",
        "Use cold mixer, pour gently and stir only once",
        ["Shake it hard with ice", "Pour the mixer in first", "Use less ice"],
        "Carbonation escapes when mixers are warm or agitated. Cold, gentle and quick keeps the bubbles.",
      ),
    ],
  },
  drinks: [
    {
      id: "gin-and-tonic",
      focus:
        "Gin and tonic over plenty of ice with a lime wedge. Build it cold and fresh, and it's a different drink.",
    },
    {
      id: "cuba-libre",
      focus:
        "Rum and cola with fresh lime juice. The lime is what separates a Cuba Libre from a Rum & Coke.",
    },
    {
      id: "moscow-mule",
      focus:
        "Vodka, ginger beer and lime in a copper mug. The ginger beer should be spicy, not sweet.",
    },
    {
      id: "paloma",
      focus:
        "Mexico's favorite tequila highball: tequila, a little lime and a pinch of salt, topped with grapefruit soda.",
    },
    {
      id: "dark-n-stormy",
      focus:
        "Ginger beer with black rum floated on top for the 'storm cloud'. Pour the rum gently over a spoon so it sits on top.",
    },
    {
      id: "bloody-mary",
      focus:
        "Vodka, tomato, lemon and seasoning. Season to the guest's taste, and mix it gently so the tomato doesn't go thin and foamy.",
    },
    {
      id: "americano",
      focus:
        "Campari and sweet vermouth lengthened with soda: a lighter, lower-proof Negroni relative, served over ice.",
    },
  ],
});

export const fizzesAndCollinses: CourseInput = familyCourse({
  id: "fizzes-and-collinses",
  title: "Fizzes & Collinses",
  summary:
    "Sours lengthened with soda water: tall, bright and refreshing, from the Tom Collins to the Ramos Gin Fizz.",
  icon: { kind: "glass", glass: "collins" },
  family: "fizz-collins",
  intro: {
    id: "a-sour-with-soda",
    title: "A sour with soda",
    summary: "The difference between a fizz and a Collins.",
    blocks: [
      text(
        "Take a gin sour, add soda water and you have a fizz or a Collins. The two are cousins, and the difference is in the serve.",
      ),
      points(
        [
          "Fizz: shaken hard, strained into a smaller glass with no ice, then topped with a little soda. Drink it fast while it fizzes.",
          "Collins: built or shaken and served over ice in a tall Collins glass, with more soda. A long, slow drink.",
          "Both are topped with soda last, poured gently.",
        ],
        "Fizz or Collins?",
      ),
      ask(
        "What's the main difference between a fizz and a Collins?",
        "A fizz is served without ice in a smaller glass; a Collins is tall and over ice",
        ["A fizz uses lime and a Collins uses lemon", "A fizz is stirred", "A Collins has no soda"],
        "Same idea, different serve: the fizz is short and icy-cold with no ice; the Collins is long and on ice.",
      ),
      ask(
        "When is the soda added?",
        "Last, topped gently after the rest of the drink",
        [
          "First, before the spirit",
          "In the shaker with the ice",
          "It isn't added; it's a garnish",
        ],
        "Soda goes in last so it stays fizzy. Shaking it would blow the bubbles out.",
      ),
    ],
  },
  drinks: [
    {
      id: "gin-fizz",
      focus:
        "Gin, lemon and sugar shaken hard, strained with no ice and topped with soda. Serve it the moment it's made.",
    },
    {
      id: "john-collins",
      focus:
        "The tall, iced version: gin, lemon and sugar over ice, topped with soda. Made with Old Tom gin it's a Tom Collins.",
    },
    {
      id: "ramos-fizz",
      focus:
        "A New Orleans showpiece: gin, citrus, cream, egg white and orange flower water, shaken long and hard for a tall, stable foam.",
    },
  ],
});

export const julepsAndSmashes: CourseInput = familyCourse({
  id: "juleps-and-smashes",
  title: "Juleps & Smashes",
  summary:
    "Muddled mint, fruit and herbs, often over crushed ice. Fresh, aromatic and built for hot weather.",
  icon: { kind: "glass", glass: "julep-cup" },
  family: "julep-smash",
  intro: {
    id: "herbs-and-crushed-ice",
    title: "Herbs, fruit and crushed ice",
    summary: "Muddling gently and serving very cold.",
    blocks: [
      text(
        "Juleps and smashes get their flavor from fresh herbs and fruit pressed straight into the drink. The skill is in muddling: herbs gently for aroma, citrus firmly for juice and oil.",
        "Many are served over crushed ice, which chills them fast and frosts the glass. The garnish matters here too: a fresh mint sprig set right by the straw, so the guest smells it on every sip.",
      ),
      points(
        [
          "Muddle herbs gently; muddle citrus firmly.",
          "Crushed ice for juleps and the Caipirinha; double strain the shaken smashes.",
          "A big, fresh mint or herb sprig as garnish, slapped to wake it up.",
        ],
        "What this family has in common",
      ),
      ask(
        "Why should mint be muddled gently?",
        "Shredding it releases bitter flavors",
        ["It's expensive", "Gentle muddling adds more sugar", "It makes the drink stronger"],
        "Gentle pressure releases the aromatic oils. Tearing the leaves releases bitter, grassy notes.",
      ),
    ],
  },
  drinks: [
    {
      id: "mojito",
      focus:
        "Cuba's classic: mint, sugar and lime pressed gently, then rum, ice and a soda top. Keep the mint whole-ish, never shredded.",
    },
    {
      id: "mint-julep",
      focus:
        "The Kentucky Derby drink: bourbon, sugar and mint over a mound of crushed ice in a frosted metal cup.",
    },
    {
      id: "caipirinha",
      focus:
        "Brazil's national drink: lime wedges muddled firmly with sugar, then cachaça and crushed ice, all in the glass.",
    },
    {
      id: "whiskey-smash",
      focus:
        "Lemon and mint muddled with bourbon and sugar, shaken and double strained over crushed ice.",
    },
    {
      id: "gin-basil-smash",
      focus:
        "A modern classic from Hamburg: gin, lemon, sugar and a big handful of basil, muddled, shaken and double strained.",
    },
  ],
});

export const tiki: CourseInput = familyCourse({
  id: "tiki",
  title: "Tiki & Tropical",
  summary:
    "Layered rums, fresh citrus, spiced syrups and crushed ice. The most complex family to build, and the most fun to serve.",
  icon: { kind: "glass", glass: "hurricane" },
  family: "tiki-tropical",
  intro: {
    id: "the-tiki-formula",
    title: "The tiki formula",
    summary: "Many rums, fresh citrus, spiced syrups and plenty of ice.",
    blocks: [
      text(
        "Tiki began in 1930s California with Donn Beach and Trader Vic, who blended several rums with fresh citrus and house syrups to create drinks that tasted like an escape. The best tiki drinks are carefully balanced sours underneath all the theater.",
        "Expect specialty ingredients: orgeat (almond syrup), falernum (lime, ginger and clove), rich demerara syrup, and two or three different rums in one drink.",
      ),
      points(
        [
          "Several rums blended for depth.",
          "Fresh lime, plus spiced or nutty syrups.",
          "Shaken, blended or swizzled with lots of crushed ice.",
          "Generous garnishes: mint, pineapple, cherries.",
        ],
        "What this family has in common",
      ),
      warning(
        "Strong drinks in disguise",
        "Many tiki drinks hold two or three standard drinks of alcohol behind the fruit. Donn Beach famously limited guests to two Zombies. Keep track of what you serve.",
      ),
      ask(
        "What is orgeat?",
        "An almond syrup, often with orange flower water",
        ["A rum from Martinique", "A type of crushed ice", "A ginger beer"],
        "Orgeat is a sweet almond syrup and the backbone of the Mai Tai.",
      ),
    ],
  },
  drinks: [
    {
      id: "mai-tai",
      focus:
        "Trader Vic's masterpiece: two rums, orange curaçao, orgeat and lime over crushed ice, garnished with mint and the spent lime shell.",
    },
    {
      id: "pina-colada",
      focus:
        "Rum, coconut cream and pineapple, blended with ice until smooth. Puerto Rico's national drink.",
    },
    {
      id: "jungle-bird",
      focus:
        "A 1970s Kuala Lumpur classic: dark rum, Campari, pineapple, lime and demerara syrup. Bitter meets tropical.",
    },
    {
      id: "zombie",
      focus:
        "Donn Beach's legendary three-rum blend with lime, falernum, Donn's mix, grenadine and spice. Strong: serve with care.",
    },
    {
      id: "queens-park-swizzle",
      focus:
        "Demerara rum, lime, sugar and mint, swizzled over crushed ice until the glass frosts, with Angostura floated on top.",
    },
  ],
});

export const sparkling: CourseInput = familyCourse({
  id: "sparkling",
  title: "Sparkling & Wine",
  summary: "Drinks built on Champagne, Prosecco and wine: brunch classics and celebration drinks.",
  icon: { kind: "glass", glass: "flute" },
  family: "sparkling",
  intro: {
    id: "working-with-bubbles",
    title: "Working with bubbles",
    summary: "Keep the wine cold and pour it last.",
    blocks: [
      text(
        "Sparkling cocktails are about keeping the bubbles. Keep sparkling wine cold, open it carefully, and pour it last and gently, down the side of the glass.",
      ),
      points(
        [
          "Chill the wine and the glass. Warm wine foams over and goes flat.",
          "Pour sparkling wine last, gently, down the inside of the glass.",
          "Never shake sparkling wine. Shake the rest, strain, then top.",
          "Stir once at most, gently, if the recipe says so.",
        ],
        "Rules for bubbles",
      ),
      ask(
        "When does the sparkling wine go into a French 75?",
        "Last, topped over the shaken gin, lemon and sugar",
        ["First, before shaking", "In the shaker with the ice", "It's floated on the bottom"],
        "Never shake sparkling wine. Shake the rest, strain, then top with the wine.",
      ),
      ask(
        "How do you open a bottle of sparkling wine safely?",
        "Hold the cork, point it away from people, and twist the bottle",
        [
          "Pop the cork with your thumbs",
          "Shake it first to loosen the cork",
          "Remove the cage and let it pop on its own",
        ],
        "A flying cork can injure someone. Keep a hand on the cork and turn the bottle slowly for a quiet release.",
      ),
    ],
  },
  drinks: [
    {
      id: "french-75",
      focus: "Gin, lemon and sugar shaken, strained into a flute and topped with Champagne.",
    },
    {
      id: "spritz",
      focus:
        "Prosecco, Aperol and a splash of soda over ice in a wine glass, with an orange slice. A bright, low-proof aperitivo.",
    },
    {
      id: "champagne-cocktail",
      focus:
        "A sugar cube soaked in Angostura in the bottom of a flute, a little Cognac, then Champagne. The cube fizzes as it dissolves.",
    },
    {
      id: "mimosa",
      focus:
        "Equal parts fresh orange juice and Prosecco. Juice first, then the wine, poured gently so it doesn't foam over.",
    },
    {
      id: "bellini",
      focus:
        "White peach purée and Prosecco, from Harry's Bar in Venice. Stir the two together very gently so the wine keeps its fizz.",
    },
    {
      id: "kir",
      focus:
        "A splash of crème de cassis topped with chilled dry white wine. Made with Champagne, it's a Kir Royale.",
    },
  ],
});

export const afterDinner: CourseInput = familyCourse({
  id: "after-dinner",
  title: "After-Dinner Drinks",
  summary: "Coffee, cream and liqueur drinks, and the duos and trios that end a meal.",
  icon: { kind: "glass", glass: "irish-coffee" },
  intro: {
    id: "dessert-in-a-glass",
    title: "Dessert in a glass",
    summary: "Duos, cream drinks and coffee drinks.",
    blocks: [
      text(
        "After dinner, guests often want something rich, sweet or warming. This course groups three small families: duos and trios (a spirit with a liqueur), cream drinks, and coffee drinks.",
      ),
      points(
        [
          "Duos and trios: a spirit plus a liqueur, built over ice. Black Russian, Rusty Nail.",
          "Cream drinks: equal parts spirit, liqueur and cream, shaken hard and served up. Alexander, Grasshopper.",
          "Coffee drinks: hot or cold coffee with spirit and sugar. Espresso Martini, Irish Coffee.",
        ],
        "Three small families",
      ),
      tip(
        "Fresh espresso",
        "An Espresso Martini's foam comes from fresh, hot espresso shaken hard. Old or cold coffee won't foam.",
      ),
      ask(
        "Cream drinks like the Alexander are…",
        "Shaken hard and served up",
        ["Stirred and served on the rocks", "Built in a highball", "Blended with crushed ice"],
        "Cream needs a hard shake to blend and chill, and the drink is strained into a chilled glass.",
      ),
    ],
  },
  drinks: [
    {
      id: "espresso-martini",
      focus:
        "Vodka, coffee liqueur, sugar and fresh espresso, shaken hard for a thick crema. Three coffee beans on top.",
    },
    {
      id: "black-russian",
      focus: "Vodka and coffee liqueur over ice. Add cream and it's a White Russian.",
    },
    {
      id: "rusty-nail",
      focus:
        "Scotch and Drambuie, built over ice. A two-ingredient drink that's all about the whisky.",
    },
    {
      id: "alexander",
      focus: "Cognac, dark crème de cacao and cream, shaken and served up with fresh nutmeg.",
    },
    {
      id: "grasshopper",
      focus:
        "Equal parts crème de menthe, crème de cacao and cream. Minty, chocolatey and pale green.",
    },
    {
      id: "irish-coffee",
      focus:
        "Hot coffee, sugar and Irish whiskey in a warmed glass, with lightly whipped cream floated on top. Don't stir: drink it through the cream.",
    },
  ],
});
