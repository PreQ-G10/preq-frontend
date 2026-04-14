import { StyleSheet } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  cardContent: {
    gap: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  noResultContainer: {
    alignItems: 'center',
    padding: Spacing.xxl,
    gap: Spacing.md,
  },
  noResultIcon: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
