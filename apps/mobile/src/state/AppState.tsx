import React, { createContext, useContext, useMemo, useReducer } from 'react';
import {
  cafeById,
  currentMember,
  currentSubscription,
  drinkById,
  initialBalance,
  initialHistory,
} from '../mockData';
import type { AuthPhase, StackScreen, TabKey } from '../navigation/types';
import type { Member, PendingToken, RedemptionOutcome, RedemptionRecord, Subscription } from '../types';

const TOKEN_TTL_MS = 5 * 60 * 1000; // 300s, per PRODUCT_AND_BUSINESS_RULES.md SC-FR-017

function randomBackupCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

type State = {
  authPhase: AuthPhase;
  activeTab: TabKey;
  stack: StackScreen[];
  member: Member;
  subscription: Subscription;
  balance: number;
  history: RedemptionRecord[];
  pendingToken: PendingToken | null;
  lastOutcome: RedemptionOutcome | null;
};

type Action =
  | { type: 'GO_TO_AUTH' }
  | { type: 'BACK_TO_LANDING' }
  | { type: 'SIGN_IN' }
  | { type: 'START_SIGN_UP' }
  | { type: 'COMPLETE_ONBOARDING'; homeNeighbourhoodId: string; preferences: string[] }
  | { type: 'SIGN_OUT' }
  | { type: 'SET_TAB'; tab: TabKey }
  | { type: 'PUSH'; screen: StackScreen }
  | { type: 'POP' }
  | { type: 'POP_TO_ROOT' }
  | { type: 'GENERATE_TOKEN'; cafeId: string; drinkId: string }
  | { type: 'CANCEL_TOKEN' }
  | { type: 'TOKEN_EXPIRED' }
  | { type: 'SIMULATE_SCAN_SUCCESS' }
  | { type: 'SIMULATE_SCAN_ALREADY_USED' }
  | { type: 'SET_CANCEL_AT_PERIOD_END'; value: boolean };

const initialState: State = {
  authPhase: 'landing',
  activeTab: 'home',
  stack: [],
  member: currentMember,
  subscription: currentSubscription,
  balance: initialBalance,
  history: initialHistory,
  pendingToken: null,
  lastOutcome: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'GO_TO_AUTH':
      return { ...state, authPhase: 'auth' };
    case 'BACK_TO_LANDING':
      return { ...state, authPhase: 'landing' };
    case 'SIGN_IN':
      return { ...state, authPhase: 'app', activeTab: 'home', stack: [] };
    case 'START_SIGN_UP':
      return { ...state, authPhase: 'onboarding' };
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        authPhase: 'app',
        activeTab: 'home',
        stack: [],
        member: {
          ...state.member,
          homeNeighbourhoodId: action.homeNeighbourhoodId,
          preferences: action.preferences,
        },
      };
    case 'SIGN_OUT':
      return { ...initialState, authPhase: 'landing' };
    case 'SET_TAB':
      return { ...state, activeTab: action.tab, stack: [] };
    case 'PUSH':
      return { ...state, stack: [...state.stack, action.screen] };
    case 'POP':
      return { ...state, stack: state.stack.slice(0, -1) };
    case 'POP_TO_ROOT':
      return { ...state, stack: [] };
    case 'GENERATE_TOKEN': {
      const cafe = cafeById(action.cafeId);
      const drink = drinkById(action.drinkId);
      if (!cafe || !drink) return state;
      // Business rule (SC-BR-006): generating a token never deducts credits.
      // The balance only changes on a successful redemption (scan).
      const now = Date.now();
      const token: PendingToken = {
        id: `token-${now}`,
        cafeId: cafe.id,
        cafeName: cafe.name,
        drinkId: drink.id,
        drinkName: drink.name,
        creditCost: drink.creditCost,
        createdAt: now,
        expiresAt: now + TOKEN_TTL_MS,
        backupCode: randomBackupCode(),
        status: 'PENDING',
      };
      return {
        ...state,
        pendingToken: token,
        stack: [...state.stack, { name: 'RedemptionToken' }],
      };
    }
    case 'CANCEL_TOKEN':
      return {
        ...state,
        pendingToken: state.pendingToken ? { ...state.pendingToken, status: 'SUPERSEDED' } : null,
        stack: state.stack.slice(0, -1),
      };
    case 'TOKEN_EXPIRED': {
      if (!state.pendingToken || state.pendingToken.status !== 'PENDING') return state;
      return {
        ...state,
        pendingToken: { ...state.pendingToken, status: 'EXPIRED' },
        lastOutcome: { kind: 'expired' },
        stack: [...state.stack, { name: 'RedemptionResult' }],
      };
    }
    case 'SIMULATE_SCAN_SUCCESS': {
      const token = state.pendingToken;
      if (!token || token.status !== 'PENDING') return state;
      if (Date.now() > token.expiresAt) {
        return {
          ...state,
          pendingToken: { ...token, status: 'EXPIRED' },
          lastOutcome: { kind: 'expired' },
          stack: [...state.stack, { name: 'RedemptionResult' }],
        };
      }
      const record: RedemptionRecord = {
        id: `redemption-${token.id}`,
        cafeId: token.cafeId,
        cafeName: token.cafeName,
        drinkId: token.drinkId,
        drinkName: token.drinkName,
        creditCost: token.creditCost,
        redeemedAt: 'Just now',
        status: 'COMPLETED',
      };
      return {
        ...state,
        balance: state.balance - token.creditCost,
        history: [record, ...state.history],
        pendingToken: { ...token, status: 'REDEEMED' },
        lastOutcome: { kind: 'success', record },
        stack: [...state.stack, { name: 'RedemptionResult' }],
      };
    }
    case 'SIMULATE_SCAN_ALREADY_USED': {
      // Demonstrates the concurrency-safe outcome from PRODUCT_AND_BUSINESS_RULES.md
      // §8: a second scan of an already-claimed token is rejected, not double-charged.
      return {
        ...state,
        lastOutcome: { kind: 'superseded' },
        stack: [...state.stack, { name: 'RedemptionResult' }],
      };
    }
    case 'SET_CANCEL_AT_PERIOD_END':
      return {
        ...state,
        subscription: {
          ...state.subscription,
          cancelAtPeriodEnd: action.value,
          status: action.value ? 'CANCELING' : 'ACTIVE',
        },
      };
    default:
      return state;
  }
}

type ContextValue = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const AppStateContext = createContext<ContextValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}

export function useAppActions() {
  const { dispatch } = useAppState();
  return useMemo(
    () => ({
      goToAuth: () => dispatch({ type: 'GO_TO_AUTH' }),
      backToLanding: () => dispatch({ type: 'BACK_TO_LANDING' }),
      signIn: () => dispatch({ type: 'SIGN_IN' }),
      startSignUp: () => dispatch({ type: 'START_SIGN_UP' }),
      completeOnboarding: (homeNeighbourhoodId: string, preferences: string[]) =>
        dispatch({ type: 'COMPLETE_ONBOARDING', homeNeighbourhoodId, preferences }),
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      setTab: (tab: TabKey) => dispatch({ type: 'SET_TAB', tab }),
      push: (screen: StackScreen) => dispatch({ type: 'PUSH', screen }),
      pop: () => dispatch({ type: 'POP' }),
      popToRoot: () => dispatch({ type: 'POP_TO_ROOT' }),
      generateToken: (cafeId: string, drinkId: string) =>
        dispatch({ type: 'GENERATE_TOKEN', cafeId, drinkId }),
      cancelToken: () => dispatch({ type: 'CANCEL_TOKEN' }),
      tokenExpired: () => dispatch({ type: 'TOKEN_EXPIRED' }),
      simulateScanSuccess: () => dispatch({ type: 'SIMULATE_SCAN_SUCCESS' }),
      simulateScanAlreadyUsed: () => dispatch({ type: 'SIMULATE_SCAN_ALREADY_USED' }),
      setCancelAtPeriodEnd: (value: boolean) => dispatch({ type: 'SET_CANCEL_AT_PERIOD_END', value }),
    }),
    [dispatch],
  );
}
