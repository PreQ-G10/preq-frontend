import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AppText } from './AppText';
import { Colors } from '@/constants/theme';
import { styles } from './Spinner.styles';

interface SpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export function Spinner({ message, size = 'large', fullScreen = false }: SpinnerProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={Colors.primary} />
      {message && <AppText variant="body" color="secondary" style={styles.message}>{message}</AppText>}
    </View>
  );
}
