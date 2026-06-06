import { Colors, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  sheet: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: Spacing.lg,
    maxHeight: '88%',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  closeButton: {
    padding: 4,
  },

  stepIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  stepBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBubbleActive: {
    backgroundColor: Colors.primary,
  },
  stepBubbleInactive: {
    backgroundColor: Colors.gray300,
  },
  stepConnector: {
    flex: 1,
    height: 2,
    marginHorizontal: Spacing.xs,
  },
  stepConnectorActive: {
    backgroundColor: Colors.primary,
  },
  stepConnectorInactive: {
    backgroundColor: Colors.gray300,
  },
  stepLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },

  subtitle: {
    marginBottom: Spacing.md,
  },

  fieldList: {
    maxHeight: 320,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  fieldRowSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '12',
  },
  fieldRowUnselected: {
    borderColor: Colors.gray300,
    backgroundColor: Colors.background,
  },
  fieldTextGroup: {
    flex: 1,
  },
  fieldCurrentValue: {
    marginTop: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  checkboxUnselected: {
    borderColor: Colors.gray300,
    backgroundColor: 'transparent',
  },

  editList: {
    maxHeight: 320,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 8,
    padding: Spacing.sm,
    fontSize: 15,
    color: Colors.text,
  },

  actions: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  cancelButton: {
    alignSelf: 'center',
    padding: Spacing.sm,
  },
  backButton: {
    alignSelf: 'center',
    padding: Spacing.sm,
  },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.error + '18',
    borderWidth: 1,
    borderColor: Colors.error + '40',
  },
  errorBannerText: {
    flex: 1,
  },

  successSheet: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  successIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  successTitle: {
    marginBottom: Spacing.xs,
  },
  successSubtitle: {
    textAlign: 'center',
  },
});