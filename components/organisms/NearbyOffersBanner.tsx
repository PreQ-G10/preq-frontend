import { AppText } from '@/components/atoms';
import { Colors } from '@/constants/theme';
import { NearbyOffer } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { Animated, ScrollView, TouchableOpacity, View } from 'react-native';
import { styles } from './NearbyOffersBanner.styles';

interface NearbyOffersBannerProps {
  offers: NearbyOffer[];
  onOfferPress: (offer: NearbyOffer) => void;
  onDismiss?: () => void;
}

export function NearbyOffersBanner({ offers, onOfferPress, onDismiss }: NearbyOffersBannerProps) {
  const opacity = useRef(new Animated.Value(1)).current;

  if (offers.length === 0) return null;

  function handleDismiss() {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onDismiss?.());
  }

  function formatPrice(price: number) {
    return `$${price.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`;
  }

  function discountPercent(original: number, current: number) {
    return Math.round(((original - current) / original) * 100);
  }

  return (
    <Animated.View testID="nearby-offers-banner" style={[styles.container, { opacity }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconWrapper}>
            <Ionicons name="flame" size={13} color={Colors.white} />
          </View>
          <View>
            <AppText variant="h3" style={styles.headerTitle}>
              Precios bajos cerca tuyo
            </AppText>
            <AppText testID="nearby-offers-subtitle" variant="caption" color="secondary" style={styles.headerSubtitle}>
              {offers.length} {offers.length === 1 ? 'producto' : 'productos'} por debajo del promedio
            </AppText>
          </View>
        </View>
        {onDismiss && (
          <TouchableOpacity
            testID="nearby-offers-dismiss"
            style={styles.dismissButton}
            onPress={handleDismiss}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={12} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={172}
        snapToAlignment="start"
      >
        {offers.map((offer) => {
          const hasDiscount = offer.averagePrice != null && offer.averagePrice > offer.price;
          const pct = hasDiscount ? discountPercent(offer.averagePrice!, offer.price) : 0;

          return (
            <TouchableOpacity
              key={`${offer.product.id}-${offer.location.id}`}
              testID={`offer-card-${offer.product.id}`}
              style={styles.card}
              onPress={() => onOfferPress(offer)}
              activeOpacity={0.75}
            >
              {hasDiscount && (
                <View style={styles.discountBadge}>
                  <AppText variant="caption" color="white" style={styles.discountText}>
                    -{pct}%
                  </AppText>
                </View>
              )}
              <AppText variant="bodySmall" style={styles.productName} numberOfLines={2}>
                {offer.product.name}
              </AppText>
              <View style={styles.storeRow}>
                <Ionicons name="storefront-outline" size={11} color={Colors.textSecondary} />
                <AppText variant="caption" color="secondary" style={styles.storeName} numberOfLines={1}>
                  {offer.location.name}
                </AppText>
              </View>
              <View style={styles.priceRow}>
                <AppText variant="h3" color="primary" style={styles.price}>
                  {formatPrice(offer.price)}
                </AppText>
                {hasDiscount && (
                  <AppText variant="caption" color="secondary" style={styles.originalPrice}>
                    {formatPrice(offer.averagePrice!)}
                  </AppText>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}