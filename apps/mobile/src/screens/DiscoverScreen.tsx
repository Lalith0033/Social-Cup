import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { CafePhoto } from '../components/CafePhoto';
import { Card, StarRating } from '../components/Primitives';
import { cafes, drinksForCafe, neighbourhoods } from '../mockData';
import { useAppActions, useAppState } from '../state/AppState';
import { colors, radii, spacing, type } from '../theme';

export function DiscoverScreen() {
  const { push } = useAppActions();
  const { state } = useAppState();
  const [query, setQuery] = useState('');
  const [neighbourhoodFilter, setNeighbourhoodFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return cafes.filter((cafe) => {
      const matchesQuery = cafe.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchesNeighbourhood = !neighbourhoodFilter || cafe.neighbourhoodId === neighbourhoodFilter;
      return matchesQuery && matchesNeighbourhood;
    });
  }, [query, neighbourhoodFilter]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <Text style={styles.subtitle}>Home base: {neighbourhoods.find((n) => n.id === state.member.homeNeighbourhoodId)?.name}</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search cafés"
          placeholderTextColor={colors.textSecondary}
          style={styles.search}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow} style={styles.filterScroll}>
        <FilterChip label="All neighbourhoods" active={!neighbourhoodFilter} onPress={() => setNeighbourhoodFilter(null)} />
        {neighbourhoods.map((n) => (
          <FilterChip
            key={n.id}
            label={n.name}
            active={neighbourhoodFilter === n.id}
            onPress={() => setNeighbourhoodFilter(n.id)}
          />
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 && (
          <Text style={styles.empty}>No cafés match “{query}”.</Text>
        )}
        {filtered.map((cafe) => {
          const menu = drinksForCafe(cafe.id);
          const cheapest = menu.reduce((min, d) => Math.min(min, d.creditCost), menu[0]?.creditCost ?? 0);
          return (
            <Pressable key={cafe.id} onPress={() => push({ name: 'CafeDetail', cafeId: cafe.id })}>
              <Card style={styles.cafeCard}>
                <CafePhoto color={cafe.photoColor} emoji={cafe.photoEmoji} height={120} radius={radii.md} />
                <View style={styles.cafeInfo}>
                  <View style={styles.cafeTitleRow}>
                    <Text style={styles.cafeName}>{cafe.name}</Text>
                    <Text style={styles.cafeDistance}>{cafe.distanceLabel}</Text>
                  </View>
                  <View style={styles.ratingRow}>
                    <StarRating value={cafe.ratingAvg} />
                    <Text style={styles.ratingText}>
                      {cafe.ratingAvg.toFixed(1)} ({cafe.ratingCount})
                    </Text>
                  </View>
                  <Text style={styles.cafeMeta}>
                    {neighbourhoods.find((n) => n.id === cafe.neighbourhoodId)?.name} · {cafe.hours}
                  </Text>
                  <Text style={styles.cafeDrinks}>
                    {menu.length} drinks available · from {cheapest} credits
                  </Text>
                </View>
              </Card>
            </Pressable>
          );
        })}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  title: { ...type.title, color: colors.textPrimary },
  subtitle: { ...type.small, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.md },
  search: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
  },
  filterScroll: { marginTop: spacing.md, flexGrow: 0 },
  filterRow: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginRight: spacing.sm,
  },
  chipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { ...type.small, color: colors.textPrimary, fontWeight: '600' },
  chipTextActive: { color: colors.textOnBrand },
  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  empty: { ...type.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xxl },
  cafeCard: { padding: spacing.md, marginBottom: spacing.md },
  cafeInfo: { marginTop: spacing.md },
  cafeTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cafeName: { ...type.subtitle, color: colors.textPrimary, flexShrink: 1, marginRight: spacing.sm },
  cafeDistance: { ...type.small, color: colors.textSecondary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingText: { ...type.small, color: colors.textSecondary, marginLeft: spacing.xs },
  cafeMeta: { ...type.small, color: colors.textSecondary, marginTop: 4 },
  cafeDrinks: { ...type.small, color: colors.brand, marginTop: 6, fontWeight: '600' },
});
