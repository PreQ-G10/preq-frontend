import React from 'react';
import { Image, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/atoms';
import { Colors } from '@/constants/theme';
import { ProductDetectionResponse } from '@/types';
import { styles } from './ProductCard.styles';

interface ProductCardProps {
  product: ProductDetectionResponse;
  showSimilarity?: boolean;
}

export function ProductCard({ product, showSimilarity = true }: ProductCardProps) {
  const similarityPercent = Math.round(product.similarity * 100);

  return (
    <View style={styles.container}>
      {product.imageUrl ? (
        <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="cube-outline" size={32} color={Colors.gray300} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.quantity}>{product.quantity} {product.quantityType}</Text>
        {showSimilarity && (
          <View style={styles.badgeRow}>
            <Badge
              label={`${similarityPercent}% coincidencia`}
              variant={product.isConfident ? 'success' : 'warning'}
            />
          </View>
        )}
      </View>
    </View>
  );
}
