import { StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', gap: Spacing.md, padding: Spacing.xl },
  fullScreen: { flex: 1, backgroundColor: Colors.white },
  message: { textAlign: 'center' },
});
