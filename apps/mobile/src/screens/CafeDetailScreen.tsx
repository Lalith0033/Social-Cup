import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CafePhoto } from '../components/CafePhoto';
import { Badge, Card, StarRating } from '../components/Primitives';
import { ScreenContainer } from '../components/ScreenContainer';
import { cafeById, drinksForCafe, neighbourhoodName, ratingsForCafe } from '../mockData';
import { useAppActions } from '../state/AppState';
import { colors, radii, spacing, type } from '../theme';

export function CafeDetailScreen({ cafeId }: { cafeId: string }) {
  const { pop, push } = useAppActions();
  const cafe = cafeById(cafeId);
  if (!cafe) return null;

  const menu = drinksForCafe(cafe.id);
  const cafeRatings = ratingsForCafe(cafe.id);

  return (
    <ScreenContainer onBack={pop} title={cafe.name}>
      <CafePhoto color={cafe.photoColor} emoji={cafe.photoEmoji} height={160} radius={radii.lg} />
      <View style={styles.photoStrip}>
        <CafePhoto color={cafe.photoColor} emoji="📷" height={56} width={56} radius={radii.sm} />
        <View style={{ width: spacing.sm }} />
        <CafePhoto color={cafe.photoColor} emoji="🪑" height={56} width={56} radius={radii.sm} />
        <View style={{ width: spacing.sm }} />
        <CafePhoto color={cafe.photoColor} emoji="🎨" height={56} width={56} radius={radii.sm} />
      </View>

      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{cafe.name}</Text>
          <Text style={styles.address}>{cafe.address}</Text>
        </View>
        <Badge label="Open now" tone="success" />
      </View>

      <View style={styles.ratingRow}>
        <StarRating value={cafe.ratingAvg} size={18} />
        <Text style={styles.ratingText}>
          {cafe.ratingAvg.toFixed(1)} · {cafe.ratingCount} ratings · {neighbourhoodName(cafe.neighbourhoodId)}
        </Text>
      </View>

      <View style={styles.tagRow}>
        {cafe.vibeTags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Menu</Text>
      {menu.map((drink) => (
        <Pressable key={drink.id} onPress={() => push({ name: 'RedeemConfirm', cafeId: cafe.id, drinkId: drink.id })}>
          <Card style={styles.drinkCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.drinkName}>{drink.name}</Text>
              <Text style={styles.drinkDescription}>{drink.description}</Text>
              <Text style={styles.drinkRetail}>${(drink.retailPriceCents / 100).toFixed(2)} retail</Text>
            </View>
            <View style={styles.creditBadge}>
              <Text style={styles.creditBadgeValue}>{drink.creditCost}</Text>
              <Text style={styles.creditBadgeLabel}>credits</Text>
            </View>
          </Card>
        </Pressable>
      ))}

      <Text style={styles.sectionTitle}>Recent ratings</Text>
      {cafeRatings.length === 0 && <Text style={styles.emptyRatings}>No ratings yet.</Text>}
      {cafeRatings.map((rating) => (
        <Card key={rating.id} style={styles.ratingCard}>
          <View style={styles.ratingCardHeader}>
            <Text style={styles.ratingUser}>{rating.userName}</Text>
            <StarRating value={rating.stars} />
          </View>
          {rating.note && <Text style={styles.ratingNote}>“{rating.note}”</Text>}
          {rating.verifiedRedemption && <Badge label="Verified redemption" tone="brand" />}
        </Card>
      ))}

      <View style={{ height: spacing.xxl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  photoStrip: { flexDirection: 'row', marginTop: spacing.sm },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: spacing.lg },
  name: { ...type.title, color: colors.textPrimary },
  address: { ...type.small, color: colors.textSecondary, marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  ratingText: { ...type.small, color: colors.textSecondary, marginLeft: spacing.sm },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  tag: { backgroundColor: colors.surfaceAlt, borderRadius: radii.pill, paddingVertical: 4, paddingHorizontal: spacing.md, marginRight: spacing.sm, marginBottom: spacing.sm },
  tagText: { ...type.small, color: colors.textSecondary },
  sectionTitle: { ...type.subtitle, color: colors.textPrimary, marginTop: spacing.xl, marginBottom: spacing.md },
  drinkCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  drinkName: { ...type.bodyStrong, color: colors.textPrimary },
  drinkDescription: { ...type.small, color: colors.textSecondary, marginTop: 2 },
  drinkRetail: { ...type.small, color: colors.textSecondary, marginTop: 4 },
  creditBadge: { alignItems: 'center', backgroundColor: colors.accentBg, borderRadius: radii.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, marginLeft: spacing.md },
  creditBadgeValue: { ...type.title, fontSize: 20, color: colors.brandDark },
  creditBadgeLabel: { ...type.caption, color: colors.brandDark },
  emptyRatings: { ...type.body, color: colors.textSecondary },
  ratingCard: { marginBottom: spacing.md },
  ratingCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingUser: { ...type.bodyStrong, color: colors.textPrimary },
  ratingNote: { ...type.body, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.xs, fontStyle: 'italic' },
});
