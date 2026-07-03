import { AppText, Card } from '@/components/atoms';
import { SearchBar } from '@/components/molecules';
import { Routes } from '@/constants/routes';
import { Colors } from '@/constants/theme';
import { shoppingListService } from '@/services/api';
import { BusinessMetricsResponse } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { styles } from './BusinessHomeContent.styles';

const actions = [
  { icon: 'pricetag-outline', text: 'Publicá y actualizá los precios de tus productos' },
  { icon: 'storefront-outline', text: 'Administrá la información de tu negocio', route: Routes.profile },
  { icon: 'bar-chart-outline', text: 'Revisá las estadísticas de tu local' },
];

function formatPrice(value: number) {
  return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

function MetricCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricIcon}>
        <Ionicons name={icon as any} size={20} color={Colors.primary} />
      </View>
      <AppText variant="h3" style={styles.metricValue}>{value}</AppText>
      <AppText variant="caption" color="secondary" style={styles.metricLabel}>{label}</AppText>
    </View>
  );
}

export function BusinessHomeContent() {
  const [query, setQuery] = useState('');
  const [metrics, setMetrics] = useState<BusinessMetricsResponse | null>(null);

  useEffect(() => {
    shoppingListService.getBusinessMetrics()
      .then(setMetrics)
      .catch(() => setMetrics(null));
  }, []);

  return (
    <ScrollView
      style={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="on-drag"
      contentContainerStyle={styles.contentContainer}
    >
      <SearchBar
        value={query}
        onChangeText={setQuery}
        onSubmit={() => router.push({ pathname: Routes.search, params: { query } })}
        onClear={() => setQuery('')}
        placeholder="Buscá un producto para agregar..."
      />

      {metrics && (
        <View style={styles.metricsSection}>
          <AppText variant="h3">Tu negocio</AppText>

          <View style={styles.metricsRow}>
            <MetricCard
              icon="people-outline"
              label={`Usuario${metrics.uniqueUsersLast30Days !== 1 ? 's' : ''} con listas creadas para tu local - últimos 30 días`}
              value={String(metrics.uniqueUsersLast30Days)}
            />
            <MetricCard
              icon="cash-outline"
              label="Precio promedio últimas 10 listas guardadas por usuarios"
              value={metrics.averagePriceLast10Lists != null
                ? formatPrice(Number(metrics.averagePriceLast10Lists))
                : 'Sin datos'}
            />
          </View>

          {metrics.topProducts.length > 0 && (
            <Card elevated padded>
              <AppText variant="label" color="secondary" style={styles.topProductsTitle}>
                Top 5 productos más agregados
              </AppText>
              <View style={styles.topProductsList}>
                {metrics.topProducts.map((product, index) => (
                  <View key={product.productId} style={styles.topProductRow}>
                    <View style={styles.topProductRank}>
                      <AppText variant="label" color="white">{index + 1}</AppText>
                    </View>
                    <AppText variant="body" style={styles.topProductName}>{product.name}</AppText>
                    <AppText variant="bodySmall" color="secondary">{product.totalAdded}{product.totalAdded !== 1 ? ' veces' : ' vez'}</AppText>
                  </View>
                ))}
              </View>
            </Card>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.catalogueButton} onPress={() => router.push(Routes.catalogue)}>
        <Ionicons name="grid-outline" size={20} color={Colors.white} />
        <AppText variant="label" color="white">Mi catálogo</AppText>
      </TouchableOpacity>

      <AppText variant="h3">¿Qué podés hacer?</AppText>
      <Card elevated>
        <View style={styles.tipCard}>
          {actions.map((action, i) => (
            <TouchableOpacity key={i} style={styles.tipRow} activeOpacity={0.7}>
              <View style={styles.tipIcon}>
                <Ionicons name={action.icon as any} size={20} color={Colors.primary} />
              </View>
              <AppText variant="bodySmall" color="secondary" style={styles.tipText}>
                {action.text}
              </AppText>
              <Ionicons name="chevron-forward-outline" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}