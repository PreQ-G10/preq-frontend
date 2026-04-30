import { AppText, Badge, Button, Card } from '@/components/atoms';
import { Colors } from '@/constants/theme';
import { ProductDetectionResponse } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, View } from 'react-native';
import { styles } from './BarcodeProductFound.styles';

interface BarcodeProductFoundProps {
  product: ProductDetectionResponse;
  onCollaborate: () => void;
  onViewPrices: () => void;
}

export function BarcodeProductFound({ product, onCollaborate, onViewPrices }: BarcodeProductFoundProps) {
  return (
    <View style={styles.container}>
      <Card elevated padded>
        <View style={styles.cardContent}>
          {product.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="cube-outline" size={32} color={Colors.gray300} />
            </View>
          )}
          <View style={styles.info}>
            <AppText variant="h3">{product.name}</AppText>
            <AppText variant="body" color="secondary">{product.brand}</AppText>
            <AppText variant="bodySmall" color="muted">{product.quantity} {product.quantityType}</AppText>
            <View style={styles.badge}>
              <Badge label="Producto encontrado · Código de barras escaneado" variant="success" />
            </View>
          </View>
        </View>
      </Card>
      <Button label="Colaborar con el precio" variant="primary" fullWidth onPress={onCollaborate} />
      <Button label="Ver precios" variant="secondary" fullWidth onPress={onViewPrices} />
    </View>
  );
}