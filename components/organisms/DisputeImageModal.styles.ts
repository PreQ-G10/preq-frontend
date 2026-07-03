import { Colors, Radius, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  sheet: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    padding: Spacing.xs,
  },
  iconWrapper: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: Spacing.sm,
  },
  actions: {
    gap: Spacing.sm,
    alignItems: 'center',
  },
  cancelButton: {
    paddingVertical: Spacing.sm,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.error + '15',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
  },
  errorBannerText: {
    color: Colors.error,
    flex: 1,
  },
  successSheet: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  successIconWrapper: {
    marginBottom: Spacing.sm,
  },
  successTitle: {
    textAlign: 'center',
  },
  successSubtitle: {
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
});