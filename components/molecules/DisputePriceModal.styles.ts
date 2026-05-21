import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reportInfo: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  currentPrice: {
    alignItems: 'flex-end',
    gap: 3,
  },
  priceText: {
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  hint: {
    marginTop: -Spacing.sm,
  },
  button: {
    marginTop: Spacing.sm,
  },
  productZone: {
    backgroundColor: '#fff0f5',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#ffd6e5',
    gap: 3,
  },
  detailZone: {
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
});