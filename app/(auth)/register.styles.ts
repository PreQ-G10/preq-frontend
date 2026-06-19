import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    padding: Spacing.lg,
    paddingTop: Spacing.xxl * 4,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xl,
    textAlign: 'center',
    color: Colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    fontSize: Typography.sizes.md,
    color: Colors.text,
    backgroundColor: Colors.surface,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  buttonText: {
    color: Colors.white,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  error: {
    color: Colors.error,
    marginBottom: Spacing.sm,
    fontSize: Typography.sizes.sm,
  },
  link: {
    textAlign: 'center',
    color: Colors.primary,
    fontSize: Typography.sizes.md,
  },
  tabRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: 0,
  },
  tab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderTopLeftRadius: Radius.sm,
    borderTopRightRadius: Radius.sm,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.gray400,
    backgroundColor: Colors.background,
    zIndex: 1,
  },
  tabActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
    zIndex: 2, 
  },
  tabText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.text,
    fontWeight: Typography.weights.semibold,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderTopLeftRadius: 0,
    borderTopRightRadius: Radius.sm,
    borderBottomLeftRadius: Radius.sm,
    borderBottomRightRadius: Radius.sm,
    padding: Spacing.lg,
    zIndex: 1,
    marginTop: -1,
  },
  suggestionList: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  suggestionItem: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  suggestionMain: {
    color: Colors.text,
    fontSize: Typography.sizes.md,
  },
  suggestionSecondary: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.sm,
  },
});