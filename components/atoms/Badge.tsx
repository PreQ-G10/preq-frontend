import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './Badge.styles';

type Variant = 'success' | 'warning' | 'error' | 'primary' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: Variant;
}

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return (
    <View style={[styles.base, styles[variant]]}>
      <Text style={[styles.label, styles[`label_${variant}`]]}>{label}</Text>
    </View>
  );
}
