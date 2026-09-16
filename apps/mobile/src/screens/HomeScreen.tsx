import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { CATEGORY_ORDER } from '../categoryMeta';
import { CafePhoto } from '../components/CafePhoto';
import { DrinkCard } from '../components/DrinkCard';
import { Badge, CategoryChip, Card, CreditChip, EmptyState, ProgressBar, SectionTitle, StarRating } from '../components/Primitives';
import { cafeById, getCurrentLocationLabel, getNearbyDrinks, getPopularDrinks, getTrendingDrinks, nearbyVenues } from '../mockData';
import { useAppActions, useAppState } from '../state/AppState';
import { colors, radii, spacing, type } from '../theme';
import type { Drink } from '../types';

export function HomeScreen() {
  const { state } = useAppState();
  const { setTab, push } = useAppActions();
  const { member, balance, subscription, history } = state;
  const recent = history[0];
  const recentCafe = recent ? cafeById(recent.cafeId) : undefined;
  const firstName = member.displayName.split(' ')[0];

  function openDrink(drink: Drink) {
    push({ name: 'DrinkDetail', drinkId: drink.id, cafeId: drink.cafeId });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.location}>📍 {getCurrentLocationLabel()}</Text>
        <Text style={styles.greeting}>Good morning, {firstName} ☀️</Text>
        <Text style={styles.subGreeting}>What's your next drink?</Text>

        <Card style={styles.balanceCard}>
          <View style={styles.balanceRow}>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Available credits</Text>
              <Text style={styles.balanceValue}>{balance}</Text>
              <Text style={styles.balanceOf}>of {subscription.creditsPerPeriod} this cycle</Text>
            </View>
            <Badge label={subscription.status === 'ACTIVE' ? 'Active member' : subscription.status} tone={subscription.status === 'ACTIVE' ? 'success' : 'warning'} />
          </View>
          <View style={styles.progressWrap}>
            <ProgressBar value={balance} max={subscription.creditsPerPeriod} />
          </View>
          <Text style={styles.renews}>Credits reset {subscription.currentPeriodEnd} · no rollover</Text>
        </Card>

        <View style={styles.sectionHeaderRow}>
          <SectionTitle>What's your next drink?</SectionTitle>
          <Pressable onPress={() => setTab('discover')}><Text style={styles.browseAll}>Browse all →</Text></Pressable>
        </View>
        <DrinkRow drinks={getNearbyDrinks()} onPress={openDrink} cardWidth={220} />

        <SectionTitle>Popular near you</SectionTitle>
        <DrinkRow drinks={getPopularDrinks()} onPress={openDrink} />

        <SectionTitle>Explore by category</SectionTitle>
        <View style={styles.categoryWrap}>
          {CATEGORY_ORDER.map((category) => (
            <CategoryChip key={category} category={category} onPress={() => setTab('discover')} />
          ))}
        </View>

        <SectionTitle>Trending around you</SectionTitle>
        <DrinkRow drinks={getTrendingDrinks()} onPress={openDrink} />

        <SectionTitle>Nearby Social Cup venues</SectionTitle>
        {nearbyVenues().slice(0, 4).map((cafe) => (
          <Pressable key={cafe.id} onPress={() => push({ name: 'CafeDetail', cafeId: cafe.id })}>
            <Card style={styles.venueRow}>
              <CafePhoto color={cafe.photoColor} emoji={cafe.photoEmoji} height={48} width={48} radius={radii.md} />
              <View style={styles.venueInfo}>
                <Text style={styles.venueName} numberOfLines={1}>{cafe.name}</Text>
                <View style={styles.venueMetaRow}>
                  <StarRating value={cafe.ratingAvg} size={12} />
                  <Text style={styles.venueMeta}> {cafe.ratingAvg.toFixed(1)} · {cafe.distanceLabel}</Text>
                </View>
              </View>
            </Card>
          </Pressable>
        ))}

        <SectionTitle>Recent activity</SectionTitle>
        {recent ? (
          <Pressable onPress={() => push({ name: 'History' })}>
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
            <EmptyState emoji="🥤" title="No redemptions yet" subtitle="Go find your first drink!" />
          </Card>
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function DrinkRow({ drinks, onPress, cardWidth }: { drinks: Drink[]; onPress: (drink: Drink) => void; cardWidth?: number }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.drinkRow} contentContainerStyle={styles.drinkRowContent}>
      {drinks.map((drink) => (
        <DrinkCard
          key={drink.id}
          drink={drink}
          cafe={cafeById(drink.cafeId)}
          onPress={() => onPress(drink)}
          width={cardWidth}
          photoHeight={cardWidth ? 150 : undefined}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  location: { ...type.small, color: colors.textSecondary, fontWeight: '600' },
  greeting: { ...type.title, color: colors.textPrimary, marginTop: 2 },
  subGreeting: { ...type.body, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.xl },
  balanceCard: { marginBottom: spacing.xl },
  balanceRow: { flexDirection: 'row', alignItems: 'flex-start' },
  balanceInfo: { flex: 1, minWidth: 0 },
  balanceLabel: { ...type.small, color: colors.textSecondary },
  balanceValue: { fontSize: 40, fontWeight: '700', color: colors.brandDark, marginTop: 2 },
  balanceOf: { ...type.small, color: colors.textSecondary },
  progressWrap: { marginTop: spacing.lg },
  renews: { ...type.small, color: colors.textSecondary, marginTop: spacing.sm },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  browseAll: { ...type.small, color: colors.brand, fontWeight: '600' },
  drinkRow: { marginBottom: spacing.md },
  drinkRowContent: { paddingRight: spacing.md },
  categoryWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md },
  venueRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  venueInfo: { flex: 1, minWidth: 0, marginLeft: spacing.md },
  venueName: { ...type.bodyStrong, color: colors.textPrimary },
  venueMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2, flexWrap: 'wrap' },
  venueMeta: { ...type.small, color: colors.textSecondary },
  recentRow: { flexDirection: 'row', alignItems: 'center' },
  recentInfo: { flex: 1, minWidth: 0, marginLeft: spacing.md, marginRight: spacing.sm },
  recentDrink: { ...type.bodyStrong, color: colors.textPrimary },
  recentCafe: { ...type.small, color: colors.textSecondary, marginTop: 1 },
  recentDate: { ...type.small, color: colors.textSecondary, marginTop: 1 },
});
