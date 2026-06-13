import { AppText, Button } from '@/components/atoms';
import { BarcodeProductFound, CreateProductForm, ProductDetectionResult, ProductSearchResults } from '@/components/organisms';
import { Routes } from '@/constants/routes';
import { Colors } from '@/constants/theme';
import { productService } from '@/services/api';
import { Product, ProductDetectionResponse, ProductSearchWithPrice } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { styles } from './confirm.styles';

type Step = 'detection' | 'barcodeFound' | 'collision' | 'notFound' | 'search' | 'create';

export default function ProductConfirmScreen() {
  const { photoUri, results: resultsParam, source, barcodeStatus, barcode } = useLocalSearchParams<{
    photoUri?: string;
    results?: string;
    source?: 'barcode' | 'image';
    barcodeStatus?: string;
    barcode?: string;
  }>();

  const notFound = barcodeStatus === 'NOT_FOUND' || barcodeStatus === 'INCOMPLETE_DATA';
  const isFound = barcodeStatus === 'FOUND' || barcodeStatus === 'CREATED';
  const isCollision = barcodeStatus === 'COLLISION';

  function getInitialStep(): Step {
    if (notFound) return 'notFound';
    if (isFound) return 'barcodeFound';
    if (isCollision) return 'collision';
    return 'detection';
  }

  const [step, setStep] = useState<Step>(getInitialStep);
  const [showOptions, setShowOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const parsedResults: ProductDetectionResponse[] = useMemo(() => {
    if (!resultsParam) return [];
    const parsed = JSON.parse(resultsParam);

    if (source === 'barcode') {
      return (parsed as Product[]).map(p => ({
        productId: p.id,
        name: p.name,
        brand: p.brand,
        quantity: p.quantity,
        quantityType: p.quantityType,
        imageUrl: p.images?.[0],
        similarity: 1,
        isConfident: true,
      }));
    }

    return parsed as ProductDetectionResponse[];
  }, [resultsParam, source]);

  const foundProduct = parsedResults[0] ?? null;
  const collisionProduct = parsedResults[0] ?? null; // existingProduct from backend

  const titles: Record<Step, string> = {
    detection: '¿Reconocés este producto?',
    barcodeFound: 'Producto encontrado',
    collision: '¿Es este tu producto?',
    notFound: 'Producto no encontrado',
    search: 'Buscá el producto',
    create: 'Crear nuevo producto',
  };

  async function handleConfirmImage(product: ProductDetectionResponse) {
    if (source === 'image' && photoUri) {
      await productService.confirmImage(product.productId, photoUri, product.similarity);
    }
    router.push(Routes.productDetails(product.productId));
  }

  async function handleConfirmCollision() {
    if (!collisionProduct || !barcode) return;
    setSubmitting(true);
    try {
      await productService.resolveBarcodeCollision(collisionProduct.productId, barcode, true);
      router.push(Routes.productDetails(collisionProduct.productId));
    } finally {
      setSubmitting(false);
    }
  }

  function handleDenyCollision() {
    setStep('search');
  }

  function handleSelectFromSearch(data: ProductSearchWithPrice) {
    router.push(Routes.productDetails(data.product.id));
  }

  function handleProductCreated(product: Product) {
    router.push(Routes.productDetails(product.id));
  }

  function handleBack() {
    if (step === 'create') { setStep('search'); return; }
    if (step === 'search') {
      if (notFound) { setStep('notFound'); return; }
      if (isCollision) { setStep('collision'); return; }
      setStep('detection');
      return;
    }
    router.push(Routes.home);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <AppText variant="h3">{titles[step]}</AppText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>

          {step === 'barcodeFound' && foundProduct && (
            <BarcodeProductFound
              product={foundProduct}
              onCollaborate={() => router.push(Routes.productDetails(foundProduct.productId))}
              onViewPrices={() => router.push(Routes.productDetails(foundProduct.productId))}
            />
          )}

          {step === 'collision' && collisionProduct && (
            <View style={localStyles.collisionContainer}>
              <View style={localStyles.caveat}>
                <Ionicons name="information-circle-outline" size={16} color={Colors.primary} />
                <AppText variant="bodySmall" color="secondary" style={localStyles.caveatText}>
                  Para confirmar, el producto debe coincidir en nombre, marca y cantidad
                </AppText>
              </View>
              <ProductDetectionResult
                results={[collisionProduct]}
                onConfirm={handleConfirmCollision}
                onReject={handleDenyCollision}
                confirmLabel="Sí, es este"
                rejectLabel="No es este"
                submitting={submitting}
              />
            </View>
          )}

          {step === 'detection' && (
            <ProductDetectionResult
              results={parsedResults}
              onConfirm={handleConfirmImage}
              onReject={() => setShowOptions(true)}
            />
          )}

          {step === 'notFound' && (
            <View style={styles.notFoundContainer}>
              <View style={styles.notFoundIcon}>
                <Ionicons name="search-outline" size={48} color={Colors.gray300} />
              </View>
              <AppText variant="h3" style={{ textAlign: 'center' }}>
                No encontramos este código
              </AppText>
              <AppText variant="body" color="secondary" style={{ textAlign: 'center' }}>
                No pudimos identificar este producto por su código de barras.
              </AppText>
              <View style={styles.notFoundActions}>
                <Button label="Escanear por imagen" variant="primary" fullWidth
                  onPress={() => router.replace(Routes.camera)} />
                <Button label="Buscar manualmente" variant="secondary" fullWidth
                  onPress={() => setStep('search')} />
              </View>
            </View>
          )}

          {step === 'search' && (
            <ProductSearchResults
              onSelect={handleSelectFromSearch}
              onCreateNew={() => setStep('create')}
            />
          )}

          {step === 'create' && (
            <CreateProductForm
              photoUri={photoUri}
              initialBarcode={barcode}
              onCreated={handleProductCreated}
            />
          )}

        </View>
      </ScrollView>

      <Modal visible={showOptions} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <AppText variant="h3" style={styles.popupTitle}>¿Qué querés hacer?</AppText>
            <Button label="Buscar manualmente" variant="primary" fullWidth
              onPress={() => { setShowOptions(false); setStep('search'); }} />
            <Button
              label={source === 'barcode' ? 'Escanear otro código' : 'Tomar otra foto'}
              variant="secondary" fullWidth
              onPress={() => { setShowOptions(false); router.push(Routes.camera); }}
            />
            <Button label="Cancelar" variant="ghost" fullWidth
              onPress={() => setShowOptions(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  collisionContainer: { gap: 12 },
  caveat: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    padding: 12,
    backgroundColor: '#fff8f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffe0b2',
  },
  caveatText: { flex: 1 },
});