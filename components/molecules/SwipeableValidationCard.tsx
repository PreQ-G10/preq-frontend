import { PendingValidationResponse } from '@/types';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, View } from 'react-native';
import { PendingValidationCard } from './PendingValidationCard';
import { SwipeOverlay } from './SwipeOverlay';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export interface SwipeableValidationCardHandle {
  reset: () => void;
}

interface SwipeableValidationCardProps {
  report: PendingValidationResponse;
  onConfirm: () => void;
  onDisputeOpen: () => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

export const SwipeableValidationCard = forwardRef<SwipeableValidationCardHandle, SwipeableValidationCardProps>(
  function SwipeableValidationCard(
    { report, onConfirm, onDisputeOpen, onSwipeStart, onSwipeEnd },
    ref
  ) {
    const translateX = useRef(new Animated.Value(0)).current;
    const overlayX = useRef(new Animated.Value(0)).current;
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const animatedMargin = useRef(new Animated.Value(0)).current;
    const isSwiping = useRef(false);
    const [measured, setMeasured] = useState(false);

    useImperativeHandle(ref, () => ({
      reset() {
        // Snap card back into place without collapsing
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }).start();
        Animated.spring(overlayX, { toValue: 0, useNativeDriver: false, tension: 80, friction: 12 }).start();
      },
    }));

    function onLayout(e: any) {
      if (measured) return;
      const h = e.nativeEvent.layout.height;
      if (h > 0) {
        animatedHeight.setValue(h);
        animatedMargin.setValue(12);
        setMeasured(true);
      }
    }

    function syncOverlay(dx: number) {
      overlayX.setValue(dx);
    }

    function snapBack() {
      isSwiping.current = false;
      onSwipeEnd?.();
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }).start();
      Animated.spring(overlayX, { toValue: 0, useNativeDriver: false, tension: 80, friction: 12 }).start();
    }

    function swipeOut(direction: 'left' | 'right', callback: () => void) {
      isSwiping.current = false;
      onSwipeEnd?.();
      const toValue = direction === 'right' ? SCREEN_WIDTH * 1.4 : -SCREEN_WIDTH * 1.4;

      Animated.timing(translateX, { toValue, duration: 200, useNativeDriver: true }).start();
      Animated.timing(overlayX, { toValue, duration: 200, useNativeDriver: false }).start();

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(animatedHeight, { toValue: 0, duration: 220, useNativeDriver: false }),
          Animated.timing(animatedMargin, { toValue: 0, duration: 220, useNativeDriver: false }),
        ]).start(() => {
          translateX.setValue(0);
          overlayX.setValue(0);
          callback();
        });
      }, 160);
    }

    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dx) > 6 && Math.abs(g.dx) > Math.abs(g.dy) * 2,
        onPanResponderGrant: () => {
          if (!isSwiping.current) {
            isSwiping.current = true;
            onSwipeStart?.();
          }
        },
        onPanResponderMove: (_, g) => {
          translateX.setValue(g.dx);
          syncOverlay(g.dx);
        },
        onPanResponderRelease: (_, g) => {
          if (g.dx > SWIPE_THRESHOLD) {
            swipeOut('right', onConfirm);
          } else if (g.dx < -SWIPE_THRESHOLD) {
            isSwiping.current = false;
            onSwipeEnd?.();
            onDisputeOpen();
          } else {
            snapBack();
          }
        },
        onPanResponderTerminate: () => snapBack(),
      })
    ).current;

    const rotate = translateX.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-1.5deg', '0deg', '1.5deg'],
      extrapolate: 'clamp',
    });

    if (!measured) {
      return (
        <View onLayout={onLayout}>
          <PendingValidationCard report={report} />
        </View>
      );
    }

    return (
      <Animated.View style={{ height: animatedHeight, marginBottom: animatedMargin, overflow: 'hidden' }}>
        <View style={styles.inner}>
          <SwipeOverlay translateX={overlayX} threshold={SWIPE_THRESHOLD} />
          <Animated.View
            style={[styles.card, { transform: [{ translateX }, { rotate }] }]}
            {...panResponder.panHandlers}
          >
            <PendingValidationCard report={report} />
          </Animated.View>
        </View>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  inner: {
    position: 'relative',
  },
  card: {
    zIndex: 1,
  },
});