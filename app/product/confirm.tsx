import React, { useState } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/atoms';
import { ProductDetectionResult, ProductSearchResults, CreateProductForm } from '@/components/organisms';
import { Colors } from '@/constants/theme';
import { Routes } from '@/constants/routes';
import { productService } from '@/services/api';
import { Product, ProductDetectionResponse } from '@/types';
import { styles } from './confirm.styles';

type Step = 'detection' | 'search' | 'create';

export default function ProductConfirmScreen() {
  const { photoUri, results: resultsParam } = useLocalSearchParams<{ photoUri: string; results: string }>();
  const results: ProductDetectionResponse[] = resultsParam ? JSON.parse(resultsParam) : [];
  const [step, setStep] = useState<Step>('detection');

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

  function handleSelectFromSearch(product: Product) {
    router.push({ pathname: Routes.priceCollaborate, params: { productId: product.id } });
  }

  function handleProductCreated(product: Product) {
    router.push({ pathname: Routes.priceCollaborate, params: { productId: product.id } });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step === 'detection' ? router.back() : setStep('detection')}>
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
              onReject={() => setStep('search')}
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
    </SafeAreaView>
  );
}
