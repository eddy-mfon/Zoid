/* ZOID Concrete Ritual: the catalog is built from the user's real club jersey photography, with honest stock signals and a two-week Lagos delivery promise. */
export type GalleryView = { label: "Front" | "Back" | "Close-up"; image: string; treatment: "front" | "back" | "detail" };
export type Product = {
  slug: string;
  name: string;
  category: string;
  price: string;
  image: string;
  gallery: GalleryView[];
  tone: string;
  style: string;
  color: string;
  sizes: string[];
  stock: Record<string, number>;
  fit: string;
  fitNote: string;
  details: string;
  delivery: string;
};

const sharedFit = "True to size";
const sharedFitNote = "Choose your usual size for a relaxed match-day fit. Size up for more room through the body.";
const delivery = "Delivered in 2 weeks";
const galleryFor = (image: string): GalleryView[] => [
  { label: "Front", image, treatment: "front" },
  { label: "Back", image, treatment: "back" },
  { label: "Close-up", image, treatment: "detail" }
];

export const products: Product[] = [
  { slug: "ac-milan-2526", name: "AC Milan / 25—26", category: "CURATED JERSEY", price: "₦58,500", image: "/manus-storage/ac-milan-2526_b917ea29.jpg", gallery: galleryFor("/manus-storage/ac-milan-2526_b917ea29.jpg"), tone: "Red / Black", style: "Jersey", color: "Red", sizes: ["M", "L", "XL"], stock: { M: 8, L: 3, XL: 6 }, fit: sharedFit, fitNote: sharedFitNote, details: "A classic Rossoneri stripe, selected for the rhythm of the shirt and the weight it carries across generations.", delivery },
  { slug: "barcelona-away", name: "Barcelona / Away", category: "ARCHIVE EDITION", price: "₦62,000", image: "/manus-storage/barcelona_9a244f02.jpg", gallery: galleryFor("/manus-storage/barcelona_9a244f02.jpg"), tone: "Onyx / Red", style: "Archive", color: "Black", sizes: ["M", "L", "XL"], stock: { M: 2, L: 7, XL: 4 }, fit: "Relaxed", fitNote: "A roomier archival cut. Size down for a closer silhouette or stay true to size for the full vintage shape.", details: "A dark away expression with a sharp contrast story, curated for late-night streets and long-distance football memory.", delivery },
  { slug: "inter-milan-2526", name: "Inter Milan / 25—26", category: "CURATED JERSEY", price: "₦59,500", image: "/manus-storage/inter-milan-2526_65e7cadc.jpg", gallery: galleryFor("/manus-storage/inter-milan-2526_65e7cadc.jpg"), tone: "Blue / Black", style: "Jersey", color: "Blue", sizes: ["M", "L", "XL"], stock: { M: 5, L: 1, XL: 3 }, fit: sharedFit, fitNote: sharedFitNote, details: "A blue-black vertical code from San Siro, selected for its graphic discipline and unmistakable match-day presence.", delivery },
  { slug: "liverpool-2526", name: "Liverpool / 25—26", category: "HERITAGE DROP", price: "₦61,500", image: "/manus-storage/liverpool-2526_78e5ffc7.jpg", gallery: galleryFor("/manus-storage/liverpool-2526_78e5ffc7.jpg"), tone: "Red / Bone", style: "Heritage", color: "Red", sizes: ["M", "L", "XL"], stock: { M: 9, L: 4, XL: 2 }, fit: "Athletic", fitNote: "Designed close through the chest with stretch through the body. Stay true to size for the intended athletic profile.", details: "A red shirt with a city-wide pulse, carrying the energy of the Kop into a new field of wear.", delivery },
  { slug: "manchester-united-2526", name: "Manchester United / 25—26", category: "CURATED JERSEY", price: "₦60,500", image: "/manus-storage/manchester-united-2526_2aca202f.jpg", gallery: galleryFor("/manus-storage/manchester-united-2526_2aca202f.jpg"), tone: "Red / Black", style: "Jersey", color: "Red", sizes: ["M", "L", "XL"], stock: { M: 4, L: 2, XL: 8 }, fit: sharedFit, fitNote: sharedFitNote, details: "A red home statement shaped by one of football's most persistent visual languages: crest, collar, conviction.", delivery },
  { slug: "manchester-city-2324", name: "Manchester City / 23—24", category: "ARCHIVE EDITION", price: "₦55,000", image: "/manus-storage/manchester-city-2324_a2693d41.jpg", gallery: galleryFor("/manus-storage/manchester-city-2324_a2693d41.jpg"), tone: "Sky / White", style: "Archive", color: "White", sizes: ["M", "L", "XL"], stock: { M: 6, L: 5, XL: 1 }, fit: "Relaxed", fitNote: "A roomier archival cut. Size down for a closer silhouette or stay true to size for the full vintage shape.", details: "A clean sky-blue archive cut, chosen for the calm confidence of a side that kept rising.", delivery },
  { slug: "newcastle-2526", name: "Newcastle / 25—26", category: "HERITAGE DROP", price: "₦57,500", image: "/manus-storage/newcastle-2526_802db4b3.jpg", gallery: galleryFor("/manus-storage/newcastle-2526_802db4b3.jpg"), tone: "Black / White", style: "Heritage", color: "Black", sizes: ["M", "L", "XL"], stock: { M: 3, L: 2, XL: 7 }, fit: sharedFit, fitNote: sharedFitNote, details: "Black and white stripes with a northern edge, selected as evidence that identity can be immediate and lasting.", delivery },
  { slug: "aston-villa-home", name: "Aston Villa / Home", category: "CURATED JERSEY", price: "₦56,500", image: "/manus-storage/aston-villa_fd1eeff3.jpg", gallery: galleryFor("/manus-storage/aston-villa_fd1eeff3.jpg"), tone: "Claret / Blue", style: "Jersey", color: "Red", sizes: ["M", "L", "XL"], stock: { M: 5, L: 6, XL: 2 }, fit: "Athletic", fitNote: "Designed close through the chest with stretch through the body. Stay true to size for the intended athletic profile.", details: "A claret-and-blue home cut with a strong shoulder line and a story built on belonging.", delivery },
  { slug: "real-madrid-2627", name: "Real Madrid / 26—27", category: "SPECIAL KIT", price: "₦64,000", image: "/manus-storage/real-madrid-2627_1566a606.jpg", gallery: galleryFor("/manus-storage/real-madrid-2627_1566a606.jpg"), tone: "White / Onyx", style: "Jersey", color: "White", sizes: ["M", "L", "XL"], stock: { M: 1, L: 4, XL: 3 }, fit: sharedFit, fitNote: sharedFitNote, details: "A white first layer with a sharp new-season line, held for the collector who knows when a classic shifts.", delivery },
  { slug: "juventus-2526", name: "Juventus / 25—26", category: "SPECIAL KIT", price: "₦63,500", image: "/manus-storage/juventus-2526_98206217.jpg", gallery: galleryFor("/manus-storage/juventus-2526_98206217.jpg"), tone: "Black / White", style: "Jersey", color: "Black", sizes: ["M", "L", "XL"], stock: { M: 7, L: 2, XL: 5 }, fit: sharedFit, fitNote: sharedFitNote, details: "A monochrome Turin code, curated for graphic impact and the discipline of a shirt that never needs to shout.", delivery },
  { slug: "lyon-2526", name: "Lyon / 25—26", category: "SPECIAL KIT", price: "₦58,000", image: "/manus-storage/lyon-2526_f3a4ee85.jpg", gallery: galleryFor("/manus-storage/lyon-2526_f3a4ee85.jpg"), tone: "White / Red / Blue", style: "Heritage", color: "White", sizes: ["M", "L", "XL"], stock: { M: 3, L: 8, XL: 1 }, fit: "Relaxed", fitNote: "A roomier archival cut. Size down for a closer silhouette or stay true to size for the full vintage shape.", details: "A bright French archive piece with red-blue punctuation, selected for its balance of restraint and movement.", delivery },
  { slug: "brazil-1998", name: "Brazil / 1998 Vintage", category: "ARCHIVE EDITION", price: "₦68,000", image: "/jerseys/National/Brazil 1998 home vintage jersey.jpg", gallery: galleryFor("/jerseys/National/Brazil 1998 home vintage jersey.jpg"), tone: "Canary Yellow / Green", style: "Archive", color: "Yellow", sizes: ["M", "L", "XL"], stock: { M: 4, L: 3, XL: 2 }, fit: "Relaxed", fitNote: "Classic 90s boxy fit. Fits true to size with iconic roominess.", details: "The legendary 1998 Samba classic worn by Ronaldo and Rivaldo in France.", delivery },
  { slug: "england-wc", name: "England / World Cup", category: "NATIONAL TEAM", price: "₦65,000", image: "/jerseys/National/England national WC.jpg", gallery: galleryFor("/jerseys/National/England national WC.jpg"), tone: "Pure White / Navy", style: "Heritage", color: "White", sizes: ["M", "L", "XL"], stock: { M: 6, L: 4, XL: 5 }, fit: sharedFit, fitNote: sharedFitNote, details: "Three Lions white edition crafted for international competition.", delivery },
  { slug: "france-2026-away", name: "France / 2026 Away", category: "NATIONAL TEAM", price: "₦66,500", image: "/jerseys/National/France FIFA world cup 2026 away.jpg", gallery: galleryFor("/jerseys/National/France FIFA world cup 2026 away.jpg"), tone: "White / Tricolore", style: "Jersey", color: "White", sizes: ["M", "L", "XL"], stock: { M: 5, L: 5, XL: 3 }, fit: "Athletic", fitNote: sharedFitNote, details: "Les Bleus away kit tailored with French elegance for the 2026 World Cup.", delivery },
  { slug: "germany-2026", name: "Germany / 2026 WC", category: "NATIONAL TEAM", price: "₦66,000", image: "/jerseys/National/Germany 26 WC.jpg", gallery: galleryFor("/jerseys/National/Germany 26 WC.jpg"), tone: "White / Black", style: "Jersey", color: "White", sizes: ["M", "L", "XL"], stock: { M: 3, L: 6, XL: 4 }, fit: sharedFit, fitNote: sharedFitNote, details: "Deutscher Fußball-Bund classic white edition built for tournament pressure.", delivery },
  { slug: "japan-2026", name: "Japan / 2026 Special", category: "SPECIAL KIT", price: "₦67,000", image: "/jerseys/National/Japan 26 WCC.jpg", gallery: galleryFor("/jerseys/National/Japan 26 WCC.jpg"), tone: "Samurai Blue", style: "Special", color: "Blue", sizes: ["M", "L", "XL"], stock: { M: 2, L: 8, XL: 1 }, fit: "Athletic", fitNote: sharedFitNote, details: "Samurai Blue special world edition featuring intricate traditional wave motif.", delivery },
  { slug: "norway-2026", name: "Norway / 2026 Home", category: "NATIONAL TEAM", price: "₦64,500", image: "/jerseys/National/Norway home jersey World Cup 2026.jpg", gallery: galleryFor("/jerseys/National/Norway home jersey World Cup 2026.jpg"), tone: "Crimson / Blue", style: "Jersey", color: "Red", sizes: ["M", "L", "XL"], stock: { M: 5, L: 2, XL: 6 }, fit: sharedFit, fitNote: sharedFitNote, details: "Viking red home edition built for speed and power.", delivery },
  { slug: "spain-2026-away", name: "Spain / 2026 Away", category: "NATIONAL TEAM", price: "₦65,500", image: "/jerseys/National/Spain jersey World Cup 2026 away.jpg", gallery: galleryFor("/jerseys/National/Spain jersey World Cup 2026 away.jpg"), tone: "Yellow / Red", style: "Jersey", color: "Yellow", sizes: ["M", "L", "XL"], stock: { M: 4, L: 4, XL: 3 }, fit: sharedFit, fitNote: sharedFitNote, details: "La Roja away iteration designed for high tempo fluid play.", delivery },
  { slug: "spain-national", name: "Spain / Home Heritage", category: "HERITAGE DROP", price: "₦66,000", image: "/jerseys/National/Spain national.jpg", gallery: galleryFor("/jerseys/National/Spain national.jpg"), tone: "Red / Gold", style: "Heritage", color: "Red", sizes: ["M", "L", "XL"], stock: { M: 7, L: 3, XL: 2 }, fit: sharedFit, fitNote: sharedFitNote, details: "Classic La Roja red home jersey with gold emblem accents.", delivery },
  { slug: "zoid-pro-gym-set", name: "ZOID Pro Gym Set / Black", category: "GYM KITS", price: "₦48,000", image: "/manus-storage/zoid-jersey-detail_0ef688bb.jpg", gallery: galleryFor("/manus-storage/zoid-jersey-detail_0ef688bb.jpg"), tone: "Onyx / Stealth", style: "Gym Kit", color: "Black", sizes: ["S", "M", "L", "XL"], stock: { S: 5, M: 10, L: 8, XL: 4 }, fit: "Athletic", fitNote: "Engineered high-stretch performance compression fit.", details: "Monochrome training set with moisture-wicking technology and minimal branding.", delivery },
  { slug: "zoid-training-kit-red", name: "ZOID Apex Gym Kit / Crimson", category: "GYM KITS", price: "₦52,000", image: "/manus-storage/ac-milan-2526_b917ea29.jpg", gallery: galleryFor("/manus-storage/ac-milan-2526_b917ea29.jpg"), tone: "Crimson / Slate", style: "Gym Kit", color: "Red", sizes: ["S", "M", "L", "XL"], stock: { S: 4, M: 7, L: 6, XL: 2 }, fit: "Athletic", fitNote: "Ergonomic fit designed for high-intensity training sessions.", details: "Breathable activewear kit constructed from lightweight technical fabrics.", delivery }
];

export const productBySlug = (slug?: string) => products.find((product) => product.slug === slug);


type SearchableProduct = Product;

const normalizeSearch = (value: string) => value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();

const editDistance = (left: string, right: string) => {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    let diagonal = previous[0];
    previous[0] = row;
    for (let column = 1; column <= right.length; column += 1) {
      const above = previous[column];
      const cost = left[row - 1] === right[column - 1] ? 0 : 1;
      previous[column] = Math.min(previous[column] + 1, previous[column - 1] + 1, diagonal + cost);
      diagonal = above;
    }
  }
  return previous[right.length];
};

const tokenSimilarity = (queryToken: string, productToken: string) => {
  if (!queryToken || !productToken) return 0;
  if (productToken.includes(queryToken) || queryToken.includes(productToken)) return 1;
  const distance = editDistance(queryToken, productToken);
  const scale = Math.max(queryToken.length, productToken.length);
  return distance <= 2 && scale >= 5 ? Math.max(0, 1 - distance / scale) : 0;
};

export const searchProducts = (query: string): SearchableProduct[] => {
  const normalized = normalizeSearch(query);
  if (!normalized) return products;
  const queryTokens = normalized.split(/\s+/).filter(Boolean);
  return products
    .map((product, index) => {
      const searchable = normalizeSearch(`${product.name} ${product.category} ${product.color} ${product.style} ${product.tone}`);
      const productTokens = searchable.split(/\s+/);
      const tokenScores = queryTokens.map((queryToken) => Math.max(...productTokens.map((productToken) => tokenSimilarity(queryToken, productToken)), 0));
      const matched = tokenScores.filter((score) => score > 0).length;
      const score = tokenScores.reduce((sum, value) => sum + value, 0) / queryTokens.length + (matched === queryTokens.length ? 0.18 : 0) - index * 0.0005;
      return { product, score };
    })
    .filter(({ score }) => score >= 0.3)
    .sort((a, b) => b.score - a.score)
    .map(({ product }) => product);
};
