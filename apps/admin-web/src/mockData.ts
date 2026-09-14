import type {
  Cafe,
  Drink,
  Member,
  Neighbourhood,
  PayoutBatch,
  Rating,
  RedemptionAuditEntry,
} from './types';

export const neighbourhoods: Neighbourhood[] = [
  { id: 'n-deep-ellum', name: 'Deep Ellum' },
  { id: 'n-bishop-arts', name: 'Bishop Arts' },
  { id: 'n-uptown', name: 'Uptown' },
  { id: 'n-trinity-groves', name: 'Trinity Groves' },
  { id: 'n-lower-greenville', name: 'Lower Greenville' },
];

export const initialCafes: Cafe[] = [
  { id: 'cafe-elm-and-oak', name: 'Elm & Oak Coffee', neighbourhoodId: 'n-deep-ellum', address: '2934 Elm St, Dallas, TX', payoutRateCents: 85, active: true },
  { id: 'cafe-bishop-brew', name: 'Bishop Brew Collective', neighbourhoodId: 'n-bishop-arts', address: '408 N Bishop Ave, Dallas, TX', payoutRateCents: 90, active: true },
  { id: 'cafe-uptown-pour', name: 'Uptown Pour House', neighbourhoodId: 'n-uptown', address: '2500 McKinney Ave, Dallas, TX', payoutRateCents: 80, active: true },
  { id: 'cafe-trinity-roast', name: 'Trinity Roasting Co.', neighbourhoodId: 'n-trinity-groves', address: '3011 Gulden Ln, Dallas, TX', payoutRateCents: 88, active: true },
  { id: 'cafe-greenville-grind', name: 'Greenville Grind', neighbourhoodId: 'n-lower-greenville', address: '1919 Greenville Ave, Dallas, TX', payoutRateCents: 82, active: false },
];

export const initialDrinks: Drink[] = [
  { id: 'drink-elm-latte', cafeId: 'cafe-elm-and-oak', name: 'Honey Oat Latte', retailPriceCents: 650, creditCost: 4, active: true },
  { id: 'drink-elm-cold-brew', cafeId: 'cafe-elm-and-oak', name: 'Cold Brew', retailPriceCents: 500, creditCost: 3, active: true },
  { id: 'drink-elm-matcha', cafeId: 'cafe-elm-and-oak', name: 'Ceremonial Matcha', retailPriceCents: 600, creditCost: 4, active: true },
  { id: 'drink-bishop-cortado', cafeId: 'cafe-bishop-brew', name: 'Cortado', retailPriceCents: 475, creditCost: 3, active: true },
  { id: 'drink-bishop-espresso', cafeId: 'cafe-bishop-brew', name: 'Double Espresso', retailPriceCents: 400, creditCost: 3, active: true },
  { id: 'drink-bishop-latte', cafeId: 'cafe-bishop-brew', name: 'Vanilla Bean Latte', retailPriceCents: 600, creditCost: 4, active: true },
  { id: 'drink-uptown-americano', cafeId: 'cafe-uptown-pour', name: 'Americano', retailPriceCents: 400, creditCost: 3, active: true },
  { id: 'drink-uptown-mocha', cafeId: 'cafe-uptown-pour', name: 'Dark Mocha', retailPriceCents: 675, creditCost: 4, active: false },
  { id: 'drink-trinity-pourover', cafeId: 'cafe-trinity-roast', name: 'Pour Over', retailPriceCents: 550, creditCost: 3, active: true },
  { id: 'drink-greenville-drip', cafeId: 'cafe-greenville-grind', name: 'House Drip', retailPriceCents: 325, creditCost: 2, active: true },
];

export const initialMembers: Member[] = [
  { id: 'member-jordan', displayName: 'Jordan Ramirez', email: 'jordan.ramirez@example.com', status: 'ACTIVE', subscriptionStatus: 'ACTIVE', creditsRemaining: 18, creditsPerPeriod: 30, joinedAt: 'Jan 12, 2026', currentPeriodEnd: 'Oct 9, 2026' },
  { id: 'member-priya', displayName: 'Priya Shah', email: 'priya.shah@example.com', status: 'ACTIVE', subscriptionStatus: 'ACTIVE', creditsRemaining: 27, creditsPerPeriod: 30, joinedAt: 'Feb 3, 2026', currentPeriodEnd: 'Oct 14, 2026' },
  { id: 'member-ana', displayName: 'Ana Gutierrez', email: 'ana.gutierrez@example.com', status: 'ACTIVE', subscriptionStatus: 'PAST_DUE', creditsRemaining: 6, creditsPerPeriod: 30, joinedAt: 'Mar 21, 2026', currentPeriodEnd: 'Sep 30, 2026' },
  { id: 'member-devon', displayName: 'Devon King', email: 'devon.king@example.com', status: 'ACTIVE', subscriptionStatus: 'CANCELING', creditsRemaining: 12, creditsPerPeriod: 30, joinedAt: 'Apr 9, 2026', currentPeriodEnd: 'Sep 25, 2026' },
  { id: 'member-sam', displayName: 'Sam Whitfield', email: 'sam.whitfield@example.com', status: 'SUSPENDED', subscriptionStatus: 'ACTIVE', creditsRemaining: 30, creditsPerPeriod: 30, joinedAt: 'May 30, 2026', currentPeriodEnd: 'Oct 2, 2026' },
  { id: 'member-marcus', displayName: 'Marcus Tran', email: 'marcus.tran@example.com', status: 'ACTIVE', subscriptionStatus: 'CANCELED', creditsRemaining: 0, creditsPerPeriod: 30, joinedAt: 'Jun 18, 2025', currentPeriodEnd: 'Jul 18, 2026' },
];

export const initialRatings: Rating[] = [
  { id: 'r1', cafeId: 'cafe-elm-and-oak', drinkName: 'Honey Oat Latte', userName: 'Priya S.', stars: 5, note: 'Best oat latte in Deep Ellum, hands down.', verifiedRedemption: true, hidden: false },
  { id: 'r2', cafeId: 'cafe-elm-and-oak', drinkName: 'Cold Brew', userName: 'Marcus T.', stars: 4, note: 'Smooth, not too acidic.', verifiedRedemption: true, hidden: false },
  { id: 'r3', cafeId: 'cafe-bishop-brew', drinkName: 'Cortado', userName: 'Jordan R.', stars: 5, note: 'Perfect texture every time.', verifiedRedemption: true, hidden: false },
  { id: 'r4', cafeId: 'cafe-bishop-brew', drinkName: 'Vanilla Bean Latte', userName: 'Ana G.', stars: 5, verifiedRedemption: false, hidden: false },
  { id: 'r5', cafeId: 'cafe-uptown-pour', drinkName: 'Dark Mocha', userName: 'Chris L.', stars: 1, note: 'Rude staff, will not return. [flagged for review]', verifiedRedemption: true, hidden: false },
  { id: 'r6', cafeId: 'cafe-trinity-roast', drinkName: 'Pour Over', userName: 'Devon K.', stars: 5, note: 'Loved the dog on the patio too.', verifiedRedemption: true, hidden: false },
];

export const initialAudit: RedemptionAuditEntry[] = [
  { id: 'aud-1', memberName: 'Jordan Ramirez', cafeId: 'cafe-bishop-brew', cafeName: 'Bishop Brew Collective', drinkName: 'Cortado', creditCost: 3, payoutAmountCents: 270, timestamp: 'Sep 7, 2026 · 8:14 AM', status: 'COMPLETED' },
  { id: 'aud-2', memberName: 'Jordan Ramirez', cafeId: 'cafe-elm-and-oak', cafeName: 'Elm & Oak Coffee', drinkName: 'Honey Oat Latte', creditCost: 4, payoutAmountCents: 340, timestamp: 'Sep 5, 2026 · 9:02 AM', status: 'COMPLETED' },
  { id: 'aud-3', memberName: 'Priya Shah', cafeId: 'cafe-uptown-pour', cafeName: 'Uptown Pour House', drinkName: 'Dark Mocha', creditCost: 4, payoutAmountCents: 320, timestamp: 'Sep 2, 2026 · 4:47 PM', status: 'COMPLETED' },
  { id: 'aud-4', memberName: 'Ana Gutierrez', cafeId: 'cafe-bishop-brew', cafeName: 'Bishop Brew Collective', drinkName: 'Double Espresso', creditCost: 3, payoutAmountCents: 270, timestamp: 'Aug 30, 2026 · 7:55 AM', status: 'VOIDED', voidReason: 'Member reported wrong drink prepared' },
  { id: 'aud-5', memberName: 'Devon King', cafeId: 'cafe-trinity-roast', cafeName: 'Trinity Roasting Co.', drinkName: 'Pour Over', creditCost: 3, payoutAmountCents: 264, timestamp: 'Aug 28, 2026 · 10:30 AM', status: 'COMPLETED' },
];

export const initialPayoutBatches: PayoutBatch[] = [
  {
    id: 'batch-elm-aug',
    cafeId: 'cafe-elm-and-oak',
    periodLabel: 'Aug 1 – Aug 31, 2026',
    status: 'PAID',
    items: [
      { id: 'item-1', redemptionId: 'aud-2', drinkName: 'Honey Oat Latte', amountCents: 340 },
      { id: 'item-2', redemptionId: 'aud-2b', drinkName: 'Cold Brew', amountCents: 255 },
    ],
  },
  {
    id: 'batch-bishop-aug',
    cafeId: 'cafe-bishop-brew',
    periodLabel: 'Aug 1 – Aug 31, 2026',
    status: 'APPROVED',
    items: [
      { id: 'item-3', redemptionId: 'aud-1', drinkName: 'Cortado', amountCents: 270 },
      { id: 'item-4', redemptionId: 'aud-4', drinkName: 'Double Espresso', amountCents: 270 },
    ],
  },
  {
    id: 'batch-uptown-sep',
    cafeId: 'cafe-uptown-pour',
    periodLabel: 'Sep 1 – Sep 30, 2026',
    status: 'DRAFT',
    items: [{ id: 'item-5', redemptionId: 'aud-3', drinkName: 'Dark Mocha', amountCents: 320 }],
  },
  {
    id: 'batch-trinity-sep',
    cafeId: 'cafe-trinity-roast',
    periodLabel: 'Sep 1 – Sep 30, 2026',
    status: 'DRAFT',
    items: [{ id: 'item-6', redemptionId: 'aud-5', drinkName: 'Pour Over', amountCents: 264 }],
  },
];
