// Shared visual language for the Social Cup member app.
// Not shared cross-workspace (RN styling can't be reused by the web apps),
// but the palette/spacing scale mirrors the tokens used in admin-web/barista-web.

export const colors = {
  bg: '#FAF6F1',
  surface: '#FFFFFF',
  surfaceAlt: '#F1E7DA',
  border: '#E7DDD3',
  textPrimary: '#2B1B12',
  textSecondary: '#7A6355',
  textOnBrand: '#FFF8F0',
  brand: '#2F8F7A',
  brandDark: '#1F6357',
  brandBg: '#E3F2EE',
  accent: '#C97B3D',
  accentBg: '#F6E3D0',
  accentDark: '#8A4E1F',
  imageOverlay: 'rgba(32, 28, 26, 0.4)',
  accentOnImage: '#E8B487',
  textOnImageMuted: '#F6DED0',
  success: '#2F7D4F',
  successBg: '#E4F3E9',
  danger: '#B3261E',
  dangerBg: '#FBE9E7',
  warning: '#9C6B00',
  warningBg: '#FBEFD7',
  white: '#FFFFFF',
  black: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
};

export const type = {
  display: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  title: { fontSize: 22, fontWeight: '700' as const },
  subtitle: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodyStrong: { fontSize: 15, fontWeight: '600' as const },
  small: { fontSize: 13, fontWeight: '400' as const },
  caption: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.4 },
};

export const shadow = {
  card: {
    shadowColor: '#241E1A',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
};
