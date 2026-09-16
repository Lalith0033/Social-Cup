import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { CATEGORY_COLOR, CATEGORY_EMOJI, CATEGORY_LABELS, CATEGORY_ORDER } from '../categoryMeta';
import { CafePhoto } from '../components/CafePhoto';
import { DrinkPhoto } from '../components/DrinkPhoto';
import { CategoryChip, Card, CreditChip, EmptyState, StarRating } from '../components/Primitives';
import { activeDrinks, averageRatingForDrink, cafeById, cafes, drinksForCafe, getCurrentLocationLabel, neighbourhoods } from '../mockData';
import { useAppActions } from '../state/AppState';
import { colors, radii, spacing, type } from '../theme';
import type { Drink, DrinkCategory } from '../types';

type Mode = 'drinks' | 'venues';

export function DiscoverScreen() {
  const { push } = useAppActions();
  const [mode, setMode] = useState<Mode>('drinks');
  const [query, setQuery] = useState('');
  const [neighbourhoodFilter, setNeighbourhoodFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<DrinkCategory | null>(null);

  const filteredDrinks = useMemo(() => {
    return activeDrinks().filter((drink) => {
      const cafe = cafeById(drink.cafeId);
      const matchesQuery = drink.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchesNeighbourhood = !neighbourhoodFilter || cafe?.neighbourhoodId === neighbourhoodFilter;
      const matchesCategory = !categoryFilter || drink.category === categoryFilter;
      return matchesQuery && matchesNeighbourhood && matchesCategory;
    });
  }, [query, neighbourhoodFilter, categoryFilter]);

  const filteredVenues = useMemo(() => {
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
        <Text style={styles.subtitle}>📍 {getCurrentLocationLabel()}</Text>

        <View style={styles.modeRow}>
          <ModeButton label="Drinks" active={mode === 'drinks'} onPress={() => setMode('drinks')} />
          <ModeButton label="Venues" active={mode === 'venues'} onPress={() => setMode('venues')} />
        </View>

        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={mode === 'drinks' ? 'Search drinks' : 'Search venues'}
            placeholderTextColor={colors.textSecondary}
            style={styles.search}
          />
        </View>
      </View>

      {mode === 'drinks' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow} style={styles.filterScroll}>
          <FilterChip label="All categories" active={!categoryFilter} onPress={() => setCategoryFilter(null)} />
          {CATEGORY_ORDER.map((category) => (
            <CategoryChip key={category} category={category} active={categoryFilter === category} onPress={() => setCategoryFilter(category)} />
          ))}
        </ScrollView>
      )}

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
        {mode === 'drinks' ? (
          <>
            {filteredDrinks.length === 0 && (
              <EmptyState emoji="🔍" title="No drinks found" subtitle={`Nothing matches “${query}”. Try a different search or category.`} />
            )}
            {filteredDrinks.map((drink) => (
              <DrinkListRow key={drink.id} drink={drink} onPress={() => push({ name: 'DrinkDetail', drinkId: drink.id, cafeId: drink.cafeId })} />
            ))}
          </>
        ) : (
          <>
            {filteredVenues.length === 0 && (
              <EmptyState emoji="📍" title="No venues found" subtitle={`Nothing matches “${query}”. Try a different search or neighbourhood.`} />
            )}
            {filteredVenues.map((cafe) => {
              const menu = drinksForCafe(cafe.id);
              const cheapest = menu.reduce((min, d) => Math.min(min, d.creditCost), menu[0]?.creditCost ?? 0);
              return (
                <Pressable key={cafe.id} onPress={() => push({ name: 'CafeDetail', cafeId: cafe.id })}>
                  <Card style={styles.cafeCard}>
                    <CafePhoto color={cafe.photoColor} emoji={cafe.photoEmoji} height={120} radius={radii.md} />
                    <View style={styles.cafeInfo}>
                      <View style={styles.cafeTitleRow}>
                        <Text style={styles.cafeName}>{cafe.name}</Text>
                        <Text style={styles.cafeDistance} numberOfLines={1}>{cafe.distanceLabel}</Text>
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
          </>
        )}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ModeButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.modeButton, active && styles.modeButtonActive]}>
      <Text style={[styles.modeButtonText, active && styles.modeButtonTextActive]}>{label}</Text>
    </Pressable>
  );
}

function DrinkListRow({ drink, onPress }: { drink: Drink; onPress: () => void }) {
  const cafe = cafeById(drink.cafeId);
  const rating = averageRatingForDrink(drink.id, cafe?.ratingAvg ?? 0);
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.drinkCard}>
        <DrinkPhoto imageUri={drink.imageUri} color={CATEGORY_COLOR[drink.category]} emoji={CATEGORY_EMOJI[drink.category]} height={88} width={88} radius={radii.md} />
        <View style={styles.drinkInfo}>
          <Text style={styles.drinkName} numberOfLines={1}>{drink.name}</Text>
          <Text style={styles.drinkCategory}>{CATEGORY_LABELS[drink.category]}{cafe ? ` · ${cafe.name}` : ''}</Text>
          <View style={styles.drinkFooter}>
            {rating > 0 && <StarRating value={rating} size={12} />}
            <CreditChip amount={drink.creditCost} compact />
          </View>
        </View>
      </Card>
    </Pressable>
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
  modeRow: { flexDirection: 'row', backgroundColor: colors.surfaceAlt, borderRadius: radii.pill, padding: 4, marginBottom: spacing.md },
  modeButton: { flex: 1, paddingVertical: spacing.sm, borderRadius: radii.pill, alignItems: 'center' },
  modeButtonActive: { backgroundColor: colors.surface },
  modeButtonText: { ...type.bodyStrong, color: colors.textSecondary },
  modeButtonTextActive: { color: colors.brand },
  searchWrap: { position: 'relative', justifyContent: 'center' },
  searchIcon: { position: 'absolute', left: spacing.md, fontSize: 15, zIndex: 1 },
  search: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingLeft: spacing.xxl,
    paddingRight: spacing.md,
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
  drinkCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, marginBottom: spacing.md },
  drinkInfo: { flex: 1, minWidth: 0, marginLeft: spacing.md },
  drinkName: { ...type.bodyStrong, color: colors.textPrimary },
  drinkCategory: { ...type.small, color: colors.textSecondary, marginTop: 2 },
  drinkFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  cafeCard: { padding: spacing.md, marginBottom: spacing.md },
  cafeInfo: { marginTop: spacing.md },
  cafeTitleRow: { flexDirection: 'row', alignItems: 'flex-start' },
  cafeName: { ...type.subtitle, color: colors.textPrimary, flexShrink: 1, marginRight: spacing.sm },
  cafeDistance: { ...type.small, color: colors.textSecondary, flexShrink: 0, marginLeft: spacing.sm },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, flexWrap: 'wrap' },
  ratingText: { ...type.small, color: colors.textSecondary, marginLeft: spacing.xs },
  cafeMeta: { ...type.small, color: colors.textSecondary, marginTop: 4 },
  cafeDrinks: { ...type.small, color: colors.brand, marginTop: 6, fontWeight: '600' },
});
