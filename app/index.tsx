import { AppText, Card, Spinner } from '@/components/atoms';
import { SearchBar } from '@/components/molecules';
import { Routes } from '@/constants/routes';
import { Colors } from '@/constants/theme';
import { productService } from '@/services/api';
import { Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import 'react-native-reanimated';
import { styles } from './index.styles';

const tips = [
  { icon: 'scan-outline', text: 'Apuntá la cámara al producto para identificarlo automáticamente' },
  { icon: 'pricetag-outline', text: 'Colaborá con el precio que viste en el local' },
  { icon: 'bar-chart-outline', text: 'Comparé precios entre distintos locales' },
];

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const data = await productService.search(query);
      setResults(data);
      setShowResults(true);
    } finally {
      setSearching(false);
    }
  }

  function handleDismiss() {
    setShowResults(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.container} onPress={handleDismiss}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>preq</Text>
          <Text style={styles.headerSubtitle}>Compará precios de productos en tu zona</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.searchWrapper}>
            <SearchBar
              value={query}
              onChangeText={(text) => { setQuery(text); if (!text) setShowResults(false); }}
              onSubmit={handleSearch}
              onClear={() => setShowResults(false)}
              hasResults={showResults && results.length > 0}
              placeholder="Buscá un producto..."
            />
            {showResults && (searching || results.length > 0) && (
              <View style={styles.dropdown}>
                {searching && <Spinner size="small" />}
                {!searching && results.slice(0, 3).map(product => (
                  <TouchableOpacity
                    key={product.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setShowResults(false);
                      router.push({ pathname: Routes.search, params: { query, productId: String(product.id) } });
                    }}
                    activeOpacity={0.7}
                  >
                    <AppText variant="body">{product.name}</AppText>
                    <AppText variant="bodySmall" color="secondary">
                      {product.brand} · {product.quantity} {product.quantityType}
                    </AppText>
                  </TouchableOpacity>
                ))}
                {!searching && results.length > 3 && (
                  <TouchableOpacity
                    style={styles.viewMore}
                    onPress={() => {
                      setShowResults(false);
                      router.push({ pathname: Routes.search, params: { query } });
                    }}
                  >
                    <AppText variant="label" color="primary">Ver todos ({results.length})</AppText>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
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
      </Pressable>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.scanButton} onPress={() => router.push(Routes.camera)} activeOpacity={0.85}>
          <Ionicons name="scan" size={32} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.scanLabel}>Escanear producto</Text>
      </View>
    </SafeAreaView>
  );
}
