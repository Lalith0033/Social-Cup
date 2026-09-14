import React, { useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Button } from '../components/Button';
import { ScreenContainer } from '../components/ScreenContainer';
import { TextField } from '../components/TextField';
import { useAppActions } from '../state/AppState';
import { colors, radii, spacing, type } from '../theme';

type Mode = 'signin' | 'signup';

export function AuthScreen() {
  const { backToLanding, signIn, startSignUp } = useAppActions();
  const { width } = useWindowDimensions();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('jordan.ramirez@example.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const canSubmit = email.trim().length > 3 && password.trim().length >= 4;

  const isWide = width >= 760;
  const form = (
    <>
      <Text style={styles.eyebrow}>WELCOME TO SOCIAL CUP</Text>
      <Text style={styles.title}>{mode === 'signin' ? 'Welcome back' : 'Create your account'}</Text>
      <Text style={styles.subtitle}>
        {mode === 'signin' ? 'Your next great cup is waiting.' : 'Join a warmer way to discover Dallas coffee.'}
      </Text>

      <View style={styles.toggle}>
        <ToggleTab label="Sign in" active={mode === 'signin'} onPress={() => setMode('signin')} />
        <ToggleTab label="Sign up" active={mode === 'signup'} onPress={() => setMode('signup')} />
      </View>

      <View style={styles.form}>
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.passwordWrap}>
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 4 characters"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <Pressable onPress={() => setShowPassword((value) => !value)} style={styles.showPassword}>
            <Text style={styles.showPasswordText}>{showPassword ? 'Hide' : 'Show'}</Text>
          </Pressable>
        </View>
        {mode === 'signin' && (
          <View style={styles.formMeta}>
            <Pressable onPress={() => setRememberMe((value) => !value)} style={styles.remember}>
              <View style={[styles.checkbox, rememberMe && styles.checkboxSelected]}>{rememberMe && <Text style={styles.check}>✓</Text>}</View>
              <Text style={styles.metaText}>Remember me</Text>
            </Pressable>
            <Text style={styles.forgot}>Forgot password?</Text>
          </View>
        )}
      </View>

      <Button
        label={mode === 'signin' ? 'Sign in' : 'Continue'}
        onPress={mode === 'signin' ? signIn : startSignUp}
        disabled={!canSubmit}
      />

      <View style={styles.providerRow}>
        <View style={styles.divider} />
        <Text style={styles.or}>or continue with</Text>
        <View style={styles.divider} />
      </View>
      <View style={styles.providerButtons}>
        <Button label="Google" variant="secondary" onPress={signIn} fullWidth={false} />
        <View style={{ width: spacing.md }} />
        <Button label="Apple" variant="secondary" onPress={signIn} fullWidth={false} />
      </View>

      <Text style={styles.mockNote}>Demo mode · any email and password will sign you in.</Text>
    </>
  );

  if (isWide) {
    return (
      <View style={styles.wideShell}>
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85' }}
          style={styles.imagePanel}
          imageStyle={styles.imagePanelImage}
        >
          <View style={styles.imageOverlay} />
          <View style={styles.imageContent}>
            <Text style={styles.imageMark}>☕</Text>
            <Text style={styles.imageBrand}>Social Cup</Text>
            <Text style={styles.imageTitle}>Good coffee.{'\n'}Great conversations.</Text>
            <Text style={styles.imageQuote}>“The best part of the morning is finding your place.”</Text>
          </View>
        </ImageBackground>
        <View style={styles.formPanel}>
          <Pressable onPress={backToLanding} style={styles.backLink}><Text style={styles.backLinkText}>‹ Back home</Text></Pressable>
          <View style={styles.formInner}>{form}</View>
        </View>
      </View>
    );
  }

  return <ScreenContainer onBack={backToLanding}>{form}</ScreenContainer>;
}

function ToggleTab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wideShell: { flex: 1, flexDirection: 'row', backgroundColor: colors.bg },
  imagePanel: { flex: 1, minWidth: 340, justifyContent: 'flex-end', padding: 48 },
  imagePanelImage: { resizeMode: 'cover' },
  imageOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(55, 30, 18, 0.58)' },
  imageContent: { position: 'relative', maxWidth: 420 },
  imageMark: { fontSize: 38, marginBottom: spacing.sm },
  imageBrand: { ...type.subtitle, color: colors.textOnBrand, letterSpacing: 0.8 },
  imageTitle: { fontSize: 44, lineHeight: 48, fontWeight: '700', color: colors.textOnBrand, marginTop: spacing.xxl },
  imageQuote: { ...type.body, color: '#F4DCC9', marginTop: spacing.xl, lineHeight: 23 },
  formPanel: { flex: 0.82, justifyContent: 'center', padding: 48, backgroundColor: colors.bg },
  formInner: { width: '100%', maxWidth: 460, alignSelf: 'center' },
  backLink: { position: 'absolute', top: 32, left: 48 },
  backLinkText: { ...type.bodyStrong, color: colors.brand },
  eyebrow: { ...type.caption, color: colors.accent, letterSpacing: 1.4, marginBottom: spacing.sm },
  title: { ...type.title, color: colors.textPrimary, marginTop: spacing.md },
  subtitle: { ...type.body, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.xl },
  toggle: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.pill,
    padding: 4,
    marginBottom: spacing.xl,
  },
  tab: { flex: 1, paddingVertical: spacing.sm, borderRadius: radii.pill, alignItems: 'center' },
  tabActive: { backgroundColor: colors.surface },
  tabLabel: { ...type.bodyStrong, color: colors.textSecondary },
  tabLabelActive: { color: colors.brand },
  form: { marginBottom: spacing.sm },
  passwordWrap: { position: 'relative' },
  showPassword: { position: 'absolute', right: spacing.md, bottom: 13, padding: 4 },
  showPasswordText: { ...type.small, color: colors.brand, fontWeight: '600' },
  formMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: -spacing.sm, marginBottom: spacing.sm },
  remember: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 18, height: 18, borderRadius: 5, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  checkboxSelected: { backgroundColor: colors.brand, borderColor: colors.brand },
  check: { color: colors.white, fontSize: 12, fontWeight: '700' },
  metaText: { ...type.small, color: colors.textSecondary },
  forgot: { ...type.small, color: colors.brand },
  providerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xl },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  or: { ...type.small, color: colors.textSecondary, marginHorizontal: spacing.md },
  providerButtons: { flexDirection: 'row' },
  mockNote: { ...type.small, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
});
