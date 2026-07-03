import { Colors, Radius, Spacing, Typography } from "@/constants/theme";
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.primary,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerSpacer: { width: 36 },
  savedAgo: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: Typography.sizes.xs,
    marginTop: 2,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  address: {
    marginBottom: Spacing.sm,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  items: {
    gap: Spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  checkBoxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  itemName: { flex: 1 },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  progressColumn: {
    alignItems: 'flex-end',
    gap: 2,
  },
  itemQuantity: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  itemQuantityChecked: {
    color: Colors.textMuted,
  },
  subtractButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
});