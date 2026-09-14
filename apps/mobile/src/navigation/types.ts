// Hand-rolled navigation model: no react-navigation dependency is added for
// this frontend-only prototype. A single top-level "phase" gates the signed
// out flow, and a tab + push-stack model covers the signed-in app — the same
// shape a real navigation library would give us, without the dependency.

export type AuthPhase = 'landing' | 'auth' | 'onboarding' | 'app';

export type TabKey = 'home' | 'discover' | 'history' | 'membership' | 'profile';

export type StackScreen =
  | { name: 'CafeDetail'; cafeId: string }
  | { name: 'RedeemConfirm'; cafeId: string; drinkId: string }
  | { name: 'RedemptionToken' }
  | { name: 'RedemptionResult' };
