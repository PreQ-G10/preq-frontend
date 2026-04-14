import { StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
    borderRadius: Radius.md,
  },
  selected: {
    backgroundColor: '#fff0f5',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerSelected: {
    backgroundColor: '#ffe0eb',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.text,
  },
  nameSelected: {
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  address: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  checkIcon: {
    marginLeft: Spacing.sm,
  },
});
