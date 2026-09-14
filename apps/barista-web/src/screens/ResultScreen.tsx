import { useEffect } from 'react';
import { Button } from '../components/Button';
import { useBaristaActions, useBaristaState } from '../state/BaristaState';
import type { ScanOutcomeKind } from '../types';

const COPY: Record<ScanOutcomeKind, { emoji: string; title: string; message: string; tone: 'success' | 'danger' }> = {
  SUCCESS: { emoji: '✅', title: 'Approved', message: '', tone: 'success' },
  ALREADY_USED: { emoji: '⚠️', title: 'Already used', message: 'This code has already been redeemed.', tone: 'danger' },
  EXPIRED: { emoji: '⏱️', title: 'Expired', message: 'This code expired after 5 minutes. Ask the member to generate a new one.', tone: 'danger' },
  WRONG_CAFE: { emoji: '📍', title: 'Wrong café', message: 'This code was generated for a different café.', tone: 'danger' },
  NOT_ENOUGH_CREDITS: { emoji: '💳', title: 'Not enough credits', message: 'This member does not have enough credits remaining this cycle.', tone: 'danger' },
  INVALID: { emoji: '❓', title: 'Invalid code', message: "We couldn't find an active code matching that entry.", tone: 'danger' },
};

export function ResultScreen() {
  const { state } = useBaristaState();
  const { dismissResult } = useBaristaActions();
  const result = state.lastResult;

  useEffect(() => {
    if (result?.kind === 'SUCCESS') {
      const id = setTimeout(dismissResult, 5000);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [result, dismissResult]);

  if (!result) return null;
  const copy = COPY[result.kind];
  const bg = copy.tone === 'success' ? 'var(--sc-success)' : 'var(--sc-danger)';

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: bg,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 72, marginBottom: 16 }}>{copy.emoji}</div>
      <h1 style={{ fontSize: 30, margin: 0 }}>{copy.title}</h1>

      {result.kind === 'SUCCESS' ? (
        <>
          <p style={{ fontSize: 20, marginTop: 12 }}>{result.drinkName}</p>
          <p style={{ opacity: 0.85, marginTop: 4 }}>{result.memberName}</p>
          <div
            style={{
              marginTop: 20,
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 999,
              padding: '8px 20px',
              fontWeight: 700,
            }}
          >
            -{result.creditCost} credits
          </div>
          <p style={{ fontSize: 13, opacity: 0.8, marginTop: 24 }}>Returning to scanner…</p>
        </>
      ) : (
        <p style={{ maxWidth: 360, marginTop: 12, lineHeight: 1.5 }}>{copy.message}</p>
      )}

      <div style={{ marginTop: 32, width: '100%', maxWidth: 320 }}>
        <Button label="Done" variant="secondary" onClick={dismissResult} />
      </div>
    </div>
  );
}
