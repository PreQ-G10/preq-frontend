import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.gray50,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  weightedCard: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: '#fff0f5',
    borderWidth: 1,
    borderColor: '#ffd6e5',
    gap: Spacing.xs,
  },
  weightedValue: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.black,
    color: Colors.primary,
    lineHeight: Typography.sizes.xxl * 1.3,
  },
  statValue: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  locationInfo: {
    flex: 1,
    gap: 2,
  },
  locationPrice: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
});
