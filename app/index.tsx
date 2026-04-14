import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card } from '@/components/atoms';
import { Colors } from '@/constants/theme';
import { Routes } from '@/constants/routes';
import { styles } from './index.styles';

const tips = [
  { icon: 'scan-outline', text: 'Apuntá la cámara al producto para identificarlo automáticamente' },
  { icon: 'pricetag-outline', text: 'Colaborá con el precio que viste en el local' },
  { icon: 'bar-chart-outline', text: 'Comparé precios entre distintos locales' },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>preq</Text>
        <Text style={styles.headerSubtitle}>Compará precios de productos en tu zona</Text>
      </View>

      <View style={styles.content}>
        <AppText variant="h3">¿Cómo funciona?</AppText>
        <Card elevated>
          <View style={styles.tipCard}>
            {tips.map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <View style={styles.tipIcon}>
                  <Ionicons name={tip.icon as any} size={20} color={Colors.primary} />
                </View>
                <AppText variant="bodySmall" color="secondary" style={styles.tipText}>
                  {tip.text}
                </AppText>
              </View>
            ))}
          </View>
        </Card>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.scanButton} onPress={() => router.push(Routes.camera)} activeOpacity={0.85}>
          <Ionicons name="scan" size={32} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.scanLabel}>Escanear producto</Text>
      </View>
    </SafeAreaView>
  );
}
