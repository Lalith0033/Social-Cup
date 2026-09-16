import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Countdown } from '../components/Countdown';
import { FakeQrCode } from '../components/FakeQrCode';
import { Card } from '../components/Primitives';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAppActions, useAppState } from '../state/AppState';
import { colors, radii, spacing, type } from '../theme';

export function RedemptionTokenScreen() {
  const { pop, cancelToken, tokenExpired, simulateScanSuccess, simulateScanAlreadyUsed } = useAppActions();
  const { state } = useAppState();
  const token = state.pendingToken;

  if (!token || token.status !== 'PENDING') {
    return (
      <ScreenContainer onBack={pop} title="Redemption code">
        <Text style={styles.gone}>This code is no longer active.</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer onBack={cancelToken} title="Show this to your barista">
      <View style={styles.center}>
        <FakeQrCode seed={token.id} />
        <Countdown expiresAt={token.expiresAt} createdAt={token.createdAt} onExpire={tokenExpired} />
      </View>

      <Card style={styles.card}>
        <Text style={styles.cafeName}>{token.cafeName}</Text>
        <Text style={styles.drinkName}>{token.drinkName}</Text>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>Credits to be used</Text>
          <Text style={styles.value}>{token.creditCost}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Backup code</Text>
          <Text style={styles.code}>{token.backupCode}</Text>
        </View>
      </Card>

      <Text style={styles.hint}>
        No internet needed at the counter — your barista scans this QR, or types the backup code, to complete
        the redemption. Credits are deducted only after a successful scan.
      </Text>

      <View style={styles.demoBox}>
        <Text style={styles.demoLabel}>DEMO CONTROLS — simulate the barista scan</Text>
        <Button label="Simulate successful scan" onPress={simulateScanSuccess} />
        <View style={{ height: spacing.sm }} />
        <Button label="Simulate “already used”" variant="secondary" onPress={simulateScanAlreadyUsed} />
        <View style={{ height: spacing.sm }} />
        <Button label="Cancel this code" variant="ghost" onPress={cancelToken} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', marginTop: spacing.md, marginBottom: spacing.lg },
  card: { marginBottom: spacing.lg },
  cafeName: { ...type.small, color: colors.textSecondary },
  drinkName: { ...type.subtitle, color: colors.textPrimary, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  label: { ...type.body, color: colors.textSecondary, flex: 1, minWidth: 0, marginRight: spacing.md },
  value: { ...type.bodyStrong, color: colors.brand, flexShrink: 1, textAlign: 'right' },
  code: { ...type.bodyStrong, color: colors.textPrimary, letterSpacing: 2, flexShrink: 1, textAlign: 'right' },
  hint: { ...type.small, color: colors.textSecondary, textAlign: 'center', lineHeight: 18, marginBottom: spacing.xl },
  demoBox: { borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', borderRadius: radii.lg, padding: spacing.lg },
  demoLabel: { ...type.caption, color: colors.textSecondary, marginBottom: spacing.md, textAlign: 'center' },
  gone: { ...type.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xxl },
});
