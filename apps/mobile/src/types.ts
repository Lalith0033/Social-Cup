// Local UI-only types for the mock member experience.
// Field names intentionally echo PRODUCT_AND_BUSINESS_RULES.md terminology
// so this prototype maps cleanly onto the real domain model later.

export type Neighbourhood = {
  id: string;
  name: string;
};

export type DrinkCategory =
  | 'coffee'
  | 'espresso'
  | 'latte'
  | 'cold_brew'
  | 'matcha'
  | 'hojicha'
  | 'milk_tea'
  | 'boba'
  | 'fruit_tea'
  | 'specialty_tea'
  | 'chai'
  | 'smoothie'
  | 'juice'
  | 'lemonade'
  | 'refresher'
  | 'hot_chocolate'
  | 'seasonal';

export type Drink = {
  id: string;
  cafeId: string;
  name: string;
  description: string;
  category: DrinkCategory;
  retailPriceCents: number;
  creditCost: number;
  active: boolean;
  imageUri?: string;
};

export type Cafe = {
  id: string;
  name: string;
  neighbourhoodId: string;
  address: string;
  hours: string;
  vibeTags: string[];
  distanceLabel: string;
  photoColor: string;
  photoEmoji: string;
  ratingAvg: number;
  ratingCount: number;
};

export type Rating = {
  id: string;
  drinkId: string;
  cafeId: string;
  userName: string;
  stars: number;
  note?: string;
  verifiedRedemption: boolean;
};

export type Member = {
  id: string;
  displayName: string;
  email: string;
  homeNeighbourhoodId: string;
  preferences: string[];
};

export type SubscriptionStatus = 'ACTIVE' | 'CANCELING' | 'PAST_DUE';

export type Subscription = {
  status: SubscriptionStatus;
  planName: string;
  priceLabel: string;
  creditsPerPeriod: number;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
};

export type RedemptionRecord = {
  id: string;
  cafeId: string;
  cafeName: string;
  drinkId: string;
  drinkName: string;
  creditCost: number;
  redeemedAt: string;
  status: 'COMPLETED' | 'VOIDED';
};

export type TokenStatus = 'PENDING' | 'REDEEMED' | 'EXPIRED' | 'SUPERSEDED';

export type PendingToken = {
  id: string;
  cafeId: string;
  cafeName: string;
  drinkId: string;
  drinkName: string;
  creditCost: number;
  createdAt: number;
  expiresAt: number;
  backupCode: string;
  status: TokenStatus;
};

export type RedemptionOutcome =
  | { kind: 'success'; record: RedemptionRecord }
  | { kind: 'expired' }
  | { kind: 'superseded' };

// Mock-only social layer: a small curated set of feed posts, not backed by
// any real posting/likes/comments infrastructure.
export type FeedPost = {
  id: string;
  userName: string;
  userInitials: string;
  distanceLabel: string;
  drinkId: string;
  cafeId: string;
  caption?: string;
  likeCount: number;
  commentCount: number;
};
