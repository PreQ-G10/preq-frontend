import { AppText, Button, Card, Spinner } from '@/components/atoms';
import { SearchBar } from '@/components/molecules';
import { Routes } from '@/constants/routes';
import { Colors } from '@/constants/theme';
import { productService } from '@/services/api';
import { Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { styles } from './search.styles';

export default function SearchScreen() {
  const { query: initialQuery } = useLocalSearchParams<{ query: string }>();
  const [query, setQuery] = useState(initialQuery ?? '');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCollaborate, setShowCollaborate] = useState(false);

  useEffect(() => {
    if (initialQuery) handleSearch();
  }, []);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await productService.search(query);
      setResults(data);
    } finally {
      setLoading(false);
    }
  }

  function handleProductPress(product: Product) {
    router.push(Routes.productDetails(product.id));
  }

  function handleCollaborate() {
    setShowCollaborate(false);
    router.push({ pathname: Routes.priceCollaborate, params: { productId: String(selectedProduct!.id) } });
  }

  function handleSkipCollaborate() {
    setShowCollaborate(false);
    router.push(Routes.priceDetails(selectedProduct!.id));
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <AppText variant="h3">Buscar producto</AppText>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar value={query} onChangeText={setQuery} onSubmit={handleSearch} placeholder="Nombre o marca..." />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading && <Spinner message="Buscando..." />}

        {!loading && searched && results.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={48} color={Colors.gray300} />
            <AppText variant="body" color="secondary">No hay resultados para &quot;{query}&quot;</AppText>
          </View>
        )}

        {!loading && results.map(product => (
          <TouchableOpacity key={product.id} onPress={() => handleProductPress(product)} activeOpacity={0.7}>
            <Card elevated padded>
              <View style={styles.productRow}>
                <View style={styles.productInfo}>
                  <AppText variant="body">{product.name}</AppText>
                  <AppText variant="bodySmall" color="secondary">
                    {product.brand} · {product.quantity} {product.quantityType}
                  </AppText>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.gray400} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={showCollaborate} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <AppText variant="h3" style={styles.popupTitle}>
              {selectedProduct?.name}
            </AppText>
            <AppText variant="body" color="secondary" style={styles.popupSubtitle}>
              ¿Querés colaborar con el precio de este producto?
            </AppText>
            <Button label="Sí, colaborar" variant="primary" fullWidth onPress={handleCollaborate} />
            <Button label="Solo ver precios" variant="secondary" fullWidth onPress={handleSkipCollaborate} />
            <Button label="Cancelar" variant="ghost" fullWidth onPress={() => setShowCollaborate(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
