import { Colors, Spacing } from '@/constants/theme';
import { productService } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import React, { useRef, useState } from 'react';
import { Image, Modal, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { AppText, Button, Spinner } from '../atoms';
import { styles } from './ProductCameraModal.styles';

interface ProductCameraModalProps {
  visible: boolean;
  productId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductCameraModal({ visible, productId, onClose, onSuccess }: ProductCameraModalProps) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);

  function resetState() {
    setCapturedPhotoUri(null);
    setIsCameraActive(true);
  }

  function handleClose() {
    resetState();
    onClose();
  }

  async function compressImage(uri: string): Promise<string> {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1024 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  }

  async function handleCapture() {
    if (!cameraRef.current || isUploading) return;
    
    try {
      const photo = await cameraRef.current.takePhoto();
      setIsCameraActive(false);
      const uri = photo.path.startsWith('file://') ? photo.path : `file://${photo.path}`;
      setCapturedPhotoUri(uri);
    } catch (error) {
      console.error('Capture failed:', error);
    }
  }

  async function handleConfirm() {
    if (!capturedPhotoUri) return;
    setIsUploading(true);
    try {
      const compressed = await compressImage(capturedPhotoUri);
      await productService.uploadImage(productId, compressed);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Confirm image failed:', error);
    } finally {
      setIsUploading(false);
    }
  }

  if (!hasPermission) {
    return (
      <Modal visible={visible} animationType="slide">
        <SafeAreaView style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color={Colors.primary} />
          <AppText variant="h3">Permiso necesario</AppText>
          <AppText variant="body" color="secondary" style={styles.textCenter}>
            Necesitamos acceso a la cámara para tomar fotos del producto.
          </AppText>
          <Button label="Dar permiso" onPress={requestPermission} fullWidth />
          <Button label="Cerrar" variant="ghost" onPress={onClose} fullWidth />
        </SafeAreaView>
      </Modal>
    );
  }

  if (!device) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.container}>
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={visible && isCameraActive}
          photo={true}
        />
        {capturedPhotoUri && (
          <Image source={{ uri: capturedPhotoUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        )}
        
        <SafeAreaView style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={Colors.white} />
            </TouchableOpacity>
            <AppText variant="label" color="white">Subir foto del producto</AppText>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.bottomBar}>
            {!capturedPhotoUri ? (
              <TouchableOpacity 
                style={styles.captureButton} 
                onPress={handleCapture}
                disabled={isUploading}
              >
                <View style={styles.captureInner} />
              </TouchableOpacity>
            ) : (
              <View style={{ flexDirection: 'row', gap: Spacing.md, paddingHorizontal: Spacing.lg, width: '100%' }}>
                <Button label="Repetir" variant="ghost" onPress={resetState} style={{ flex: 1 }} />
                <Button label="Usar foto" variant="primary" onPress={handleConfirm} loading={isUploading} style={{ flex: 1 }} />
              </View>
            )}
          </View>
        </SafeAreaView>

        {isUploading && (
          <View style={styles.loading}>
            <Spinner message="Subiendo foto..." />
          </View>
        )}
      </View>
    </Modal>
  );
}
