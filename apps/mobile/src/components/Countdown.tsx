import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, type } from '../theme';
import { ProgressBar } from './Primitives';

function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function Countdown({
  expiresAt,
  createdAt,
  onExpire,
}: {
  expiresAt: number;
  createdAt?: number;
  onExpire?: () => void;
}) {
  const [remaining, setRemaining] = useState(() => expiresAt - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(expiresAt - Date.now());
    }, 250);
    return () => clearInterval(id);
  }, [expiresAt]);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire?.();
    }
  }, [remaining, onExpire]);

  const urgent = remaining < 30_000;
  const totalMs = createdAt !== undefined ? expiresAt - createdAt : undefined;

  return (
    <View style={styles.wrap}>
      <View style={[styles.pill, urgent ? styles.urgent : styles.normal]}>
        <Text style={[styles.text, urgent && styles.urgentText]}>
          {remaining > 0 ? `Expires in ${formatRemaining(remaining)}` : 'Expired'}
        </Text>
      </View>
      {totalMs !== undefined && totalMs > 0 && (
        <View style={styles.barWrap}>
          <ProgressBar
            value={Math.max(0, remaining)}
            max={totalMs}
            color={urgent ? colors.danger : colors.accent}
            trackColor={colors.surfaceAlt}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  barWrap: { width: 180, marginTop: spacing.sm },
  pill: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: radii.pill,
  },
  normal: { backgroundColor: colors.accentBg },
  urgent: { backgroundColor: colors.dangerBg },
  text: { ...type.bodyStrong, color: colors.accentDark },
  urgentText: { color: colors.danger },
});
