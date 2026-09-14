import type { Section } from '../state/AdminState';

const ITEMS: { key: Section; label: string; emoji: string }[] = [
  { key: 'dashboard', label: 'Dashboard', emoji: '📊' },
  { key: 'cafes', label: 'Cafés', emoji: '☕' },
  { key: 'drinks', label: 'Drinks', emoji: '🥤' },
  { key: 'members', label: 'Members', emoji: '👥' },
  { key: 'subscriptions', label: 'Subscriptions', emoji: '💳' },
  { key: 'ratings', label: 'Ratings', emoji: '⭐' },
  { key: 'payouts', label: 'Payouts', emoji: '💵' },
  { key: 'audit', label: 'Audit log', emoji: '🧾' },
];

export function Sidebar({ active, onSelect }: { active: Section; onSelect: (s: Section) => void }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-brand">☕ Social Cup Admin</div>
      {ITEMS.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`sidebar-item ${active === item.key ? 'active' : ''}`}
          onClick={() => onSelect(item.key)}
        >
          <span>{item.emoji}</span>
          <span>{item.label}</span>
        </button>
      ))}
      <div style={{ flex: 1 }} />
      <a
        href="http://localhost:4001"
        style={{ color: 'rgba(255,248,240,0.6)', fontSize: 12, padding: '10px 12px' }}
      >
        Open Barista demo →
      </a>
    </nav>
  );
}
