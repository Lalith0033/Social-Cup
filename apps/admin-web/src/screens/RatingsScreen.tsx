import { Badge } from '../components/Badge';
import { useAdminActions, useAdminState } from '../state/AdminState';

function Stars({ value }: { value: number }) {
  return (
    <span style={{ color: 'var(--sc-accent)' }}>
      {'★'.repeat(value)}
      <span style={{ color: 'var(--sc-border)' }}>{'★'.repeat(5 - value)}</span>
    </span>
  );
}

export function RatingsScreen() {
  const { state } = useAdminState();
  const { toggleRatingHidden } = useAdminActions();

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Ratings</h1>
      <p style={{ color: 'var(--sc-text-secondary)', marginTop: -8 }}>Moderate member ratings and notes.</p>

      <table className="table">
        <thead>
          <tr>
            <th>Café</th>
            <th>Drink</th>
            <th>Member</th>
            <th>Rating</th>
            <th>Note</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {state.ratings.map((rating) => (
            <tr key={rating.id} style={{ opacity: rating.hidden ? 0.5 : 1 }}>
              <td>{state.cafes.find((c) => c.id === rating.cafeId)?.name}</td>
              <td>{rating.drinkName}</td>
              <td>{rating.userName}</td>
              <td>
                <Stars value={rating.stars} />
              </td>
              <td style={{ maxWidth: 280, color: 'var(--sc-text-secondary)' }}>{rating.note ?? '—'}</td>
              <td>
                {rating.verifiedRedemption && <Badge label="Verified" tone="success" />}
                {rating.hidden && <Badge label="Hidden" tone="danger" />}
              </td>
              <td>
                <button className="link-btn" onClick={() => toggleRatingHidden(rating.id)}>
                  {rating.hidden ? 'Unhide' : 'Hide'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
