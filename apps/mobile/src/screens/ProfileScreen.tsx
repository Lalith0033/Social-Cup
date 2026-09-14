import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Primitives';
import { neighbourhoodName } from '../mockData';
import { useAppActions, useAppState } from '../state/AppState';
import { colors, radii, spacing, type } from '../theme';

const PREFERENCE_LABELS: Record<string, string> = {
  espresso: 'Espresso',
  latte: 'Latte',
  'cold-brew': 'Cold brew',
  matcha: 'Matcha',
  'oat-milk': 'Oat milk',
};

export function ProfileScreen() {
  const { state } = useAppState();
  const { signOut } = useAppActions();
  const { member } = state;
  const initials = member.displayName
    .split(' ')
    .map((p) => p[0])
    .join('');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{member.displayName}</Text>
          <Text style={styles.email}>{member.email}</Text>
        </View>

        <Card style={styles.card}>
          <Row label="Home neighbourhood" value={neighbourhoodName(member.homeNeighbourhoodId)} />
          <View style={styles.divider} />
          <Text style={styles.prefLabel}>Coffee preferences</Text>
          <View style={styles.prefRow}>
            {member.preferences.map((pref) => (
              <View key={pref} style={styles.prefChip}>
                <Text style={styles.prefChipText}>{PREFERENCE_LABELS[pref] ?? pref}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Account</Text>
        <Card style={styles.card}>
          <Row label="Email verification" value="Verified" />
          <Row label="Login method" value="Email & password" />
        </Card>

        <View style={{ height: spacing.xl }} />
        <Button label="Sign out" variant="secondary" onPress={signOut} />
        <Text style={styles.version}>Social Cup · v1.0.0 (prototype)</Text>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, alignItems: 'stretch' },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radii.pill,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: { ...type.title, color: colors.textOnBrand },
  name: { ...type.title, color: colors.textPrimary },
  email: { ...type.small, color: colors.textSecondary, marginTop: 2 },
  card: { marginBottom: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  rowLabel: { ...type.body, color: colors.textSecondary },
  rowValue: { ...type.bodyStrong, color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  prefLabel: { ...type.small, color: colors.textSecondary, marginBottom: spacing.sm },
  prefRow: { flexDirection: 'row', flexWrap: 'wrap' },
  prefChip: { backgroundColor: colors.surfaceAlt, borderRadius: radii.pill, paddingVertical: 4, paddingHorizontal: spacing.md, marginRight: spacing.sm, marginBottom: spacing.sm },
  prefChipText: { ...type.small, color: colors.textPrimary },
  sectionTitle: { ...type.subtitle, color: colors.textPrimary, marginBottom: spacing.md },
  version: { ...type.small, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.lg },
});
