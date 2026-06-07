import { Colors } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  side: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    color: Colors.textMuted,
    fontSize: 16,
  },
  confirmText: {
    color: Colors.success,
  },
  disputeText: {
    color: Colors.error,
  },
});