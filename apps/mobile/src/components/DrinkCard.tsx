import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CATEGORY_COLOR, CATEGORY_EMOJI, CATEGORY_LABELS } from '../categoryMeta';
import { averageRatingForDrink } from '../mockData';
import { colors, radii, spacing, type } from '../theme';
import type { Cafe, Drink } from '../types';
import { CreditChip, StarRating } from './Primitives';
import { DrinkPhoto } from './DrinkPhoto';

export function DrinkCard({
  drink,
  cafe,
  onPress,
  width,
  photoHeight = 120,
}: {
  drink: Drink;
  cafe?: Cafe;
  onPress: () => void;
  width?: number;
  photoHeight?: number;
}) {
  const rating = averageRatingForDrink(drink.id, cafe?.ratingAvg ?? 0);
  return (
    <Pressable onPress={onPress} style={[styles.card, width ? { width } : undefined]}>
      <DrinkPhoto
        imageUri={drink.imageUri}
        color={CATEGORY_COLOR[drink.category]}
        emoji={CATEGORY_EMOJI[drink.category]}
        height={photoHeight}
        radius={radii.md}
      />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{drink.name}</Text>
        <Text style={styles.category}>{CATEGORY_LABELS[drink.category]}</Text>
        {cafe && (
          <Text style={styles.venue} numberOfLines={1}>{cafe.name} · {cafe.distanceLabel}</Text>
        )}
        <View style={styles.footer}>
          {rating > 0 && (
            <View style={styles.ratingRow}>
              <StarRating value={rating} size={12} />
            </View>
          )}
          <CreditChip amount={drink.creditCost} compact />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 168,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginRight: spacing.md,
    marginBottom: spacing.sm,
  },
  body: { padding: spacing.md },
  name: { ...type.bodyStrong, color: colors.textPrimary },
  category: { ...type.caption, color: colors.textSecondary, marginTop: 2, textTransform: 'none' },
  venue: { ...type.small, color: colors.textSecondary, marginTop: 4 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  ratingRow: { flexShrink: 1, marginRight: spacing.xs },
});
