import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CATEGORY_COLOR, CATEGORY_EMOJI } from '../categoryMeta';
import { cafeById, drinkById } from '../mockData';
import { colors, radii, spacing, type } from '../theme';
import type { FeedPost } from '../types';
import { Button } from './Button';
import { Card } from './Primitives';
import { DrinkPhoto } from './DrinkPhoto';

export function FeedPostCard({ post, onViewDrink }: { post: FeedPost; onViewDrink: () => void }) {
  const drink = drinkById(post.drinkId);
  const cafe = cafeById(post.cafeId);
  if (!drink || !cafe) return null;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{post.userInitials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{post.userName}</Text>
          <Text style={styles.distance}>📍 {post.distanceLabel}</Text>
        </View>
      </View>

      <DrinkPhoto
        imageUri={drink.imageUri}
        color={CATEGORY_COLOR[drink.category]}
        emoji={CATEGORY_EMOJI[drink.category]}
        height={200}
        radius={radii.md}
      />

      <Text style={styles.drinkLine}>
        {drink.name} <Text style={styles.venueLine}>@ {cafe.name}</Text>
      </Text>
      {post.caption && <Text style={styles.caption}>"{post.caption}"</Text>}

      <View style={styles.footer}>
        <Text style={styles.stat}>♡ {post.likeCount}</Text>
        <Text style={styles.stat}>💬 {post.commentCount}</Text>
      </View>

      <Button label="View Drink" variant="secondary" onPress={onViewDrink} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: { ...type.bodyStrong, color: colors.textOnBrand },
  headerInfo: { flex: 1, minWidth: 0 },
  userName: { ...type.bodyStrong, color: colors.textPrimary },
  distance: { ...type.small, color: colors.textSecondary, marginTop: 1 },
  drinkLine: { ...type.bodyStrong, color: colors.textPrimary, marginTop: spacing.md },
  venueLine: { ...type.body, color: colors.textSecondary, fontWeight: '400' },
  caption: { ...type.body, color: colors.textSecondary, marginTop: spacing.xs, fontStyle: 'italic' },
  footer: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md, marginBottom: spacing.md },
  stat: { ...type.small, color: colors.textSecondary, fontWeight: '600' },
});
