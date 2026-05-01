import { AppText, Button, Spinner } from '@/components/atoms';
import { Routes } from '@/constants/routes';
import { Colors } from '@/constants/theme';
import { locationService, productService } from '@/services/api';
import { setDetectedLocation } from '@/services/maps';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { styles } from './camera.styles';

type CameraMode = 'image' | 'barcode';

export default function CameraScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);
  const detectingRef = useRef(false);
  const [detecting, setDetecting] = useState(false);
<<<<<<< HEAD
  const [scanPaused, setScanPaused] = useState(false);
  const [mode, setMode] = useState<CameraMode>('image');

  async function getLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;
    return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  }
=======
  const isFocused = useIsFocused();
>>>>>>> 40af531 (Fixed camera, automatic location detection and minimaps compatibilities with android)

  async function compressImage(uri: string): Promise<string> {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    console.log("Compressing:", uri);
    return result.uri;
  }

  // ── Barcode mode ──────────────────────────────────────────────────────────

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && !detectingRef.current && !scanPaused) {
        const code = codes[0].value;
        if (code && code.length > 0) handleBarcodeDetected(code);
      }
    },
  });

  async function handleBarcodeDetected(code: string) {
    if (detectingRef.current) return;
    detectingRef.current = true;
    setScanPaused(true);
    setDetecting(true);
    try {
      const [result, pos] = await Promise.all([
        productService.detectByBarcode(code),
        getLocation(),
      ]);

      const locationResult = pos
        ? await locationService.detectNearby(pos.coords.latitude, pos.coords.longitude)
        : null;
      setDetectedLocation(locationResult);

      if (result.status === 'NOT_FOUND' || result.status === 'INCOMPLETE_DATA') {
        router.push({
          pathname: Routes.productConfirm,
          params: { 
            source: 'barcode', 
            barcodeStatus: result.status,
            barcode: code,
          },
        });
        return;
      }

      router.push({
        pathname: Routes.productConfirm,
        params: {
          source: 'barcode',
          barcodeStatus: result.status,
          barcode: code,
          results: JSON.stringify(
            result.status === 'COLLISION'
              ? [result.existingProduct]
              : [result.product]
          ),
        },
      });
    } catch (error) {
      console.error('Barcode detection failed:', error);
    } finally {
      detectingRef.current = false;
      setScanPaused(false);
      setDetecting(false);
    }
  }

  // ── Image mode ────────────────────────────────────────────────────────────

  async function handleCapture() {
    if (!cameraRef.current || !isFocused || detectingRef.current) return;
    detectingRef.current = true;
    setDetecting(true);
    try {
      const photo = await cameraRef.current.takePhoto();
      const uri = photo.path.startsWith('file://') ? photo.path : `file://${photo.path}`;
      const compressed = await compressImage(uri);

      const [results, locationResult] = await Promise.all([
        productService.detectByImage(compressed),
        getLocation().then(pos =>
          pos ? locationService.detectNearby(pos.coords.latitude, pos.coords.longitude) : null
        ),
      ]);

      setDetectedLocation(locationResult);
      router.push({
        pathname: Routes.productConfirm,
        params: { photoUri: uri, results: JSON.stringify(results), source: 'image' },
      });
    } catch (error) {
      console.error('Detection failed:', error);
    } finally {
      detectingRef.current = false;
      setDetecting(false);
    }
  }

  // ── Mode switch ───────────────────────────────────────────────────────────

  function handleModeSwitch(newMode: CameraMode) {
    if (detectingRef.current) return;
    detectingRef.current = false;
    setScanPaused(false);
    setMode(newMode);
  }

  // ── Guards ────────────────────────────────────────────────────────────────

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

  if (!device) return <Spinner fullScreen message="Iniciando cámara..." />;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
<<<<<<< HEAD
        isActive={!scanPaused}
        photo={mode === 'image'}
        codeScanner={mode === 'barcode' && !scanPaused ? codeScanner : undefined}
=======
        isActive={isFocused}
        photo={true}
>>>>>>> 40af531 (Fixed camera, automatic location detection and minimaps compatibilities with android)
      />
      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push(Routes.home)}>
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>

          <View style={styles.toggle}>
            <TouchableOpacity
              style={[styles.toggleOption, mode === 'image' && styles.toggleActive]}
              onPress={() => handleModeSwitch('image')}
            >
              <Ionicons name="camera-outline" size={16} color={mode === 'image' ? Colors.primary : Colors.white} />
              <Text style={[styles.toggleText, mode === 'image' && styles.toggleTextActive]}>
                Foto
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleOption, mode === 'barcode' && styles.toggleActive]}
              onPress={() => handleModeSwitch('barcode')}
            >
              <Ionicons name="barcode-outline" size={16} color={mode === 'barcode' ? Colors.primary : Colors.white} />
              <Text style={[styles.toggleText, mode === 'barcode' && styles.toggleTextActive]}>
                Código
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.frameContainer}>
          <View style={[styles.frame, mode === 'barcode' && styles.barcodeFrame]} />
          <Text style={styles.frameHint}>
            {mode === 'image'
              ? 'Centrá el producto en el recuadro'
              : 'Centrá el código de barras en el recuadro'}
          </Text>
        </View>

        <View style={styles.bottomBar}>
          {mode === 'image' && (
            <TouchableOpacity style={styles.captureButton} onPress={handleCapture} activeOpacity={0.85}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {detecting && (
      <View style={styles.loadingOverlay}>
        <Spinner fullScreen message="Analizando producto..." />
      </View>
      )}
    </View>
  );
  
}

