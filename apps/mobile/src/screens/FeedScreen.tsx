import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { FeedPostCard } from '../components/FeedPostCard';
import { feedPosts, getCurrentLocationLabel } from '../mockData';
import { useAppActions } from '../state/AppState';
import { colors, spacing, type } from '../theme';

export function FeedScreen() {
  const { push } = useAppActions();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Feed</Text>
        <Text style={styles.subtitle}>Drinks people are enjoying near 📍 {getCurrentLocationLabel()}</Text>

        {feedPosts.map((post) => (
          <FeedPostCard
            key={post.id}
            post={post}
            onViewDrink={() => push({ name: 'DrinkDetail', drinkId: post.drinkId, cafeId: post.cafeId })}
          />
        ))}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  title: { ...type.title, color: colors.textPrimary },
  subtitle: { ...type.small, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.lg },
});
