import { StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  focused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.sm + 4,
    fontSize: Typography.sizes.md,
    color: Colors.text,
  },
  clearButton: {
    padding: Spacing.xs,
  },
});
