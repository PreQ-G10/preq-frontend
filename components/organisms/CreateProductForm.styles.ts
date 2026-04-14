import { StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: Radius.lg,
    backgroundColor: Colors.gray100,
  },
  photoPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: Radius.lg,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  flex: {
    flex: 1,
  },
  submitButton: {
    marginTop: Spacing.sm,
  },
});
