import { StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: { gap: Spacing.xs },
  label: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.text },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.sizes.md,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  inputError: { borderColor: Colors.error },
  error: { fontSize: Typography.sizes.xs, color: Colors.error },
});
