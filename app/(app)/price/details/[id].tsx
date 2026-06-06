import { AppText, Button, Spinner } from '@/components/atoms';
import { PriceSummaryPanel } from '@/components/organisms';
import { Routes } from '@/constants/routes';
import { Colors } from '@/constants/theme';
import { priceService } from '@/services/api';
import { PriceSummaryResponse } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { styles } from './[id].styles';

export default function PriceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [summary, setSummary] = useState<PriceSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    priceService.getSummary(Number(id))
      .then(setSummary)
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner fullScreen message="Cargando precios..." />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <AppText variant="h3">Precios del producto</AppText>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {summary && summary.avgPrice > 0 ? (
          <>
            <PriceSummaryPanel productId= {id} summary={summary} />
            <Button
              label="Ver mapa de calor"
              variant="secondary"
              fullWidth
              onPress={() => router.push(Routes.priceHeatmap(Number(id)))}
            />
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="pricetag-outline" size={48} color={Colors.gray300} />
            <AppText variant="h3" color="secondary">Sin precios todavía</AppText>
            <AppText variant="body" color="muted" style={{ textAlign: 'center' }}>
              Sé el primero en colaborar con el precio de este producto
            </AppText>
          </View>
        )}
        <Button
          label="Escanear otro producto"
          variant="secondary"
          fullWidth
          style={styles.scanAgainButton}
          onPress={() => router.push(Routes.camera)}
        />
        <Button
          label="Volver al inicio"
          variant="ghost"
          fullWidth
          onPress={() => router.push(Routes.home)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
