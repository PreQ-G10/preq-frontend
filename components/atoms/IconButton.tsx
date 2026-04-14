import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { styles } from './IconButton.styles';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const iconSizes: Record<Size, number> = { sm: 16, md: 22, lg: 28 };
const containerSizes: Record<Size, number> = { sm: 32, md: 44, lg: 56 };

interface IconButtonProps extends TouchableOpacityProps {
  icon: keyof typeof Ionicons.glyphMap;
  variant?: Variant;
  size?: Size;
}

export function IconButton({ icon, variant = 'ghost', size = 'md', style, ...props }: IconButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], { width: containerSizes[size], height: containerSizes[size] }, style]}
      activeOpacity={0.8}
      {...props}
    >
      <Ionicons name={icon} size={iconSizes[size]} color={variant === 'primary' ? Colors.white : Colors.primary} />
    </TouchableOpacity>
  );
}
