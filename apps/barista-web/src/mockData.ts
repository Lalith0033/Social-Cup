import type { Cafe, RedemptionLogEntry } from './types';

export const cafes: Cafe[] = [
  { id: 'cafe-elm-and-oak', name: 'Elm & Oak Coffee', address: '2934 Elm St, Dallas, TX' },
  { id: 'cafe-bishop-brew', name: 'Bishop Brew Collective', address: '408 N Bishop Ave, Dallas, TX' },
  { id: 'cafe-uptown-pour', name: 'Uptown Pour House', address: '2500 McKinney Ave, Dallas, TX' },
  { id: 'cafe-trinity-roast', name: 'Trinity Roasting Co.', address: '3011 Gulden Ln, Dallas, TX' },
  { id: 'cafe-greenville-grind', name: 'Greenville Grind', address: '1919 Greenville Ave, Dallas, TX' },
];

// Demo-only PIN: every cafe accepts "1234" so the reviewer doesn't need a lookup table.
export const DEMO_PIN = '1234';

// Deterministic demo scenarios so the four scan states are reachable reliably,
// rather than relying on chance. A real backup code maps 1:1 to a live token;
// here each hardcoded code plays the part of a specific scenario.
export const DEMO_BACKUP_CODES: Record<string, { memberName: string; drinkName: string; creditCost: number }> = {
  'K9B2A7': { memberName: 'Jordan Ramirez', drinkName: 'Honey Oat Latte', creditCost: 4 },
  'M3X8Q1': { memberName: 'Priya Shah', drinkName: 'Cortado', creditCost: 3 },
};

export const initialTodayLog: RedemptionLogEntry[] = [
  { id: 'log-1', memberName: 'Ana Gutierrez', drinkName: 'Vanilla Bean Latte', creditCost: 4, time: '7:58 AM' },
  { id: 'log-2', memberName: 'Devon King', drinkName: 'Double Espresso', creditCost: 3, time: '8:21 AM' },
  { id: 'log-3', memberName: 'Sam Whitfield', drinkName: 'Cold Brew', creditCost: 3, time: '9:05 AM' },
];
