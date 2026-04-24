import { AppText, Button, Spinner } from '@/components/atoms';
import { Routes } from '@/constants/routes';
import { Colors } from '@/constants/theme';
import { productService } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { styles } from './camera.styles';

export default function BarcodeCameraScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const [hasDetected, setHasDetected] = useState(false);
  const [detecting, setDetecting] = useState(false);

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && !hasDetected) {
        const detectedCode = codes[0].value;
        if (detectedCode) {
          handleBarcodeDetected(detectedCode);
        }
      }
    },
  });

  const handleBarcodeDetected = async (code: string) => {
    setHasDetected(true);
    setDetecting(true);
    try {
      const result = await productService.detectByBarcode(code);
      router.replace({
        pathname: Routes.productConfirm,
        params: { results: JSON.stringify([result]), source: 'barcode' },
      });
    } catch (error) {
      router.replace({
        pathname: Routes.productConfirm
      });
      console.error('Barcode detection failed:', error);
      setDetecting(false);
      setHasDetected(false);
    }
  };

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.permissionIcon}>
          <Ionicons name="camera-outline" size={40} color={Colors.primary} />
        </View>
        <AppText variant="h3">Permiso de cámara</AppText>
        <AppText variant="body" color="secondary" style={styles.permissionText}>
          Necesitamos acceso a tu cámara para escanear códigos de barras
        </AppText>
        <Button label="Dar permiso" onPress={requestPermission} fullWidth />
        <Button label="Volver" variant="ghost" onPress={() => router.back()} fullWidth />
      </SafeAreaView>
    );
  }

  if (!device) {
    return <Spinner fullScreen message="Iniciando cámara..." />;
  }

  if (detecting) {
    return <Spinner fullScreen message="Identificando producto..." />;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />

        <View style={styles.overlay}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.autoLabel}>
            <Text style={styles.autoLabelText}>Escanear Código de Barras</Text>
          </View>
        </View>

        <View style={styles.frameContainer}>
          <View style={styles.frame} />
          <Text style={styles.frameHint}>Centrá el código de barras en el recuadro</Text>
        </View>

        <View style={styles.bottomBar} />
      </View>
    </View>
  );
}