import { AppText, Spinner } from '@/components/atoms';
import { PriceValidationForm } from '@/components/organisms';
import { Colors } from '@/constants/theme';
import { priceService } from '@/services/api';
import { PendingValidationResponse } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as ExpoLocation from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { styles } from './index.styles';

export default function ValidationScreen() {
  const [reports, setReports] = useState<PendingValidationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    setLoading(true);
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setReports([]);
        return;
      }
      const pos = await ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.Accuracy.Balanced });
      const data = await priceService.getPendingValidation(pos.coords.latitude, pos.coords.longitude);
      setReports(data);
    } catch (e) {
      console.error('Failed to load pending validation:', e);
    } finally {
      setLoading(false);
    }
  }

  function handleValidated(reportId: number) {
    setReports((prev) => prev.filter((r) => r.id !== reportId));
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <AppText variant="h3">Validar precios</AppText>
      </View>

      <View style={styles.content}>
        <AppText variant="bodySmall" color="secondary" style={styles.subtitle}>
          Estos precios fueron reportados cerca tuyo y necesitan confirmación
        </AppText>

        {loading ? (
          <Spinner fullScreen message="Buscando precios cercanos..." />
        ) : (
          <PriceValidationForm reports={reports} onValidated={handleValidated} />
        )}
      </View>
    </SafeAreaView>
  );
}