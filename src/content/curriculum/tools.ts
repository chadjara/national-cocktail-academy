import type { Tool } from "./schema";

/** Every tool the academy teaches. The drawing for each lives in the design system. */
export const tools: readonly Tool[] = [
  {
    id: "jigger",
    name: "Jigger",
    summary:
      "A double-ended measure. The standard US jigger is 1 oz on one side and 2 oz on the other, with inner lines for ¼, ½ and ¾ oz.",
  },
  {
    id: "boston-shaker",
    name: "Boston shaker",
    summary:
      "Two metal tins, one large and one small, that seal together. The working bartender's shaker: fast, roomy and easy to clean.",
  },
  {
    id: "cobbler-shaker",
    name: "Cobbler shaker",
    summary:
      "A three-piece shaker with a built-in strainer and cap. Common at home and in hotel bars, slower in a rush and prone to sticking.",
  },
  {
    id: "hawthorne-strainer",
    name: "Hawthorne strainer",
    summary:
      "A flat strainer with a coiled spring that fits over a shaker tin. Holds back ice and most fruit while you pour.",
  },
  {
    id: "julep-strainer",
    name: "Julep strainer",
    summary:
      "A perforated, spoon-shaped strainer that sits inside a mixing glass. The classic choice for stirred drinks.",
  },
  {
    id: "fine-strainer",
    name: "Fine strainer",
    summary:
      "A small cone of mesh held under the main strainer to catch ice chips, pulp and herb fragments. Using both is double straining.",
  },
  {
    id: "barspoon",
    name: "Barspoon",
    summary:
      "A long, twisted spoon for stirring, layering and measuring small amounts. One barspoon is about 5 ml (1 teaspoon).",
  },
  {
    id: "mixing-glass",
    name: "Mixing glass",
    summary:
      "A heavy, wide glass for stirring spirit-forward drinks with ice. Its weight keeps it steady and its size gives room to stir.",
  },
  {
    id: "muddler",
    name: "Muddler",
    summary:
      "A flat-ended pestle for pressing herbs, citrus and sugar to release juice and oils. Press and twist; don't pound.",
  },
  {
    id: "peeler",
    name: "Y-peeler",
    summary:
      "The fastest way to cut wide citrus peels for twists. Take the colored zest and as little white pith as possible.",
  },
  {
    id: "channel-knife",
    name: "Channel knife",
    summary:
      "Cuts a long, thin spiral of peel, like the one hung on a Horse's Neck or curled into a Martini.",
  },
  {
    id: "paring-knife",
    name: "Paring knife and board",
    summary:
      "For cutting wheels, wedges and trimming twists. Keep it sharp: a dull knife slips and crushes fruit.",
  },
  {
    id: "speed-pourer",
    name: "Speed pourer",
    summary:
      "A metal spout fitted into a bottle that gives a steady, controllable stream. Standard on every well and back-bar bottle.",
  },
  {
    id: "ice-scoop",
    name: "Ice scoop",
    summary:
      "The only thing that goes into the ice well. Never scoop with a glass: a chip in the ice is a health hazard you can't find.",
  },
  {
    id: "bar-mat",
    name: "Bar mat",
    summary:
      "A ridged rubber mat where you build drinks. It catches spills, keeps glasses from sliding and marks your station.",
  },
  {
    id: "citrus-press",
    name: "Citrus press",
    summary:
      "A hinged hand press for juicing lemons and limes to order. Fresh juice is non-negotiable; juice it daily and keep it cold.",
  },
];
