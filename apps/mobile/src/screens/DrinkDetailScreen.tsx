import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { CATEGORY_COLOR, CATEGORY_EMOJI, CATEGORY_LABELS } from '../categoryMeta';
import { Button } from '../components/Button';
import { DrinkPhoto } from '../components/DrinkPhoto';
import { CreditChip, SectionTitle, StarRating } from '../components/Primitives';
import { ScreenContainer } from '../components/ScreenContainer';
import { averageRatingForDrink, cafeById, communityMentionsForDrink, drinkById, ratingsForDrink } from '../mockData';
import { useAppActions } from '../state/AppState';
import { colors, radii, spacing, type } from '../theme';

export function DrinkDetailScreen({ drinkId, cafeId }: { drinkId: string; cafeId: string }) {
  const { pop, push } = useAppActions();
  const drink = drinkById(drinkId);
  const cafe = cafeById(cafeId);
  if (!drink || !cafe) return null;

  const rating = averageRatingForDrink(drink.id, cafe.ratingAvg);
  const ratingCount = ratingsForDrink(drink.id).length;
  const temperatureTag = drink.name.toLowerCase().includes('iced') || drink.name.toLowerCase().includes('cold') ? 'Iced' : 'Hot';
  const mentions = communityMentionsForDrink(drink.id);

  return (
    <ScreenContainer onBack={pop} title={drink.name}>
      <DrinkPhoto
        imageUri={drink.imageUri}
        color={CATEGORY_COLOR[drink.category]}
        emoji={CATEGORY_EMOJI[drink.category]}
        height={220}
        radius={radii.lg}
      />

      <View style={styles.ratingRow}>
        <StarRating value={rating} size={18} />
        {rating > 0 && (
          <Text style={styles.ratingText}>
            {rating.toFixed(1)}{ratingCount > 0 ? ` · ${ratingCount} rating${ratingCount === 1 ? '' : 's'}` : ''}
          </Text>
        )}
      </View>

      <Pressable onPress={() => push({ name: 'CafeDetail', cafeId: cafe.id })} style={styles.venueRow}>
        <Text style={styles.venueText}>📍 {cafe.name} · {cafe.distanceLabel}</Text>
      </Pressable>

      <View style={styles.tagRow}>
        <View style={[styles.tag, { backgroundColor: `${CATEGORY_COLOR[drink.category]}22` }]}>
          <Text style={styles.tagText}>{CATEGORY_LABELS[drink.category]}</Text>
        </View>
        <View style={styles.tag}><Text style={styles.tagText}>{temperatureTag}</Text></View>
      </View>

      <Text style={styles.description}>{drink.description}</Text>

      <View style={styles.creditRow}>
        <CreditChip amount={drink.creditCost} />
      </View>

      <Button label="Redeem" onPress={() => push({ name: 'RedeemConfirm', cafeId: cafe.id, drinkId: drink.id })} />
      <View style={{ height: spacing.sm }} />
      <Button
        label="Get Directions"
        variant="secondary"
        onPress={() => Alert.alert('Get Directions', `Directions to ${cafe.name} aren't available in this preview.`)}
      />

      {mentions.length > 0 && (
        <>
          <SectionTitle>Community</SectionTitle>
          {mentions.map((line, index) => (
            <Text key={index} style={styles.mention}>"{line}"</Text>
          ))}
        </>
      )}

      <View style={{ height: spacing.xxl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg },
  ratingText: { ...type.small, color: colors.textSecondary, marginLeft: spacing.sm },
  venueRow: { marginTop: spacing.sm },
  venueText: { ...type.body, color: colors.brand, fontWeight: '600' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  tag: { backgroundColor: colors.surfaceAlt, borderRadius: radii.pill, paddingVertical: 4, paddingHorizontal: spacing.md, marginRight: spacing.sm, marginBottom: spacing.sm },
  tagText: { ...type.small, color: colors.textSecondary },
  description: { ...type.body, color: colors.textSecondary, marginTop: spacing.sm },
  creditRow: { marginVertical: spacing.lg, alignItems: 'flex-start' },
  mention: { ...type.body, color: colors.textSecondary, marginTop: spacing.sm, fontStyle: 'italic' },
});
