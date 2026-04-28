import { AppText } from '@/components/atoms';
import { PriceSummaryResponse } from '@/types';
import React from 'react';
import { View } from 'react-native';
import { styles } from './PriceSummaryPanel.styles';

interface PriceSummaryPanelProps {
  summary: PriceSummaryResponse;
}

function formatPrice(value: number) {
  return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

export function PriceSummaryPanel({ summary }: PriceSummaryPanelProps) {
  return (
    <View style={styles.container}>
      <View style={styles.weightedCard}>
        <AppText variant="label" color="primary">Precio estimado actual</AppText>
        <AppText variant="caption" color="secondary">Ajustado por inflación reciente</AppText>
        <AppText style={styles.weightedValue}>{formatPrice(summary.weightedPrice)}</AppText>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <AppText style={styles.statValue}>{formatPrice(summary.avgPrice)}</AppText>
          <AppText style={styles.statLabel}>Precio promedio</AppText>
        </View>
        <View style={styles.statCard}>
          <AppText style={styles.statValue}>{formatPrice(summary.minPrice)}</AppText>
          <AppText style={styles.statLabel}>Precio mínimo</AppText>
        </View>
        <View style={styles.statCard}>
          <AppText style={styles.statValue}>{formatPrice(summary.maxPrice)}</AppText>
          <AppText style={styles.statLabel}>Precio máximo</AppText>
        </View>
      </View>

      {summary.topLocations.length > 0 && (
        <View>
          <AppText variant="label" color="default" style={{ marginBottom: 8 }}>
            Mejores lugares
          </AppText>
          {summary.topLocations.map((loc, index) => (
            <View key={index} style={styles.locationRow}>
              <View style={styles.locationInfo}>
                <AppText variant="body">{loc.name}</AppText>
                <AppText variant="bodySmall" color="secondary">{loc.address} · {loc.reportCount} reportes</AppText>
              </View>
              <AppText style={styles.locationPrice}>{formatPrice(loc.avgPrice)}</AppText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
