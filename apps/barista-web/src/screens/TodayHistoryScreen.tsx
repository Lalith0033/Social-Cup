import { Button } from '../components/Button';
import { cafes } from '../mockData';
import { useBaristaActions, useBaristaState } from '../state/BaristaState';

export function TodayHistoryScreen() {
  const { state } = useBaristaState();
  const { setView } = useBaristaActions();
  const cafe = cafes.find((c) => c.id === state.trustedCafeId) ?? cafes[0];
  const totalCredits = state.todayLog.reduce((sum, entry) => sum + entry.creditCost, 0);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 12, color: 'var(--sc-text-secondary)', margin: 0 }}>{cafe.name}</p>
          <h1 style={{ fontSize: 20, margin: 0 }}>Today's redemptions</h1>
        </div>
        <Button label="Back to scanner" variant="secondary" block={false} onClick={() => setView('scanner')} />
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <StatCard label="Redemptions" value={String(state.todayLog.length)} />
        <StatCard label="Credits redeemed" value={String(totalCredits)} />
      </div>

      {state.todayLog.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--sc-text-secondary)' }}>
          No redemptions yet today.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {state.todayLog.map((entry) => (
            <div key={entry.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>{entry.drinkName}</p>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--sc-text-secondary)' }}>{entry.memberName}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: 700, color: 'var(--sc-brand)' }}>-{entry.creditCost} credits</p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--sc-text-secondary)' }}>{entry.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card" style={{ flex: 1, textAlign: 'center' }}>
      <p style={{ fontSize: 28, fontWeight: 700, margin: 0, color: 'var(--sc-brand-dark)' }}>{value}</p>
      <p style={{ fontSize: 12, color: 'var(--sc-text-secondary)', margin: 0 }}>{label}</p>
    </div>
  );
}
