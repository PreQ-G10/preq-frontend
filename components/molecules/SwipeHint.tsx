import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { AppText } from '../atoms';
import { styles } from './SwipeHint.styles';

export function SwipeHint() {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        <Ionicons name="arrow-back" size={14} color={Colors.error} />
        <AppText style={[styles.text, styles.disputeText]}>Disputar</AppText>
      </View>
      <AppText style={styles.divider}>·</AppText>
      <View style={styles.side}>
        <AppText style={[styles.text, styles.confirmText]}>Confirmar</AppText>
        <Ionicons name="arrow-forward" size={14} color={Colors.success} />
      </View>
    </View>
  );
}