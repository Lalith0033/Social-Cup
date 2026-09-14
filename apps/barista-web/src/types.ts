// Local UI-only types for the mock barista experience.

export type Cafe = {
  id: string;
  name: string;
  address: string;
};

export type ScanOutcomeKind =
  | 'SUCCESS'
  | 'ALREADY_USED'
  | 'EXPIRED'
  | 'WRONG_CAFE'
  | 'NOT_ENOUGH_CREDITS'
  | 'INVALID';

export type ScanResult = {
  kind: ScanOutcomeKind;
  memberName?: string;
  drinkName?: string;
  creditCost?: number;
};

export type RedemptionLogEntry = {
  id: string;
  memberName: string;
  drinkName: string;
  creditCost: number;
  time: string;
};
