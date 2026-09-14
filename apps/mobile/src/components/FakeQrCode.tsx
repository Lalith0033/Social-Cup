import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radii } from '../theme';

// Purely decorative: a deterministic pseudo-random grid seeded by the token
// id, so it looks and feels like a scannable code without pulling in a QR
// generation dependency for a mock-only screen. The real, functional
// identifier is the backup code rendered underneath it.
function seededGrid(seed: string, size: number): boolean[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const cells: boolean[] = [];
  for (let i = 0; i < size * size; i++) {
    hash = (hash * 1103515245 + 12345) >>> 0;
    cells.push((hash >>> 16) % 3 !== 0);
  }
  return cells;
}

export function FakeQrCode({ seed, size = 9, pixel = 20 }: { seed: string; size?: number; pixel?: number }) {
  const cells = useMemo(() => seededGrid(seed, size), [seed, size]);
  const dimension = size * pixel;
  return (
    <View style={[styles.frame, { width: dimension + 24, height: dimension + 24 }]}>
      <View style={{ width: dimension, height: dimension, flexDirection: 'row', flexWrap: 'wrap' }}>
        {cells.map((filled, i) => (
          <View
            key={i}
            style={{
              width: pixel,
              height: pixel,
              backgroundColor: filled ? colors.brandDark : 'transparent',
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
