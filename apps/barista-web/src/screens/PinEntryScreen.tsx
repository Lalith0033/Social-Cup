import { useState } from 'react';
import { Button } from '../components/Button';
import { cafes } from '../mockData';
import { useBaristaActions, useBaristaState } from '../state/BaristaState';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

export function PinEntryScreen() {
  const { state } = useBaristaState();
  const { setSelectedCafe, setPinDraft, submitPin, resetDemoLockout } = useBaristaActions();
  const [showHint, setShowHint] = useState(false);
  const cafe = cafes.find((c) => c.id === state.selectedCafeId) ?? cafes[0];

  function pressKey(key: string) {
    if (state.lockedOut) return;
    if (key === '⌫') {
      setPinDraft(state.pinDraft.slice(0, -1));
      return;
    }
    if (key === '') return;
    if (state.pinDraft.length >= 4) return;
    const next = state.pinDraft + key;
    setPinDraft(next);
    if (next.length === 4) {
      // Submit on the next tick so the last digit renders before validation.
      setTimeout(() => submitPin(), 80);
    }
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 34, marginBottom: 8 }}>☕</div>
          <h1 style={{ fontSize: 20, margin: 0 }}>Social Cup Barista</h1>
          <p style={{ color: 'var(--sc-text-secondary)', fontSize: 13, marginTop: 6 }}>
            Enter this café's 4-digit PIN to trust this device.
          </p>
        </div>

        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--sc-text-secondary)' }}>Café</label>
        <select
          className="input"
          style={{ marginTop: 6, marginBottom: 18 }}
          value={state.selectedCafeId}
          onChange={(e) => setSelectedCafe(e.target.value)}
        >
          {cafes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <p style={{ fontSize: 12, color: 'var(--sc-text-secondary)', marginTop: -12, marginBottom: 18 }}>
          {cafe.address}
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 16,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: i < state.pinDraft.length ? 'var(--sc-brand)' : 'var(--sc-surface-alt)',
                border: '1px solid var(--sc-border)',
              }}
            />
          ))}
        </div>

        {state.pinError && (
          <p style={{ color: 'var(--sc-danger)', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>
            {state.pinError}
          </p>
        )}

        {state.lockedOut ? (
          <>
            <div className="badge badge-danger" style={{ display: 'block', textAlign: 'center', marginBottom: 16 }}>
              Device locked
            </div>
            <Button label="Reset lockout (demo control)" variant="secondary" onClick={resetDemoLockout} />
          </>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {KEYS.map((key, i) => (
              <button
                key={i}
                type="button"
                disabled={key === ''}
                onClick={() => pressKey(key)}
                className="btn btn-secondary"
                style={{ fontSize: 20, padding: '16px 0', visibility: key === '' ? 'hidden' : 'visible' }}
              >
                {key}
              </button>
            ))}
          </div>
        )}

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            style={{ background: 'none', border: 'none', color: 'var(--sc-text-secondary)', fontSize: 12, cursor: 'pointer' }}
          >
            {showHint ? 'Hide demo hint' : 'Show demo hint'}
          </button>
          {showHint && (
            <p style={{ fontSize: 12, color: 'var(--sc-text-secondary)' }}>
              Demo PIN for every café: <strong>1234</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
