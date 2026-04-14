import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Button, Spinner } from '@/components/atoms';
import { PriceSummaryPanel } from '@/components/organisms';
import { Colors } from '@/constants/theme';
import { Routes } from '@/constants/routes';
import { priceService } from '@/services/api';
import { PriceSummaryResponse } from '@/types';
import { styles } from './[id].styles';

export default function PriceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [summary, setSummary] = useState<PriceSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    priceService.getSummary(Number(id))
      .then(setSummary)
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
        {summary ? (
          <PriceSummaryPanel summary={summary} />
        ) : (
          <View>
            <AppText variant="body" color="secondary">No hay precios disponibles todavía</AppText>
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
