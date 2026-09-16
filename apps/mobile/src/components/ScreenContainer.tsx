import React from 'react';
import { Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, type } from '../theme';

type Props = {
  title?: string;
  onBack?: () => void;
  scroll?: boolean;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
};

export function ScreenContainer({ title, onBack, scroll = true, children, rightSlot }: Props) {
  const Wrapper = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      {(title || onBack) && (
        <View style={styles.header}>
          {onBack ? (
            <Pressable
              onPress={onBack}
              hitSlop={12}
              style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
            >
              <Text style={styles.backText}>‹ Back</Text>
            </Pressable>
          ) : (
            <View style={styles.backButton} />
          )}
          {title ? <Text numberOfLines={2} style={styles.headerTitle}>{title}</Text> : <View />}
          <View style={styles.rightSlot}>{rightSlot}</View>
        </View>
      )}
      <Wrapper
        style={styles.body}
        contentContainerStyle={scroll ? styles.scrollContent : undefined}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Wrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: { width: 72, flexShrink: 0 },
  backButtonPressed: { opacity: 0.6 },
  backText: { ...type.bodyStrong, color: colors.brand },
  headerTitle: { ...type.subtitle, color: colors.textPrimary, flex: 1, minWidth: 0, textAlign: 'center' },
  rightSlot: { width: 72, flexShrink: 0, alignItems: 'flex-end' },
  body: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
});
