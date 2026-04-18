import { AppText } from '@/components/atoms';
import { PriceCollaborationForm } from '@/components/organisms';
import { Routes } from '@/constants/routes';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { styles } from './collaborate.styles';

export default function PriceCollaborateScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();

  function handleDone() {
    router.push(Routes.priceDetails(Number(productId)));
  }

  function handleSkip() {
    router.push(Routes.priceDetails(Number(productId)));
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <AppText variant="h3">Colaborar con el precio</AppText>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppText variant="body" color="secondary" style={styles.subtitle}>
          Tu aporte ayuda a otros usuarios a comparar precios en tiempo real
        </AppText>
        <PriceCollaborationForm
          productId={Number(productId)}
          onDone={handleDone}
          onSkip={handleSkip}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
