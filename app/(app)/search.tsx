import { AppText, Button, Spinner } from '@/components/atoms';
import { SearchBar, SearchResultCard } from '@/components/molecules';
import { AddToCatalogueModal, CreateProductForm } from '@/components/organisms';
import { Routes } from '@/constants/routes';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { productService } from '@/services/api';
import { Product, ProductSearchWithPrice } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { styles } from './search.styles';

export default function SearchScreen() {
  const { query: initialQuery } = useLocalSearchParams<{ query: string }>();
  const { role } = useAuth();
  const isBusiness = role === 'BUSINESS';

  const [query, setQuery] = useState(initialQuery ?? '');
  const [results, setResults] = useState<ProductSearchWithPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCollaborate, setShowCollaborate] = useState(false);
  const [showAddToCatalogue, setShowAddToCatalogue] = useState(false);
  const [showCreateProduct, setShowCreateProduct] = useState(false);

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
    if (isBusiness) return;
    router.push(Routes.productDetails(product.id));
  }

  function handleAddToCatalogue(product: Product) {
    setSelectedProduct(product);
    setShowAddToCatalogue(true);
  }

  function handleProductCreated(product: Product) {
    setShowCreateProduct(false);
    setSelectedProduct(product);
    setShowAddToCatalogue(true);
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
            <AppText variant="body" color="secondary">No hay resultados para "{query}"</AppText>
          </View>
        )}

        {!loading && results.map(data => (
          <View key={data.product.id} style={styles.resultRow}>
            <View style={styles.resultCardWrapper}>
              <SearchResultCard
                product={data.product}
                maxPrice={data.maxPrice}
                minPrice={data.minPrice}
                isBusiness={isBusiness}
                onPress={() => handleProductPress(data.product)}
              />
            </View>
            {isBusiness && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddToCatalogue(data.product)}
              >
                <Ionicons name="add" size={22} color={Colors.white} />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Floating create product button — business only */}
      {isBusiness && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setShowCreateProduct(true)}
        >
          <Ionicons name="add" size={24} color={Colors.white} />
          <AppText variant="label" color="white">Crear producto</AppText>
        </TouchableOpacity>
      )}

      {/* User collaborate modal */}
      <Modal visible={showCollaborate} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <AppText variant="h3" style={styles.popupTitle}>{selectedProduct?.name}</AppText>
            <AppText variant="body" color="secondary" style={styles.popupSubtitle}>
              ¿Querés colaborar con el precio de este producto?
            </AppText>
            <Button label="Sí, colaborar" variant="primary" fullWidth onPress={handleCollaborate} />
            <Button label="Solo ver precios" variant="secondary" fullWidth onPress={handleSkipCollaborate} />
            <Button label="Cancelar" variant="ghost" fullWidth onPress={() => setShowCollaborate(false)} />
          </View>
        </View>
      </Modal>

      {/* Business add to catalogue modal */}
      {selectedProduct && (
        <AddToCatalogueModal
          visible={showAddToCatalogue}
          product={selectedProduct}
          onClose={() => setShowAddToCatalogue(false)}
          onSuccess={() => setShowAddToCatalogue(false)}
        />
      )}

      {/* Create product modal */}
      <Modal visible={showCreateProduct} transparent animationType="slide" statusBarTranslucent>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={() => setShowCreateProduct(false)}>
            <View style={styles.createProductOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.createProductSheet}>
                  <View style={styles.createProductHeader}>
                    <AppText variant="h3">Crear producto</AppText>
                    <TouchableOpacity onPress={() => setShowCreateProduct(false)}>
                      <Ionicons name="close" size={24} color={Colors.text} />
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                  >
                    <CreateProductForm onCreated={handleProductCreated} />
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}