import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { useAppActions, useAppState } from '../state/AppState';
import { colors, radii, spacing, type } from '../theme';

export function RedemptionResultScreen() {
  const { state } = useAppState();
  const { setTab } = useAppActions();
  const outcome = state.lastOutcome;

  const done = () => setTab('home');
  const viewHistory = () => setTab('history');

  if (!outcome || outcome.kind === 'success') {
    const record = outcome && outcome.kind === 'success' ? outcome.record : undefined;
    return (
      <SafeAreaView style={[styles.safe, styles.successBg]}>
        <StatusBar barStyle="light-content" />
        <View style={styles.center}>
          <Text style={styles.bigEmoji}>✅</Text>
          <Text style={styles.resultTitle}>Redeemed!</Text>
          {record && (
            <>
              <Text style={styles.resultSubtitle}>{record.drinkName}</Text>
              <Text style={styles.resultMeta}>{record.cafeName}</Text>
              <View style={styles.pill}>
                <Text style={styles.pillText}>-{record.creditCost} credits</Text>
              </View>
              <Text style={styles.balanceNote}>{state.balance} credits remaining this cycle</Text>
            </>
          )}
        </View>
        <View style={styles.actions}>
          <Button label="Back to home" variant="secondary" onPress={done} />
          <View style={{ height: spacing.sm }} />
          <Button label="View redemption history" variant="ghost" onPress={viewHistory} />
        </View>
      </SafeAreaView>
    );
  }

  const isExpired = outcome.kind === 'expired';
  const title = isExpired ? 'Code expired' : 'Already used';
  const message = isExpired
    ? 'This redemption code expired after 5 minutes. Generate a new one to try again — no credits were used.'
    : 'This code was already redeemed at the counter. No additional credits were used.';

  return (
    <SafeAreaView style={[styles.safe, styles.dangerBg]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.center}>
        <Text style={styles.bigEmoji}>{isExpired ? '⏱️' : '⚠️'}</Text>
        <Text style={styles.resultTitle}>{title}</Text>
        <Text style={styles.resultMessage}>{message}</Text>
      </View>
      <View style={styles.actions}>
        <Button label="Back to home" variant="secondary" onPress={done} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, justifyContent: 'space-between' },
  successBg: { backgroundColor: colors.success },
  dangerBg: { backgroundColor: colors.danger },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  bigEmoji: { fontSize: 64, marginBottom: spacing.lg },
  resultTitle: { ...type.display, color: colors.white, marginBottom: spacing.sm },
  resultSubtitle: { ...type.title, color: colors.white },
  resultMeta: { ...type.body, color: colors.white, opacity: 0.85, marginTop: 2 },
  resultMessage: { ...type.body, color: colors.white, textAlign: 'center', marginTop: spacing.sm, lineHeight: 20 },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  pillText: { ...type.bodyStrong, color: colors.white },
  balanceNote: { ...type.small, color: colors.white, opacity: 0.85, marginTop: spacing.md },
  actions: { padding: spacing.xl },
});
