import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { CATEGORY_COLOR, CATEGORY_EMOJI, CATEGORY_LABELS } from '../categoryMeta';
import { Button } from '../components/Button';
import { Card } from '../components/Primitives';
import { drinkById, neighbourhoodName } from '../mockData';
import { PREFERENCE_META } from '../preferenceMeta';
import { useAppActions, useAppState } from '../state/AppState';
import { colors, radii, spacing, type } from '../theme';
import type { DrinkCategory } from '../types';

export function ProfileScreen() {
  const { state } = useAppState();
  const { signOut, push } = useAppActions();
  const { member, history } = state;
  const initials = member.displayName
    .split(' ')
    .map((p) => p[0])
    .join('');

  const completed = history.filter((r) => r.status === 'COMPLETED');
  const drinksTriedCount = new Set(completed.map((r) => r.drinkId)).size;
  const venuesVisitedCount = new Set(completed.map((r) => r.cafeId)).size;
  const ratingsGivenCount = 0; // mock ratings aren't linked to the current member yet

  // Honest, non-fabricated: derived from the member's own completed redemptions.
  const favoriteCategory = (() => {
    const tally = new Map<DrinkCategory, number>();
    completed.forEach((r) => {
      const category = drinkById(r.drinkId)?.category;
      if (category) tally.set(category, (tally.get(category) ?? 0) + 1);
    });
    let top: DrinkCategory | undefined;
    let topCount = 0;
    tally.forEach((count, category) => {
      if (count > topCount) {
        top = category;
        topCount = count;
      }
    });
    return top;
  })();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{member.displayName}</Text>
          <Text style={styles.email}>{member.email}</Text>
        </View>

        <View style={styles.statStrip}>
          <Stat label="Drinks tried" value={drinksTriedCount} />
          <Stat label="Venues visited" value={venuesVisitedCount} />
          <Stat label="Ratings given" value={ratingsGivenCount} />
        </View>

        {favoriteCategory && (
          <View style={[styles.favoriteRow, { backgroundColor: `${CATEGORY_COLOR[favoriteCategory]}22` }]}>
            <Text style={styles.favoriteEmoji}>{CATEGORY_EMOJI[favoriteCategory]}</Text>
            <Text style={styles.favoriteText}>
              Your favorite: <Text style={styles.favoriteCategoryName}>{CATEGORY_LABELS[favoriteCategory]}</Text>
            </Text>
          </View>
        )}

        <View style={styles.statStrip}>
          <Stat label="Posts" value={0} />
          <Stat label="Followers" value={0} />
          <Stat label="Following" value={0} />
        </View>
        <Text style={styles.socialCaption}>Social features coming soon</Text>

        <Card style={styles.card}>
          <Row label="Home neighbourhood" value={neighbourhoodName(member.homeNeighbourhoodId)} />
          <View style={styles.divider} />
          <Text style={styles.prefLabel}>Drink preferences</Text>
          <View style={styles.prefRow}>
            {member.preferences.map((pref) => (
              <View key={pref} style={styles.prefChip}>
                <Text style={styles.prefChipText}>
                  {PREFERENCE_META[pref] ? `${PREFERENCE_META[pref].emoji} ${PREFERENCE_META[pref].label}` : pref}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={styles.card}>
          <NavRow label="🧾 Redemption history" onPress={() => push({ name: 'History' })} />
          <View style={styles.divider} />
          <NavRow label="💳 Membership & billing" onPress={() => push({ name: 'Membership' })} />
        </Card>

        <Text style={styles.sectionTitle}>Account</Text>
        <Card style={styles.card}>
          <Row label="Email verification" value="Verified" />
          <Row label="Login method" value="Email & password" />
        </Card>

        <View style={{ height: spacing.xl }} />
        <Button label="Sign out" variant="secondary" onPress={signOut} />
        <Text style={styles.version}>Social Cup · v1.0.0 (prototype)</Text>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function NavRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.navRow}>
      <Text style={styles.navRowLabel}>{label}</Text>
      <Text style={styles.navRowArrow}>→</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, alignItems: 'stretch' },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radii.pill,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: { ...type.title, color: colors.textOnBrand },
  name: { ...type.title, color: colors.textPrimary },
  email: { ...type.small, color: colors.textSecondary, marginTop: 2 },
  statStrip: { flexDirection: 'row', marginBottom: spacing.sm },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { ...type.title, color: colors.textPrimary },
  statLabel: { ...type.small, color: colors.textSecondary, marginTop: 2, textAlign: 'center' },
  socialCaption: { ...type.caption, color: colors.textSecondary, textAlign: 'center', textTransform: 'none', marginBottom: spacing.lg },
  favoriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  favoriteEmoji: { fontSize: 16, marginRight: spacing.xs },
  favoriteText: { ...type.small, color: colors.textPrimary },
  favoriteCategoryName: { fontWeight: '700' },
  card: { marginBottom: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  rowLabel: { ...type.body, color: colors.textSecondary, flex: 1, minWidth: 0, marginRight: spacing.md },
  rowValue: { ...type.bodyStrong, color: colors.textPrimary, flexShrink: 1, textAlign: 'right' },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.xs },
  navRowLabel: { ...type.bodyStrong, color: colors.textPrimary, flex: 1, minWidth: 0 },
  navRowArrow: { ...type.bodyStrong, color: colors.textSecondary, marginLeft: spacing.sm },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  prefLabel: { ...type.small, color: colors.textSecondary, marginBottom: spacing.sm },
  prefRow: { flexDirection: 'row', flexWrap: 'wrap' },
  prefChip: { backgroundColor: colors.surfaceAlt, borderRadius: radii.pill, paddingVertical: 4, paddingHorizontal: spacing.md, marginRight: spacing.sm, marginBottom: spacing.sm },
  prefChipText: { ...type.small, color: colors.textPrimary },
  sectionTitle: { ...type.subtitle, color: colors.textPrimary, marginBottom: spacing.md },
  version: { ...type.small, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.lg },
});
