import { Colors } from '@/constants/theme';
import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { styles } from './Input.styles';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text testID="input-label" style={styles.label}>{label}</Text>}
      <TextInput
        testID="input-field"
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={Colors.textMuted}
        {...props}
      />
      {error && <Text testID="input-error" style={styles.error}>{error}</Text>}
    </View>
  );
}