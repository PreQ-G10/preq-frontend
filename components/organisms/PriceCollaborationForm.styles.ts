import { StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

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
});
