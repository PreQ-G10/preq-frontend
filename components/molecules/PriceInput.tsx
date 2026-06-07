import { Colors } from '@/constants/theme';
import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { styles } from './PriceInput.styles';

interface PriceInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  currency?: string;
  error?: string;
}

export function PriceInput({ value, onChangeText, label = 'Precio', currency = '$', error }: PriceInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputRow, focused && styles.inputRowFocused]}>
        <Text style={styles.currency}>{currency}</Text>
        <TextInput
          testID="price-input-field"
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={Colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {error && <Text testID="price-input-error" style={styles.error}>{error}</Text>}
    </View>
  );
}