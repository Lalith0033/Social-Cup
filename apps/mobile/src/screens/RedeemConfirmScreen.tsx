import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { CafePhoto } from '../components/CafePhoto';
import { Card } from '../components/Primitives';
import { ScreenContainer } from '../components/ScreenContainer';
import { cafeById, drinkById } from '../mockData';
import { useAppActions, useAppState } from '../state/AppState';
import { colors, radii, spacing, type } from '../theme';

export function RedeemConfirmScreen({ cafeId, drinkId }: { cafeId: string; drinkId: string }) {
  const { pop, generateToken } = useAppActions();
  const { state } = useAppState();
  const cafe = cafeById(cafeId);
  const drink = drinkById(drinkId);
  if (!cafe || !drink) return null;

  const remainingAfter = state.balance - drink.creditCost;
  const canRedeem = remainingAfter >= 0;

  return (
    <ScreenContainer onBack={pop} title="Confirm redemption">
      <Card style={styles.card}>
        <View style={styles.row}>
          <CafePhoto color={cafe.photoColor} emoji={cafe.photoEmoji} height={64} width={64} radius={radii.md} />
          <View style={styles.info}>
            <Text style={styles.drinkName}>{drink.name}</Text>
            <Text style={styles.cafeName}>{cafe.name}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.lineRow}>
          <Text style={styles.lineLabel}>Credit cost</Text>
          <Text style={styles.lineValue}>{drink.creditCost} credits</Text>
        </View>
        <View style={styles.lineRow}>
          <Text style={styles.lineLabel}>Current balance</Text>
          <Text style={styles.lineValue}>{state.balance} credits</Text>
        </View>
        <View style={styles.lineRow}>
          <Text style={styles.lineLabelStrong}>Balance after redemption</Text>
          <Text style={[styles.lineValueStrong, !canRedeem && styles.lineValueDanger]}>
            {Math.max(remainingAfter, 0)} credits
          </Text>
        </View>
      </Card>

      {!canRedeem && (
        <Text style={styles.warning}>
          You don't have enough credits for this drink. Credits reset at the start of your next billing cycle.
        </Text>
      )}

      <Text style={styles.note}>
        Your credit isn't deducted yet — generating a code just reserves it. It's only used once a barista
        successfully scans your code at the counter.
      </Text>

      <View style={{ marginTop: spacing.lg }}>
        <Button label="Generate redemption code" onPress={() => generateToken(cafeId, drinkId)} disabled={!canRedeem} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, minWidth: 0, marginLeft: spacing.md },
  drinkName: { ...type.subtitle, color: colors.textPrimary },
  cafeName: { ...type.small, color: colors.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  lineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  lineLabel: { ...type.body, color: colors.textSecondary, flex: 1, minWidth: 0, marginRight: spacing.md },
  lineValue: { ...type.body, color: colors.textPrimary, flexShrink: 1, textAlign: 'right' },
  lineLabelStrong: { ...type.bodyStrong, color: colors.textPrimary, flex: 1, minWidth: 0, marginRight: spacing.md },
  lineValueStrong: { ...type.bodyStrong, color: colors.brand, flexShrink: 1, textAlign: 'right' },
  lineValueDanger: { color: colors.danger },
  warning: { ...type.small, color: colors.danger, marginTop: spacing.lg },
  note: { ...type.small, color: colors.textSecondary, marginTop: spacing.lg, lineHeight: 18 },
});
