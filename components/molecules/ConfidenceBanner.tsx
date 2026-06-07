import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './ConfidenceBanner.styles';

interface ConfidenceBannerProps {
  isConfident: boolean;
  similarity: number;
}

export function ConfidenceBanner({ isConfident, similarity }: ConfidenceBannerProps) {
  const percent = Math.round(similarity * 100);

  return (
    <View testID="confidence-banner" style={[styles.container, isConfident ? styles.confident : styles.notConfident]}>
      <Ionicons
        name={isConfident ? 'checkmark-circle-outline' : 'warning-outline'}
        size={18}
        color={isConfident ? Colors.success : Colors.warning}
      />
      <Text testID="confidence-banner-message" style={[styles.text, isConfident ? styles.textConfident : styles.textNotConfident]}>
        {isConfident
          ? `Alta coincidencia (${percent}%) — probablemente es el mismo producto`
          : `Coincidencia baja (${percent}%) — verificá antes de confirmar`}
      </Text>
    </View>
  );
}