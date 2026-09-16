import type { Cafe, Drink, FeedPost, Member, Neighbourhood, Rating, RedemptionRecord, Subscription } from './types';

export const neighbourhoods: Neighbourhood[] = [
  { id: 'n-deep-ellum', name: 'Deep Ellum' },
  { id: 'n-bishop-arts', name: 'Bishop Arts' },
  { id: 'n-uptown', name: 'Uptown' },
  { id: 'n-trinity-groves', name: 'Trinity Groves' },
  { id: 'n-lower-greenville', name: 'Lower Greenville' },
];

export const cafes: Cafe[] = [
  {
    id: 'cafe-elm-and-oak',
    name: 'Elm & Oak Coffee',
    neighbourhoodId: 'n-deep-ellum',
    address: '2934 Elm St, Dallas, TX',
    hours: 'Open until 7:00 PM',
    vibeTags: ['Cozy', 'Live music nearby', 'Laptop friendly'],
    distanceLabel: '0.4 mi',
    photoColor: '#C97B3D',
    photoEmoji: '☕',
    ratingAvg: 4.7,
    ratingCount: 128,
  },
  {
    id: 'cafe-bishop-brew',
    name: 'Bishop Brew Collective',
    neighbourhoodId: 'n-bishop-arts',
    address: '408 N Bishop Ave, Dallas, TX',
    hours: 'Open until 6:00 PM',
    vibeTags: ['Local roaster', 'Patio seating'],
    distanceLabel: '1.2 mi',
    photoColor: '#8C6446',
    photoEmoji: '🌿',
    ratingAvg: 4.9,
    ratingCount: 212,
  },
  {
    id: 'cafe-uptown-pour',
    name: 'Uptown Pour House',
    neighbourhoodId: 'n-uptown',
    address: '2500 McKinney Ave, Dallas, TX',
    hours: 'Open until 8:00 PM',
    vibeTags: ['Fast pickup', 'Great for meetings'],
    distanceLabel: '2.6 mi',
    photoColor: '#6B4A32',
    photoEmoji: '🥐',
    ratingAvg: 4.5,
    ratingCount: 96,
  },
  {
    id: 'cafe-trinity-roast',
    name: 'Trinity Roasting Co.',
    neighbourhoodId: 'n-trinity-groves',
    address: '3011 Gulden Ln, Dallas, TX',
    hours: 'Open until 5:00 PM',
    vibeTags: ['Small batch', 'Dog friendly'],
    distanceLabel: '3.1 mi',
    photoColor: '#8A5A34',
    photoEmoji: '🐾',
    ratingAvg: 4.6,
    ratingCount: 74,
  },
  {
    id: 'cafe-greenville-grind',
    name: 'Greenville Grind',
    neighbourhoodId: 'n-lower-greenville',
    address: '1919 Greenville Ave, Dallas, TX',
    hours: 'Open until 9:00 PM',
    vibeTags: ['Late hours', 'Study spot'],
    distanceLabel: '4.0 mi',
    photoColor: '#B5652F',
    photoEmoji: '📚',
    ratingAvg: 4.4,
    ratingCount: 61,
  },
  {
    id: 'cafe-boba-bliss',
    name: 'Boba Bliss Tea Bar',
    neighbourhoodId: 'n-deep-ellum',
    address: '2811 Commerce St, Dallas, TX',
    hours: 'Open until 9:00 PM',
    vibeTags: ['Boba', 'Instagrammable', 'Group friendly'],
    distanceLabel: '0.8 mi',
    photoColor: '#8B6BA8',
    photoEmoji: '🧋',
    ratingAvg: 4.8,
    ratingCount: 154,
  },
  {
    id: 'cafe-trinity-squeeze',
    name: 'Trinity Squeeze Juice Bar',
    neighbourhoodId: 'n-uptown',
    address: '2415 McKinney Ave, Dallas, TX',
    hours: 'Open until 7:00 PM',
    vibeTags: ['Cold-pressed', 'Post-workout favorite'],
    distanceLabel: '1.6 mi',
    photoColor: '#E0A526',
    photoEmoji: '🥤',
    ratingAvg: 4.6,
    ratingCount: 88,
  },
];

export const drinks: Drink[] = [
  // Elm & Oak
  { id: 'drink-elm-latte', cafeId: 'cafe-elm-and-oak', name: 'Honey Oat Latte', description: 'Espresso, steamed oat milk, local honey', category: 'latte', retailPriceCents: 650, creditCost: 4, active: true, imageUri: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=700&q=85' },
  { id: 'drink-elm-cold-brew', cafeId: 'cafe-elm-and-oak', name: 'Cold Brew', description: 'Slow-steeped 18 hours', category: 'cold_brew', retailPriceCents: 500, creditCost: 3, active: true, imageUri: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=85' },
  { id: 'drink-elm-matcha', cafeId: 'cafe-elm-and-oak', name: 'Ceremonial Matcha', description: 'Whisked to order, oat milk', category: 'matcha', retailPriceCents: 600, creditCost: 4, active: true },
  { id: 'drink-elm-drip', cafeId: 'cafe-elm-and-oak', name: 'House Drip', description: 'Rotating single-origin', category: 'coffee', retailPriceCents: 350, creditCost: 2, active: true },
  { id: 'drink-elm-hojicha', cafeId: 'cafe-elm-and-oak', name: 'Iced Hojicha Latte', description: 'Roasted green tea, oat milk, ice', category: 'hojicha', retailPriceCents: 575, creditCost: 3, active: true },

  // Bishop Brew
  { id: 'drink-bishop-cortado', cafeId: 'cafe-bishop-brew', name: 'Cortado', description: 'Equal parts espresso and steamed milk', category: 'espresso', retailPriceCents: 475, creditCost: 3, active: true },
  { id: 'drink-bishop-espresso', cafeId: 'cafe-bishop-brew', name: 'Double Espresso', description: 'House blend, bright and bold', category: 'espresso', retailPriceCents: 400, creditCost: 3, active: true },
  { id: 'drink-bishop-latte', cafeId: 'cafe-bishop-brew', name: 'Vanilla Bean Latte', description: 'Espresso, whole milk, vanilla bean', category: 'latte', retailPriceCents: 600, creditCost: 4, active: true },
  { id: 'drink-bishop-iced-vanilla-latte', cafeId: 'cafe-bishop-brew', name: 'Iced Vanilla Latte', description: 'Espresso, cold milk, vanilla, ice', category: 'latte', retailPriceCents: 625, creditCost: 4, active: true, imageUri: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=85' },

  // Uptown Pour
  { id: 'drink-uptown-americano', cafeId: 'cafe-uptown-pour', name: 'Americano', description: 'Espresso over hot water', category: 'espresso', retailPriceCents: 400, creditCost: 3, active: true },
  { id: 'drink-uptown-mocha', cafeId: 'cafe-uptown-pour', name: 'Dark Mocha', description: 'Espresso, dark chocolate, steamed milk', category: 'latte', retailPriceCents: 675, creditCost: 4, active: true },
  { id: 'drink-uptown-coldbrew', cafeId: 'cafe-uptown-pour', name: 'Vanilla Cold Brew', description: 'Cold brew, vanilla sweet cream', category: 'cold_brew', retailPriceCents: 550, creditCost: 3, active: true },

  // Trinity Roasting
  { id: 'drink-trinity-pourover', cafeId: 'cafe-trinity-roast', name: 'Pour Over', description: 'Single origin, brewed to order', category: 'coffee', retailPriceCents: 550, creditCost: 3, active: true },
  { id: 'drink-trinity-latte', cafeId: 'cafe-trinity-roast', name: 'Cinnamon Oat Latte', description: 'Espresso, oat milk, cinnamon', category: 'latte', retailPriceCents: 625, creditCost: 4, active: true },
  { id: 'drink-trinity-seasonal', cafeId: 'cafe-trinity-roast', name: 'Maple Pecan Cold Brew', description: 'Limited-time seasonal pour', category: 'seasonal', retailPriceCents: 625, creditCost: 4, active: true },

  // Greenville Grind
  { id: 'drink-greenville-drip', cafeId: 'cafe-greenville-grind', name: 'House Drip', description: 'Bottomless-friendly medium roast', category: 'coffee', retailPriceCents: 325, creditCost: 2, active: true },
  { id: 'drink-greenville-matcha', cafeId: 'cafe-greenville-grind', name: 'Iced Matcha Latte', description: 'Ceremonial matcha, oat milk, ice', category: 'matcha', retailPriceCents: 600, creditCost: 4, active: true },
  { id: 'drink-greenville-chai', cafeId: 'cafe-greenville-grind', name: 'Housemade Chai Latte', description: 'Slow-steeped spiced chai', category: 'chai', retailPriceCents: 550, creditCost: 3, active: true, imageUri: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=700&q=85' },
  { id: 'drink-greenville-specialty-tea', cafeId: 'cafe-greenville-grind', name: 'Jasmine Silver Needle', description: 'Loose-leaf white tea, steeped to order', category: 'specialty_tea', retailPriceCents: 475, creditCost: 3, active: true },

  // Boba Bliss Tea Bar
  { id: 'drink-boba-brown-sugar-milk-tea', cafeId: 'cafe-boba-bliss', name: 'Brown Sugar Milk Tea', description: 'Black tea, brown sugar boba, fresh milk', category: 'milk_tea', retailPriceCents: 625, creditCost: 4, active: true, imageUri: 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=700&q=85' },
  { id: 'drink-boba-taro', cafeId: 'cafe-boba-bliss', name: 'Taro Milk Tea', description: 'Creamy taro, tapioca pearls', category: 'boba', retailPriceCents: 650, creditCost: 4, active: true, imageUri: 'https://images.unsplash.com/photo-1627483262268-9c2b5be8c8e9?auto=format&fit=crop&w=700&q=85' },
  { id: 'drink-boba-strawberry-matcha', cafeId: 'cafe-boba-bliss', name: 'Strawberry Matcha', description: 'Layered strawberry puree and ceremonial matcha', category: 'matcha', retailPriceCents: 675, creditCost: 4, active: true, imageUri: 'https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?auto=format&fit=crop&w=700&q=85' },
  { id: 'drink-boba-peach-fruit-tea', cafeId: 'cafe-boba-bliss', name: 'Peach Fruit Tea', description: 'Fresh peach, green tea, popping boba', category: 'fruit_tea', retailPriceCents: 600, creditCost: 3, active: true },
  { id: 'drink-boba-thai-tea', cafeId: 'cafe-boba-bliss', name: 'Thai Tea', description: 'Classic spiced black tea, condensed milk', category: 'milk_tea', retailPriceCents: 600, creditCost: 3, active: true },

  // Trinity Squeeze Juice Bar
  { id: 'drink-squeeze-green-juice', cafeId: 'cafe-trinity-squeeze', name: 'Green Detox Juice', description: 'Kale, cucumber, green apple, ginger', category: 'juice', retailPriceCents: 700, creditCost: 4, active: true, imageUri: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=700&q=85' },
  { id: 'drink-squeeze-mango-smoothie', cafeId: 'cafe-trinity-squeeze', name: 'Mango Smoothie', description: 'Mango, banana, coconut milk', category: 'smoothie', retailPriceCents: 675, creditCost: 4, active: true, imageUri: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=700&q=85' },
  { id: 'drink-squeeze-strawberry-lemonade', cafeId: 'cafe-trinity-squeeze', name: 'Strawberry Lemonade', description: 'Fresh-squeezed lemonade, strawberry puree', category: 'lemonade', retailPriceCents: 550, creditCost: 3, active: true, imageUri: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=700&q=85' },
  { id: 'drink-squeeze-watermelon-refresher', cafeId: 'cafe-trinity-squeeze', name: 'Watermelon Mint Refresher', description: 'Cold-pressed watermelon, mint, lime', category: 'refresher', retailPriceCents: 600, creditCost: 3, active: true },
  { id: 'drink-squeeze-hot-chocolate', cafeId: 'cafe-trinity-squeeze', name: 'Drinking Chocolate', description: 'Dark cocoa, steamed milk, whipped cream', category: 'hot_chocolate', retailPriceCents: 575, creditCost: 3, active: true },
];

export const ratings: Rating[] = [
  { id: 'r1', drinkId: 'drink-elm-latte', cafeId: 'cafe-elm-and-oak', userName: 'Priya S.', stars: 5, note: 'Best oat latte in Deep Ellum, hands down.', verifiedRedemption: true },
  { id: 'r2', drinkId: 'drink-elm-cold-brew', cafeId: 'cafe-elm-and-oak', userName: 'Marcus T.', stars: 4, note: 'Smooth, not too acidic.', verifiedRedemption: true },
  { id: 'r3', drinkId: 'drink-bishop-cortado', cafeId: 'cafe-bishop-brew', userName: 'Jordan R.', stars: 5, note: 'Perfect texture every time.', verifiedRedemption: true },
  { id: 'r4', drinkId: 'drink-bishop-latte', cafeId: 'cafe-bishop-brew', userName: 'Ana G.', stars: 5, verifiedRedemption: false },
  { id: 'r5', drinkId: 'drink-uptown-mocha', cafeId: 'cafe-uptown-pour', userName: 'Chris L.', stars: 4, note: 'Rich, a little sweet.', verifiedRedemption: true },
  { id: 'r6', drinkId: 'drink-trinity-pourover', cafeId: 'cafe-trinity-roast', userName: 'Devon K.', stars: 5, note: 'Loved the dog on the patio too.', verifiedRedemption: true },
  { id: 'r7', drinkId: 'drink-greenville-matcha', cafeId: 'cafe-greenville-grind', userName: 'Sam W.', stars: 4, verifiedRedemption: false },
  { id: 'r8', drinkId: 'drink-boba-strawberry-matcha', cafeId: 'cafe-boba-bliss', userName: 'Sarah', stars: 5, note: 'This matcha was incredible.', verifiedRedemption: true },
  { id: 'r9', drinkId: 'drink-boba-brown-sugar-milk-tea', cafeId: 'cafe-boba-bliss', userName: 'Mike', stars: 5, verifiedRedemption: true },
  { id: 'r10', drinkId: 'drink-bishop-iced-vanilla-latte', cafeId: 'cafe-bishop-brew', userName: 'Priya', stars: 5, note: 'Perfect afternoon drink.', verifiedRedemption: true },
];

export const feedPosts: FeedPost[] = [
  {
    id: 'feed-1',
    userName: 'Sarah',
    userInitials: 'S',
    distanceLabel: '0.8 mi away',
    drinkId: 'drink-boba-strawberry-matcha',
    cafeId: 'cafe-boba-bliss',
    caption: 'This matcha was 🔥',
    likeCount: 42,
    commentCount: 7,
  },
  {
    id: 'feed-2',
    userName: 'Mike',
    userInitials: 'M',
    distanceLabel: '1.4 mi away',
    drinkId: 'drink-boba-brown-sugar-milk-tea',
    cafeId: 'cafe-boba-bliss',
    likeCount: 28,
    commentCount: 4,
  },
  {
    id: 'feed-3',
    userName: 'Priya',
    userInitials: 'P',
    distanceLabel: '2.1 mi away',
    drinkId: 'drink-bishop-iced-vanilla-latte',
    cafeId: 'cafe-bishop-brew',
    caption: 'Perfect afternoon drink.',
    likeCount: 19,
    commentCount: 3,
  },
  {
    id: 'feed-4',
    userName: 'Devon K.',
    userInitials: 'DK',
    distanceLabel: '1.0 mi away',
    drinkId: 'drink-squeeze-green-juice',
    cafeId: 'cafe-trinity-squeeze',
    caption: 'Needed this after a run.',
    likeCount: 15,
    commentCount: 2,
  },
  {
    id: 'feed-5',
    userName: 'Ana G.',
    userInitials: 'AG',
    distanceLabel: '2.6 mi away',
    drinkId: 'drink-squeeze-watermelon-refresher',
    cafeId: 'cafe-trinity-squeeze',
    caption: 'So refreshing on a hot day.',
    likeCount: 33,
    commentCount: 5,
  },
];

export const currentMember: Member = {
  id: 'member-jordan',
  displayName: 'Jordan Ramirez',
  email: 'jordan.ramirez@example.com',
  homeNeighbourhoodId: 'n-bishop-arts',
  preferences: ['espresso', 'oat-milk', 'cold-brew'],
};

export const currentSubscription: Subscription = {
  status: 'ACTIVE',
  planName: 'Social Cup Membership',
  priceLabel: '$24.99/mo',
  creditsPerPeriod: 30,
  currentPeriodEnd: 'Oct 9, 2026',
  cancelAtPeriodEnd: false,
};

export const initialBalance = 18;

export const initialHistory: RedemptionRecord[] = [
  {
    id: 'redemption-1',
    cafeId: 'cafe-bishop-brew',
    cafeName: 'Bishop Brew Collective',
    drinkId: 'drink-bishop-cortado',
    drinkName: 'Cortado',
    creditCost: 3,
    redeemedAt: 'Sep 7, 2026 · 8:14 AM',
    status: 'COMPLETED',
  },
  {
    id: 'redemption-2',
    cafeId: 'cafe-elm-and-oak',
    cafeName: 'Elm & Oak Coffee',
    drinkId: 'drink-elm-latte',
    drinkName: 'Honey Oat Latte',
    creditCost: 4,
    redeemedAt: 'Sep 5, 2026 · 9:02 AM',
    status: 'COMPLETED',
  },
  {
    id: 'redemption-3',
    cafeId: 'cafe-uptown-pour',
    cafeName: 'Uptown Pour House',
    drinkId: 'drink-uptown-mocha',
    drinkName: 'Dark Mocha',
    creditCost: 4,
    redeemedAt: 'Sep 2, 2026 · 4:47 PM',
    status: 'COMPLETED',
  },
  {
    id: 'redemption-4',
    cafeId: 'cafe-bishop-brew',
    cafeName: 'Bishop Brew Collective',
    drinkId: 'drink-bishop-espresso',
    drinkName: 'Double Espresso',
    creditCost: 3,
    redeemedAt: 'Aug 30, 2026 · 7:55 AM',
    status: 'VOIDED',
  },
];

export function cafeById(id: string): Cafe | undefined {
  return cafes.find((c) => c.id === id);
}

export function drinkById(id: string): Drink | undefined {
  return drinks.find((d) => d.id === id);
}

export function drinksForCafe(cafeId: string): Drink[] {
  return drinks.filter((d) => d.cafeId === cafeId && d.active);
}

export function activeDrinks(): Drink[] {
  return drinks.filter((d) => d.active);
}

export function ratingsForCafe(cafeId: string): Rating[] {
  return ratings.filter((r) => r.cafeId === cafeId);
}

export function ratingsForDrink(drinkId: string): Rating[] {
  return ratings.filter((r) => r.drinkId === drinkId);
}

export function averageRatingForDrink(drinkId: string, fallback: number): number {
  const forDrink = ratingsForDrink(drinkId);
  if (forDrink.length === 0) return fallback;
  return forDrink.reduce((sum, r) => sum + r.stars, 0) / forDrink.length;
}

export function neighbourhoodName(id: string): string {
  return neighbourhoods.find((n) => n.id === id)?.name ?? 'Dallas';
}

// Single seam for "where the member currently is" — a real geolocation
// integration would replace this function body only.
export function getCurrentLocationLabel(): string {
  return neighbourhoodName(currentMember.homeNeighbourhoodId);
}

// Curated mock discovery lists. Hand-authored rather than computed so the
// home feed reads intentionally; a real recommendation API would replace
// these three functions without touching any screen.
const nearbyDrinkIds = [
  'drink-boba-strawberry-matcha',
  'drink-boba-brown-sugar-milk-tea',
  'drink-bishop-iced-vanilla-latte',
  'drink-squeeze-mango-smoothie',
  'drink-elm-cold-brew',
  'drink-greenville-chai',
];

const popularDrinkIds = [
  'drink-elm-latte',
  'drink-bishop-cortado',
  'drink-boba-taro',
  'drink-squeeze-green-juice',
  'drink-trinity-pourover',
  'drink-boba-peach-fruit-tea',
];

const trendingDrinkIds = [
  'drink-squeeze-strawberry-lemonade',
  'drink-boba-strawberry-matcha',
  'drink-greenville-matcha',
  'drink-squeeze-watermelon-refresher',
  'drink-uptown-mocha',
  'drink-elm-hojicha',
];

function drinksByIds(ids: string[]): Drink[] {
  return ids.map((id) => drinkById(id)).filter((d): d is Drink => !!d && d.active);
}

export function getNearbyDrinks(): Drink[] {
  return drinksByIds(nearbyDrinkIds);
}

export function getPopularDrinks(): Drink[] {
  return drinksByIds(popularDrinkIds);
}

export function getTrendingDrinks(): Drink[] {
  return drinksByIds(trendingDrinkIds);
}

export function nearbyVenues(): Cafe[] {
  return [...cafes].sort((a, b) => parseFloat(a.distanceLabel) - parseFloat(b.distanceLabel));
}

export function communityMentionsForDrink(drinkId: string): string[] {
  const mentions: string[] = [];
  feedPosts
    .filter((p) => p.drinkId === drinkId)
    .forEach((p) => mentions.push(`${p.userName} tried this`));
  ratingsForDrink(drinkId).forEach((r) => mentions.push(`${r.userName} rated this ${r.stars} stars`));
  return mentions.slice(0, 3);
}
