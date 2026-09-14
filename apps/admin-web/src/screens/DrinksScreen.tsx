import { useState } from 'react';
import { Badge } from '../components/Badge';
import { useAdminActions, useAdminState } from '../state/AdminState';

export function DrinksScreen() {
  const { state } = useAdminState();
  const { toggleDrinkActive } = useAdminActions();
  const [cafeFilter, setCafeFilter] = useState<string>('all');

  const filtered = state.drinks.filter((d) => cafeFilter === 'all' || d.cafeId === cafeFilter);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Drinks</h1>
      <p style={{ color: 'var(--sc-text-secondary)', marginTop: -8, marginBottom: 20 }}>
        Menu items across all cafés, with retail price and credit cost.
      </p>

      <select className="input" style={{ maxWidth: 260, marginBottom: 16 }} value={cafeFilter} onChange={(e) => setCafeFilter(e.target.value)}>
        <option value="all">All cafés</option>
        {state.cafes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <table className="table">
        <thead>
          <tr>
            <th>Drink</th>
            <th>Café</th>
            <th>Retail price</th>
            <th>Credit cost</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {filtered.map((drink) => (
            <tr key={drink.id}>
              <td style={{ fontWeight: 600 }}>{drink.name}</td>
              <td>{state.cafes.find((c) => c.id === drink.cafeId)?.name}</td>
              <td>${(drink.retailPriceCents / 100).toFixed(2)}</td>
              <td>{drink.creditCost} credits</td>
              <td>
                <Badge label={drink.active ? 'Active' : 'Inactive'} tone={drink.active ? 'success' : 'neutral'} />
              </td>
              <td>
                <button className="link-btn" onClick={() => toggleDrinkActive(drink.id)}>
                  {drink.active ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
