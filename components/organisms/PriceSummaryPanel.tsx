import { AppText, CustomScrollView, Spinner } from '@/components/atoms';
import { VerificationTooltip, getVerificationConfig } from '@/components/molecules/VerificationTooltip';
import { Colors, Spacing } from '@/constants/theme';
import { priceService } from '@/services/api';
import { PriceSummaryResponse } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styles } from './PriceSummaryPanel.styles';

interface PriceSummaryPanelProps {
  productId: string;
  summary: PriceSummaryResponse;
}

function formatPrice(value: number) {
  return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
}

export function PriceSummaryPanel({ productId, summary }: PriceSummaryPanelProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [locationReports, setLocationReports] = useState<Record<number, any[]>>({});
  const [loadingReports, setLoadingReports] = useState<Record<number, boolean>>({});
  const [tooltip, setTooltip] = useState<{ score: number, x: number, y: number } | null>(null);
  const [businessTooltip, setBusinessTooltip] = useState<{ color: string; label: string; message: string; icon: any; x: number; y: number } | null>(null);

  const handleToggle = async (index: number, locationId: number) => {
    const isExpanded = expandedIndex === index;
    if (isExpanded) {
      setExpandedIndex(null);
      return;
    }

    setExpandedIndex(index);

    if (!locationReports[locationId]) {
      setLoadingReports(prev => ({ ...prev, [locationId]: true }));
      try {
        const data = await priceService.getLocationPrices(Number(productId), locationId);
        setLocationReports(prev => ({ ...prev, [locationId]: data }));
      } catch (error) {
        console.error('Error fetching location history:', error);
      } finally {
        setLoadingReports(prev => ({ ...prev, [locationId]: false }));
      }
    }
  };

  const handleVerificationInfo = (score: number, event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setTooltip({ score, x: pageX, y: pageY - 45 });
  };

  function getBusinessPriceBadge(businessPrice: number, avgPrice: number, reportedAt: string) {
    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(reportedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    const deviation = (avgPrice - businessPrice) / avgPrice;
  
    if (deviation > 0.20 || daysSinceUpdate >= 90) {
      return {
        color: '#ef4444',
        icon: 'alert-circle' as const,
        label: 'Precio poco confiable',
        message: 'El precio reportado por el comercio se desvía significativamente del precio de los usuarios o lleva más de 90 días sin actualizarse.',
      };
    }
    if (deviation > 0.10 || daysSinceUpdate >= 60) {
      return {
        color: '#f59e0b',
        icon: 'warning' as const,
        label: 'Precio medianamente confiable',
        message: 'El precio reportado por el comercio puede estar algo desactualizado o difiere moderadamente del precio reportado por los usuarios.',
      };
    }
    return {
      color: '#22c55e',
      icon: 'checkmark-circle' as const,
      label: 'Precio confiable',
      message: 'El precio reportado por el comercio está al día y es consistente con los reportes de los usuarios.',
    };
  }

  return (
    <View style={styles.container}>
      <View style={styles.weightedCard}>
        <AppText variant="label" color="primary">Precio estimado actual</AppText>
        <AppText variant="caption" color="secondary">Ajustado por inflación aproximada</AppText>
        <AppText style={styles.weightedValue}>{formatPrice(summary.weightedPrice)}</AppText>
      </View>

      <View style={styles.confidenceCard}>
        <AppText variant="label" color="secondary">Precio estimado actual (sin considerar inflación)</AppText>
        <AppText style={styles.confidenceValue}>{formatPrice(summary.weightedByConfidencePrice)}</AppText>
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
          {summary.topLocations.map((loc, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <View key={index} style={{ marginBottom: Spacing.xs }}>
                <TouchableOpacity
                  style={styles.locationRow}
                  onPress={() => handleToggle(index, loc.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.locationInfo}>
                    <AppText variant="body">{loc.name}</AppText>
                    <AppText variant="bodySmall" color="secondary">
                      {loc.address} · {loc.reportCount} reportes
                    </AppText>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
                    <AppText style={styles.locationPrice}>{formatPrice(loc.avgPrice)}</AppText>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color={Colors.gray400}
                    />
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  loadingReports[loc.id] ? (
                    <View style={{ paddingVertical: Spacing.sm }}>
                      <Spinner size="small" />
                    </View>
                  ) : (
                    <CustomScrollView maxHeight={132} style={{ marginTop: 4, marginHorizontal: Spacing.md }}>
                      {locationReports[loc.id]?.map((report: any, rIdx: number) => {
                        if (report.businessReported) {
                          const badge = getBusinessPriceBadge(report.price, loc.avgPrice, report.reportedAt);
                          return (
                            <View key={rIdx} style={styles.reportRow}>
                              <View style={styles.reportRowAccentBusiness} />
                              <View style={styles.reportRowLeft}>
                                <Ionicons name="storefront-outline" size={14} color={Colors.primary} />
                                <AppText variant="bodySmall" color="primary" style={{ fontWeight: '600' }}>Comercio</AppText>
                              </View>
                              <View style={styles.reportPriceRow}>
                                <AppText style={styles.reportPrice}>{formatPrice(report.price)}</AppText>
                                <TouchableOpacity
                                  onPress={(e) => {
                                    const { pageX, pageY } = e.nativeEvent;
                                    setBusinessTooltip({ color: badge.color, label: badge.label, message: badge.message, icon: badge.icon, x: pageX, y: pageY });
                                  }}
                                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                  <Ionicons name={badge.icon} size={15} color={badge.color} />
                                </TouchableOpacity>
                              </View>
                              <AppText variant="caption" color="secondary" style={styles.reportDate}>{formatDate(report.reportedAt)}</AppText>
                            </View>
                          );
                        }
                      
                        const config = getVerificationConfig(report.score);
                        return (
                          <View key={rIdx} style={styles.reportRow}>
                            <View style={styles.reportRowAccentUser} />
                            <View style={styles.reportRowLeft}>
                              <Ionicons name="person-outline" size={14} color={Colors.gray400} />
                              <AppText variant="bodySmall" color="secondary">Usuario</AppText>
                            </View>
                            <View style={styles.reportPriceRow}>
                              <AppText style={styles.reportPrice}>{formatPrice(report.price)}</AppText>
                              <TouchableOpacity
                                onPress={(e) => handleVerificationInfo(report.score, e)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                              >
                                <Ionicons name={config.name} size={15} color={config.color} />
                              </TouchableOpacity>
                            </View>
                            <AppText variant="caption" color="secondary" style={styles.reportDate}>{formatDate(report.reportedAt)}</AppText>
                          </View>
                        );
                      })}
                    </CustomScrollView>
                  )
                )}
              </View>
            );
          })}
        </View>
      )}

      <VerificationTooltip
        visible={!!tooltip}
        score={tooltip?.score ?? 0}
        x={tooltip?.x ?? 0}
        y={tooltip?.y ?? 0}
        onClose={() => setTooltip(null)}
      />
      <VerificationTooltip
        visible={!!businessTooltip}
        x={businessTooltip?.x ?? 0}
        y={businessTooltip?.y ?? 0}
        onClose={() => setBusinessTooltip(null)}
        title={businessTooltip?.label}
        message={businessTooltip?.message}
        icon={businessTooltip?.icon}
        iconColor={businessTooltip?.color}
      />
    </View>
  );
}