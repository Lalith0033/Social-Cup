import { z } from 'zod';

export const accountStatuses = ['REGISTERED', 'ACTIVE', 'SUSPENDED', 'DELETED'] as const;
export const subscriptionStatuses = ['NONE', 'ACTIVE', 'PAST_DUE', 'CANCELING', 'UNPAID', 'CANCELED'] as const;
export const redemptionTokenStatuses = ['PENDING', 'REDEEMED', 'EXPIRED', 'SUPERSEDED'] as const;
export const redemptionFailureCodes = [
  'EXPIRED',
  'ALREADY_USED',
  'MEMBERSHIP_INACTIVE',
  'NOT_ENOUGH_CREDITS',
  'WRONG_CAFE',
  'NO_CONNECTION',
] as const;

export const createRedemptionTokenSchema = z.object({
  cafeId: z.string().uuid(),
  drinkId: z.string().uuid(),
});

export const scanRedemptionSchema = z.object({
  token: z.string().min(1).max(512),
  idempotencyKey: z.string().uuid(),
});

export type AccountStatus = (typeof accountStatuses)[number];
export type SubscriptionStatus = (typeof subscriptionStatuses)[number];
export type RedemptionTokenStatus = (typeof redemptionTokenStatuses)[number];
export type RedemptionFailureCode = (typeof redemptionFailureCodes)[number];
