import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    fontSize: Typography.sizes.md,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  inputLocked: {
    color: Colors.textSecondary,
    backgroundColor: Colors.gray200,
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
  searchContainer: {
    marginBottom: Spacing.xs,
  },
  suggestionList: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
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
  resultsContainer: {
    marginBottom: Spacing.sm,
  },
  resultsTitle: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.xs,
  },
  nearbyList: {
    maxHeight: 180,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.sm,
  },
  nearbyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  nearbyName: {
    color: Colors.text,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  nearbyAddress: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.sm,
  },
  nearbyChevron: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.xl,
    marginLeft: Spacing.sm,
  },
  emptyState: {
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    alignItems: 'center',
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  emptyStateText: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
  },
  createButton: {
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Radius.sm,
    marginBottom: Spacing.sm,
  },
  createButtonText: {
    color: Colors.primary,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  formSectionTitle: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  lockedFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  editButton: {
    padding: Spacing.sm,
  },
  editIcon: {
    fontSize: Typography.sizes.md,
  },
});