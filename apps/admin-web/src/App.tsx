import { Sidebar } from './components/Sidebar';
import { AuditScreen } from './screens/AuditScreen';
import { CafesScreen } from './screens/CafesScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { DrinksScreen } from './screens/DrinksScreen';
import { MembersScreen } from './screens/MembersScreen';
import { PayoutsScreen } from './screens/PayoutsScreen';
import { RatingsScreen } from './screens/RatingsScreen';
import { SubscriptionsScreen } from './screens/SubscriptionsScreen';
import { AdminStateProvider, useAdminActions, useAdminState } from './state/AdminState';
import type { Section } from './state/AdminState';

function Shell() {
  const { state } = useAdminState();
  const { setSection } = useAdminActions();

  return (
    <div className="app-shell">
      <Sidebar active={state.section} onSelect={setSection} />
      <main className="main-content">{renderSection(state.section)}</main>
    </div>
  );
}

function renderSection(section: Section) {
  switch (section) {
    case 'dashboard':
      return <DashboardScreen />;
    case 'cafes':
      return <CafesScreen />;
    case 'drinks':
      return <DrinksScreen />;
    case 'members':
      return <MembersScreen />;
    case 'subscriptions':
      return <SubscriptionsScreen />;
    case 'ratings':
      return <RatingsScreen />;
    case 'payouts':
      return <PayoutsScreen />;
    case 'audit':
      return <AuditScreen />;
    default:
      return <DashboardScreen />;
  }
}

function App() {
  return (
    <AdminStateProvider>
      <Shell />
    </AdminStateProvider>
  );
}

export default App;
