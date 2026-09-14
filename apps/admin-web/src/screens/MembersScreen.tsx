import { Badge } from '../components/Badge';
import { useAdminActions, useAdminState } from '../state/AdminState';
import type { SubscriptionStatus } from '../types';

const SUB_TONE: Record<SubscriptionStatus, 'success' | 'warning' | 'danger' | 'neutral'> = {
  ACTIVE: 'success',
  PAST_DUE: 'warning',
  CANCELING: 'warning',
  CANCELED: 'neutral',
};

export function MembersScreen() {
  const { state } = useAdminState();
  const { toggleMemberStatus } = useAdminActions();

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Members</h1>
      <p style={{ color: 'var(--sc-text-secondary)', marginTop: -8 }}>{state.members.length} registered members</p>

      <table className="table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Email</th>
            <th>Account</th>
            <th>Subscription</th>
            <th>Credits</th>
            <th>Joined</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {state.members.map((member) => (
            <tr key={member.id}>
              <td style={{ fontWeight: 600 }}>{member.displayName}</td>
              <td style={{ color: 'var(--sc-text-secondary)' }}>{member.email}</td>
              <td>
                <Badge label={member.status === 'ACTIVE' ? 'Active' : 'Suspended'} tone={member.status === 'ACTIVE' ? 'success' : 'danger'} />
              </td>
              <td>
                <Badge label={member.subscriptionStatus.replace('_', ' ')} tone={SUB_TONE[member.subscriptionStatus]} />
              </td>
              <td>
                {member.creditsRemaining} / {member.creditsPerPeriod}
              </td>
              <td>{member.joinedAt}</td>
              <td>
                <button className={`link-btn ${member.status === 'ACTIVE' ? 'danger' : ''}`} onClick={() => toggleMemberStatus(member.id)}>
                  {member.status === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
