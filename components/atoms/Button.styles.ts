import { StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: Radius.md },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },
  primary: { backgroundColor: Colors.primary },
  secondary: { backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.primary },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: Colors.error },
  sm: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md },
  md: { paddingVertical: Spacing.sm + 4, paddingHorizontal: Spacing.lg },
  lg: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
  label: { fontWeight: Typography.weights.semibold },
  label_primary: { color: Colors.white },
  label_secondary: { color: Colors.primary },
  label_ghost: { color: Colors.primary },
  label_danger: { color: Colors.white },
  label_sm: { fontSize: Typography.sizes.sm },
  label_md: { fontSize: Typography.sizes.md },
  label_lg: { fontSize: Typography.sizes.lg },
});
