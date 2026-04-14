import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Button, Card } from '@/components/atoms';
import { ConfidenceBanner, ProductCard } from '@/components/molecules';
import { Colors } from '@/constants/theme';
import { ProductDetectionResponse } from '@/types';
import { styles } from './ProductDetectionResult.styles';

interface ProductDetectionResultProps {
  results: ProductDetectionResponse[];
  onConfirm: (product: ProductDetectionResponse) => void;
  onReject: () => void;
}

export function ProductDetectionResult({ results, onConfirm, onReject }: ProductDetectionResultProps) {
  const top = results[0];

  if (!top) {
    return (
      <View style={styles.noResultContainer}>
        <View style={styles.noResultIcon}>
          <Ionicons name="search-outline" size={32} color={Colors.gray400} />
        </View>
        <AppText variant="h3" color="default">No encontramos el producto</AppText>
        <AppText variant="body" color="secondary" style={{ textAlign: 'center' }}>
          Buscalo por nombre o creá uno nuevo
        </AppText>
        <Button label="Buscar manualmente" variant="secondary" onPress={onReject} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppText variant="h3">¿Es este el producto?</AppText>
      <Card elevated padded>
        <View style={styles.cardContent}>
          <ProductCard product={top} showSimilarity={false} />
          <View style={styles.divider} />
          <ConfidenceBanner isConfident={top.isConfident} similarity={top.similarity} />
          <View style={styles.actions}>
            <Button
              label="No es este"
              variant="secondary"
              style={styles.actionButton}
              onPress={onReject}
            />
            <Button
              label="Sí, confirmar"
              variant="primary"
              style={styles.actionButton}
              onPress={() => onConfirm(top)}
            />
          </View>
        </View>
      </Card>
    </View>
  );
}
