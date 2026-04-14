import { StyleSheet } from 'react-native';
import { Colors, Typography } from '@/constants/theme';

export const styles = StyleSheet.create({
  h1: { fontSize: Typography.sizes.xxxl, fontWeight: Typography.weights.black, lineHeight: 38 },
  h2: { fontSize: Typography.sizes.xxl, fontWeight: Typography.weights.bold, lineHeight: 30 },
  h3: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.semibold, lineHeight: 26 },
  body: { fontSize: Typography.sizes.md, fontWeight: Typography.weights.regular, lineHeight: 22 },
  bodySmall: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.regular, lineHeight: 18 },
  caption: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.regular, lineHeight: 16 },
  label: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, lineHeight: 18 },
  color_default: { color: Colors.text },
  color_secondary: { color: Colors.textSecondary },
  color_muted: { color: Colors.textMuted },
  color_primary: { color: Colors.primary },
  color_white: { color: Colors.white },
  color_success: { color: Colors.success },
  color_error: { color: Colors.error },
});
