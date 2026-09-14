import { Fragment, useState } from 'react';
import { Badge } from '../components/Badge';
import { useAdminActions, useAdminState } from '../state/AdminState';
import type { PayoutBatchStatus } from '../types';

const STATUS_TONE: Record<PayoutBatchStatus, 'neutral' | 'warning' | 'success'> = {
  DRAFT: 'neutral',
  APPROVED: 'warning',
  PAID: 'success',
};

export function PayoutsScreen() {
  const { state } = useAdminState();
  const { approveBatch, markBatchPaid } = useAdminActions();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Payout batches</h1>
      <p style={{ color: 'var(--sc-text-secondary)', marginTop: -8, marginBottom: 20 }}>
        DRAFT → APPROVED → PAID. Paid batches are final — corrections use adjustments, not edits.
      </p>

      <table className="table">
        <thead>
          <tr>
            <th>Café</th>
            <th>Period</th>
            <th>Status</th>
            <th>Total</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {state.payoutBatches.map((batch) => {
            const total = batch.items.reduce((sum, i) => sum + i.amountCents, 0);
            const cafeName = state.cafes.find((c) => c.id === batch.cafeId)?.name;
            const isExpanded = expanded === batch.id;
            return (
              <Fragment key={batch.id}>
                <tr>
                  <td style={{ fontWeight: 600 }}>{cafeName}</td>
                  <td>{batch.periodLabel}</td>
                  <td>
                    <Badge label={batch.status} tone={STATUS_TONE[batch.status]} />
                  </td>
                  <td>${(total / 100).toFixed(2)}</td>
                  <td>
                    <button className="link-btn" onClick={() => setExpanded(isExpanded ? null : batch.id)}>
                      {isExpanded ? 'Hide items' : `${batch.items.length} items`}
                    </button>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {batch.status === 'DRAFT' && (
                      <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: 13 }} onClick={() => approveBatch(batch.id)}>
                        Approve
                      </button>
                    )}
                    {batch.status === 'APPROVED' && (
                      <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: 13 }} onClick={() => markBatchPaid(batch.id)}>
                        Mark paid
                      </button>
                    )}
                    {batch.status === 'PAID' && <span style={{ color: 'var(--sc-text-secondary)', fontSize: 13 }}>Finalized</span>}
                  </td>
                </tr>
                {isExpanded && (
                  <tr>
                    <td colSpan={6} style={{ background: 'var(--sc-surface-alt)' }}>
                      <div style={{ display: 'grid', gap: 6, padding: '4px 0' }}>
                        {batch.items.map((item) => (
                          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                            <span>{item.drinkName}</span>
                            <span style={{ color: 'var(--sc-text-secondary)' }}>${(item.amountCents / 100).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
