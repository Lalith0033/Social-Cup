// Shared source of truth for Member.preferences ids, used by both
// OnboardingScreen (selection) and ProfileScreen (display) so the two never
// drift out of sync with each other or with real seeded member data.
export const PREFERENCE_META: Record<string, { label: string; emoji: string }> = {
  espresso: { label: 'Espresso', emoji: '☕' },
  latte: { label: 'Latte', emoji: '🥛' },
  'cold-brew': { label: 'Cold brew', emoji: '🧊' },
  matcha: { label: 'Matcha', emoji: '🍵' },
  'oat-milk': { label: 'Oat milk', emoji: '🌾' },
};

export const PREFERENCE_ORDER = ['espresso', 'latte', 'cold-brew', 'matcha', 'oat-milk'];
