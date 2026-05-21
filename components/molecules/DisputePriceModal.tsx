import { Button } from '@/components/atoms';
import { PriceInput } from '@/components/molecules';
import { Colors } from '@/constants/theme';
import { PendingValidationResponse } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { AppText } from '../atoms';
import { styles } from './DisputePriceModal.styles';

interface DisputePriceModalProps {
  visible: boolean;
  report: PendingValidationResponse | null;
  onConfirm: (alternativePrice: number) => void;
  onCancel: () => void;
}

function formatPrice(value: number) {
  return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

export function DisputePriceModal({ visible, report, onConfirm, onCancel }: DisputePriceModalProps) {
  const [alternativePrice, setAlternativePrice] = useState('');
  const [error, setError] = useState('');

  function handleConfirm() {
    const parsed = Number(alternativePrice);
    if (!alternativePrice.trim() || isNaN(parsed) || parsed <= 0) {
      setError('Ingresá un precio válido');
      return;
    }
    setError('');
    setAlternativePrice('');
    onConfirm(parsed);
  }

  function handleCancel() {
    setAlternativePrice('');
    setError('');
    onCancel();
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
  }

  if (!report) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleCancel}>
      <View style={styles.container}>
        <View style={styles.header}>
          <AppText variant="h3">Reportar precio incorrecto</AppText>
          <TouchableOpacity onPress={handleCancel}>
            <AppText variant="body" color="primary">Cancelar</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.reportInfo}>
          {/* Product zone */}
          <View style={styles.productZone}>
            <AppText variant="label" color="primary">{report.product.name}</AppText>
            <AppText variant="bodySmall" color="secondary">
              {report.product.brand} · {report.product.quantity} {report.product.quantityType}
            </AppText>
          </View>
          
          {/* Location + price zone */}
          <View style={styles.detailZone}>
            <View>
              <Ionicons name="location-outline" size={13} color={Colors.textMuted}>
                <AppText variant="bodySmall">{report.locationName}</AppText>
              </Ionicons>
              <AppText variant="caption" color="secondary">{report.locationAddress}</AppText>
            </View>
            <View style={styles.currentPrice}>
              <AppText variant="bodySmall" color="secondary">Precio reportado</AppText>
              <AppText variant="body" style={styles.priceText}>{formatPrice(report.price)}</AppText>
            </View>
          </View>
        </View>

        <AppText variant="bodySmall" color="secondary" style={styles.hint}>
          Ingresá el precio correcto que viste en el local
        </AppText>

        <PriceInput
          value={alternativePrice}
          onChangeText={setAlternativePrice}
          error={error}
        />

        <Button
          label="Enviar precio correcto"
          onPress={handleConfirm}
          fullWidth
          style={styles.button}
        />
      </View>
    </Modal>
  );
}