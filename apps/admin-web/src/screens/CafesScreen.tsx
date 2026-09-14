import { Badge } from '../components/Badge';
import { neighbourhoods } from '../mockData';
import { useAdminActions, useAdminState } from '../state/AdminState';

export function CafesScreen() {
  const { state } = useAdminState();
  const { toggleCafeActive } = useAdminActions();

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Cafés</h1>
      <p style={{ color: 'var(--sc-text-secondary)', marginTop: -8 }}>
        {state.cafes.length} cafés on the network · {state.cafes.filter((c) => c.active).length} active
      </p>

      <table className="table">
        <thead>
          <tr>
            <th>Café</th>
            <th>Neighbourhood</th>
            <th>Address</th>
            <th>Payout rate</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {state.cafes.map((cafe) => (
            <tr key={cafe.id}>
              <td style={{ fontWeight: 600 }}>{cafe.name}</td>
              <td>{neighbourhoods.find((n) => n.id === cafe.neighbourhoodId)?.name}</td>
              <td style={{ color: 'var(--sc-text-secondary)' }}>{cafe.address}</td>
              <td>${(cafe.payoutRateCents / 100).toFixed(2)}/credit</td>
              <td>
                <Badge label={cafe.active ? 'Active' : 'Inactive'} tone={cafe.active ? 'success' : 'neutral'} />
              </td>
              <td>
                <button className="link-btn" onClick={() => toggleCafeActive(cafe.id)}>
                  {cafe.active ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
