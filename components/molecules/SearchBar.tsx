import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './SearchBar.styles';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  onClear?: () => void;
  hasResults?: boolean;
}

export function SearchBar({ value, onChangeText, placeholder = 'Buscar producto...', onSubmit, onClear, hasResults }: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[
        styles.container,
        focused && styles.focused,
        hasResults && styles.hasResults,
      ]}
    >
      <Ionicons name="search-outline" size={20} color={focused ? Colors.primary : Colors.gray400} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={() => { onChangeText(''); onClear?.(); }}>
          <Ionicons name="close-circle" size={18} color={Colors.gray400} />
        </TouchableOpacity>
      )}
    </View>
  );
}
