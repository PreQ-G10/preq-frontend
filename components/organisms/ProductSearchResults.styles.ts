import { StyleSheet } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  list: {
    gap: Spacing.sm,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  resultInfo: {
    flex: 1,
    gap: 2,
  },
  arrow: {
    marginLeft: Spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  createRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
  },
});
