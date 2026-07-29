// The memory lexicon: how ordinary language about remembered smells gets
// mapped onto the fixed descriptor vocabulary.
//
// This is the least glamorous file in SCENT and the one that decides whether
// the demo feels like magic or like a search box. A GNN can tell you what a
// molecule smells like; nothing in the model knows that "my grandmother's
// kitchen" means bready-vanilla-buttery. That knowledge has to be written down,
// and this is where it lives.
//
// Matching runs longest-phrase-first, so "cut grass" wins over "grass" and
// "rain on hot asphalt" wins over "rain". Weights are 0–1 and need not sum to
// anything; the projection normalises.

export type MemoryEntry = {
  phrases: string[];
  weights: Record<string, number>;
};

export const MEMORY_LEXICON: MemoryEntry[] = [
  // ══ weather, earth, outdoors ═══════════════════════════════════════
  {
    phrases: [
      "rain on hot asphalt", "rain on asphalt", "rain on pavement", "rain on concrete",
      "hot asphalt after rain", "wet asphalt", "wet pavement", "wet concrete",
      "petrichor", "the smell of rain", "rain on dry ground", "first rain",
      "summer rain", "rain on a hot day",
      "sidewalk on a rainy day", "a rainy day", "rainy day", "wet sidewalk",
      "the sidewalk after rain", "sidewalk", "the pavement", "wet street",
    ],
    weights: { earthy: 1, musty: 0.7, mossy: 0.6, tarry: 0.45, green: 0.35, ozone: 0.4, metallic: 0.3 },
  },
  {
    phrases: ["rain", "rainy", "raining", "after the rain", "drizzle", "wet earth", "wet soil", "damp ground"],
    weights: { earthy: 0.95, musty: 0.6, mossy: 0.55, green: 0.4, ozone: 0.35 },
  },
  {
    phrases: ["thunderstorm", "lightning", "before a storm", "storm coming", "static", "the air before a storm"],
    weights: { ozone: 1, metallic: 0.6, fresh: 0.5, earthy: 0.4 },
  },
  {
    phrases: ["soil", "dirt", "mud", "earth", "the ground", "a garden bed", "potting soil", "digging"],
    weights: { earthy: 1, musty: 0.65, mossy: 0.5, mushroom: 0.45, green: 0.3 },
  },
  {
    phrases: ["forest", "the woods", "woodland", "forest floor", "deep woods", "hiking", "a trail", "under the trees"],
    weights: { pine: 0.85, earthy: 0.8, mossy: 0.75, woody: 0.7, resinous: 0.5, mushroom: 0.4, green: 0.4 },
  },
  {
    phrases: ["pine forest", "pine trees", "pine needles", "christmas tree", "a fir tree", "evergreen", "conifer", "spruce"],
    weights: { pine: 1, resinous: 0.85, woody: 0.6, fresh: 0.5, camphoreous: 0.4, green: 0.35 },
  },
  {
    phrases: ["moss", "mossy rocks", "a damp forest", "lichen", "a creek bed"],
    weights: { mossy: 1, earthy: 0.8, green: 0.55, musty: 0.5, mushroom: 0.4 },
  },
  {
    phrases: [
      "cut grass", "freshly cut grass", "mown grass", "the lawn", "mowing the lawn",
      "a lawnmower", "a football pitch", "a soccer field", "fresh grass", "grass clippings",
    ],
    weights: { grassy: 1, green: 0.95, fresh: 0.6, herbal: 0.4, apple: 0.3 },
  },
  {
    phrases: ["grass", "a field", "a meadow", "the park", "a backyard", "green leaves", "leaves", "crushed leaves"],
    weights: { green: 0.9, grassy: 0.75, herbal: 0.45, fresh: 0.4 },
  },
  {
    phrases: ["hay", "a hayfield", "dried grass", "straw", "a hay bale", "hayloft", "new mown hay"],
    weights: { hay: 1, sweet: 0.55, woody: 0.4, tobacco: 0.4, musty: 0.35 },
  },
  {
    phrases: ["autumn", "fall leaves", "dead leaves", "autumn leaves", "october", "leaf pile", "raking leaves"],
    weights: { earthy: 0.8, woody: 0.6, hay: 0.55, musty: 0.5, tobacco: 0.4, mossy: 0.4 },
  },
  {
    phrases: [
      "the sea", "the ocean", "the beach", "seaside", "salt air", "sea air", "the coast",
      "low tide", "seaweed", "the shore", "ocean spray", "a harbour", "a harbor",
    ],
    // Sulfurous is not incidental. The smell of the sea is largely
    // dimethyl sulfide from phytoplankton breaking down.
    weights: { marine: 1, sulfurous: 0.6, ozone: 0.6, fresh: 0.5, fishy: 0.4, vegetable: 0.35, melon: 0.3 },
  },
  {
    phrases: ["snow", "fresh snow", "winter air", "cold air", "frost", "a cold morning", "ice"],
    weights: { ozone: 0.85, fresh: 0.8, cooling: 0.6, metallic: 0.45, camphoreous: 0.3 },
  },
  {
    phrases: ["fog", "mist", "humid", "humidity", "a swamp", "a marsh"],
    weights: { musty: 0.8, earthy: 0.7, marine: 0.5, mossy: 0.45, green: 0.35 },
  },
  {
    phrases: ["mushrooms", "a mushroom", "fungus", "truffle", "truffles", "damp wood"],
    weights: { mushroom: 1, earthy: 0.8, musty: 0.6, sulfurous: 0.35, woody: 0.35 },
  },

  // ══ fire and smoke ═════════════════════════════════════════════════
  {
    phrases: [
      "campfire", "a bonfire", "bonfire", "a fire pit", "woodsmoke", "wood smoke",
      "a fireplace", "a log fire", "burning wood", "a wood stove", "smoke",
      "a chimney", "sitting by the fire",
    ],
    weights: { smoky: 1, burnt: 0.8, phenolic: 0.7, woody: 0.6, tarry: 0.4, warm: 0.4 },
  },
  {
    phrases: ["barbecue", "bbq", "a grill", "grilling", "charcoal", "a cookout", "smoked meat", "brisket"],
    weights: { smoky: 0.95, meaty: 0.9, roasted: 0.8, burnt: 0.6, savoury: 0.6, fried: 0.4 },
  },
  {
    phrases: ["a match", "struck match", "matches", "a lit match", "sulphur", "sulfur", "fireworks", "a sparkler", "gunpowder"],
    weights: { sulfurous: 1, burnt: 0.8, smoky: 0.6, metallic: 0.5, phenolic: 0.3 },
  },
  {
    phrases: ["ash", "ashes", "a cold fireplace", "burnt", "something burning", "scorched"],
    weights: { burnt: 1, smoky: 0.85, tarry: 0.5, phenolic: 0.5, musty: 0.35 },
  },
  {
    phrases: ["incense", "a church", "a temple", "a cathedral", "frankincense", "myrrh", "sandalwood", "a shrine"],
    weights: { resinous: 1, balsamic: 0.85, woody: 0.75, smoky: 0.6, spicy: 0.5, warm: 0.45, camphoreous: 0.35 },
  },
  {
    phrases: [
      "cigarettes", "a cigarette", "smoking", "an ashtray", "stale smoke", "a cigar",
      "pipe tobacco", "tobacco", "a smoky bar", "my grandfather's coat",
    ],
    weights: { tobacco: 1, smoky: 0.75, phenolic: 0.6, hay: 0.5, sweet: 0.4, leather: 0.35 },
  },

  // ══ home, rooms, buildings ═════════════════════════════════════════
  {
    phrases: [
      "my grandmother's kitchen", "grandmothers kitchen", "grandma's kitchen", "grandmas kitchen",
      "my nana's house", "my grandma's house", "my grandmother's house", "granny's house",
      "my grandparents house", "sunday at my grandmother's", "baking with my grandmother",
    ],
    weights: { bready: 1, vanilla: 0.85, buttery: 0.7, caramellic: 0.6, cinnamon: 0.5, sweet: 0.6, warm: 0.5, nutty: 0.35 },
  },
  {
    phrases: [
      "a bakery", "fresh bread", "bread", "baking bread", "bread out of the oven",
      "sourdough", "a loaf of bread", "bread crust", "the bread aisle", "dough",
    ],
    weights: { bready: 1, roasted: 0.6, nutty: 0.55, sweet: 0.5, warm: 0.45, sour: 0.3 },
  },
  {
    phrases: [
      "baking", "cookies", "cookies in the oven", "biscuits", "a cake", "birthday cake",
      "cupcakes", "a pie", "apple pie", "pastry", "a bake sale", "shortbread",
    ],
    weights: { sweet: 1, vanilla: 0.85, buttery: 0.8, caramellic: 0.6, bready: 0.6, warm: 0.5 },
  },
  {
    phrases: ["gingerbread", "ginger biscuits", "speculoos", "christmas baking", "spiced cake"],
    weights: { cinnamon: 1, spicy: 0.85, sweet: 0.7, warm: 0.7, caramellic: 0.55, clove: 0.5, vanilla: 0.4 },
  },
  {
    phrases: [
      "a used bookstore", "a bookshop", "old books", "an old book", "a library",
      "the library", "a second hand bookshop", "book pages", "an archive", "a reading room",
    ],
    // Vanilla leads deliberately: ageing paper degrades to vanillin, and that
    // is the fact the result is meant to surface. Musty is real but secondary.
    weights: { vanilla: 1, musty: 0.7, woody: 0.65, sweet: 0.6, balsamic: 0.5, earthy: 0.35, hay: 0.3 },
  },
  {
    phrases: ["a new book", "a fresh notebook", "printed paper", "a newspaper", "a magazine", "printer ink", "a photocopier"],
    weights: { solvent: 0.8, woody: 0.5, phenolic: 0.45, ethereal: 0.4, plastic: 0.35 },
  },
  {
    phrases: ["an attic", "a basement", "a cellar", "a crawlspace", "a damp room", "mould", "mold", "mildew", "a musty room"],
    weights: { musty: 1, earthy: 0.85, mushroom: 0.6, mossy: 0.5, woody: 0.4 },
  },
  {
    phrases: [
      "my grandmother's closet", "an old wardrobe", "a linen closet",
      "an antique shop", "a charity shop", "a thrift store", "old clothes",
    ],
    weights: { camphoreous: 1, musty: 0.8, tarry: 0.5, woody: 0.45, powdery: 0.45, medicinal: 0.4 },
  },
  {
    // Split out of the wardrobe family. Sharing those weights put mothballs
    // among the camphoreous terpenes, which smell of a wardrobe but are not
    // what is in it. Naphthalene is tar first and camphor second.
    phrases: ["mothballs", "a mothball", "moth balls", "naphthalene"],
    weights: { tarry: 1, camphoreous: 0.85, medicinal: 0.6, plastic: 0.5, smoky: 0.45, musty: 0.4 },
  },
  {
    phrases: [
      "clean laundry", "fresh laundry", "laundry", "fresh sheets", "clean sheets",
      "line dried sheets", "a laundromat", "a launderette", "fabric softener",
      "washing powder", "detergent", "just washed towels",
    ],
    weights: { soapy: 1, floral: 0.7, fresh: 0.7, powdery: 0.6, musk: 0.55, aldehydic: 0.5, citrus: 0.35 },
  },
  {
    phrases: ["soap", "a bar of soap", "shampoo", "a shower", "bubble bath", "a bathroom", "conditioner", "body wash"],
    weights: { soapy: 1, floral: 0.75, fresh: 0.65, powdery: 0.5, citrus: 0.4, lavender: 0.35 },
  },
  {
    phrases: ["bleach", "cleaning products", "a freshly cleaned house", "disinfectant", "mopped floors", "a clean bathroom", "pine cleaner"],
    weights: { medicinal: 0.8, pine: 0.7, fresh: 0.65, phenolic: 0.6, citrus: 0.5, soapy: 0.5 },
  },
  {
    phrases: ["a hospital", "a hospital hallway", "a doctor's office", "a waiting room", "a clinic", "a ward", "a nursing home"],
    weights: { medicinal: 1, phenolic: 0.8, ethereal: 0.7, solvent: 0.5, soapy: 0.45, ammoniacal: 0.3 },
  },
  {
    phrases: ["a dentist", "the dentist's office", "a dental surgery", "clove oil", "dental"],
    weights: { clove: 1, medicinal: 0.9, phenolic: 0.7, spicy: 0.55, camphoreous: 0.4 },
  },
  {
    phrases: [
      "hand sanitizer", "hand sanitiser", "an alcohol wipe", "rubbing alcohol",
      "antiseptic", "a pharmacy", "a chemist", "a first aid kit", "a plaster", "a band aid",
    ],
    weights: { ethereal: 1, medicinal: 0.85, phenolic: 0.6, solvent: 0.5 },
  },
  {
    phrases: ["vicks", "vapour rub", "vapor rub", "chest rub", "eucalyptus", "menthol", "being sick as a kid", "cough syrup"],
    weights: { camphoreous: 1, minty: 0.8, cooling: 0.8, medicinal: 0.7, fresh: 0.5 },
  },
  {
    phrases: [
      "a swimming pool", "the pool", "the pool in summer", "chlorine", "a leisure centre",
      "swim practice", "a public pool", "an indoor pool", "pool water",
    ],
    weights: { medicinal: 0.85, fresh: 0.75, ozone: 0.7, marine: 0.55, soapy: 0.45, sulfurous: 0.3 },
  },
  {
    phrases: ["a locker room", "a changing room", "a gym", "sweat", "a wrestling mat", "sports kit", "old trainers", "sneakers"],
    weights: { sweaty: 1, cheesy: 0.8, sour: 0.6, rubbery: 0.5, animalic: 0.45, musty: 0.4 },
  },
  {
    phrases: ["a sauna", "a steam room", "hot cedar", "a spa", "hot stones"],
    weights: { woody: 1, resinous: 0.7, warm: 0.6, camphoreous: 0.45, earthy: 0.4 },
  },
  {
    phrases: ["a school", "a classroom", "a school hallway", "first day of school", "a lecture hall", "a gymnasium"],
    weights: { plastic: 0.6, soapy: 0.5, musty: 0.5, woody: 0.45, solvent: 0.45, rubbery: 0.4 },
  },
  {
    phrases: ["a greenhouse", "a garden centre", "a flower shop", "a florist", "a plant nursery", "tomato plants", "a potting shed"],
    weights: { green: 1, earthy: 0.8, floral: 0.7, grassy: 0.5, vegetable: 0.5, mossy: 0.4 },
  },
  {
    phrases: ["a barn", "a stable", "horses", "a farm", "manure", "a paddock", "hay and horses", "livestock", "a petting zoo"],
    weights: { animalic: 1, leather: 0.7, phenolic: 0.7, hay: 0.65, fecal: 0.6, musty: 0.5, earthy: 0.5 },
  },
  {
    phrases: ["a cinema", "a movie theater", "a movie theatre", "the movies", "movie popcorn", "buttered popcorn", "popcorn"],
    weights: { bready: 1, roasted: 0.85, buttery: 0.85, nutty: 0.6, sweet: 0.5, savoury: 0.4 },
  },
  {
    phrases: ["a hotel", "a hotel room", "a hotel lobby", "clean towels", "a holiday", "a vacation", "an airbnb"],
    weights: { soapy: 0.8, fresh: 0.7, floral: 0.6, musk: 0.5, powdery: 0.45, citrus: 0.4 },
  },
  {
    phrases: ["a subway", "the underground", "the tube", "a train station", "a metro", "a bus"],
    weights: { metallic: 0.85, tarry: 0.6, musty: 0.6, rubbery: 0.5, burnt: 0.4, solvent: 0.4 },
  },
  {
    phrases: ["an airplane", "a plane", "an aeroplane", "an airport", "a plane cabin", "jet fuel"],
    weights: { plastic: 0.7, solvent: 0.6, ethereal: 0.55, metallic: 0.5, soapy: 0.4, ozone: 0.4 },
  },

  // ══ vehicles, fuel, workshop ═══════════════════════════════════════
  {
    phrases: [
      "a new car", "new car smell", "a car showroom", "a brand new car",
      "the inside of a new car", "a new dashboard",
    ],
    weights: { plastic: 1, leather: 0.8, solvent: 0.7, rubbery: 0.55, waxy: 0.45, sweet: 0.35 },
  },
  {
    phrases: ["an old car", "my dad's car", "a car interior", "a taxi", "a car seat", "a road trip"],
    weights: { leather: 0.8, plastic: 0.6, musty: 0.55, rubbery: 0.5, tobacco: 0.35 },
  },
  {
    phrases: [
      "gasoline", "petrol", "a gas station", "a petrol station", "filling up the car",
      "diesel", "fuel", "a jerry can", "two stroke",
    ],
    weights: { solvent: 1, ethereal: 0.8, tarry: 0.6, plastic: 0.4, burnt: 0.4, sweet: 0.35 },
  },
  {
    phrases: ["a garage", "my dad's garage", "a workshop", "motor oil", "engine oil", "wd40", "grease", "a mechanic"],
    weights: { solvent: 0.85, tarry: 0.7, metallic: 0.65, rubbery: 0.55, waxy: 0.5, burnt: 0.35 },
  },
  {
    phrases: ["tires", "tyres", "new tires", "a tire shop", "rubber", "an inner tube", "a rubber band", "a bike shop"],
    weights: { rubbery: 1, sulfurous: 0.6, tarry: 0.55, burnt: 0.45, phenolic: 0.4 },
  },
  {
    phrases: ["fresh tarmac", "asphalt", "road works", "new tarmac", "hot tar", "a newly paved road", "creosote"],
    weights: { tarry: 1, smoky: 0.7, phenolic: 0.65, burnt: 0.5, solvent: 0.45 },
  },
  {
    phrases: [
      "fresh paint", "paint", "a freshly painted room", "paint thinner", "turpentine",
      "white spirit", "varnish", "a decorator", "a hardware store", "a diy store",
    ],
    weights: { solvent: 1, ethereal: 0.75, pine: 0.5, plastic: 0.45, resinous: 0.4 },
  },
  {
    phrases: ["sawdust", "cut wood", "a lumber yard", "a sawmill", "woodwork", "a workbench", "pencil shavings", "cedar"],
    weights: { woody: 1, resinous: 0.75, pine: 0.6, fresh: 0.45, earthy: 0.35 },
  },

  // ══ materials, childhood objects ═══════════════════════════════════
  {
    phrases: [
      "crayons", "a box of crayons", "colouring", "coloring", "playdough", "play doh",
      "modelling clay", "plasticine", "a toy box", "kindergarten",
    ],
    weights: { waxy: 0.9, vanilla: 0.6, almond: 0.55, sweet: 0.55, plastic: 0.5, powdery: 0.4 },
  },
  {
    phrases: ["a sharpie", "a permanent marker", "markers", "a whiteboard marker", "glue", "pva glue", "rubber cement", "nail polish"],
    weights: { solvent: 1, ethereal: 0.8, plastic: 0.5, sweet: 0.4, fruity: 0.35 },
  },
  {
    phrases: ["new plastic", "a new toy", "an unboxing", "a new phone", "packaging", "bubble wrap", "a new appliance", "styrofoam"],
    weights: { plastic: 1, solvent: 0.65, sweet: 0.4, rubbery: 0.4, balsamic: 0.35 },
  },
  {
    phrases: [
      "leather", "a leather jacket", "new leather", "a leather sofa", "a saddle",
      "a shoe shop", "a leather bag", "a wallet", "a car's leather seats",
    ],
    weights: { leather: 1, animalic: 0.7, phenolic: 0.65, smoky: 0.5, woody: 0.45, warm: 0.35 },
  },
  {
    phrases: ["chalk", "a blackboard", "chalk dust", "concrete dust", "plaster", "a building site"],
    weights: { powdery: 1, earthy: 0.6, metallic: 0.45, musty: 0.4 },
  },
  {
    phrases: ["coins", "metal", "a handrail", "old pennies", "a coin", "iron", "rust", "copper", "blood", "a nosebleed"],
    weights: { metallic: 1, mushroom: 0.5, earthy: 0.4, sour: 0.35 },
  },
  {
    phrases: ["a wet dog", "a dog", "my dog", "a dog's paws", "a puppy", "a cat", "a hamster", "a pet shop"],
    weights: { animalic: 1, musty: 0.7, sweaty: 0.6, cheesy: 0.5, fecal: 0.4, earthy: 0.4 },
  },
  {
    phrases: ["wool", "a wet jumper", "a wet sweater", "a wool coat", "a blanket", "sheep"],
    weights: { animalic: 0.8, waxy: 0.65, musty: 0.6, hay: 0.45, sweaty: 0.4 },
  },
  {
    phrases: ["sunscreen", "sun cream", "suncream", "spf", "the beach in summer", "a tanning lotion", "coconut oil"],
    weights: { coconut: 1, creamy: 0.8, sweet: 0.7, waxy: 0.6, floral: 0.4, marine: 0.35 },
  },
  {
    phrases: ["perfume", "cologne", "aftershave", "my mother's perfume", "a department store", "a fragrance counter", "hairspray"],
    weights: { floral: 0.9, musk: 0.8, powdery: 0.7, citrus: 0.6, woody: 0.5, aldehydic: 0.5 },
  },

  // ══ coffee, tea, drink ═════════════════════════════════════════════
  {
    phrases: [
      "coffee", "fresh coffee", "a coffee shop", "espresso", "ground coffee",
      "a cafe", "a café", "coffee beans", "a morning coffee", "a coffee machine", "roasted coffee",
    ],
    // Sulfurous carries real weight here: the thing that makes just-opened
    // coffee smell like coffee is a thiol, and it is gone within hours.
    weights: { coffee: 1, roasted: 0.95, sulfurous: 0.7, burnt: 0.6, nutty: 0.5, cocoa: 0.45, earthy: 0.4 },
  },
  {
    phrases: ["tea", "black tea", "a cup of tea", "earl grey", "green tea", "a teapot", "chai", "a tea room"],
    weights: { hay: 0.7, green: 0.6, woody: 0.5, floral: 0.5, citrus: 0.45, tobacco: 0.35 },
  },
  {
    phrases: ["beer", "a pub", "a brewery", "a bar", "lager", "an ipa", "stale beer", "a beer garden"],
    weights: { winey: 0.85, sour: 0.6, bready: 0.6, resinous: 0.5, solvent: 0.45, hay: 0.35 },
  },
  {
    phrases: ["wine", "red wine", "white wine", "a wine cellar", "a vineyard", "a glass of wine", "a cork"],
    weights: { winey: 1, fruity: 0.7, woody: 0.55, sour: 0.45, berry: 0.45, earthy: 0.35 },
  },
  {
    phrases: ["whisky", "whiskey", "scotch", "bourbon", "a distillery", "an oak barrel", "rum", "brandy"],
    weights: { woody: 0.85, vanilla: 0.8, smoky: 0.7, caramellic: 0.6, warm: 0.55, phenolic: 0.5 },
  },
  {
    phrases: ["vinegar", "pickles", "a pickle jar", "sauerkraut", "kimchi", "kombucha", "malt vinegar"],
    weights: { sour: 1, solvent: 0.5, vegetable: 0.45, sulfurous: 0.35 },
  },
  {
    phrases: ["orange juice", "fresh juice", "lemonade", "a smoothie", "squash", "cordial"],
    weights: { citrus: 1, fruity: 0.8, sweet: 0.7, fresh: 0.5, aldehydic: 0.4 },
  },
  {
    phrases: ["cola", "soda", "fizzy drink", "root beer", "a soda fountain", "sarsaparilla"],
    weights: { sweet: 0.9, caramellic: 0.7, anise: 0.6, citrus: 0.5, minty: 0.4, medicinal: 0.35 },
  },

  // ══ food ═══════════════════════════════════════════════════════════
  {
    phrases: ["chocolate", "cocoa", "hot chocolate", "dark chocolate", "a chocolate shop", "brownies", "a chocolate bar"],
    weights: { cocoa: 1, sweet: 0.8, roasted: 0.7, nutty: 0.6, caramellic: 0.5, creamy: 0.45 },
  },
  {
    phrases: ["vanilla", "vanilla ice cream", "ice cream", "custard", "a vanilla pod", "an ice cream van", "a gelato shop"],
    weights: { vanilla: 1, sweet: 0.85, creamy: 0.8, buttery: 0.55, powdery: 0.4 },
  },
  {
    phrases: ["caramel", "toffee", "burnt sugar", "fudge", "butterscotch", "creme brulee", "dulce de leche"],
    weights: { caramellic: 1, sweet: 0.9, buttery: 0.7, burnt: 0.5, maple: 0.45, nutty: 0.4 },
  },
  {
    phrases: [
      "cotton candy", "candy floss", "a fairground", "a carnival", "a funfair",
      "a county fair", "a theme park", "a circus", "candy", "sweets", "a sweet shop",
    ],
    weights: { caramellic: 1, sweet: 1, fruity: 0.7, vanilla: 0.5, berry: 0.4 },
  },
  {
    phrases: ["bubblegum", "chewing gum", "a gumball", "hubba bubba", "a packet of gum"],
    weights: { fruity: 1, sweet: 0.9, banana: 0.6, berry: 0.55, minty: 0.4, solvent: 0.35 },
  },
  {
    phrases: ["maple syrup", "pancakes", "waffles", "a diner", "brunch", "french toast"],
    weights: { maple: 1, caramellic: 0.85, sweet: 0.8, buttery: 0.7, bready: 0.6, nutty: 0.4 },
  },
  {
    phrases: ["honey", "a beehive", "beeswax", "honeycomb", "a jar of honey"],
    weights: { honey: 1, sweet: 0.85, floral: 0.7, waxy: 0.55, rose: 0.4 },
  },
  {
    phrases: ["peanut butter", "peanuts", "roasted nuts", "almonds", "hazelnuts", "a nut roaster", "toasted sesame", "praline"],
    weights: { nutty: 1, roasted: 0.85, almond: 0.6, sweet: 0.5, cocoa: 0.4, fatty: 0.4 },
  },
  {
    phrases: ["marzipan", "almond", "amaretto", "bakewell", "cherry flavour", "cherry flavor", "a cherry sweet"],
    weights: { almond: 1, cherry: 0.85, sweet: 0.8, vanilla: 0.5, floral: 0.4 },
  },
  {
    phrases: ["butter", "melted butter", "buttered toast", "cream", "milk", "warm milk", "yoghurt", "yogurt", "a dairy"],
    weights: { buttery: 1, creamy: 0.9, fatty: 0.7, sweet: 0.5, sour: 0.4 },
  },
  {
    phrases: ["cheese", "a cheese shop", "blue cheese", "parmesan", "cheddar", "a cheeseboard", "goat cheese", "brie"],
    weights: { cheesy: 1, sour: 0.75, animalic: 0.6, fatty: 0.6, sweaty: 0.55, musty: 0.4 },
  },
  {
    phrases: [
      "frying onions", "garlic", "frying garlic", "sofrito", "someone cooking",
      "a kitchen", "dinner cooking", "a restaurant kitchen", "caramelised onions",
    ],
    weights: { alliaceous: 1, sulfurous: 0.8, savoury: 0.7, fried: 0.6, meaty: 0.45, vegetable: 0.45 },
  },
  {
    // Kept separate from frying: a raw cut onion is the lachrymator, with none
    // of the browned, savoury notes cooking adds.
    phrases: ["cut onions", "cutting onions", "chopping onions", "a cut onion", "onions", "raw onion", "onion"],
    weights: { alliaceous: 1, sulfurous: 0.85, sour: 0.6, green: 0.5, vegetable: 0.4 },
  },
  {
    phrases: ["bacon", "frying bacon", "a fry up", "a full english", "sausages", "breakfast cooking", "a sunday roast", "roast dinner"],
    weights: { meaty: 1, savoury: 0.9, roasted: 0.8, fried: 0.75, smoky: 0.6, fatty: 0.6 },
  },
  {
    phrases: ["fried chicken", "chips", "french fries", "a chip shop", "a fryer", "a takeaway", "fast food", "a deep fryer", "doughnuts", "donuts"],
    weights: { fried: 1, fatty: 0.9, meaty: 0.6, savoury: 0.6, roasted: 0.5, sour: 0.35, sweet: 0.3 },
  },
  {
    phrases: ["pizza", "a pizzeria", "oregano", "italian food", "tomato sauce", "pasta sauce", "a trattoria"],
    weights: { herbal: 1, spicy: 0.6, bready: 0.6, savoury: 0.55, green: 0.45, warm: 0.4 },
  },
  {
    phrases: ["rice", "jasmine rice", "basmati", "steamed rice", "a rice cooker", "pandan"],
    weights: { bready: 1, nutty: 0.6, roasted: 0.5, sweet: 0.45, floral: 0.35 },
  },
  {
    phrases: ["curry", "an indian restaurant", "cumin", "garam masala", "a spice shop", "a spice market", "spices", "coriander seed"],
    weights: { spicy: 1, warm: 0.8, earthy: 0.6, herbal: 0.6, sweaty: 0.45, peppery: 0.5 },
  },
  {
    phrases: ["cinnamon", "cloves", "nutmeg", "mulled wine", "christmas", "the holidays", "a christmas market", "spiced"],
    weights: { cinnamon: 1, clove: 0.85, warm: 0.8, spicy: 0.8, sweet: 0.6, woody: 0.45, citrus: 0.35 },
  },
  {
    phrases: ["black pepper", "pepper", "peppercorns", "a pepper grinder"],
    weights: { peppery: 1, spicy: 0.8, woody: 0.6, resinous: 0.45 },
  },
  {
    phrases: ["ginger", "fresh ginger", "ginger ale", "ginger tea"],
    weights: { spicy: 1, warm: 0.7, citrus: 0.5, woody: 0.45, sweet: 0.4 },
  },
  {
    phrases: ["basil", "fresh herbs", "rosemary", "thyme", "sage", "an herb garden", "a herb garden", "parsley", "coriander", "cilantro"],
    weights: { herbal: 1, green: 0.85, fresh: 0.6, camphoreous: 0.4, anise: 0.35 },
  },
  {
    phrases: ["mint", "peppermint", "spearmint", "toothpaste", "brushing my teeth", "mouthwash", "a mint", "a polo"],
    weights: { minty: 1, cooling: 0.9, fresh: 0.8, herbal: 0.5, medicinal: 0.4 },
  },
  {
    phrases: ["licorice", "liquorice", "aniseed", "star anise", "fennel", "absinthe", "ouzo", "sambuca", "pastis"],
    weights: { anise: 1, sweet: 0.7, spicy: 0.5, herbal: 0.45, medicinal: 0.35 },
  },
  {
    phrases: ["fish", "a fish market", "seafood", "a fishmonger", "shellfish", "oysters", "a fish and chip shop"],
    weights: { fishy: 1, marine: 0.85, ammoniacal: 0.5, sulfurous: 0.4, savoury: 0.35 },
  },
  {
    phrases: ["a tomato plant", "tomato leaves", "vine tomatoes", "a tomato"],
    weights: { green: 1, vegetable: 0.85, grassy: 0.6, earthy: 0.45, fresh: 0.4 },
  },
  {
    phrases: ["cucumber", "watermelon", "melon", "honeydew", "a fruit salad"],
    weights: { cucumber: 1, melon: 0.9, fresh: 0.7, green: 0.6, marine: 0.35 },
  },
  {
    phrases: ["boiled potatoes", "mashed potato", "potatoes", "a jacket potato", "crisps", "potato chips"],
    weights: { vegetable: 1, savoury: 0.7, buttery: 0.5, sulfurous: 0.5, earthy: 0.45 },
  },

  // ══ fruit ══════════════════════════════════════════════════════════
  {
    phrases: ["oranges", "an orange", "orange peel", "clementines", "satsumas", "peeling an orange", "a citrus grove", "mandarin"],
    weights: { citrus: 1, fresh: 0.8, sweet: 0.6, fruity: 0.6, aldehydic: 0.45 },
  },
  {
    phrases: ["lemon", "lemons", "lime", "lemon zest", "a gin and tonic", "lemongrass"],
    weights: { citrus: 1, fresh: 0.85, aldehydic: 0.6, sour: 0.45, green: 0.35 },
  },
  {
    phrases: ["grapefruit", "a grapefruit"],
    weights: { citrus: 1, fresh: 0.7, sulfurous: 0.5, woody: 0.45, tropical: 0.4 },
  },
  {
    phrases: ["strawberries", "a strawberry", "raspberries", "berries", "a berry", "blackcurrant", "jam", "strawberry jam"],
    weights: { berry: 1, fruity: 0.85, sweet: 0.8, caramellic: 0.45, green: 0.35, floral: 0.35 },
  },
  {
    phrases: ["banana", "bananas", "a banana", "pear drops", "banana bread"],
    weights: { banana: 1, fruity: 0.85, sweet: 0.7, solvent: 0.4 },
  },
  {
    phrases: ["apples", "an apple", "a green apple", "an orchard", "cider", "apple picking"],
    weights: { apple: 1, fruity: 0.85, fresh: 0.6, green: 0.5, sweet: 0.5 },
  },
  {
    phrases: ["peaches", "a peach", "apricot", "nectarine", "stone fruit"],
    weights: { fruity: 1, sweet: 0.8, creamy: 0.6, coconut: 0.45, floral: 0.4 },
  },
  {
    phrases: ["pineapple", "mango", "passionfruit", "tropical fruit", "papaya", "guava", "a tropical drink"],
    weights: { tropical: 1, fruity: 0.9, sweet: 0.75, sulfurous: 0.4, citrus: 0.4 },
  },
  {
    phrases: ["coconut", "a piña colada", "a pina colada", "macaroons"],
    weights: { coconut: 1, creamy: 0.8, sweet: 0.75, waxy: 0.45 },
  },
  {
    phrases: ["grapes", "grape soda", "grape candy", "concord grapes", "purple sweets"],
    weights: { grape: 1, fruity: 0.85, sweet: 0.8, floral: 0.4 },
  },

  // ══ flowers ════════════════════════════════════════════════════════
  {
    phrases: ["flowers", "a bouquet", "a garden in bloom", "blossom", "a flower bed", "spring flowers", "a meadow in bloom"],
    weights: { floral: 1, sweet: 0.6, green: 0.5, fresh: 0.5, honey: 0.4 },
  },
  {
    phrases: ["roses", "a rose", "rose petals", "a rose garden", "rosewater", "turkish delight"],
    weights: { rose: 1, floral: 0.9, sweet: 0.65, honey: 0.5, powdery: 0.4 },
  },
  {
    phrases: ["jasmine", "night blooming flowers", "orange blossom", "neroli", "a jasmine bush", "gardenia", "tuberose"],
    weights: { jasmine: 1, floral: 0.9, orangeblossom: 0.7, sweet: 0.6, animalic: 0.4 },
  },
  {
    phrases: ["lavender", "a lavender field", "lavender oil", "a sachet", "provence"],
    weights: { lavender: 1, herbal: 0.7, floral: 0.7, fresh: 0.55, camphoreous: 0.4 },
  },
  {
    phrases: ["violets", "a violet", "parma violets", "face powder", "a powder compact", "old makeup", "lipstick"],
    weights: { violet: 1, powdery: 0.9, floral: 0.7, sweet: 0.5, woody: 0.4 },
  },
  {
    phrases: ["lilac", "lily of the valley", "hyacinth", "spring blossom", "a lily", "freesia", "sweet peas"],
    weights: { floral: 1, fresh: 0.7, green: 0.6, powdery: 0.5, soapy: 0.45 },
  },

  // ══ people, body, feeling ══════════════════════════════════════════
  {
    phrases: ["a baby", "a baby's head", "a newborn", "baby powder", "a nursery", "talcum powder", "a baby blanket"],
    weights: { powdery: 1, creamy: 0.7, soapy: 0.7, sweet: 0.6, musk: 0.5, vanilla: 0.45 },
  },
  {
    phrases: ["skin", "someone's skin", "a hug", "someone's neck", "my mother", "my father", "someone i loved", "a person i miss", "body heat"],
    weights: { musk: 1, animalic: 0.7, powdery: 0.6, sweaty: 0.5, warm: 0.5, waxy: 0.4 },
  },
  {
    phrases: ["hair", "someone's hair", "clean hair", "a hairdresser", "a barbershop", "a salon"],
    weights: { soapy: 0.9, floral: 0.7, powdery: 0.55, musk: 0.5, solvent: 0.4 },
  },

  // ══ seasons and occasions ══════════════════════════════════════════
  {
    phrases: ["summer", "a summer evening", "summer nights", "a hot day", "july", "the last day of school", "a summer holiday"],
    weights: { grassy: 0.8, green: 0.7, coconut: 0.6, warm: 0.6, floral: 0.5, marine: 0.45, earthy: 0.4 },
  },
  {
    phrases: ["winter", "a winter morning", "december", "a cold night"],
    weights: { ozone: 0.8, fresh: 0.7, cooling: 0.6, pine: 0.5, woody: 0.45, smoky: 0.4 },
  },
  {
    phrases: ["spring", "the first warm day", "april", "new growth"],
    weights: { green: 0.9, floral: 0.8, grassy: 0.7, fresh: 0.7, earthy: 0.45 },
  },
  {
    phrases: ["childhood", "when i was a kid", "being a child", "my childhood home", "nostalgia", "a memory", "growing up", "my old house"],
    weights: { vanilla: 0.7, waxy: 0.6, sweet: 0.6, powdery: 0.55, musty: 0.5, woody: 0.45, soapy: 0.4 },
  },
  {
    phrases: ["a wedding", "a funeral", "a church service", "lilies", "a chapel"],
    weights: { floral: 1, powdery: 0.6, woody: 0.5, resinous: 0.45, sweet: 0.45 },
  },
  {
    phrases: ["halloween", "a pumpkin", "carving pumpkins", "candle wax", "a blown out candle", "a birthday candle"],
    weights: { waxy: 0.9, burnt: 0.7, smoky: 0.6, vegetable: 0.5, sweet: 0.4 },
  },
];

// Single words that are really just aliases for a vocabulary axis. Applied
// after phrase matching, so "smoky campfire" picks up the campfire entry and
// this only fills gaps.
export const SYNONYMS: Record<string, string> = {
  smoke: "smoky", smokey: "smoky", smoked: "smoky",
  burning: "burnt", charred: "burnt", scorched: "burnt", toasted: "roasted", toasty: "roasted",
  roast: "roasted", browned: "roasted",
  sugary: "sweet", sugar: "sweet", syrupy: "sweet",
  flowery: "floral", blossoms: "floral", petals: "floral",
  citrusy: "citrus", zesty: "citrus", lemony: "citrus", orangey: "citrus",
  fruit: "fruity", juicy: "fruity", ripe: "fruity",
  wood: "woody", timber: "woody", oak: "woody", oaky: "woody", bark: "woody",
  soil: "earthy", loam: "earthy", dirt: "earthy", muddy: "earthy",
  dank: "musty", damp: "musty", stale: "musty", mouldy: "musty", moldy: "musty",
  cool: "cooling", icy: "cooling", crisp: "fresh", clean: "fresh", airy: "fresh",
  salty: "marine", oceanic: "marine", briny: "marine", sea: "marine",
  medicine: "medicinal", antiseptic: "medicinal", hospital: "medicinal", clinical: "medicinal",
  chemical: "solvent", petrol: "solvent", acetone: "solvent", paint: "solvent",
  eggy: "sulfurous", sulphurous: "sulfurous", rotten: "fecal", rotting: "fecal", putrid: "fecal",
  garlicky: "alliaceous", oniony: "alliaceous", onion: "alliaceous", garlic: "alliaceous",
  savory: "savoury", umami: "savoury", brothy: "savoury",
  meat: "meaty", beefy: "meaty",
  milky: "creamy", cheese: "cheesy", funky: "cheesy",
  greasy: "fatty", oily: "fatty",
  nut: "nutty", nuts: "nutty",
  vanillic: "vanilla", caramel: "caramellic", toffee: "caramellic",
  bread: "bready", doughy: "bready", yeasty: "bready", biscuity: "bready",
  spice: "spicy", hot: "warm", cosy: "warm", cozy: "warm",
  animal: "animalic", feral: "animalic", musky: "musk",
  dusty: "powdery", talc: "powdery",
  sharp: "ethereal", boozy: "ethereal", alcohol: "ethereal",
  metal: "metallic", tinny: "metallic", bloody: "metallic", iron: "metallic",
  tar: "tarry", bitumen: "tarry",
  plasticky: "plastic", synthetic: "plastic",
  bo: "sweaty", perspiration: "sweaty",
  urine: "urinous", pee: "urinous", ammonia: "ammoniacal",
  fish: "fishy", herby: "herbal", herbs: "herbal",
  piney: "pine", resin: "resinous", sap: "resinous", balsam: "balsamic",
  soap: "soapy", detergent: "soapy",
  vinegary: "sour", acidic: "sour", tart: "sour", fermented: "sour",
  wine: "winey", winy: "winey",
  frying: "fried", deepfried: "fried",
  leathery: "leather", hide: "leather",
  rubber: "rubbery", latex: "rubbery",
  mushroomy: "mushroom", fungal: "mushroom", moss: "mossy",
};
