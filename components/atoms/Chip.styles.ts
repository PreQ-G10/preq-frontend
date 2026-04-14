import { StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export const styles = StyleSheet.create({
  base: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md, borderRadius: Radius.full, borderWidth: 1.5 },
  selected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  unselected: { backgroundColor: Colors.white, borderColor: Colors.border },
  label: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.medium },
  labelSelected: { color: Colors.white },
  labelUnselected: { color: Colors.textSecondary },
});
