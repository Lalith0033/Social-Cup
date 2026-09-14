import { PinEntryScreen } from './screens/PinEntryScreen';
import { ResultScreen } from './screens/ResultScreen';
import { ScannerScreen } from './screens/ScannerScreen';
import { TodayHistoryScreen } from './screens/TodayHistoryScreen';
import { BaristaStateProvider, useBaristaState } from './state/BaristaState';

function Screens() {
  const { state } = useBaristaState();

  if (!state.trustedCafeId || state.view === 'pin') return <PinEntryScreen />;
  if (state.view === 'result') return <ResultScreen />;
  if (state.view === 'history') return <TodayHistoryScreen />;
  return <ScannerScreen />;
}

function App() {
  return (
    <BaristaStateProvider>
      <Screens />
      <DemoSurfaceLinks />
    </BaristaStateProvider>
  );
}

function DemoSurfaceLinks() {
  return (
    <div style={{ textAlign: 'center', padding: '8px 24px 24px', fontSize: 12, color: 'var(--sc-text-secondary)' }}>
      Demo build · other surfaces:{' '}
      <a href="http://localhost:4001" style={{ color: 'var(--sc-brand)' }}>
        Admin
      </a>
    </div>
  );
}

export default App;
