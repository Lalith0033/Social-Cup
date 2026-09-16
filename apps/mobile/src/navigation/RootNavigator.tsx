import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CafeDetailScreen } from '../screens/CafeDetailScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { DiscoverScreen } from '../screens/DiscoverScreen';
import { DrinkDetailScreen } from '../screens/DrinkDetailScreen';
import { FeedScreen } from '../screens/FeedScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LandingScreen } from '../screens/LandingScreen';
import { MapScreen } from '../screens/MapScreen';
import { MembershipScreen } from '../screens/MembershipScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RedeemConfirmScreen } from '../screens/RedeemConfirmScreen';
import { RedemptionResultScreen } from '../screens/RedemptionResultScreen';
import { RedemptionTokenScreen } from '../screens/RedemptionTokenScreen';
import { useAppActions, useAppState } from '../state/AppState';
import { colors } from '../theme';
import { TabBar } from './TabBar';
import type { StackScreen, TabKey } from './types';

export function RootNavigator() {
  const { state } = useAppState();
  const { setTab } = useAppActions();

  if (state.authPhase === 'landing') return <LandingScreen />;
  if (state.authPhase === 'auth') return <AuthScreen />;
  if (state.authPhase === 'onboarding') return <OnboardingScreen />;

  const topOfStack = state.stack[state.stack.length - 1];

  if (topOfStack) {
    return <View style={styles.fill}>{renderStackScreen(topOfStack)}</View>;
  }

  return (
    <View style={styles.fill}>
      <View style={styles.fill}>{renderTab(state.activeTab)}</View>
      <TabBar active={state.activeTab} onSelect={setTab} />
    </View>
  );
}

function renderTab(tab: TabKey) {
  switch (tab) {
    case 'home':
      return <HomeScreen />;
    case 'feed':
      return <FeedScreen />;
    case 'discover':
      return <DiscoverScreen />;
    case 'map':
      return <MapScreen />;
    case 'profile':
      return <ProfileScreen />;
    default:
      return <HomeScreen />;
  }
}

function renderStackScreen(screen: StackScreen) {
  switch (screen.name) {
    case 'CafeDetail':
      return <CafeDetailScreen cafeId={screen.cafeId} />;
    case 'DrinkDetail':
      return <DrinkDetailScreen drinkId={screen.drinkId} cafeId={screen.cafeId} />;
    case 'RedeemConfirm':
      return <RedeemConfirmScreen cafeId={screen.cafeId} drinkId={screen.drinkId} />;
    case 'RedemptionToken':
      return <RedemptionTokenScreen />;
    case 'RedemptionResult':
      return <RedemptionResultScreen />;
    case 'History':
      return <HistoryScreen />;
    case 'Membership':
      return <MembershipScreen />;
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.bg },
});
