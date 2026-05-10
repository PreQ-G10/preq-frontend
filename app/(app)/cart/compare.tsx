import { AppText, Button, Card, CustomScrollView, Spinner } from '@/components/atoms';
import { Colors } from '@/constants/theme';
import { useCart } from '@/context/cartContext';
import { cartService } from '@/services/api';
import { CartCompareResponse, CartLocationResponse, CartProductResponse, PriceSource } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from './compare.styles';

type SortMode = 'price' | 'distance' | 'optimo';

function formatPrice(value: number) {
  return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

function formatDistance(meters?: number) {
  if (meters == null) return null;
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;
}

function normalize(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return values.map(() => 0);
  return values.map((v) => (v - min) / (max - min));
}

function sortLocations(locations: CartLocationResponse[], mode: SortMode): CartLocationResponse[] {
  if (mode === 'price') return [...locations].sort((a, b) => a.totalEstimatedPrice - b.totalEstimatedPrice);
  if (mode === 'distance') {
    return [...locations].sort((a, b) => {
      if (a.distanceMeters == null) return 1;
      if (b.distanceMeters == null) return -1;
      return a.distanceMeters - b.distanceMeters;
    });
  }
  const prices = locations.map((l) => l.totalEstimatedPrice);
  const distances = locations.map((l) => l.distanceMeters ?? 0);
  const normPrices = normalize(prices);
  const normDistances = normalize(distances);
  return [...locations]
    .map((loc, i) => ({ loc, score: normPrices[i] * 0.6 + normDistances[i] * 0.4 }))
    .sort((a, b) => a.score - b.score)
    .map((x) => x.loc);
}

const sourceConfig: Record<PriceSource, { label: string; color: string; icon: string }> = {
  REPORTED: { label: 'Precio reportado', color: Colors.success, icon: 'checkmark-circle-outline' },
  NEARBY_FALLBACK: { label: 'Precio de locales cercanos', color: Colors.warning, icon: 'location-outline' },
  GLOBAL_FALLBACK: { label: 'Precio estimado global', color: Colors.textMuted, icon: 'analytics-outline' },
  NO_DATA: { label: 'Sin datos', color: Colors.error, icon: 'alert-circle-outline' },
};

function ProductRow({ product }: { product: CartProductResponse }) {
  const config = sourceConfig[product.priceSource];
  return (
    <View style={styles.productRow}>
      <View style={styles.productRowLeft}>
        <AppText variant="body">{product.name}</AppText>
        <View style={styles.sourceRow}>
          <Ionicons name={config.icon as any} size={12} color={config.color} />
          <AppText variant="caption" style={{ color: config.color }}>{config.label}</AppText>
        </View>
      </View>
      <View style={styles.productRowRight}>
        <AppText variant="bodySmall" color="secondary">
          {product.quantity}x {formatPrice(product.unitPrice)}
        </AppText>
        <AppText variant="label">{formatPrice(product.totalPrice)}</AppText>
      </View>
    </View>
  );
}

function LocationCard({ loc, index }: { loc: CartLocationResponse; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const animHeight = useRef(new Animated.Value(0)).current;
  const animOpacity = useRef(new Animated.Value(0)).current;
  const animRotate = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const toValue = expanded ? 0 : 1;
    setExpanded(!expanded);
    Animated.parallel([
      Animated.spring(animHeight, { toValue, useNativeDriver: false, tension: 80, friction: 12 }),
      Animated.timing(animOpacity, { toValue, duration: 200, useNativeDriver: false }),
      Animated.timing(animRotate, { toValue, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const maxHeight = animHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 72 * 6],
  });

  const rotate = animRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Card elevated padded>
      <TouchableOpacity onPress={toggle} activeOpacity={0.7}>
        <View style={styles.locationCard}>
          <View style={styles.rankBadge}>
            <AppText variant="label" color="white">{index + 1}</AppText>
          </View>
          <View style={styles.locationInfo}>
            <AppText variant="body">{loc.name}</AppText>
            <AppText variant="bodySmall" color="secondary">{loc.address}</AppText>
            {loc.distanceMeters != null && (
              <View style={styles.distanceRow}>
                <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
                <AppText variant="caption" color="muted">{formatDistance(loc.distanceMeters)}</AppText>
              </View>
            )}
          </View>
          <View style={styles.priceCol}>
            <AppText style={styles.totalPrice}>{formatPrice(loc.totalEstimatedPrice)}</AppText>
            <AppText variant="caption" color="muted">estimado</AppText>
          </View>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons name="chevron-down" size={18} color={Colors.textMuted} />
          </Animated.View>
        </View>
      </TouchableOpacity>

      <Animated.View style={{ maxHeight, opacity: animOpacity, overflow: 'hidden' }}>
        <View style={styles.divider} />
        <CustomScrollView
          maxHeight={72 * 5}
          nestedScrollEnabled={true}
        >
          {loc.products.map((product) => (
            <ProductRow key={product.productId} product={product} />
          ))}
        </CustomScrollView>
      </Animated.View>
    </Card>
  );
}

export default function CartCompareScreen() {
  const { items } = useCart();
  const [result, setResult] = useState<CartCompareResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>('price');

  useEffect(() => {
    cartService.compare({
      items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
    }).then(setResult)
      .catch(() => setResult(null))
      .finally(() => setLoading(false));
  }, []);

  const sorted = result ? sortLocations(result.locations, sortMode) : [];
  const hasDistance = sorted.some((l) => l.distanceMeters != null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <AppText variant="h3" color="white" style={styles.headerTitle}>Comparar canasta</AppText>
        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <Spinner fullScreen message="Comparando precios..." />
      ) : !result || result.locations.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="storefront-outline" size={48} color={Colors.gray300} />
          <AppText variant="h3" color="secondary">Sin resultados</AppText>
          <AppText variant="body" color="muted" style={{ textAlign: 'center' }}>
            No hay suficientes datos de precios para comparar tu canasta.
          </AppText>
          <Button label="Volver" variant="ghost" onPress={() => router.back()} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          <View style={styles.sortRow}>
            {(['price', 'distance', 'optimo'] as SortMode[]).map((mode) => {
              const labels: Record<SortMode, string> = { price: 'Precio', distance: 'Distancia', optimo: 'Óptimo' };
              const icons: Record<SortMode, string> = { price: 'pricetag-outline', distance: 'location-outline', optimo: 'star-outline' };
              const active = sortMode === mode;
              const disabled = mode === 'distance' && !hasDistance;
              return (
                <TouchableOpacity
                  key={mode}
                  style={[styles.sortButton, active && styles.sortButtonActive, disabled && styles.sortButtonDisabled]}
                  onPress={() => !disabled && setSortMode(mode)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={icons[mode] as any} size={14} color={active ? Colors.white : disabled ? Colors.textMuted : Colors.textSecondary} />
                  <AppText variant="label" style={{ color: active ? Colors.white : disabled ? Colors.textMuted : Colors.textSecondary }}>
                    {labels[mode]}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          {result.skippedProducts.length > 0 && (
            <View style={styles.warning}>
              <Ionicons name="information-circle-outline" size={16} color={Colors.warning} />
              <AppText variant="bodySmall" color="secondary" style={{ flex: 1 }}>
                Sin datos suficientes para: {result.skippedProducts.join(', ')}. No se incluyeron en el cálculo.
              </AppText>
            </View>
          )}

          {sorted.map((loc, index) => (
            <LocationCard key={loc.locationId} loc={loc} index={index} />
          ))}

          <AppText variant="caption" color="muted" style={styles.disclaimer}>
            Los precios son estimados basados en reportes de usuarios y pueden variar.
          </AppText>

        </ScrollView>
      )}
    </SafeAreaView>
  );
}