import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { radii } from '../theme';

// Drinks are the app's primary discovery object, so unlike CafePhoto's
// offline-only placeholder, this renders a real remote photo when one is
// available (same <Image>+URL pattern already used on the landing page),
// falling back to the same colored+emoji placeholder look when it isn't.
export function DrinkPhoto({
  imageUri,
  color,
  emoji,
  height = 96,
  width,
  radius = radii.lg,
}: {
  imageUri?: string;
  color: string;
  emoji: string;
  height?: number;
  width?: number | string;
  radius?: number;
}) {
  const dimStyle = { height, width: (width as never) ?? '100%', borderRadius: radius };

  if (imageUri) {
    return (
      <View style={[styles.base, dimStyle, { backgroundColor: color }]}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      </View>
    );
  }

  return (
    <View style={[styles.base, dimStyle, { backgroundColor: color }]}>
      <Text style={{ fontSize: height * 0.4 }}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
});
