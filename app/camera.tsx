import { AppText, Button, Spinner } from '@/components/atoms';
import { Routes } from '@/constants/routes';
import { Colors } from '@/constants/theme';
import { productService } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { styles } from './camera.styles';

export default function CameraScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);
  const [detecting, setDetecting] = useState(false);

  async function compressImage(uri: string): Promise<string> {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  }

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.permissionIcon}>
          <Ionicons name="camera-outline" size={40} color={Colors.primary} />
        </View>
        <AppText variant="h3">Permiso de cámara</AppText>
        <AppText variant="body" color="secondary" style={styles.permissionText}>
          Necesitamos acceso a tu cámara para escanear productos
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
    return <Spinner fullScreen message="Analizando producto..." />;
  }

  async function handleCapture() {
    if (!cameraRef.current) return;
    setDetecting(true);
    try {
      const photo = await cameraRef.current.takePhoto();
      const uri = photo.path.startsWith('file://') ? photo.path : `file://${photo.path}`;
      const compressed = await compressImage(uri);
      const results = await productService.detectByImage(compressed);
      console.log('Photo taken:', uri);
      console.log('Detection results:', results);
      router.push({
        pathname: Routes.productConfirm,
        params: { photoUri: uri, results: JSON.stringify(results) },
      });
    } catch (error) {
      console.error('Detection failed:', error);
      setDetecting(false);
    }
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
      />
      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.autoLabel}>
            <Text style={styles.autoLabelText}>Modo manual</Text>
          </View>
        </View>

        <View style={styles.frameContainer}>
          <View style={styles.frame} />
          <Text style={styles.frameHint}>Centrá el producto en el recuadro</Text>
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.captureButton} onPress={handleCapture} activeOpacity={0.85}>
            <View style={styles.captureInner} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}