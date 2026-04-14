import { StyleSheet } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.gray50,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productInfo: {
    flex: 1,
  },
  scanAgainButton: {
    marginTop: Spacing.sm,
  },
});
