import { StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: Radius.md,
    backgroundColor: Colors.gray100,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: Radius.md,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: Spacing.xs,
  },
  name: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  brand: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  quantity: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
});
