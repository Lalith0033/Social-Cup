import { useState } from 'react';
import { Button } from '../components/Button';
import { cafes, DEMO_BACKUP_CODES } from '../mockData';
import { useBaristaActions, useBaristaState } from '../state/BaristaState';

export function ScannerScreen() {
  const { state } = useBaristaState();
  const { scanResult, setView, forgetDevice } = useBaristaActions();
  const [code, setCode] = useState('');
  const cafe = cafes.find((c) => c.id === state.trustedCafeId) ?? cafes[0];

  function submitBackupCode() {
    const match = DEMO_BACKUP_CODES[code.trim().toUpperCase()];
    if (match) {
      scanResult({ kind: 'SUCCESS', ...match });
    } else {
      scanResult({ kind: 'INVALID' });
    }
    setCode('');
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 24 }}>
      <TopBar cafeName={cafe.name} onHistory={() => setView('history')} onForget={forgetDevice} />

      <div className="card" style={{ marginTop: 20, textAlign: 'center', padding: 32 }}>
        <div
          style={{
            width: 220,
            height: 220,
            margin: '0 auto 20px',
            borderRadius: 20,
            background: 'var(--sc-brand-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: 160,
              height: 160,
              border: '3px solid rgba(255,255,255,0.6)',
              borderRadius: 16,
            }}
          />
          <span style={{ position: 'absolute', fontSize: 40 }}>📷</span>
        </div>
        <p style={{ color: 'var(--sc-text-secondary)', fontSize: 14 }}>
          Point the camera at the member's QR code
        </p>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.4, color: 'var(--sc-text-secondary)', textTransform: 'uppercase', marginBottom: 12 }}>
          Or enter the 6-digit backup code
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            className="input"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. K9B2A7"
            maxLength={6}
            style={{ textTransform: 'uppercase', letterSpacing: 2 }}
          />
          <Button label="Redeem" onClick={submitBackupCode} disabled={code.trim().length < 4} block={false} />
        </div>
        <p style={{ fontSize: 12, color: 'var(--sc-text-secondary)', marginTop: 10 }}>
          Demo codes: <strong>K9B2A7</strong> (Jordan Ramirez), <strong>M3X8Q1</strong> (Priya Shah)
        </p>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.4, color: 'var(--sc-text-secondary)', textTransform: 'uppercase', marginBottom: 12 }}>
          Demo controls — simulate a scan
        </p>
        <div style={{ display: 'grid', gap: 10 }}>
          <Button
            label="Valid scan — Jordan Ramirez, Honey Oat Latte"
            onClick={() => scanResult({ kind: 'SUCCESS', memberName: 'Jordan Ramirez', drinkName: 'Honey Oat Latte', creditCost: 4 })}
          />
          <Button label="Already-used code" variant="secondary" onClick={() => scanResult({ kind: 'ALREADY_USED' })} />
          <Button label="Expired code" variant="secondary" onClick={() => scanResult({ kind: 'EXPIRED' })} />
          <Button label="Code for a different café" variant="secondary" onClick={() => scanResult({ kind: 'WRONG_CAFE' })} />
          <Button label="Not enough credits" variant="secondary" onClick={() => scanResult({ kind: 'NOT_ENOUGH_CREDITS' })} />
        </div>
      </div>
    </div>
  );
}

function TopBar({ cafeName, onHistory, onForget }: { cafeName: string; onHistory: () => void; onForget: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <p style={{ fontSize: 12, color: 'var(--sc-text-secondary)', margin: 0 }}>Trusted device</p>
        <h1 style={{ fontSize: 20, margin: 0 }}>{cafeName}</h1>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button label="Today" variant="secondary" block={false} onClick={onHistory} />
        <Button label="Switch café" variant="ghost" block={false} onClick={onForget} />
      </div>
    </div>
  );
}
