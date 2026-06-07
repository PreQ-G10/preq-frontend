import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  productZone: {
    backgroundColor: '#fff0f5',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#ffd6e5',
  },
  productIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailZone: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing.md,
    backgroundColor: Colors.gray50,
    gap: Spacing.sm,
  },
  locationBlock: {
    flex: 1,
    gap: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  priceBlock: {
    alignItems: 'flex-end',
    gap: 2,
  },
  price: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
});