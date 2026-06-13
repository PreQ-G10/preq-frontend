import { AppText, Card, Spinner } from '@/components/atoms';
import { ValidationBanner } from '@/components/atoms/ValidationBanner';
import { SearchBar } from '@/components/molecules';
import { NearbyOffersBanner } from '@/components/organisms';
import { Routes } from '@/constants/routes';
import { Colors, Spacing } from '@/constants/theme';
import { useCart } from '@/context/cartContext';
import { priceService, productService } from '@/services/api';
import { NearbyOffer, ProductSearchWithPrice } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import 'react-native-reanimated';
import { styles } from './index.styles';

const tips = [
  { icon: 'scan-outline', text: 'Apuntá la cámara al producto para identificarlo automáticamente' },
  { icon: 'pricetag-outline', text: 'Colaborá con el precio que viste en el local' },
  { icon: 'bar-chart-outline', text: 'Comparé precios entre distintos locales' },
];

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductSearchWithPrice[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const [nearbyOffers, setNearbyOffers] = useState<NearbyOffer[]>([]);
  const [offersVisible, setOffersVisible] = useState(true);
  const offersLoadedRef = useRef(false);

  const { totalItems } = useCart();

  useFocusEffect(
    useCallback(() => {
      loadPendingValidation();
      if (!offersLoadedRef.current) {
        loadNearbyOffers();
        offersLoadedRef.current = true;
      }
    }, [])
  );

  async function loadPendingValidation() {
    try {
      const { status } = await (await import('expo-location')).requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const ExpoLocation = await import('expo-location');
      const pos = await ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.Accuracy.Balanced });
      const data = await priceService.getPendingValidation(pos.coords.latitude, pos.coords.longitude);
      setPendingCount(data.length);
    } catch {
      // silently ignore, banner just won't show
    }
  }

  async function loadNearbyOffers() {
    try {
      const data = await productService.getNearbyOffers();
      setNearbyOffers(data.offers);
      setOffersVisible(true);
    } catch {
      // silently ignore errors, nearby offers just won't show
    }
  }

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setShowResults(false);
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  async function handleSearch() {
    const q = query.trim();
    if (q.length < 3 || searching) return;

    setSearching(true);
    setShowResults(true);
    try {
      const data = await productService.search(q);
      setResults(data);
    } finally {
      setSearching(false);
    }
  }

  function handleDismiss() {
    setShowResults(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>preq</Text>
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push(Routes.cart)}
              activeOpacity={0.8}
            >
              <Ionicons name="cart-outline" size={18} color={Colors.white} />
              {totalItems > 0 && (
                <View style={styles.cartCountBadge}>
                  <AppText variant="caption" color="white" style={{ fontSize: 9 }}>{totalItems}</AppText>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push(Routes.profile)}
              activeOpacity={0.8}
            >
              <Ionicons name="person-outline" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>Compará precios de productos en tu zona</Text>
      </View>
 
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.searchWrapper}>
          <SearchBar
            value={query}
            onChangeText={(text) => { setQuery(text); if (!text) setShowResults(false); }}
            onSubmit={() => {
              setShowResults(false);
              router.push({ pathname: Routes.search, params: { query } });
            }}
            onClear={() => setShowResults(false)}
            hasResults={showResults && results.length > 0}
            placeholder="Buscá un producto..."
          />
          {showResults && (searching || results.length > 0) && (
            <View style={styles.dropdown}>
              {searching && <Spinner size="small" />}
              {!searching && results.slice(0, 3).map(data => (
                <TouchableOpacity
                  key={data.product.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setShowResults(false);
                    router.push(Routes.productDetails(data.product.id));
                  }}
                  activeOpacity={0.7}
                >
                  <AppText variant="body">{data.product.name}</AppText>
                  <AppText variant="bodySmall" color="secondary">
                    {data.product.brand} · {data.product.quantity} {data.product.quantityType}
                  </AppText>
                </TouchableOpacity>
              ))}
              {!searching && results.length > 3 && (
                <TouchableOpacity
                  style={styles.viewMore}
                  onPress={() => {
                    setShowResults(false);
                    router.push({ pathname: Routes.search, params: { query } });
                  }}
                >
                  <AppText variant="label" color="primary">Ver todos ({results.length})</AppText>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
 
        <AppText variant="h3">¿Cómo funciona?</AppText>
        <Card elevated>
          <View style={styles.tipCard}>
            {tips.map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <View style={styles.tipIcon}>
                  <Ionicons name={tip.icon as any} size={20} color={Colors.primary} />
                </View>
                <AppText variant="bodySmall" color="secondary" style={styles.tipText}>
                  {tip.text}
                </AppText>
              </View>
            ))}
          </View>
        </Card>
 
        {pendingCount > 0 && (
          <ValidationBanner
            count={pendingCount}
            onPress={() => router.push(Routes.validation)}
          />
        )}

        {/* ── Nearby Offers Banner ── */}
        {offersVisible && nearbyOffers.length > 0 && (
          <NearbyOffersBanner
            offers={nearbyOffers}
            onOfferPress={(offer) => router.push(Routes.productDetails(offer.product.id))}
            onDismiss={() => setOffersVisible(false)}
          />
        )}
      </ScrollView>
 
      <View style={styles.footer}>
        <TouchableOpacity style={styles.scanButton} onPress={() => router.push(Routes.camera)} activeOpacity={0.85}>
          <Ionicons name="scan" size={32} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.scanLabel}>Escanear producto</Text>
      </View>
    </SafeAreaView>
  );
}
 
