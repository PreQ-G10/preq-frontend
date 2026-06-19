import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  productName: {
    marginBottom: Spacing.xs,
  },
  productMeta: {
    marginBottom: Spacing.lg,
  },
  priceLabel: {
    marginBottom: Spacing.xs,
    color: Colors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    fontSize: Typography.sizes.md,
    color: Colors.text,
    backgroundColor: Colors.background,
    marginBottom: Spacing.sm,
  },
  error: {
    marginBottom: Spacing.sm,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  cancelButton: {
    alignItems: 'center',
    padding: Spacing.sm,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    textAlign: 'center',
  },
});