import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { radii } from '../theme';

// No remote images / asset pipeline for this mock prototype — a colored
// placeholder with the cafe's emoji keeps the UI fully offline-safe.
export function CafePhoto({
  color,
  emoji,
  height = 96,
  width,
  radius = radii.lg,
}: {
  color: string;
  emoji: string;
  height?: number;
  width?: number | string;
  radius?: number;
}) {
  return (
    <View style={[styles.base, { backgroundColor: color, height, width: (width as never) ?? '100%', borderRadius: radius }]}>
      <Text style={{ fontSize: height * 0.4 }}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});
