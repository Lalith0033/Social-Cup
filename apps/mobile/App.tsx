import { RootNavigator } from './src/navigation/RootNavigator';
import { AppStateProvider } from './src/state/AppState';

export default function App() {
  return (
    <AppStateProvider>
      <RootNavigator />
    </AppStateProvider>
  );
}
