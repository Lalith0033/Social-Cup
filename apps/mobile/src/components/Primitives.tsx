import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CATEGORY_COLOR, CATEGORY_EMOJI, CATEGORY_LABELS } from '../categoryMeta';
import { colors, radii, shadow, spacing, type } from '../theme';
import type { DrinkCategory } from '../types';

export function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

type BadgeTone = 'success' | 'danger' | 'warning' | 'neutral' | 'brand';

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: BadgeTone }) {
  return (
    <View style={[styles.badge, badgeTones[tone].bg]}>
      <Text style={[styles.badgeText, badgeTones[tone].text]}>{label}</Text>
    </View>
  );
}

export function CreditChip({ amount, compact = false }: { amount: number; compact?: boolean }) {
  return (
    <View style={styles.creditChip}>
      <Text style={styles.creditChipEmoji}>💳</Text>
      <Text style={styles.creditChipText}>{compact ? `${amount} cr` : `${amount} credits`}</Text>
    </View>
  );
}

export function CategoryChip({
  category,
  active,
  onPress,
}: {
  category: DrinkCategory;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.categoryChip, active && styles.categoryChipActive]}>
      {!active && <View style={[styles.categoryChipDot, { backgroundColor: CATEGORY_COLOR[category] }]} />}
      <Text style={styles.categoryChipEmoji}>{CATEGORY_EMOJI[category]}</Text>
      <Text style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>{CATEGORY_LABELS[category]}</Text>
    </Pressable>
  );
}

export function ProgressBar({
  value,
  max,
  color = colors.accent,
  trackColor = colors.surfaceAlt,
}: {
  value: number;
  max: number;
  color?: string;
  trackColor?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <View style={[styles.progressTrack, { backgroundColor: trackColor }]}>
      <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
}

export function StarRating({ value, size = 14 }: { value: number; size?: number }) {
  const rounded = Math.round(value);
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ fontSize: size, color: i <= rounded ? colors.accent : colors.border }}>
          ★
        </Text>
      ))}
    </View>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function EmptyState({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyBadge}>
        <Text style={styles.emptyEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const badgeTones: Record<BadgeTone, { bg: object; text: object }> = {
  success: { bg: { backgroundColor: colors.successBg }, text: { color: colors.success } },
  danger: { bg: { backgroundColor: colors.dangerBg }, text: { color: colors.danger } },
  warning: { bg: { backgroundColor: colors.warningBg }, text: { color: colors.warning } },
  neutral: { bg: { backgroundColor: colors.surfaceAlt }, text: { color: colors.textSecondary } },
  brand: { bg: { backgroundColor: colors.brandBg }, text: { color: colors.brandDark } },
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadow.card,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
  },
  badgeText: { ...type.caption, textTransform: 'uppercase' },
  creditChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentBg,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
  creditChipEmoji: { fontSize: 14, marginRight: spacing.xs },
  creditChipText: { ...type.bodyStrong, color: colors.accentDark },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  categoryChipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  categoryChipDot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.xs },
  categoryChipEmoji: { fontSize: 15, marginRight: spacing.xs },
  categoryChipText: { ...type.small, color: colors.textPrimary, fontWeight: '600' },
  categoryChipTextActive: { color: colors.textOnBrand },
  progressTrack: { height: 8, borderRadius: radii.pill, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: radii.pill },
  sectionTitle: { ...type.subtitle, color: colors.textPrimary, marginBottom: spacing.md },
  empty: { alignItems: 'center', paddingVertical: spacing.xxxl, paddingHorizontal: spacing.xl },
  emptyBadge: {
    width: 72,
    height: 72,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyEmoji: { fontSize: 34 },
  emptyTitle: { ...type.subtitle, color: colors.textPrimary, textAlign: 'center' },
  emptySubtitle: { ...type.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
});
