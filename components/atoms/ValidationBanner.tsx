import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AppText } from '../atoms';
import { styles } from './ValidationBanner.styles';


interface ValidationBannerProps {
  count: number;
  onPress: () => void;
}

export function ValidationBanner({ count, onPress }: ValidationBannerProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle-outline" size={22} color={Colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <AppText variant="label" color="primary">Precios para validar</AppText>
        <AppText variant="bodySmall" color="secondary">
          {count === 1
            ? 'Hay 1 precio cerca tuyo que necesita validación'
            : `Hay ${count} precios cerca tuyo que necesitan validación`}
        </AppText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
    </TouchableOpacity>
  );
}