import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    overflow: 'hidden',
    borderRadius: 12,
    justifyContent: 'center',
  },
  confirmPanel: {
    left: 0,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    alignItems: 'flex-start',
    paddingLeft: 16,
  },
  disputePanel: {
    right: 0,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  confirmText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803d',
    width: 90,
  },
  disputeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#b91c1c',
    width: 90,
    textAlign: 'right',
  },
});