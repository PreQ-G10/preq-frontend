import { Colors } from '@/constants/theme';
import { PendingValidationResponse } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { AppText } from '../atoms';
import { styles } from './PendingValidationCard.styles';
 
interface PendingValidationCardProps {
  report: PendingValidationResponse;
}
 
function formatPrice(value: number) {
  return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}
 
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
}
 
export function PendingValidationCard({ report }: PendingValidationCardProps) {
  return (
    <View style={styles.container}>
      {/* Product zone */}
      <View style={styles.productZone}>
        <View style={styles.productIconRow}>
          <Ionicons name="pricetag-outline" size={14} color={Colors.primary} />
          <AppText variant="label" color="primary">{report.product.name}</AppText>
        </View>
        <AppText variant="bodySmall" color="secondary">
          {report.product.brand} · {report.product.quantity} {report.product.quantityType}
        </AppText>
      </View>
 
      {/* Location + price zone */}
      <View style={styles.detailZone}>
        <View style={styles.locationBlock}>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
            <AppText variant="bodySmall" color="secondary">{report.locationName}</AppText>
          </View>
          <AppText variant="caption" color="secondary">{report.locationAddress}</AppText>
        </View>
        <View style={styles.priceBlock}>
          <AppText style={styles.price}>{formatPrice(report.price)}</AppText>
          <AppText variant="caption" color="secondary">{formatDate(report.reportedAt)}</AppText>
        </View>
      </View>
    </View>
  );
}