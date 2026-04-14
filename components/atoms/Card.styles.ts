import { StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  base: { backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border },
  elevated: { borderWidth: 0, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  padded: { padding: Spacing.md },
});
