import { AppText, Button } from '@/components/atoms';
import { Colors } from '@/constants/theme';
import { productImageService } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { styles } from './DisputeImageModal.styles';

function SuccessScreen() {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 12,
        stiffness: 180,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.successSheet, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.successIconWrapper}>
        <Ionicons name="checkmark-circle" size={48} color={Colors.success} />
      </View>
      <AppText variant="h3" style={styles.successTitle}>¡Gracias!</AppText>
      <AppText variant="bodySmall" color="secondary" style={styles.successSubtitle}>
        Tu reporte fue enviado. Revisaremos la imagen a la brevedad.
      </AppText>
    </Animated.View>
  );
}

function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <View style={styles.errorBanner}>
      <Ionicons name="alert-circle-outline" size={18} color={Colors.error} />
      <AppText variant="bodySmall" style={styles.errorBannerText}>{message}</AppText>
    </View>
  );
}

interface DisputeImageModalProps {
  visible: boolean;
  imageId: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DisputeImageModal({ visible, imageId, onClose, onSuccess }: DisputeImageModalProps) {
  const [step, setStep] = useState<'confirm' | 'success'>('confirm');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const autoCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      setStep('confirm');
      setErrorMessage(null);
    }
    return () => {
      if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
    };
  }, [visible]);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const result = await productImageService.disputeImage(imageId);
      if (result.status === 'ALREADY_DISPUTED') {
        setErrorMessage('Ya reportaste esta imagen anteriormente.');
        return;
      }
      setStep('success');
      autoCloseTimer.current = setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 2000);
    } catch {
      setErrorMessage('No se pudo enviar el reporte. Intentalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>

              {step === 'success' && <SuccessScreen />}

              {step === 'confirm' && (
                <>
                  <View style={styles.header}>
                    <AppText variant="h3">Reportar imagen</AppText>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                      <Ionicons name="close" size={22} color={Colors.gray300} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.iconWrapper}>
                    <Ionicons name="flag-outline" size={40} color={Colors.warning} />
                  </View>

                  <AppText variant="body" color="secondary" style={styles.description}>
                    ¿Querés reportar esta imagen como incorrecta o inapropiada?
                  </AppText>

                  <ErrorBanner message={errorMessage} />

                  <View style={styles.actions}>
                    <Button
                      label="Sí, reportar"
                      variant="primary"
                      onPress={handleConfirm}
                      loading={isSubmitting}
                    />
                    <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                      <AppText variant="label" color="muted">Cancelar</AppText>
                    </TouchableOpacity>
                  </View>
                </>
              )}

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}