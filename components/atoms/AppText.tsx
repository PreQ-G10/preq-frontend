import React from 'react';
import { Text, TextProps } from 'react-native';
import { styles } from './AppText.styles';

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'caption' | 'label';
type Color = 'default' | 'secondary' | 'muted' | 'primary' | 'white' | 'success' | 'error';

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: Color;
}

export function AppText({ variant = 'body', color = 'default', style, ...props }: AppTextProps) {
  return <Text style={[styles[variant], styles[`color_${color}`], style]} {...props} />;
}
