import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  permissionIcon: {
    width: 88,
    height: 88,
    borderRadius: Radius.full,
    backgroundColor: '#fff0f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionText: {
    textAlign: 'center',
  },
  camera: {
    flex: 1,
  },
  overlay: {
  ...StyleSheet.absoluteFillObject,
  justifyContent: 'space-between',
},
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingTop: Spacing.xxl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoLabel: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  autoLabelText: {
    color: Colors.white,
    fontSize: Typography.sizes.sm,
  },
  frameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 260,
    height: 260,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  frameHint: {
    marginTop: Spacing.md,
    color: 'rgba(255,255,255,0.75)',
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
  },
  bottomBar: {
    alignItems: 'center',
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
<<<<<<< HEAD
  toggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 3,
    gap: 2,
  },
  toggleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  toggleActive: {
    backgroundColor: Colors.white,
  },
  toggleText: {
    fontSize: 13,
    color: Colors.white,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: Colors.primary,
  },
  barcodeFrame: {
    width: '85%',
    height: 120,
    borderRadius: 8,
  },
=======
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  }
>>>>>>> 40af531 (Fixed camera, automatic location detection and minimaps compatibilities with android)
});
