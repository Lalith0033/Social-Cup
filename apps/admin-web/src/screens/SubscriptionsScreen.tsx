import { useState } from 'react';
import { Badge } from '../components/Badge';
import { useAdminState } from '../state/AdminState';
import type { SubscriptionStatus } from '../types';

const SUB_TONE: Record<SubscriptionStatus, 'success' | 'warning' | 'danger' | 'neutral'> = {
  ACTIVE: 'success',
  PAST_DUE: 'warning',
  CANCELING: 'warning',
  CANCELED: 'neutral',
};

const FILTERS: (SubscriptionStatus | 'ALL')[] = ['ALL', 'ACTIVE', 'PAST_DUE', 'CANCELING', 'CANCELED'];

export function SubscriptionsScreen() {
  const { state } = useAdminState();
  const [filter, setFilter] = useState<SubscriptionStatus | 'ALL'>('ALL');

  const filtered = state.members.filter((m) => filter === 'ALL' || m.subscriptionStatus === filter);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Subscriptions</h1>
      <p style={{ color: 'var(--sc-text-secondary)', marginTop: -8, marginBottom: 20 }}>
        Single plan: Social Cup Membership — $24.99/mo, 30 credits per cycle, no rollover.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: 13, background: filter === f ? 'var(--sc-brand)' : undefined, color: filter === f ? '#fff' : undefined }}
            onClick={() => setFilter(f)}
          >
            {f === 'ALL' ? 'All' : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Status</th>
            <th>Credits this cycle</th>
            <th>Current period ends</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((member) => (
            <tr key={member.id}>
              <td style={{ fontWeight: 600 }}>{member.displayName}</td>
              <td>
                <Badge label={member.subscriptionStatus.replace('_', ' ')} tone={SUB_TONE[member.subscriptionStatus]} />
              </td>
              <td>
                {member.creditsRemaining} / {member.creditsPerPeriod}
              </td>
              <td>{member.currentPeriodEnd}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
