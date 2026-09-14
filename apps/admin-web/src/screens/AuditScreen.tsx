import { Badge } from '../components/Badge';
import { useAdminActions, useAdminState } from '../state/AdminState';

export function AuditScreen() {
  const { state } = useAdminState();
  const { voidRedemption } = useAdminActions();

  function handleVoid(auditId: string) {
    const reason = window.prompt('Reason for voiding this redemption?');
    if (reason && reason.trim()) {
      voidRedemption(auditId, reason.trim());
    }
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Redemption audit log</h1>
      <p style={{ color: 'var(--sc-text-secondary)', marginTop: -8, marginBottom: 20 }}>
        Every redemption across the network. Voiding requires a reason and cannot be undone.
      </p>

      <table className="table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Café</th>
            <th>Drink</th>
            <th>Credits</th>
            <th>Café payout</th>
            <th>Time</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {state.audit.map((entry) => (
            <tr key={entry.id}>
              <td style={{ fontWeight: 600 }}>{entry.memberName}</td>
              <td>{entry.cafeName}</td>
              <td>{entry.drinkName}</td>
              <td>{entry.creditCost}</td>
              <td>${(entry.payoutAmountCents / 100).toFixed(2)}</td>
              <td>{entry.timestamp}</td>
              <td>
                <Badge label={entry.status === 'COMPLETED' ? 'Completed' : 'Voided'} tone={entry.status === 'COMPLETED' ? 'success' : 'danger'} />
                {entry.voidReason && (
                  <div style={{ fontSize: 12, color: 'var(--sc-text-secondary)', marginTop: 4 }}>{entry.voidReason}</div>
                )}
              </td>
              <td>
                {entry.status === 'COMPLETED' && (
                  <button className="link-btn danger" onClick={() => handleVoid(entry.id)}>
                    Void
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
