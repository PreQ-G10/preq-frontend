import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { styles } from './Chip.styles';

interface ChipProps extends TouchableOpacityProps {
  label: string;
  selected?: boolean;
}

export function Chip({ label, selected = false, style, ...props }: ChipProps) {
  return (
    <TouchableOpacity style={[styles.base, selected ? styles.selected : styles.unselected, style]} activeOpacity={0.8} {...props}>
      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelUnselected]}>{label}</Text>
    </TouchableOpacity>
  );
}
