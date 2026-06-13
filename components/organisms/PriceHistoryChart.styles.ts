import { Colors, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  title: {
    marginLeft: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  empty: {
    marginTop: Spacing.md,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
});