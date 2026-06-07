import React from 'react';
import { View } from 'react-native';
import { AppText } from './AppText';
import { styles } from './Divider.styles';

interface DividerProps {
  label?: string;
}

export function Divider({ label }: DividerProps) {
  if (!label) return <View testID="divider-line" style={styles.line} />;

  return (
    <View testID="divider-with-label" style={styles.withLabel}>
      <View style={styles.flex} />
      <AppText variant="caption" color="muted" style={styles.text}>{label}</AppText>
      <View style={styles.flex} />
    </View>
  );
}