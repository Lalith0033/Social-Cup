import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CafePhoto } from '../components/CafePhoto';
import { Badge, Card, EmptyState } from '../components/Primitives';
import { ScreenContainer } from '../components/ScreenContainer';
import { cafeById } from '../mockData';
import { useAppActions, useAppState } from '../state/AppState';
import { colors, radii, spacing, type } from '../theme';

export function HistoryScreen() {
  const { state } = useAppState();
  const { pop } = useAppActions();

  return (
    <ScreenContainer onBack={pop} title="Redemption history">
      <Text style={styles.subtitle}>Every drink you've redeemed with Social Cup.</Text>

      {state.history.length === 0 ? (
        <EmptyState emoji="🧾" title="No redemptions yet" subtitle="Your redeemed drinks will show up here." />
      ) : (
        state.history.map((record) => {
          const cafe = cafeById(record.cafeId);
          return (
            <Card key={record.id} style={styles.row}>
              {cafe && <CafePhoto color={cafe.photoColor} emoji={cafe.photoEmoji} height={48} width={48} radius={radii.md} />}
              <View style={styles.info}>
                <Text style={styles.drink}>{record.drinkName}</Text>
                <Text style={styles.cafe}>{record.cafeName}</Text>
                <Text style={styles.date}>{record.redeemedAt}</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.credits}>-{record.creditCost}</Text>
                <Badge label={record.status === 'COMPLETED' ? 'Completed' : 'Voided'} tone={record.status === 'COMPLETED' ? 'success' : 'danger'} />
              </View>
            </Card>
          );
        })
      )}
      <View style={{ height: spacing.xxl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: { ...type.small, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  info: { flex: 1, minWidth: 0, marginLeft: spacing.md },
  drink: { ...type.bodyStrong, color: colors.textPrimary },
  cafe: { ...type.small, color: colors.textSecondary, marginTop: 1 },
  date: { ...type.small, color: colors.textSecondary, marginTop: 1 },
  right: { alignItems: 'flex-end', flexShrink: 0, marginLeft: spacing.sm },
  credits: { ...type.bodyStrong, color: colors.textPrimary, marginBottom: spacing.xs },
});
