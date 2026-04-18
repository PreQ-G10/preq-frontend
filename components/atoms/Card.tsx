import React from 'react';
import { View, ViewProps } from 'react-native';
import { styles } from './Card.styles';

interface CardProps extends ViewProps {
  elevated?: boolean;
  padded?: boolean;
}

export function Card({ elevated = false, padded = true, style, children, ...props }: CardProps) {
  return (
    <View style={[styles.base, elevated && styles.elevated, padded && styles.padded, style]} {...props}>
      {children}
    </View>
  );
}
