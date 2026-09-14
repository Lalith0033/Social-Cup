import { Badge } from '../components/Badge';
import { useAdminState } from '../state/AdminState';

export function DashboardScreen() {
  const { state } = useAdminState();
  const activeMembers = state.members.filter((m) => m.status === 'ACTIVE' && m.subscriptionStatus !== 'CANCELED');
  const activeCafes = state.cafes.filter((c) => c.active);
  const completedRedemptions = state.audit.filter((a) => a.status === 'COMPLETED');
  const pendingPayoutCents = state.payoutBatches
    .filter((b) => b.status !== 'PAID')
    .reduce((sum, b) => sum + b.items.reduce((s, i) => s + i.amountCents, 0), 0);
  const mrrCents = activeMembers.length * 2499;

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>
      <p style={{ color: 'var(--sc-text-secondary)', marginTop: -8 }}>Overview of the Social Cup network.</p>

      <div className="stat-grid" style={{ marginBottom: 28 }}>
        <Stat label="Active members" value={String(activeMembers.length)} />
        <Stat label="Estimated MRR" value={`$${(mrrCents / 100).toFixed(2)}`} />
        <Stat label="Active cafés" value={`${activeCafes.length} / ${state.cafes.length}`} />
        <Stat label="Completed redemptions" value={String(completedRedemptions.length)} />
        <Stat label="Pending payout liability" value={`$${(pendingPayoutCents / 100).toFixed(2)}`} />
      </div>

      <h2 style={{ fontSize: 16 }}>Recent redemptions</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Café</th>
            <th>Drink</th>
            <th>Credits</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {state.audit.slice(0, 5).map((entry) => (
            <tr key={entry.id}>
              <td>{entry.memberName}</td>
              <td>{entry.cafeName}</td>
              <td>{entry.drinkName}</td>
              <td>{entry.creditCost}</td>
              <td>
                <Badge label={entry.status === 'COMPLETED' ? 'Completed' : 'Voided'} tone={entry.status === 'COMPLETED' ? 'success' : 'danger'} />
              </td>
              <td>{entry.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <p style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--sc-brand-dark)' }}>{value}</p>
      <p style={{ fontSize: 13, color: 'var(--sc-text-secondary)', margin: '4px 0 0' }}>{label}</p>
    </div>
  );
}
