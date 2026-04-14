import { StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  line: { height: 1, backgroundColor: Colors.border },
  withLabel: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  flex: { flex: 1, height: 1, backgroundColor: Colors.border },
  text: { paddingHorizontal: Spacing.xs },
});
