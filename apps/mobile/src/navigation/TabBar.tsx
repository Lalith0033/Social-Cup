import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, type } from '../theme';
import type { TabKey } from './types';

const TABS: { key: TabKey; label: string; emoji: string }[] = [
  { key: 'home', label: 'Home', emoji: '🏠' },
  { key: 'discover', label: 'Discover', emoji: '🔍' },
  { key: 'history', label: 'History', emoji: '🧾' },
  { key: 'membership', label: 'Membership', emoji: '💳' },
  { key: 'profile', label: 'Profile', emoji: '👤' },
];

export function TabBar({ active, onSelect }: { active: TabKey; onSelect: (tab: TabKey) => void }) {
  return (
    <View style={styles.bar}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Pressable key={tab.key} style={styles.item} onPress={() => onSelect(tab.key)}>
            <Text style={[styles.emoji, isActive && styles.emojiActive]}>{tab.emoji}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  item: { flex: 1, alignItems: 'center' },
  emoji: { fontSize: 20, opacity: 0.5 },
  emojiActive: { opacity: 1 },
  label: { ...type.caption, color: colors.textSecondary, marginTop: 2, textTransform: 'none' },
  labelActive: { color: colors.brand, fontWeight: '700' },
});
