import type { Cafe, Drink, Member, Neighbourhood, Rating, RedemptionRecord, Subscription } from './types';

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
    photoColor: '#6F4E37',
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
    photoColor: '#4B2E1E',
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
];

export const drinks: Drink[] = [
  // Elm & Oak
  { id: 'drink-elm-latte', cafeId: 'cafe-elm-and-oak', name: 'Honey Oat Latte', description: 'Espresso, steamed oat milk, local honey', retailPriceCents: 650, creditCost: 4, active: true },
  { id: 'drink-elm-cold-brew', cafeId: 'cafe-elm-and-oak', name: 'Cold Brew', description: 'Slow-steeped 18 hours', retailPriceCents: 500, creditCost: 3, active: true },
  { id: 'drink-elm-matcha', cafeId: 'cafe-elm-and-oak', name: 'Ceremonial Matcha', description: 'Whisked to order, oat milk', retailPriceCents: 600, creditCost: 4, active: true },
  { id: 'drink-elm-drip', cafeId: 'cafe-elm-and-oak', name: 'House Drip', description: 'Rotating single-origin', retailPriceCents: 350, creditCost: 2, active: true },

  // Bishop Brew
  { id: 'drink-bishop-cortado', cafeId: 'cafe-bishop-brew', name: 'Cortado', description: 'Equal parts espresso and steamed milk', retailPriceCents: 475, creditCost: 3, active: true },
  { id: 'drink-bishop-espresso', cafeId: 'cafe-bishop-brew', name: 'Double Espresso', description: 'House blend, bright and bold', retailPriceCents: 400, creditCost: 3, active: true },
  { id: 'drink-bishop-latte', cafeId: 'cafe-bishop-brew', name: 'Vanilla Bean Latte', description: 'Espresso, whole milk, vanilla bean', retailPriceCents: 600, creditCost: 4, active: true },

  // Uptown Pour
  { id: 'drink-uptown-americano', cafeId: 'cafe-uptown-pour', name: 'Americano', description: 'Espresso over hot water', retailPriceCents: 400, creditCost: 3, active: true },
  { id: 'drink-uptown-mocha', cafeId: 'cafe-uptown-pour', name: 'Dark Mocha', description: 'Espresso, dark chocolate, steamed milk', retailPriceCents: 675, creditCost: 4, active: true },
  { id: 'drink-uptown-coldbrew', cafeId: 'cafe-uptown-pour', name: 'Vanilla Cold Brew', description: 'Cold brew, vanilla sweet cream', retailPriceCents: 550, creditCost: 3, active: true },

  // Trinity Roasting
  { id: 'drink-trinity-pourover', cafeId: 'cafe-trinity-roast', name: 'Pour Over', description: 'Single origin, brewed to order', retailPriceCents: 550, creditCost: 3, active: true },
  { id: 'drink-trinity-latte', cafeId: 'cafe-trinity-roast', name: 'Cinnamon Oat Latte', description: 'Espresso, oat milk, cinnamon', retailPriceCents: 625, creditCost: 4, active: true },

  // Greenville Grind
  { id: 'drink-greenville-drip', cafeId: 'cafe-greenville-grind', name: 'House Drip', description: 'Bottomless-friendly medium roast', retailPriceCents: 325, creditCost: 2, active: true },
  { id: 'drink-greenville-matcha', cafeId: 'cafe-greenville-grind', name: 'Iced Matcha Latte', description: 'Ceremonial matcha, oat milk, ice', retailPriceCents: 600, creditCost: 4, active: true },
  { id: 'drink-greenville-chai', cafeId: 'cafe-greenville-grind', name: 'Housemade Chai Latte', description: 'Slow-steeped spiced chai', retailPriceCents: 550, creditCost: 3, active: true },
];

export const ratings: Rating[] = [
  { id: 'r1', drinkId: 'drink-elm-latte', cafeId: 'cafe-elm-and-oak', userName: 'Priya S.', stars: 5, note: 'Best oat latte in Deep Ellum, hands down.', verifiedRedemption: true },
  { id: 'r2', drinkId: 'drink-elm-cold-brew', cafeId: 'cafe-elm-and-oak', userName: 'Marcus T.', stars: 4, note: 'Smooth, not too acidic.', verifiedRedemption: true },
  { id: 'r3', drinkId: 'drink-bishop-cortado', cafeId: 'cafe-bishop-brew', userName: 'Jordan R.', stars: 5, note: 'Perfect texture every time.', verifiedRedemption: true },
  { id: 'r4', drinkId: 'drink-bishop-latte', cafeId: 'cafe-bishop-brew', userName: 'Ana G.', stars: 5, verifiedRedemption: false },
  { id: 'r5', drinkId: 'drink-uptown-mocha', cafeId: 'cafe-uptown-pour', userName: 'Chris L.', stars: 4, note: 'Rich, a little sweet.', verifiedRedemption: true },
  { id: 'r6', drinkId: 'drink-trinity-pourover', cafeId: 'cafe-trinity-roast', userName: 'Devon K.', stars: 5, note: 'Loved the dog on the patio too.', verifiedRedemption: true },
  { id: 'r7', drinkId: 'drink-greenville-matcha', cafeId: 'cafe-greenville-grind', userName: 'Sam W.', stars: 4, verifiedRedemption: false },
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

export function ratingsForCafe(cafeId: string): Rating[] {
  return ratings.filter((r) => r.cafeId === cafeId);
}

export function neighbourhoodName(id: string): string {
  return neighbourhoods.find((n) => n.id === id)?.name ?? 'Dallas';
}
