import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { ScreenContainer } from '../components/ScreenContainer';
import { neighbourhoods } from '../mockData';
import { useAppActions } from '../state/AppState';
import { colors, radii, spacing, type } from '../theme';

const PREFERENCE_OPTIONS = [
  { id: 'espresso', label: 'Espresso', emoji: '☕' },
  { id: 'latte', label: 'Latte', emoji: '🥛' },
  { id: 'cold-brew', label: 'Cold brew', emoji: '🧊' },
  { id: 'matcha', label: 'Matcha', emoji: '🍵' },
];

export function OnboardingScreen() {
  const { completeOnboarding } = useAppActions();
  const [neighbourhoodId, setNeighbourhoodId] = useState(neighbourhoods[1].id);
  const [preferences, setPreferences] = useState<string[]>(['espresso', 'cold-brew']);

  function togglePreference(id: string) {
    setPreferences((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  return (
    <ScreenContainer title="Set up your profile">
      <Text style={styles.sectionLabel}>Which Dallas neighbourhood is home base?</Text>
      <View style={styles.chipWrap}>
        {neighbourhoods.map((n) => (
          <Pressable
            key={n.id}
            onPress={() => setNeighbourhoodId(n.id)}
            style={[styles.chip, neighbourhoodId === n.id && styles.chipActive]}
          >
            <Text style={[styles.chipText, neighbourhoodId === n.id && styles.chipTextActive]}>{n.name}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>What do you usually order?</Text>
      <View style={styles.chipWrap}>
        {PREFERENCE_OPTIONS.map((p) => {
          const active = preferences.includes(p.id);
          return (
            <Pressable key={p.id} onPress={() => togglePreference(p.id)} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {p.emoji} {p.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ marginTop: spacing.xxl }}>
        <Button label="Complete setup" onPress={() => completeOnboarding(neighbourhoodId, preferences)} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { ...type.bodyStrong, color: colors.textPrimary, marginBottom: spacing.md },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { ...type.body, color: colors.textPrimary },
  chipTextActive: { color: colors.textOnBrand, fontWeight: '600' },
});
