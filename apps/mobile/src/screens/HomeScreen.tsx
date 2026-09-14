import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Badge, Card, CreditChip, SectionTitle } from '../components/Primitives';
import { CafePhoto } from '../components/CafePhoto';
import { cafeById } from '../mockData';
import { useAppActions, useAppState } from '../state/AppState';
import { colors, radii, spacing, type } from '../theme';

export function HomeScreen() {
  const { state } = useAppState();
  const { setTab } = useAppActions();
  const { member, balance, subscription, history } = state;
  const recent = history[0];
  const recentCafe = recent ? cafeById(recent.cafeId) : undefined;
  const firstName = member.displayName.split(' ')[0];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>Good morning, {firstName} ☀️</Text>
        <Text style={styles.subGreeting}>Ready for your next cup?</Text>

        <Card style={styles.balanceCard}>
          <View style={styles.balanceRow}>
            <View>
              <Text style={styles.balanceLabel}>Available credits</Text>
              <Text style={styles.balanceValue}>{balance}</Text>
              <Text style={styles.balanceOf}>of {subscription.creditsPerPeriod} this cycle</Text>
            </View>
            <Badge label={subscription.status === 'ACTIVE' ? 'Active member' : subscription.status} tone={subscription.status === 'ACTIVE' ? 'success' : 'warning'} />
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min(100, (balance / subscription.creditsPerPeriod) * 100)}%` }]} />
          </View>
          <Text style={styles.renews}>Credits reset {subscription.currentPeriodEnd} · no rollover</Text>
        </Card>

        <Pressable style={styles.ctaCard} onPress={() => setTab('discover')}>
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaTitle}>Find a café</Text>
            <Text style={styles.ctaSubtitle}>Browse nearby cafés and redeem a drink</Text>
          </View>
          <Text style={styles.ctaArrow}>→</Text>
        </Pressable>

        <SectionTitle>Recent activity</SectionTitle>
        {recent ? (
          <Pressable onPress={() => setTab('history')}>
            <Card>
              <View style={styles.recentRow}>
                {recentCafe && <CafePhoto color={recentCafe.photoColor} emoji={recentCafe.photoEmoji} height={52} width={52} radius={radii.md} />}
                <View style={styles.recentInfo}>
                  <Text style={styles.recentDrink}>{recent.drinkName}</Text>
                  <Text style={styles.recentCafe}>{recent.cafeName}</Text>
                  <Text style={styles.recentDate}>{recent.redeemedAt}</Text>
                </View>
                <CreditChip amount={recent.creditCost} />
              </View>
            </Card>
          </Pressable>
        ) : (
          <Card>
            <Text style={styles.emptyText}>No redemptions yet — go find your first café!</Text>
          </Card>
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  greeting: { ...type.title, color: colors.textPrimary },
  subGreeting: { ...type.body, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.xl },
  balanceCard: { marginBottom: spacing.lg },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  balanceLabel: { ...type.small, color: colors.textSecondary },
  balanceValue: { fontSize: 40, fontWeight: '700', color: colors.brandDark, marginTop: 2 },
  balanceOf: { ...type.small, color: colors.textSecondary },
  progressTrack: { height: 8, borderRadius: radii.pill, backgroundColor: colors.surfaceAlt, marginTop: spacing.lg, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: radii.pill, backgroundColor: colors.accent },
  renews: { ...type.small, color: colors.textSecondary, marginTop: spacing.sm },
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  ctaTitle: { ...type.subtitle, color: colors.textOnBrand },
  ctaSubtitle: { ...type.small, color: colors.accentBg, marginTop: 2 },
  ctaArrow: { fontSize: 22, color: colors.textOnBrand },
  recentRow: { flexDirection: 'row', alignItems: 'center' },
  recentInfo: { flex: 1, marginLeft: spacing.md },
  recentDrink: { ...type.bodyStrong, color: colors.textPrimary },
  recentCafe: { ...type.small, color: colors.textSecondary, marginTop: 1 },
  recentDate: { ...type.small, color: colors.textSecondary, marginTop: 1 },
  emptyText: { ...type.body, color: colors.textSecondary },
});
