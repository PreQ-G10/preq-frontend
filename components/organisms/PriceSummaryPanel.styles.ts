import { StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

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
  statValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  weightedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: '#fff0f5',
    borderWidth: 1,
    borderColor: '#ffd6e5',
  },
  weightedValue: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.black,
    color: Colors.primary,
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
