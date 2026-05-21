import React from 'react';
import { Animated } from 'react-native';
import { AppText } from '../atoms';
import { styles } from './SwipeOverlay.styles';

interface SwipeOverlayProps {
  translateX: Animated.Value;
  threshold: number;
}

const PANEL_WIDTH = 110;

export function SwipeOverlay({ translateX, threshold }: SwipeOverlayProps) {
  const confirmWidth = translateX.interpolate({
    inputRange: [0, threshold],
    outputRange: [0, PANEL_WIDTH],
    extrapolate: 'clamp',
  });
  const confirmOpacity = translateX.interpolate({
    inputRange: [0, threshold * 0.2],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const disputeWidth = translateX.interpolate({
    inputRange: [-threshold, 0],
    outputRange: [PANEL_WIDTH, 0],
    extrapolate: 'clamp',
  });
  const disputeOpacity = translateX.interpolate({
    inputRange: [-threshold * 0.2, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <>
      <Animated.View
        style={[styles.panel, styles.confirmPanel, { width: confirmWidth, opacity: confirmOpacity }]}
        pointerEvents="none"
      >
        <AppText style={styles.confirmText} numberOfLines={1}>✓ Confirmar</AppText>
      </Animated.View>

      <Animated.View
        style={[styles.panel, styles.disputePanel, { width: disputeWidth, opacity: disputeOpacity }]}
        pointerEvents="none"
      >
        <AppText style={styles.disputeText} numberOfLines={1}>✗ Disputar</AppText>
      </Animated.View>
    </>
  );
}