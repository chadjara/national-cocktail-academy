import type { Ingredient } from "./schema";

/**
 * Every ingredient a spec can reference. IDs are permanent: user data (My Bar)
 * stores them, so rename the display name freely but never the id.
 */
export const ingredients = [
  // Gin
  { id: "gin", name: "London dry gin", category: "gin" },
  { id: "old-tom-gin", name: "Old Tom gin", category: "gin" },

  // Vodka
  { id: "vodka", name: "Vodka", category: "vodka" },
  { id: "citron-vodka", name: "Citrus vodka", category: "vodka" },
  { id: "vanilla-vodka", name: "Vanilla vodka", category: "vodka" },

  // Rum and cane
  { id: "white-rum", name: "White rum", category: "rum" },
  { id: "gold-rum", name: "Gold rum", category: "rum" },
  { id: "aged-rum", name: "Aged rum", category: "rum" },
  { id: "jamaican-rum", name: "Jamaican rum", category: "rum" },
  { id: "martinique-rum", name: "Martinique rum", category: "rum" },
  { id: "demerara-rum", name: "Demerara rum", category: "rum" },
  { id: "black-rum", name: "Bermuda black rum", category: "rum" },
  { id: "blackstrap-rum", name: "Blackstrap rum", category: "rum" },
  { id: "overproof-white-rum", name: "Jamaican overproof white rum", category: "rum" },
  { id: "cachaca", name: "Cachaça", category: "rum" },
  { id: "cuban-aguardiente", name: "Cuban aguardiente", category: "rum" },

  // Agave
  { id: "tequila-blanco", name: "Blanco tequila (100% agave)", category: "agave" },
  { id: "tequila-reposado", name: "Reposado tequila (100% agave)", category: "agave" },
  { id: "mezcal", name: "Mezcal", category: "agave" },

  // Whiskey
  { id: "bourbon", name: "Bourbon", category: "whiskey" },
  { id: "rye", name: "Rye whiskey", category: "whiskey" },
  { id: "blended-scotch", name: "Blended Scotch whisky", category: "whiskey" },
  { id: "islay-scotch", name: "Islay single malt Scotch", category: "whiskey" },
  { id: "irish-whiskey", name: "Irish whiskey", category: "whiskey" },

  // Brandy
  { id: "cognac", name: "Cognac", category: "brandy" },
  { id: "brandy", name: "Brandy", category: "brandy" },
  { id: "calvados", name: "Calvados", category: "brandy" },
  { id: "applejack", name: "Applejack", category: "brandy" },
  { id: "pisco", name: "Pisco", category: "brandy" },
  { id: "grappa", name: "Grappa", category: "brandy" },

  // Other spirits
  { id: "absinthe", name: "Absinthe", category: "other-spirit" },

  // Liqueurs
  { id: "triple-sec", name: "Triple sec (e.g. Cointreau)", category: "liqueur" },
  { id: "orange-curacao", name: "Orange curaçao", category: "liqueur" },
  { id: "maraschino", name: "Maraschino liqueur", category: "liqueur" },
  { id: "green-chartreuse", name: "Green Chartreuse", category: "liqueur" },
  { id: "yellow-chartreuse", name: "Yellow Chartreuse", category: "liqueur" },
  { id: "benedictine", name: "Bénédictine", category: "liqueur" },
  { id: "drambuie", name: "Drambuie", category: "liqueur" },
  { id: "galliano", name: "Galliano", category: "liqueur" },
  { id: "amaretto", name: "Amaretto", category: "liqueur" },
  { id: "coffee-liqueur", name: "Coffee liqueur", category: "liqueur" },
  { id: "creme-de-cacao-white", name: "White crème de cacao", category: "liqueur" },
  { id: "creme-de-cacao-dark", name: "Dark crème de cacao", category: "liqueur" },
  { id: "creme-de-menthe-green", name: "Green crème de menthe", category: "liqueur" },
  { id: "creme-de-menthe-white", name: "White crème de menthe", category: "liqueur" },
  { id: "creme-de-violette", name: "Crème de violette", category: "liqueur" },
  { id: "creme-de-cassis", name: "Crème de cassis", category: "liqueur" },
  { id: "creme-de-mure", name: "Crème de mûre", category: "liqueur" },
  { id: "cherry-liqueur", name: "Cherry liqueur (e.g. Cherry Heering)", category: "liqueur" },
  { id: "raspberry-liqueur", name: "Raspberry liqueur", category: "liqueur" },
  { id: "peach-schnapps", name: "Peach schnapps", category: "liqueur" },
  { id: "apricot-liqueur", name: "Apricot brandy liqueur", category: "liqueur" },
  { id: "falernum", name: "Falernum", category: "liqueur" },

  // Amari and aperitifs
  { id: "campari", name: "Campari", category: "amaro-aperitif" },
  { id: "aperol", name: "Aperol", category: "amaro-aperitif" },
  { id: "amaro-nonino", name: "Amaro Nonino", category: "amaro-aperitif" },
  { id: "fernet-branca", name: "Fernet-Branca", category: "amaro-aperitif" },

  // Vermouth and fortified wine
  { id: "sweet-vermouth", name: "Sweet vermouth", category: "vermouth-fortified" },
  { id: "dry-vermouth", name: "Dry vermouth", category: "vermouth-fortified" },
  { id: "punt-e-mes", name: "Punt e Mes", category: "vermouth-fortified" },
  { id: "lillet-blanc", name: "Lillet Blanc", category: "vermouth-fortified" },
  { id: "tawny-port", name: "Tawny port", category: "vermouth-fortified" },

  // Wine
  { id: "champagne", name: "Champagne (brut)", category: "wine" },
  { id: "prosecco", name: "Prosecco", category: "wine" },
  { id: "sparkling-wine", name: "Dry sparkling wine", category: "wine" },
  { id: "dry-white-wine", name: "Dry white wine", category: "wine" },
  { id: "red-wine", name: "Dry red wine", category: "wine" },

  // Bitters
  { id: "angostura", name: "Angostura bitters", category: "bitters" },
  { id: "orange-bitters", name: "Orange bitters", category: "bitters" },
  { id: "peychauds", name: "Peychaud's bitters", category: "bitters" },

  // Citrus
  { id: "lemon-juice", name: "Fresh lemon juice", category: "citrus" },
  { id: "lime-juice", name: "Fresh lime juice", category: "citrus" },
  { id: "orange-juice", name: "Fresh orange juice", category: "citrus" },
  { id: "grapefruit-juice", name: "Fresh grapefruit juice", category: "citrus" },
  { id: "lime", name: "Fresh lime", category: "citrus" },
  { id: "lemon", name: "Fresh lemon", category: "citrus" },

  // Other juices and purées
  { id: "pineapple-juice", name: "Pineapple juice", category: "juice" },
  { id: "cranberry-juice", name: "Cranberry juice", category: "juice" },
  { id: "tomato-juice", name: "Tomato juice", category: "juice" },
  { id: "sugar-cane-juice", name: "Sugar cane juice", category: "juice" },
  { id: "white-peach-puree", name: "White peach purée", category: "juice" },

  // Syrups
  { id: "simple-syrup", name: "Simple syrup (1:1)", category: "syrup" },
  { id: "demerara-syrup", name: "Rich demerara syrup (2:1)", category: "syrup" },
  { id: "honey-syrup", name: "Honey syrup", category: "syrup" },
  { id: "agave-syrup", name: "Agave syrup", category: "syrup" },
  { id: "orgeat", name: "Orgeat", category: "syrup" },
  { id: "grenadine", name: "Grenadine", category: "syrup" },
  { id: "raspberry-syrup", name: "Raspberry syrup", category: "syrup" },
  { id: "elderflower-cordial", name: "Elderflower cordial", category: "syrup" },
  { id: "chamomile-cordial", name: "Chamomile cordial", category: "syrup" },
  { id: "donns-mix", name: "Donn's mix (grapefruit and cinnamon)", category: "syrup" },
  { id: "coconut-cream", name: "Coconut cream", category: "syrup" },

  // Mixers
  { id: "soda-water", name: "Soda water", category: "mixer" },
  { id: "tonic-water", name: "Tonic water", category: "mixer" },
  { id: "cola", name: "Cola", category: "mixer" },
  { id: "ginger-beer", name: "Ginger beer", category: "mixer" },
  { id: "ginger-ale", name: "Ginger ale", category: "mixer" },
  { id: "grapefruit-soda", name: "Pink grapefruit soda", category: "mixer" },

  // Dairy and egg
  { id: "cream", name: "Fresh cream", category: "dairy-egg" },
  { id: "egg-white", name: "Egg white", category: "dairy-egg" },
  { id: "egg-yolk", name: "Egg yolk", category: "dairy-egg" },

  // Produce
  { id: "mint", name: "Fresh mint", category: "produce" },
  { id: "basil", name: "Fresh basil", category: "produce" },
  { id: "ginger", name: "Fresh ginger", category: "produce" },
  { id: "red-chili", name: "Red chili", category: "produce" },

  // Pantry
  { id: "sugar", name: "White cane sugar", category: "pantry" },
  { id: "sugar-cube", name: "Sugar cube", category: "pantry" },
  { id: "honey", name: "Honey", category: "pantry" },
  { id: "water", name: "Water", category: "pantry" },
  { id: "espresso", name: "Espresso", category: "pantry" },
  { id: "hot-coffee", name: "Hot black coffee", category: "pantry" },
  { id: "worcestershire", name: "Worcestershire sauce", category: "pantry" },
  { id: "hot-sauce", name: "Tabasco", category: "pantry" },
  { id: "celery-salt", name: "Celery salt", category: "pantry" },
  { id: "black-pepper", name: "Black pepper", category: "pantry" },
  { id: "salt", name: "Salt", category: "pantry" },
  { id: "orange-flower-water", name: "Orange flower water", category: "pantry" },
  { id: "vanilla-extract", name: "Vanilla extract", category: "pantry" },
] as const satisfies readonly Ingredient[];

export type IngredientId = (typeof ingredients)[number]["id"];
