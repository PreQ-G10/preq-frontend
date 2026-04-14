import { StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.black,
    color: Colors.white,
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.md,
    color: 'rgba(255,255,255,0.75)',
    marginTop: Spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    gap: Spacing.xl,
  },
  tipCard: {
    gap: Spacing.sm,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: '#fff0f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.md,
    alignItems: 'center',
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  scanButton: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  scanLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
});
