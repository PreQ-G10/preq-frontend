import { StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
  },
  confident: {
    backgroundColor: '#e6f9f2',
  },
  notConfident: {
    backgroundColor: '#fef3cd',
  },
  text: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  textConfident: {
    color: Colors.success,
  },
  textNotConfident: {
    color: Colors.warning,
  },
});
