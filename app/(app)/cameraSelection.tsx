import { AppText, Button } from '@/components/atoms';
import { Routes } from '@/constants/routes';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { styles } from './cameraSelection.styles';

export default function CameraSelectionScreen() {
  const handleImageRecognitionPress = () => {
    router.push(Routes.camera);
  };

  const handleBarcodeDetectionPress = () => {
    router.push(Routes.barcodeCamera);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <AppText variant="h3">Escanear producto</AppText>
      </View>

      <View style={styles.content}>
        <AppText variant="bodySmall" color="secondary" style={styles.description}>
          Selecciona cómo quieres identificar el producto
        </AppText>

        <View style={styles.optionsContainer}>
          <Button
            label="Identificar por Imagen"
            onPress={handleImageRecognitionPress}
            fullWidth
          />
          <Button
            label="Escanear Código de Barras"
            variant="secondary"
            onPress={handleBarcodeDetectionPress}
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
}