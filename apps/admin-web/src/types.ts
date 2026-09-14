// Local UI-only types for the mock admin experience.

export type Neighbourhood = { id: string; name: string };

export type Cafe = {
  id: string;
  name: string;
  neighbourhoodId: string;
  address: string;
  payoutRateCents: number;
  active: boolean;
};

export type Drink = {
  id: string;
  cafeId: string;
  name: string;
  retailPriceCents: number;
  creditCost: number;
  active: boolean;
};

export type MemberStatus = 'ACTIVE' | 'SUSPENDED';
export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELING' | 'CANCELED';

export type Member = {
  id: string;
  displayName: string;
  email: string;
  status: MemberStatus;
  subscriptionStatus: SubscriptionStatus;
  creditsRemaining: number;
  creditsPerPeriod: number;
  joinedAt: string;
  currentPeriodEnd: string;
};

export type Rating = {
  id: string;
  cafeId: string;
  drinkName: string;
  userName: string;
  stars: number;
  note?: string;
  verifiedRedemption: boolean;
  hidden: boolean;
};

export type RedemptionAuditEntry = {
  id: string;
  memberName: string;
  cafeId: string;
  cafeName: string;
  drinkName: string;
  creditCost: number;
  payoutAmountCents: number;
  timestamp: string;
  status: 'COMPLETED' | 'VOIDED';
  voidReason?: string;
};

export type PayoutBatchStatus = 'DRAFT' | 'APPROVED' | 'PAID';

export type PayoutBatchItem = {
  id: string;
  redemptionId: string;
  drinkName: string;
  amountCents: number;
};

export type PayoutBatch = {
  id: string;
  cafeId: string;
  periodLabel: string;
  status: PayoutBatchStatus;
  items: PayoutBatchItem[];
};
