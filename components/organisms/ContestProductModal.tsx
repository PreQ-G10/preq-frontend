import { AppText, Button } from '@/components/atoms';
import { Colors } from '@/constants/theme';
import { productService } from '@/services/api';
import { FieldContestStatus, FieldType, Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { styles } from './ContestProductModal.styles';

type ModalStep = 1 | 2 | 'success';

interface FieldConfig {
  key: FieldType;
  label: string;
  keyboard: 'default' | 'numeric';
  icon: string;
  getValue: (p: Product) => string;
}

const FIELDS: FieldConfig[] = [
  { key: 'NAME',          label: 'Nombre',           keyboard: 'default', icon: 'text-outline',    getValue: (p) => p.name ?? '' },
  { key: 'BRAND',         label: 'Marca',            keyboard: 'default', icon: 'ribbon-outline',  getValue: (p) => p.brand ?? '' },
  { key: 'QUANTITY',      label: 'Cantidad',         keyboard: 'numeric', icon: 'scale-outline',   getValue: (p) => p.quantity?.toString() ?? '' },
  { key: 'QUANTITY_TYPE', label: 'Unidad',           keyboard: 'default', icon: 'cube-outline',    getValue: (p) => p.quantityType ?? '' },
  { key: 'BARCODE',       label: 'Código de barras', keyboard: 'numeric', icon: 'barcode-outline', getValue: (p) => p.barcode?.toString() ?? '' },
];

function StepIndicator({ step }: { step: ModalStep }) {
  const step1Done = step === 2 || step === 'success';
  const step2Active = step === 2 || step === 'success';

  return (
    <>
      <View style={styles.stepIndicatorRow}>
        <View style={[styles.stepBubble, styles.stepBubbleActive]}>
          {step1Done
            ? <Ionicons name="checkmark" size={14} color={Colors.white} />
            : <AppText variant="caption" color="white" style={{ fontWeight: '700' }}>1</AppText>
          }
        </View>
        <View style={[styles.stepConnector, step1Done ? styles.stepConnectorActive : styles.stepConnectorInactive]} />
        <View style={[styles.stepBubble, step2Active ? styles.stepBubbleActive : styles.stepBubbleInactive]}>
          {step === 'success'
            ? <Ionicons name="checkmark" size={14} color={Colors.white} />
            : <AppText variant="caption" color="white" style={{ fontWeight: '700' }}>2</AppText>
          }
        </View>
      </View>
      <View style={styles.stepLabelsRow}>
        <AppText variant="caption" color={step === 1 ? 'primary' : 'muted'}>Seleccioná los campos</AppText>
        <AppText variant="caption" color={step2Active ? 'primary' : 'muted'}>Corregí los valores</AppText>
      </View>
    </>
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
        Tus correcciones fueron enviadas para revisión.
      </AppText>
    </Animated.View>
  );
}

interface ContestProductModalProps {
  visible: boolean;
  product: Product;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ContestProductModal({ visible, product, onClose, onSuccess }: ContestProductModalProps) {
  const [step, setStep] = useState<ModalStep>(1);
  const [selectedKeys, setSelectedKeys] = useState<Set<FieldType>>(new Set());
  const [editValues, setEditValues] = useState<Partial<Record<FieldType, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const autoCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset on open; cleanup timers on unmount
  useEffect(() => {
    if (visible) {
      setStep(1);
      setSelectedKeys(new Set());
      setEditValues({});
      setErrorMessage(null);
    }
    return () => {
      if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
    };
  }, [visible]);

  // Pre-fill edit values for newly selected fields
  useEffect(() => {
    setEditValues((prev) => {
      const next = { ...prev };
      selectedKeys.forEach((key) => {
        if (next[key] === undefined) {
          const field = FIELDS.find((f) => f.key === key);
          if (field) next[key] = field.getValue(product);
        }
      });
      return next;
    });
  }, [selectedKeys, product]);

  const toggleField = (key: FieldType) => {
    setErrorMessage(null);
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handleNext = () => {
    if (selectedKeys.size === 0) {
      setErrorMessage('Seleccioná al menos un campo para corregir.');
      return;
    }
    setErrorMessage(null);
    setStep(2);
  };

  const handleBack = () => {
    setErrorMessage(null);
    setStep(1);
  };

  const handleSubmit = async () => {
      const originals: Record<FieldType, string> = {
        NAME:          product.name ?? '',
        BRAND:         product.brand ?? '',
        QUANTITY:      product.quantity?.toString() ?? '',
        QUANTITY_TYPE: product.quantityType ?? '',
        BARCODE:       product.barcode ?? '',
      };

      // Validate and collect changed fields
      for (const key of Array.from(selectedKeys)) {
        const val = editValues[key]?.trim();
        if (!val) {
          setErrorMessage(`El campo "${FIELDS.find(f => f.key === key)?.label}" no puede estar vacío.`);
          return;
        }
        if (key === 'QUANTITY' && isNaN(parseFloat(val))) {
          setErrorMessage('La cantidad debe ser un número válido.');
          return;
        }
      }

      const fieldsToSubmit = Array.from(selectedKeys).filter((key) => {
        const val = editValues[key]!.trim();
        return val !== originals[key];
      });

      if (fieldsToSubmit.length === 0) {
        setErrorMessage('Los valores ingresados son iguales a los actuales.');
        return;
      }

      Keyboard.dismiss();
      setIsSubmitting(true);

      try {
        const results = await Promise.allSettled(
          fieldsToSubmit.map((key) =>
              productService.contestProductField(product.id, {
                fieldType: key as FieldType,
                fieldValue: editValues[key]!.trim(),
              }
            )
          )
        );

        const failed = results.filter((r) => r.status === 'rejected');
        failed.forEach((r) => console.error('Error submitting field contest:', r.reason));
        const succeeded = results.filter(
          (r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled'
        );
        const allAlreadySubmitted =
          succeeded.length > 0 &&
          succeeded.every((r) => r.value === 'ALREADY_SUBMITTED');

        if (allAlreadySubmitted) {
          setErrorMessage('Ya enviaste correcciones para estos campos recientemente.');
          return;
        }
        if (failed.length > 0 && succeeded.length === 0) {
          setErrorMessage('No se pudo enviar el reporte. Intentalo de nuevo.');
          return;
        }
        if (failed.length > 0) {
          // Some went through, some didn't — still show success but warn
          setErrorMessage(`${failed.length} campo(s) no pudieron enviarse.`);
        }

        setStep('success');
        autoCloseTimer.current = setTimeout(() => {
          onClose();
          onSuccess?.();
        }, 2000);
      } finally {
        setIsSubmitting(false);
      }
    };

  const selectedFields = FIELDS.filter(({ key }) => selectedKeys.has(key));

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, justifyContent: 'center' }}>

            {/* ── Success screen (replaces all content) ── */}
            {step === 'success' && <SuccessScreen />}

            {/* ── Normal sheet ── */}
            {step !== 'success' && (
              <TouchableWithoutFeedback>
                <View style={styles.sheet}>

                  {/* Header */}
                  <View style={styles.header}>
                    <AppText variant="h3">Corregir información</AppText>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                      <Ionicons name="close" size={22} color={Colors.gray300} />
                    </TouchableOpacity>
                  </View>

                  {/* Step indicator */}
                  <StepIndicator step={step} />

                  {/* Error banner */}
                  <ErrorBanner message={errorMessage} />

                  {/* ── Step 1: Select fields ── */}
                  {step === 1 && (
                    <>
                      <AppText variant="bodySmall" color="secondary" style={styles.subtitle}>
                        ¿Qué información está incorrecta?
                      </AppText>

                      <ScrollView style={styles.fieldList} showsVerticalScrollIndicator={false}>
                        {FIELDS.map(({ key, label, icon, getValue }) => {
                          const isSelected = selectedKeys.has(key);
                          const currentValue = getValue(product);
                          return (
                            <TouchableOpacity
                              key={key}
                              onPress={() => toggleField(key)}
                              activeOpacity={0.7}
                              style={[
                                styles.fieldRow,
                                isSelected ? styles.fieldRowSelected : styles.fieldRowUnselected,
                              ]}
                            >
                              <Ionicons
                                name={icon as any}
                                size={18}
                                color={isSelected ? Colors.primary : Colors.gray300}
                              />
                              <View style={styles.fieldTextGroup}>
                                <AppText variant="label" color={isSelected ? 'primary' : 'secondary'}>
                                  {label}
                                </AppText>
                                <AppText
                                  variant="caption"
                                  color="muted"
                                  numberOfLines={1}
                                  style={styles.fieldCurrentValue}
                                >
                                  {currentValue || 'Sin valor'}
                                </AppText>
                              </View>
                              <View style={[styles.checkbox, isSelected ? styles.checkboxSelected : styles.checkboxUnselected]}>
                                {isSelected && <Ionicons name="checkmark" size={13} color={Colors.white} />}
                              </View>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>

                      <View style={styles.actions}>
                        <Button
                          label={selectedKeys.size > 0 ? `Siguiente (${selectedKeys.size})` : 'Siguiente'}
                          onPress={handleNext}
                        />
                        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                          <AppText variant="label" color="muted">Cancelar</AppText>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}

                  {/* ── Step 2: Edit selected fields ── */}
                  {step === 2 && (
                    <>
                      <AppText variant="bodySmall" color="secondary" style={styles.subtitle}>
                        Ingresá los valores correctos.
                      </AppText>

                      <ScrollView
                        style={styles.editList}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                      >
                        {selectedFields.map(({ key, label, keyboard }, index) => (
                          <View key={key} style={styles.inputGroup}>
                            <AppText variant="label" style={styles.inputLabel}>{label}</AppText>
                            <TextInput
                              style={styles.textInput}
                              value={editValues[key] ?? ''}
                              onChangeText={(val) => {
                                setErrorMessage(null);
                                setEditValues((prev) => ({ ...prev, [key]: val }));
                              }}
                              keyboardType={keyboard}
                              autoFocus={index === 0}
                              placeholderTextColor={Colors.gray300}
                              placeholder={`Valor correcto para ${label.toLowerCase()}`}
                              returnKeyType={index === selectedFields.length - 1 ? 'done' : 'next'}
                              onSubmitEditing={index === selectedFields.length - 1 ? handleSubmit : undefined}
                              blurOnSubmit={index === selectedFields.length - 1}
                            />
                          </View>
                        ))}
                      </ScrollView>

                      <View style={styles.actions}>
                        <Button
                          label="Enviar correcciones"
                          onPress={handleSubmit}
                          loading={isSubmitting}
                        />
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                          <AppText variant="label" color="muted">← Volver a selección</AppText>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}

                </View>
              </TouchableWithoutFeedback>
            )}

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function withTimeout(arg0: Promise<FieldContestStatus>): any {
    throw new Error('Function not implemented.');
}
