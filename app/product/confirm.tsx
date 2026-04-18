import { AppText, Button } from '@/components/atoms';
import { CreateProductForm, ProductDetectionResult, ProductSearchResults } from '@/components/organisms';
import { Routes } from '@/constants/routes';
import { Colors } from '@/constants/theme';
import { productService } from '@/services/api';
import { Product, ProductDetectionResponse } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { styles } from './confirm.styles';

type Step = 'detection' | 'search' | 'create';

export default function ProductConfirmScreen() {
  const { photoUri, results: resultsParam } = useLocalSearchParams<{ photoUri: string; results: string }>();
  const results: ProductDetectionResponse[] = resultsParam ? JSON.parse(resultsParam) : [];
  const [step, setStep] = useState<Step>('detection');
  const [showOptions, setShowOptions] = useState(false);

  const titles: Record<Step, string> = {
    detection: '¿Reconocés este producto?',
    search: 'Buscá el producto',
    create: 'Crear nuevo producto',
  };

  async function handleConfirm(product: ProductDetectionResponse) {
    if (photoUri) {
      await productService.confirmImage(product.productId, photoUri, product.similarity);
    }
    router.push({ pathname: Routes.priceCollaborate, params: { productId: product.productId } });
  }

  async function handleSelectFromSearch(product: Product) {
    router.push({ pathname: Routes.priceCollaborate, params: { productId: product.id } });
  }

  function handleProductCreated(product: Product) {
    router.push({ pathname: Routes.priceCollaborate, params: { productId: product.id } });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step === 'detection' ? router.push(Routes.home) : setStep('detection')}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <AppText variant="h3">{titles[step]}</AppText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {step === 'detection' && (
            <ProductDetectionResult
              results={results}
              onConfirm={handleConfirm}
              onReject={() => setShowOptions(true)}
            />
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
              onCreated={handleProductCreated}
            />
          )}
        </View>
      </ScrollView>
      <Modal visible={showOptions} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <AppText variant="h3" style={styles.popupTitle}>¿Qué querés hacer?</AppText>
            <Button
              label="Buscar manualmente"
              variant="primary"
              fullWidth
              onPress={() => { setShowOptions(false); setStep('search'); }}
            />
            <Button
              label="Tomar otra foto"
              variant="secondary"
              fullWidth
              onPress={() => { setShowOptions(false); router.push(Routes.camera); }}
            />
            <Button
              label="Cancelar"
              variant="ghost"
              fullWidth
              onPress={() => setShowOptions(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
