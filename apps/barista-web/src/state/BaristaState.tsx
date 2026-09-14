import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { cafes, DEMO_PIN, initialTodayLog } from '../mockData';
import type { RedemptionLogEntry, ScanResult } from '../types';

const TRUST_STORAGE_KEY = 'social-cup-barista-trusted-cafe';
const MAX_ATTEMPTS = 5; // PRODUCT_AND_BUSINESS_RULES.md §7: "more than 5 failed attempts" locks out.

export type View = 'pin' | 'scanner' | 'result' | 'history';

type State = {
  selectedCafeId: string;
  trustedCafeId: string | null;
  view: View;
  pinDraft: string;
  pinError: string | null;
  failedAttempts: number;
  lockedOut: boolean;
  lastResult: ScanResult | null;
  todayLog: RedemptionLogEntry[];
};

type Action =
  | { type: 'SET_SELECTED_CAFE'; cafeId: string }
  | { type: 'SET_PIN_DRAFT'; value: string }
  | { type: 'SUBMIT_PIN' }
  | { type: 'RESTORE_TRUST'; cafeId: string }
  | { type: 'FORGET_DEVICE' }
  | { type: 'RESET_DEMO_LOCKOUT' }
  | { type: 'SET_VIEW'; view: View }
  | { type: 'SCAN_RESULT'; result: ScanResult }
  | { type: 'DISMISS_RESULT' };

const initialState: State = {
  selectedCafeId: cafes[0].id,
  trustedCafeId: null,
  view: 'pin',
  pinDraft: '',
  pinError: null,
  failedAttempts: 0,
  lockedOut: false,
  lastResult: null,
  todayLog: initialTodayLog,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SELECTED_CAFE':
      return { ...state, selectedCafeId: action.cafeId, pinDraft: '', pinError: null };
    case 'SET_PIN_DRAFT':
      return { ...state, pinDraft: action.value, pinError: null };
    case 'SUBMIT_PIN': {
      if (state.lockedOut) return state;
      if (state.pinDraft === DEMO_PIN) {
        return {
          ...state,
          trustedCafeId: state.selectedCafeId,
          view: 'scanner',
          pinDraft: '',
          pinError: null,
          failedAttempts: 0,
        };
      }
      const failedAttempts = state.failedAttempts + 1;
      const lockedOut = failedAttempts > MAX_ATTEMPTS;
      return {
        ...state,
        pinDraft: '',
        failedAttempts,
        lockedOut,
        pinError: lockedOut
          ? 'Too many failed attempts. This device is locked out for 30 minutes.'
          : `Incorrect PIN (${failedAttempts}/${MAX_ATTEMPTS} attempts).`,
      };
    }
    case 'RESTORE_TRUST':
      return { ...state, trustedCafeId: action.cafeId, selectedCafeId: action.cafeId, view: 'scanner' };
    case 'FORGET_DEVICE':
      return { ...initialState, todayLog: state.todayLog };
    case 'RESET_DEMO_LOCKOUT':
      return { ...state, failedAttempts: 0, lockedOut: false, pinError: null };
    case 'SET_VIEW':
      return { ...state, view: action.view };
    case 'SCAN_RESULT': {
      const result = action.result;
      if (result.kind === 'SUCCESS' && result.memberName && result.drinkName && result.creditCost) {
        const entry: RedemptionLogEntry = {
          id: `log-${Date.now()}`,
          memberName: result.memberName,
          drinkName: result.drinkName,
          creditCost: result.creditCost,
          time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        };
        return { ...state, lastResult: result, view: 'result', todayLog: [entry, ...state.todayLog] };
      }
      return { ...state, lastResult: result, view: 'result' };
    }
    case 'DISMISS_RESULT':
      return { ...state, lastResult: null, view: 'scanner' };
    default:
      return state;
  }
}

type ContextValue = { state: State; dispatch: React.Dispatch<Action> };

const BaristaStateContext = createContext<ContextValue | null>(null);

export function BaristaStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(TRUST_STORAGE_KEY);
      if (stored) dispatch({ type: 'RESTORE_TRUST', cafeId: stored });
    } catch {
      // localStorage unavailable (private browsing, etc.) — fall back to PIN entry every time.
    }
  }, []);

  useEffect(() => {
    try {
      if (state.trustedCafeId) {
        window.localStorage.setItem(TRUST_STORAGE_KEY, state.trustedCafeId);
      } else {
        window.localStorage.removeItem(TRUST_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [state.trustedCafeId]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <BaristaStateContext.Provider value={value}>{children}</BaristaStateContext.Provider>;
}

export function useBaristaState() {
  const ctx = useContext(BaristaStateContext);
  if (!ctx) throw new Error('useBaristaState must be used within BaristaStateProvider');
  return ctx;
}

export function useBaristaActions() {
  const { dispatch } = useBaristaState();
  return useMemo(
    () => ({
      setSelectedCafe: (cafeId: string) => dispatch({ type: 'SET_SELECTED_CAFE', cafeId }),
      setPinDraft: (value: string) => dispatch({ type: 'SET_PIN_DRAFT', value }),
      submitPin: () => dispatch({ type: 'SUBMIT_PIN' }),
      forgetDevice: () => dispatch({ type: 'FORGET_DEVICE' }),
      resetDemoLockout: () => dispatch({ type: 'RESET_DEMO_LOCKOUT' }),
      setView: (view: View) => dispatch({ type: 'SET_VIEW', view }),
      scanResult: (result: ScanResult) => dispatch({ type: 'SCAN_RESULT', result }),
      dismissResult: () => dispatch({ type: 'DISMISS_RESULT' }),
    }),
    [dispatch],
  );
}
