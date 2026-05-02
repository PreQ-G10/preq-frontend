import { Colors, Radius, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  searchContainer: { padding: Spacing.md },
  content: { paddingHorizontal: Spacing.md, gap: Spacing.sm, paddingBottom: Spacing.xl },
  productRow: { flexDirection: 'row', alignItems: 'center' },
  productInfo: { flex: 1, gap: 2 },
  empty: { alignItems: 'center', paddingVertical: Spacing.xxl, gap: Spacing.md },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  popup: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  popupTitle: { textAlign: 'center' },
  popupSubtitle: { textAlign: 'center', marginBottom: Spacing.sm },
});