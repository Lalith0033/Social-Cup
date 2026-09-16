import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { ScreenContainer } from '../components/ScreenContainer';
import { neighbourhoods } from '../mockData';
import { PREFERENCE_META, PREFERENCE_ORDER } from '../preferenceMeta';
import { useAppActions } from '../state/AppState';
import { colors, radii, spacing, type } from '../theme';

export function OnboardingScreen() {
  const { completeOnboarding } = useAppActions();
  const [neighbourhoodId, setNeighbourhoodId] = useState(neighbourhoods[1].id);
  const [preferences, setPreferences] = useState<string[]>(['espresso', 'cold-brew']);

  function togglePreference(id: string) {
    setPreferences((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  return (
    <ScreenContainer title="Set up your profile">
      <Text style={styles.stepLabel}>Step 1 of 2</Text>
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

      <Text style={[styles.stepLabel, { marginTop: spacing.xl }]}>Step 2 of 2</Text>
      <Text style={styles.sectionLabel}>What do you usually order?</Text>
      <View style={styles.chipWrap}>
        {PREFERENCE_ORDER.map((id) => {
          const meta = PREFERENCE_META[id];
          const active = preferences.includes(id);
          return (
            <Pressable key={id} onPress={() => togglePreference(id)} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {meta.emoji} {meta.label}
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
  stepLabel: { ...type.caption, color: colors.brand, marginBottom: spacing.xs, textTransform: 'uppercase' },
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
