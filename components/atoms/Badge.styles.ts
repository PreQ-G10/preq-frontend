import { StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export const styles = StyleSheet.create({
  base: { alignSelf: 'flex-start', paddingVertical: Spacing.xs / 2, paddingHorizontal: Spacing.sm, borderRadius: Radius.full },
  success: { backgroundColor: '#e6f9f2' },
  warning: { backgroundColor: '#fef3cd' },
  error: { backgroundColor: '#fde8e8' },
  primary: { backgroundColor: '#ffe0eb' },
  neutral: { backgroundColor: Colors.gray100 },
  label: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.semibold },
  label_success: { color: Colors.success },
  label_warning: { color: Colors.warning },
  label_error: { color: Colors.error },
  label_primary: { color: Colors.primary },
  label_neutral: { color: Colors.gray500 },
});
