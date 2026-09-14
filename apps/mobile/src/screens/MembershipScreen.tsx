import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Badge, Card } from '../components/Primitives';
import { useAppActions, useAppState } from '../state/AppState';
import { colors, radii, spacing, type } from '../theme';

export function MembershipScreen() {
  const { state } = useAppState();
  const { setCancelAtPeriodEnd } = useAppActions();
  const { subscription, balance } = state;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Membership</Text>

        <Card style={styles.planCard}>
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planName}>{subscription.planName}</Text>
              <Text style={styles.planPrice}>{subscription.priceLabel}</Text>
            </View>
            <Badge
              label={subscription.status === 'ACTIVE' ? 'Active' : subscription.status === 'CANCELING' ? 'Ending soon' : 'Past due'}
              tone={subscription.status === 'ACTIVE' ? 'success' : subscription.status === 'CANCELING' ? 'warning' : 'danger'}
            />
          </View>

          <View style={styles.divider} />

          <Row label="Credits per cycle" value={`${subscription.creditsPerPeriod} credits`} />
          <Row label="Credits remaining" value={`${balance} credits`} />
          <Row
            label={subscription.cancelAtPeriodEnd ? 'Access ends' : 'Renews on'}
            value={subscription.currentPeriodEnd}
          />
        </Card>

        {subscription.cancelAtPeriodEnd && (
          <View style={styles.noticeCard}>
            <Text style={styles.noticeText}>
              Your membership is set to end on {subscription.currentPeriodEnd}. You can keep redeeming your
              remaining credits until then.
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Billing</Text>
        <Card style={styles.billingCard}>
          <Row label="Payment method" value="•••• 4242" />
          <Row label="Next charge" value={subscription.cancelAtPeriodEnd ? 'None' : subscription.priceLabel} />
        </Card>
        <Button label="Manage payment method" variant="secondary" onPress={() => undefined} />

        <View style={{ height: spacing.xl }} />

        {subscription.cancelAtPeriodEnd ? (
          <Button label="Resume membership" onPress={() => setCancelAtPeriodEnd(false)} />
        ) : (
          <Button label="Cancel membership" variant="danger" onPress={() => setCancelAtPeriodEnd(true)} />
        )}
        <Text style={styles.fineprint}>
          Cancelling takes effect at the end of your current billing period. Your credits stay usable until then —
          nothing is lost immediately.
        </Text>

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
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  title: { ...type.title, color: colors.textPrimary, marginBottom: spacing.lg },
  planCard: { marginBottom: spacing.lg },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  planName: { ...type.subtitle, color: colors.textPrimary },
  planPrice: { ...type.body, color: colors.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  rowLabel: { ...type.body, color: colors.textSecondary },
  rowValue: { ...type.bodyStrong, color: colors.textPrimary },
  noticeCard: { backgroundColor: colors.warningBg, borderRadius: radii.md, padding: spacing.md, marginBottom: spacing.lg },
  noticeText: { ...type.small, color: colors.warning, lineHeight: 18 },
  sectionTitle: { ...type.subtitle, color: colors.textPrimary, marginBottom: spacing.md },
  billingCard: { marginBottom: spacing.md },
  fineprint: { ...type.small, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.md, lineHeight: 18 },
});
