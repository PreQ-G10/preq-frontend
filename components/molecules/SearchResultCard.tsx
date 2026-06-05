import { AppText, Card } from '@/components/atoms';
import { Colors } from '@/constants/theme';
import { useCart } from '@/context/cartContext';
import { Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { styles } from './SearchResultCard.styles';

interface SearchResultCardProps {
  product: Product;
  onPress: () => void;
}

function formatPrice(value: number) {
  return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

export function SearchResultCard({ product, onPress }: SearchResultCardProps) {
  const { items, addToCart, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.product.id === product.id);
  const cartQuantity = cartItem?.quantity ?? 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card elevated padded>
        <View style={styles.productRow}>
          {product.images?.[0] ? (
            <Image source={{ uri: product.images[0] }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="cube-outline" size={24} color={Colors.gray400} />
            </View>
          )}
          
          <View style={styles.productInfo}>
            <AppText variant="body">{product.name}</AppText>
            <AppText variant="bodySmall" color="secondary">
              {product.brand} · {product.quantity} {product.quantityType}
            </AppText>
          </View>

          <View style={styles.rightColumn}>
            {product.minPrice !== undefined && product.minPrice > 0 && (
              <View style={styles.priceRow}>
                <Ionicons name="arrow-down" size={14} color={Colors.success} />
                <AppText variant="bodySmall" color="success" style={styles.priceText}>
                  {formatPrice(product.minPrice)}
                </AppText>
              </View>
            )}
            {product.maxPrice !== undefined && product.maxPrice > 0 && (
              <View style={styles.priceRow}>
                <Ionicons name="arrow-up" size={14} color={Colors.error} />
                <AppText variant="bodySmall" color="error" style={styles.priceText}>
                  {formatPrice(product.maxPrice)}
                </AppText>
              </View>
            )}
            
            <View style={styles.cartActions}>
              {cartQuantity > 0 ? (
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    onPress={(e) => { e.stopPropagation(); updateQuantity(product.id, cartQuantity - 1); }}
                    style={styles.quantityBtn}
                  >
                    <Ionicons 
                      name={cartQuantity === 1 ? 'trash-outline' : 'remove'} 
                      size={14} 
                      color={cartQuantity === 1 ? Colors.error : Colors.text} 
                    />
                  </TouchableOpacity>
                  <AppText variant="label" style={styles.quantityText}>{cartQuantity}</AppText>
                  <TouchableOpacity
                    onPress={(e) => { e.stopPropagation(); updateQuantity(product.id, cartQuantity + 1); }}
                    style={styles.quantityBtn}
                  >
                    <Ionicons name="add" size={14} color={Colors.text} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={(e) => { e.stopPropagation(); addToCart(product); }}
                  style={styles.addBtn}
                >
                  <Ionicons name="add" size={20} color={Colors.white} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
