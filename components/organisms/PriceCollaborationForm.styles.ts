import { Colors, Radius, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.xs,
  },
  locationList: {
    gap: Spacing.xs,
  },
  noLocations: {
    paddingVertical: Spacing.md,
    textAlign: 'center',
  },
  createLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
  },
  submitButton: {
    marginTop: Spacing.sm,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedInfo: { flex: 1 },
  successColor: { color: Colors.success },
  grayColor: { color: Colors.gray400 },
});
