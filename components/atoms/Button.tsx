import { Colors } from '@/constants/theme';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { styles } from './Button.styles';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      testID="button"
      style={[styles.base, styles[variant], styles[size], fullWidth && styles.fullWidth, (disabled || loading) && styles.disabled, style]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading
        ? <ActivityIndicator testID="button-spinner" color={variant === 'primary' ? Colors.white : Colors.primary} size="small" />
        : <Text testID="button-label">{label}</Text>
      }
    </TouchableOpacity>
  );
}