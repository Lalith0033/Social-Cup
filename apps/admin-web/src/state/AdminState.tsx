import React, { createContext, useContext, useMemo, useReducer } from 'react';
import {
  initialAudit,
  initialCafes,
  initialDrinks,
  initialMembers,
  initialPayoutBatches,
  initialRatings,
} from '../mockData';
import type { Cafe, Drink, Member, PayoutBatch, Rating, RedemptionAuditEntry } from '../types';

export type Section = 'dashboard' | 'cafes' | 'drinks' | 'members' | 'subscriptions' | 'ratings' | 'payouts' | 'audit';

type State = {
  section: Section;
  cafes: Cafe[];
  drinks: Drink[];
  members: Member[];
  ratings: Rating[];
  audit: RedemptionAuditEntry[];
  payoutBatches: PayoutBatch[];
};

type Action =
  | { type: 'SET_SECTION'; section: Section }
  | { type: 'TOGGLE_CAFE_ACTIVE'; cafeId: string }
  | { type: 'TOGGLE_DRINK_ACTIVE'; drinkId: string }
  | { type: 'TOGGLE_MEMBER_STATUS'; memberId: string }
  | { type: 'TOGGLE_RATING_HIDDEN'; ratingId: string }
  | { type: 'VOID_REDEMPTION'; auditId: string; reason: string }
  | { type: 'APPROVE_BATCH'; batchId: string }
  | { type: 'MARK_BATCH_PAID'; batchId: string };

const initialState: State = {
  section: 'dashboard',
  cafes: initialCafes,
  drinks: initialDrinks,
  members: initialMembers,
  ratings: initialRatings,
  audit: initialAudit,
  payoutBatches: initialPayoutBatches,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SECTION':
      return { ...state, section: action.section };
    case 'TOGGLE_CAFE_ACTIVE':
      return {
        ...state,
        cafes: state.cafes.map((c) => (c.id === action.cafeId ? { ...c, active: !c.active } : c)),
      };
    case 'TOGGLE_DRINK_ACTIVE':
      return {
        ...state,
        drinks: state.drinks.map((d) => (d.id === action.drinkId ? { ...d, active: !d.active } : d)),
      };
    case 'TOGGLE_MEMBER_STATUS':
      return {
        ...state,
        members: state.members.map((m) =>
          m.id === action.memberId ? { ...m, status: m.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : m,
        ),
      };
    case 'TOGGLE_RATING_HIDDEN':
      return {
        ...state,
        ratings: state.ratings.map((r) => (r.id === action.ratingId ? { ...r, hidden: !r.hidden } : r)),
      };
    case 'VOID_REDEMPTION':
      // Pre-settlement void, matching PRODUCT_AND_BUSINESS_RULES.md §3.3: mark voided,
      // the corresponding payout item's batch is only affected if still DRAFT (mock
      // simplification — no clawback/adjustment modeling in this frontend-only shell).
      return {
        ...state,
        audit: state.audit.map((a) =>
          a.id === action.auditId ? { ...a, status: 'VOIDED' as const, voidReason: action.reason } : a,
        ),
      };
    case 'APPROVE_BATCH':
      return {
        ...state,
        payoutBatches: state.payoutBatches.map((b) =>
          b.id === action.batchId && b.status === 'DRAFT' ? { ...b, status: 'APPROVED' as const } : b,
        ),
      };
    case 'MARK_BATCH_PAID':
      return {
        ...state,
        payoutBatches: state.payoutBatches.map((b) =>
          b.id === action.batchId && b.status === 'APPROVED' ? { ...b, status: 'PAID' as const } : b,
        ),
      };
    default:
      return state;
  }
}

type ContextValue = { state: State; dispatch: React.Dispatch<Action> };

const AdminStateContext = createContext<ContextValue | null>(null);

export function AdminStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AdminStateContext.Provider value={value}>{children}</AdminStateContext.Provider>;
}

export function useAdminState() {
  const ctx = useContext(AdminStateContext);
  if (!ctx) throw new Error('useAdminState must be used within AdminStateProvider');
  return ctx;
}

export function useAdminActions() {
  const { dispatch } = useAdminState();
  return useMemo(
    () => ({
      setSection: (section: Section) => dispatch({ type: 'SET_SECTION', section }),
      toggleCafeActive: (cafeId: string) => dispatch({ type: 'TOGGLE_CAFE_ACTIVE', cafeId }),
      toggleDrinkActive: (drinkId: string) => dispatch({ type: 'TOGGLE_DRINK_ACTIVE', drinkId }),
      toggleMemberStatus: (memberId: string) => dispatch({ type: 'TOGGLE_MEMBER_STATUS', memberId }),
      toggleRatingHidden: (ratingId: string) => dispatch({ type: 'TOGGLE_RATING_HIDDEN', ratingId }),
      voidRedemption: (auditId: string, reason: string) => dispatch({ type: 'VOID_REDEMPTION', auditId, reason }),
      approveBatch: (batchId: string) => dispatch({ type: 'APPROVE_BATCH', batchId }),
      markBatchPaid: (batchId: string) => dispatch({ type: 'MARK_BATCH_PAID', batchId }),
    }),
    [dispatch],
  );
}
