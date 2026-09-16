import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { CafePhoto } from '../components/CafePhoto';
import { Card, SectionTitle, StarRating } from '../components/Primitives';
import { cafes, drinksForCafe, getCurrentLocationLabel, nearbyVenues } from '../mockData';
import { useAppActions } from '../state/AppState';
import { colors, radii, spacing, type } from '../theme';
import type { Cafe } from '../types';

const PIN_LAYOUT: { cafeId: string; top: string; left: string }[] = [
  { cafeId: 'cafe-elm-and-oak', top: '20%', left: '55%' },
  { cafeId: 'cafe-boba-bliss', top: '42%', left: '22%' },
  { cafeId: 'cafe-bishop-brew', top: '65%', left: '60%' },
  { cafeId: 'cafe-trinity-squeeze', top: '30%', left: '78%' },
  { cafeId: 'cafe-uptown-pour', top: '75%', left: '30%' },
];

export function MapScreen() {
  const { push } = useAppActions();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Map</Text>
        <Text style={styles.subtitle}>📍 {getCurrentLocationLabel()}</Text>

        <View style={styles.mapPreview}>
          <Text style={styles.youPin}>📍 You</Text>
          {PIN_LAYOUT.map(({ cafeId, top, left }) => {
            const cafe = cafes.find((c) => c.id === cafeId);
            if (!cafe) return null;
            return (
              <Pressable
                key={cafeId}
                onPress={() => push({ name: 'CafeDetail', cafeId })}
                style={[styles.pin, { borderColor: cafe.photoColor, top: top as never, left: left as never }]}
              >
                <View style={[styles.pinDot, { backgroundColor: cafe.photoColor }]} />
                <Text style={styles.pinText}>{cafe.photoEmoji} {cafe.name}</Text>
              </Pressable>
            );
          })}
          <Text style={styles.previewCaption}>Map preview (illustrative)</Text>
        </View>

        <SectionTitle>Nearby venues</SectionTitle>
        {nearbyVenues().map((cafe) => (
          <VenueRow key={cafe.id} cafe={cafe} onPress={() => push({ name: 'CafeDetail', cafeId: cafe.id })} />
        ))}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function VenueRow({ cafe, onPress }: { cafe: Cafe; onPress: () => void }) {
  const drinkCount = drinksForCafe(cafe.id).length;
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.venueCard}>
        <CafePhoto color={cafe.photoColor} emoji={cafe.photoEmoji} height={52} width={52} radius={radii.md} />
        <View style={styles.venueInfo}>
          <Text style={styles.venueName} numberOfLines={1}>{cafe.name}</Text>
          <View style={styles.venueMetaRow}>
            <StarRating value={cafe.ratingAvg} size={12} />
            <Text style={styles.venueMeta}> {cafe.ratingAvg.toFixed(1)} · {cafe.distanceLabel} · {drinkCount} drinks</Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  title: { ...type.title, color: colors.textPrimary },
  subtitle: { ...type.small, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.lg },
  mapPreview: {
    height: 220,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  youPin: { position: 'absolute', top: '48%', left: '45%', ...type.small, fontWeight: '700', color: colors.brand },
  pin: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    maxWidth: 160,
  },
  pinDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  pinText: { ...type.caption, color: colors.textPrimary, textTransform: 'none' },
  previewCaption: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    ...type.caption,
    color: colors.textSecondary,
    textTransform: 'none',
  },
  venueCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  venueInfo: { flex: 1, minWidth: 0, marginLeft: spacing.md },
  venueName: { ...type.bodyStrong, color: colors.textPrimary },
  venueMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2, flexWrap: 'wrap' },
  venueMeta: { ...type.small, color: colors.textSecondary },
});
