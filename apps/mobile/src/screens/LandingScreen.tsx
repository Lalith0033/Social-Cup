import React, { useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { Button } from '../components/Button';
import { useAppActions } from '../state/AppState';
import { colors, radii, shadow, spacing, type } from '../theme';

const heroImage =
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1800&q=88';
const communityImage =
  'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1000&q=85';
const baristaImage =
  'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1000&q=85';
const beansImage =
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1800&q=85';

const featuredDrinks = [
  { name: 'Strawberry Matcha', description: 'Layered strawberry puree and ceremonial matcha.', price: '$6.75', image: 'https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?auto=format&fit=crop&w=700&q=85', tag: 'Bestseller' },
  { name: 'Brown Sugar Boba Milk Tea', description: 'Black tea, brown sugar boba, fresh milk.', price: '$6.25', image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=700&q=85', tag: 'Community favorite' },
  { name: 'Cappuccino', description: 'Rich espresso with velvety steamed foam.', price: '$5.75', image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=700&q=85', tag: 'Classic' },
  { name: 'Café Latte', description: 'Silky milk and espresso, finished with art.', price: '$5.95', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=700&q=85', tag: 'Social favorite' },
  { name: 'Iced Coffee', description: 'Bold espresso chilled with milk and ice.', price: '$5.25', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=85', tag: 'Chilled' },
  { name: 'Mocha', description: 'Dark chocolate, espresso, and silky milk.', price: '$6.25', image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=700&q=85', tag: 'Treat yourself' },
];

const coldAndRefreshingDrinks = [
  { name: 'Mango Smoothie', description: 'Mango, banana, coconut milk.', price: '$6.75', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=700&q=85' },
  { name: 'Green Detox Juice', description: 'Kale, cucumber, green apple, ginger.', price: '$7.00', image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=700&q=85' },
  { name: 'Strawberry Lemonade', description: 'Fresh-squeezed lemonade, strawberry puree.', price: '$5.50', image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=700&q=85' },
  { name: 'Taro Milk Tea', description: 'Creamy taro, tapioca pearls.', price: '$6.50', image: 'https://images.unsplash.com/photo-1627483262268-9c2b5be8c8e9?auto=format&fit=crop&w=700&q=85' },
];

const categories = [
  ['☕', 'Coffee'],
  ['🧋', 'Boba'],
  ['🍵', 'Matcha & Tea'],
  ['🥤', 'Smoothies'],
  ['🍋', 'Refreshers'],
  ['🍫', 'Hot Chocolate'],
];

const testimonials = [
  ['Maya R.', 'The latte was incredible, the atmosphere was beautiful, and the staff made me feel at home.', 'MR'],
  ['Daniel K.', 'My new favorite place to work, meet friends, and start the day slowly.', 'DK'],
  ['Priya S.', 'Every cup feels thoughtful. Social Cup has made my neighborhood feel smaller in the best way.', 'PS'],
];

export function LandingScreen() {
  const { goToAuth } = useAppActions();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState<string | null>(null);
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const isWide = width >= 760;
  const cardWidth = isWide ? (width - 96) / 3 : width > 520 ? (width - 56) / 2 : width - 40;
  const categoryCardWidth = isWide || width > 390 ? 142 : Math.max(120, (width - 56) / 2);

  function scrollTo(y: number) {
    setMenuOpen(false);
    scrollRef.current?.scrollTo({ y, animated: true });
  }

  function subscribe() {
    if (!/^\S+@\S+\.\S+$/.test(newsletterEmail.trim())) {
      setNewsletterMessage('Enter a valid email to join the community.');
      return;
    }
    setNewsletterMessage('You’re in! Your 15% welcome offer is on its way.');
    setNewsletterEmail('');
  }

  function toggleLike(name: string) {
    setLikedProducts((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <ImageBackground source={{ uri: heroImage }} style={[styles.hero, { minHeight: isWide ? 680 : 620 }]} imageStyle={styles.heroImage}>
          <View style={styles.heroOverlay} />
          <View style={styles.nav}>
            <Pressable onPress={() => scrollTo(0)} style={styles.logoLockup}>
              <Text style={styles.logoMark}>☕</Text>
              <Text style={styles.logoText}>Social Cup</Text>
            </Pressable>
            {isWide && (
              <View style={styles.desktopNav}>
                {['Drinks', 'Refreshers', 'About', 'Contact'].map((item) => (
                  <Pressable key={item} onPress={() => scrollTo(item === 'About' ? 2250 : item === 'Refreshers' ? 1250 : 760)}>
                    <Text style={styles.navLink}>{item}</Text>
                  </Pressable>
                ))}
                <Pressable onPress={goToAuth}><Text style={styles.navLink}>Login</Text></Pressable>
                <Text style={styles.navIcon}>⌕</Text>
                <Text style={styles.navIcon}>♡</Text>
                <Text style={styles.navIcon}>🛒</Text>
              </View>
            )}
            {!isWide && (
              <Pressable onPress={() => setMenuOpen((value) => !value)} style={styles.menuButton}>
                <Text style={styles.menuText}>{menuOpen ? '×' : '☰'}</Text>
              </Pressable>
            )}
          </View>
          {menuOpen && (
            <View style={styles.mobileMenu}>
              {['Drinks', 'Refreshers', 'About', 'Contact'].map((item) => (
                <Pressable key={item} onPress={() => scrollTo(item === 'About' ? 2250 : item === 'Refreshers' ? 1250 : 760)}>
                  <Text style={styles.mobileMenuLink}>{item}</Text>
                </Pressable>
              ))}
              <Button label="Login / Sign up" onPress={goToAuth} />
            </View>
          )}
          <View style={[styles.heroContent, { width: Math.min(width * 0.9, 760) }]}>
            <Text style={styles.kicker}>GOOD DRINKS. BETTER CONNECTIONS.</Text>
            <Text style={[styles.heroTitle, { fontSize: isWide ? 64 : 43, lineHeight: isWide ? 69 : 46 }]}>More than just a drink.</Text>
            <Text style={styles.heroBody}>Coffee, boba, matcha, smoothies, and more — crafted with passion and made for every meaningful moment.</Text>
            <View style={styles.heroActions}>
              <Button label="Order now" onPress={goToAuth} fullWidth={false} />
              <Button label="Explore drinks" variant="secondary" onPress={() => scrollTo(760)} fullWidth={false} />
            </View>
            <View style={styles.heroProof}>
              <Proof label="Every beverage category" />
              <Proof label="Freshly made" />
              <Proof label="Locally crafted" />
            </View>
          </View>
          <Text style={styles.scrollHint}>Scroll to discover ↓</Text>
        </ImageBackground>

        <View style={styles.page}>
          <View style={styles.intro}>
            <Text style={styles.eyebrow}>FIND YOUR FAVORITE RITUAL</Text>
            <Text style={styles.sectionTitle}>A little something for every mood.</Text>
            <Text style={styles.sectionBody}>From your first espresso to an afternoon boba run, choose the drink that makes the moment yours.</Text>
          </View>
          <View style={styles.categoryGrid}>
            {categories.map(([icon, label]) => (
              <Pressable key={label} onPress={() => scrollTo(760)} style={({ pressed }) => [styles.categoryCard, { width: categoryCardWidth }, pressed && styles.pressed]}>
                <Text style={styles.categoryIcon}>{icon}</Text>
                <Text style={styles.categoryLabel}>{label}</Text>
                <Text style={styles.categoryArrow}>↗</Text>
              </Pressable>
            ))}
          </View>

          <SectionHeading eyebrow="THE SOCIAL CUP EDIT" title="Our favorite drinks" subtitle="Comforting classics, carefully made and ready when you are." />
          <View style={styles.productGrid}>
            {featuredDrinks.map((product, index) => (
              <ProductCard key={product.name} product={product} width={cardWidth} liked={likedProducts.includes(product.name)} onLike={() => toggleLike(product.name)} onOrder={goToAuth} featured={index === 0} />
            ))}
          </View>

          <ImageBackground source={{ uri: beansImage }} style={styles.beanBanner} imageStyle={styles.beanBannerImage}>
            <View style={styles.bannerOverlay} />
            <View style={styles.bannerContent}>
              <Text style={styles.bannerKicker}>ONE MEMBERSHIP, EVERY BEVERAGE</Text>
              <Text style={styles.bannerTitle}>$24.99/mo for 30 drink credits.</Text>
              <Text style={styles.bannerBody}>Redeem a credit for coffee, boba, matcha, smoothies, and more at any participating venue.</Text>
              <Button label="Join Social Cup" onPress={goToAuth} fullWidth={false} />
              <View style={styles.bannerDetails}><Text style={styles.bannerDetailsText}>✦ 30 credits per month</Text><Text style={styles.bannerDetailsText}>✦ Cancel anytime</Text><Text style={styles.bannerDetailsText}>✦ Any participating venue</Text></View>
            </View>
          </ImageBackground>

          <SectionHeading eyebrow="COLD & REFRESHING" title="Something cool, always." subtitle="The perfect pick-me-up, any time of day." />
          <View style={styles.productGrid}>
            {coldAndRefreshingDrinks.map((product) => (
              <ProductCard key={product.name} product={product} width={cardWidth} liked={likedProducts.includes(product.name)} onLike={() => toggleLike(product.name)} onOrder={goToAuth} />
            ))}
          </View>

          <View style={[styles.communitySection, !isWide && styles.communitySectionNarrow]}>
            <View style={styles.communityCopy}>
              <Text style={styles.eyebrow}>THE SOCIAL CUP STORY</Text>
              <Text style={styles.sectionTitle}>More than coffee. It’s a community.</Text>
              <Text style={styles.sectionBody}>Social Cup was created for people who believe the best moments are shared. From coffee to boba to smoothies, every drink is handcrafted to bring people closer.</Text>
              <Button label="Discover our story" variant="secondary" onPress={() => undefined} fullWidth={false} />
            </View>
            <View style={[styles.communityImages, !isWide && styles.communityImagesNarrow]}>
              <Image source={{ uri: communityImage }} style={styles.communityImageLarge} />
              <Image source={{ uri: baristaImage }} style={styles.communityImageSmall} />
            </View>
          </View>

          <SectionHeading eyebrow="FROM OUR COMMUNITY" title="Good cups, kind words." subtitle="A few notes from people who make Social Cup what it is." />
          <View style={styles.testimonialRow}>
            {testimonials.map(([name, review, initials]) => (
              <View key={name} style={[styles.testimonial, { width: isWide ? '31%' : '100%' }]}>
                <Text style={styles.stars}>★★★★★</Text>
                <Text style={styles.review}>“{review}”</Text>
                <View style={styles.person}><View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View><Text style={styles.personName}>{name}</Text></View>
              </View>
            ))}
          </View>

          <View style={styles.newsletter}>
            <Text style={styles.newsletterBean}>✦</Text>
            <Text style={styles.eyebrow}>A NOTE FROM THE TEAM</Text>
            <Text style={styles.newsletterTitle}>Get 15% off your first order.</Text>
            <Text style={styles.newsletterBody}>Join the Social Cup community for seasonal drinks, new drops, exclusive offers, and drink inspiration.</Text>
            <View style={styles.newsletterForm}>
              <TextInput value={newsletterEmail} onChangeText={setNewsletterEmail} placeholder="Your email address" placeholderTextColor={colors.textSecondary} keyboardType="email-address" autoCapitalize="none" style={styles.newsletterInput} />
              <Button label="Subscribe" onPress={subscribe} fullWidth={false} />
            </View>
            {newsletterMessage && <Text style={styles.newsletterMessage}>{newsletterMessage}</Text>}
            <Text style={styles.privacy}>By subscribing, you agree to receive Social Cup news. Unsubscribe anytime.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerBrand}><Text style={styles.footerLogo}>☕ Social Cup</Text><Text style={styles.footerDescription}>Drinks for the moments that bring us closer.</Text><Text style={styles.footerMeta}>Mon–Sun · 7:00 AM – 8:00 PM{'\n'}Dallas, Texas</Text></View>
          <FooterColumn title="Explore" items={['Home', 'Drinks', 'Refreshers', 'About us', 'Contact']} />
          <FooterColumn title="Support" items={['FAQ', 'Delivery information', 'Terms of use', 'Privacy policy', 'Refund policy']} />
          <View style={styles.footerFollow}><Text style={styles.footerHeading}>Follow us</Text><Text style={styles.socials}>◎  ◉  ◌  ◍</Text><Text style={styles.footerMeta}>Instagram · Facebook{'\n'}TikTok · Pinterest</Text></View>
        </View>
        <View style={styles.copyright}><Text style={styles.copyrightText}>© 2026 Social Cup. Made with warmth and good drinks.</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Proof({ label }: { label: string }) {
  return <View style={styles.proof}><Text style={styles.proofIcon}>✦</Text><Text style={styles.proofText}>{label}</Text></View>;
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return <View style={styles.sectionHeading}><Text style={styles.eyebrow}>{eyebrow}</Text><Text style={styles.sectionTitle}>{title}</Text><Text style={styles.sectionBody}>{subtitle}</Text></View>;
}

function ProductCard({ product, width, liked, onLike, onOrder, featured = false }: { product: { name: string; description: string; price: string; image: string; tag?: string }; width: number; liked: boolean; onLike: () => void; onOrder: () => void; featured?: boolean }) {
  return (
    <View style={[styles.productCard, { width }]}>
      <View style={styles.productImageWrap}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        {product.tag && <Text style={styles.productTag}>{product.tag}</Text>}
        <Pressable onPress={onLike} style={styles.heart}><Text style={[styles.heartText, liked && styles.heartActive]}>{liked ? '♥' : '♡'}</Text></Pressable>
      </View>
      <View style={styles.productInfo}>
        <View style={styles.productNameRow}><Text style={styles.productName}>{product.name}</Text><Text style={styles.productPrice}>{product.price}</Text></View>
        <Text style={styles.productDescription}>{product.description}</Text>
        <Text style={styles.productRating}>★★★★★ <Text style={styles.ratingCount}> 4.9</Text></Text>
        <View style={styles.productActions}><Pressable onPress={onOrder} style={styles.addButton}><Text style={styles.addButtonText}>{featured ? 'Order now' : 'Add to cart'}</Text></Pressable><Pressable onPress={onOrder} style={styles.arrowButton}><Text style={styles.arrowText}>↗</Text></Pressable></View>
      </View>
    </View>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return <View style={styles.footerColumn}><Text style={styles.footerHeading}>{title}</Text>{items.map((item) => <Pressable key={item}><Text style={styles.footerLink}>{item}</Text></Pressable>)}</View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  hero: { justifyContent: 'space-between', paddingHorizontal: '5%', paddingBottom: 34 },
  heroImage: { resizeMode: 'cover' },
  heroOverlay: { ...StyleSheet.absoluteFill, backgroundColor: colors.imageOverlay },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 22 },
  logoLockup: { flexDirection: 'row', alignItems: 'center', minHeight: 32 },
  logoMark: { fontSize: 23, lineHeight: 26, marginRight: 8 },
  logoText: { fontSize: 21, lineHeight: 26, fontWeight: '700', color: colors.textOnBrand, letterSpacing: -0.4 },
  desktopNav: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  navLink: { color: colors.textOnBrand, fontSize: 13, fontWeight: '600' },
  navIcon: { color: colors.textOnBrand, fontSize: 23, marginLeft: 2 },
  menuButton: { alignItems: 'center', justifyContent: 'center', minWidth: 32, minHeight: 32 },
  menuText: { color: colors.textOnBrand, fontSize: 27 },
  mobileMenu: { backgroundColor: colors.surface, borderRadius: radii.lg, padding: spacing.lg, gap: spacing.md, marginTop: spacing.md },
  mobileMenuLink: { ...type.bodyStrong, color: colors.textPrimary },
  heroContent: { alignItems: 'center', alignSelf: 'center', width: '100%', maxWidth: 760, marginTop: 74 },
  kicker: { ...type.caption, color: colors.accentOnImage, letterSpacing: 1.5, textAlign: 'center' },
  heroTitle: { color: colors.textOnBrand, textAlign: 'center', fontWeight: '700', letterSpacing: -1.5, marginTop: spacing.lg },
  heroBody: { color: colors.textOnImageMuted, fontSize: 17, lineHeight: 25, textAlign: 'center', maxWidth: 540, marginTop: spacing.lg },
  heroActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl, flexWrap: 'wrap', justifyContent: 'center' },
  heroProof: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20, marginTop: 34 },
  proof: { flexDirection: 'row', alignItems: 'center' },
  proofIcon: { color: colors.accentOnImage, marginRight: 6 },
  proofText: { color: colors.textOnImageMuted, fontSize: 12, fontWeight: '600' },
  scrollHint: { color: colors.textOnImageMuted, textAlign: 'center', fontSize: 12, marginTop: 30 },
  page: { backgroundColor: colors.bg, paddingHorizontal: '5%', paddingTop: 70, paddingBottom: 84 },
  intro: { alignItems: 'center', maxWidth: 620, alignSelf: 'center', marginBottom: 34 },
  eyebrow: { ...type.caption, color: colors.accent, letterSpacing: 1.5, textAlign: 'center' },
  sectionTitle: { color: colors.textPrimary, fontSize: 34, lineHeight: 39, fontWeight: '700', letterSpacing: -0.8, textAlign: 'center', marginTop: 8 },
  sectionBody: { color: colors.textSecondary, fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 10, maxWidth: 580 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 80 },
  categoryCard: { width: 142, minHeight: 116, backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  pressed: { transform: [{ translateY: 2 }], opacity: 0.88 },
  categoryIcon: { fontSize: 29, marginBottom: 8 },
  categoryLabel: { color: colors.textPrimary, fontSize: 13, fontWeight: '700', textTransform: 'capitalize' },
  categoryArrow: { color: colors.accent, fontSize: 16, position: 'absolute', top: 10, right: 12 },
  sectionHeading: { alignItems: 'center', marginBottom: 28 },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 88 },
  productCard: { backgroundColor: colors.surface, borderRadius: 21, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, ...shadow.card },
  productImageWrap: { height: 190, position: 'relative', backgroundColor: colors.surfaceAlt },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  productTag: { position: 'absolute', top: 12, left: 12, backgroundColor: colors.accentBg, color: colors.accentDark, borderRadius: 99, paddingVertical: 5, paddingHorizontal: 10, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  heart: { position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,253,249,0.92)', alignItems: 'center', justifyContent: 'center' },
  heartText: { color: colors.brand, fontSize: 22, lineHeight: 24 },
  heartActive: { color: '#B85A4A' },
  productInfo: { padding: 16 },
  productNameRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  productName: { color: colors.textPrimary, fontSize: 17, fontWeight: '700', flex: 1 },
  productPrice: { color: colors.brand, fontSize: 16, fontWeight: '800' },
  productDescription: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginTop: 7, minHeight: 38 },
  productRating: { color: colors.accent, fontSize: 12, marginTop: 12, fontWeight: '700' },
  ratingCount: { color: colors.textSecondary, fontWeight: '400' },
  productActions: { flexDirection: 'row', gap: 8, marginTop: 14 },
  addButton: { flex: 1, backgroundColor: colors.brand, borderRadius: 11, paddingVertical: 11, alignItems: 'center' },
  addButtonText: { color: colors.textOnBrand, fontSize: 12, fontWeight: '700' },
  arrowButton: { width: 40, borderRadius: 11, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  arrowText: { color: colors.brand, fontSize: 20 },
  beanBanner: { minHeight: 430, borderRadius: 26, overflow: 'hidden', justifyContent: 'center', marginBottom: 88 },
  beanBannerImage: { resizeMode: 'cover' },
  bannerOverlay: { ...StyleSheet.absoluteFill, backgroundColor: colors.imageOverlay },
  bannerContent: { padding: 34, maxWidth: 620, position: 'relative' },
  bannerKicker: { ...type.caption, color: colors.accentOnImage, letterSpacing: 1.5, textAlign: 'left' },
  bannerTitle: { color: colors.textOnBrand, fontSize: 37, lineHeight: 42, fontWeight: '700', letterSpacing: -0.8, marginTop: 10 },
  bannerBody: { color: colors.textOnImageMuted, fontSize: 15, lineHeight: 23, marginTop: 12, marginBottom: 22, maxWidth: 520 },
  bannerDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 22 },
  bannerDetailsText: { color: colors.textOnImageMuted, fontSize: 12 },
  communitySection: { flexDirection: 'row', alignItems: 'center', gap: 40, maxWidth: 1100, alignSelf: 'center', marginBottom: 90 },
  communitySectionNarrow: { flexDirection: 'column', alignItems: 'stretch' },
  communityCopy: { flex: 1, alignItems: 'flex-start' },
  communityCopyTitle: { textAlign: 'left' },
  communityCopyBody: { textAlign: 'left', marginBottom: 22 },
  communityImages: { flex: 1, width: '100%', height: 340, position: 'relative' },
  communityImagesNarrow: { flex: 0, height: 280 },
  communityImageLarge: { width: '82%', height: 285, borderRadius: 22, resizeMode: 'cover' },
  communityImageSmall: { position: 'absolute', right: 0, bottom: 0, width: '49%', height: 190, borderRadius: 20, borderWidth: 7, borderColor: colors.bg, resizeMode: 'cover' },
  testimonialRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 86 },
  testimonial: { backgroundColor: colors.surface, borderRadius: 19, borderWidth: 1, borderColor: colors.border, padding: 22, minHeight: 194, ...shadow.card },
  stars: { color: colors.accent, letterSpacing: 2, fontSize: 14 },
  review: { color: colors.textPrimary, fontSize: 16, lineHeight: 24, fontWeight: '600', marginTop: 18 },
  person: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.accentBg, alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  avatarText: { color: colors.accentDark, fontSize: 10, fontWeight: '800' },
  personName: { color: colors.textSecondary, fontSize: 13, fontWeight: '700' },
  newsletter: { backgroundColor: colors.surfaceAlt, borderRadius: 25, alignItems: 'center', padding: 34, overflow: 'hidden' },
  newsletterBean: { color: colors.accent, fontSize: 35, marginBottom: 5 },
  newsletterTitle: { color: colors.textPrimary, textAlign: 'center', fontSize: 31, lineHeight: 37, fontWeight: '700', marginTop: 8 },
  newsletterBody: { color: colors.textSecondary, textAlign: 'center', maxWidth: 560, lineHeight: 22, marginTop: 10 },
  newsletterForm: { flexDirection: 'row', width: '100%', maxWidth: 510, gap: 8, marginTop: 22 },
  newsletterInput: { flex: 1, minWidth: 0, backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 15, paddingVertical: 13, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border },
  newsletterMessage: { color: colors.success, fontSize: 13, fontWeight: '700', marginTop: 12, textAlign: 'center' },
  privacy: { color: colors.textSecondary, fontSize: 11, marginTop: 13, textAlign: 'center' },
  footer: { backgroundColor: colors.surfaceAlt, paddingHorizontal: '5%', paddingVertical: 52, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 30 },
  footerBrand: { maxWidth: 260, flex: 1 },
  footerLogo: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  footerDescription: { color: colors.textSecondary, lineHeight: 20, marginTop: 13 },
  footerMeta: { color: colors.textSecondary, fontSize: 12, lineHeight: 20, marginTop: 18 },
  footerColumn: { minWidth: 130 },
  footerHeading: { color: colors.textPrimary, fontSize: 13, fontWeight: '800', marginBottom: 15 },
  footerLink: { color: colors.textSecondary, fontSize: 13, marginBottom: 11 },
  footerFollow: { minWidth: 150 },
  socials: { color: colors.brand, fontSize: 23, letterSpacing: 4 },
  copyright: { borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surfaceAlt, padding: 15, alignItems: 'center' },
  copyrightText: { color: colors.textSecondary, fontSize: 11, textAlign: 'center' },
});
