import { Colors } from '@/constants/theme';
import React, { useRef, useState } from 'react';
import {
    Animated,
    LayoutChangeEvent,
    ScrollView,
    ScrollViewProps,
    View
} from 'react-native';

interface CustomScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  maxHeight: number;
}

export function CustomScrollView({ children, maxHeight, style, ...props }: CustomScrollViewProps) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const contentHeightRef = useRef(0);
  const containerHeightRef = useRef(maxHeight);
  const [indicatorSize, setIndicatorSize] = useState(0);
  const [scrollRange, setScrollRange] = useState(1);
  const [showBar, setShowBar] = useState(false);

  const recalculate = (contentH: number, containerH: number) => {
    if (contentH <= containerH) {
      setShowBar(false);
      return;
    }
    const size = Math.max((containerH / contentH) * containerH, 24);
    setIndicatorSize(size);
    setScrollRange(contentH - containerH);
    setShowBar(true);
  };

  const handleContentSize = (_: number, height: number) => {
    contentHeightRef.current = height;
    recalculate(height, containerHeightRef.current);
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    containerHeightRef.current = e.nativeEvent.layout.height;
    recalculate(contentHeightRef.current, e.nativeEvent.layout.height);
  };

  const thumbTranslateY = scrollY.interpolate({
    inputRange: [0, Math.max(scrollRange, 1)],
    outputRange: [0, Math.max(containerHeightRef.current - indicatorSize, 0)],
    extrapolate: 'clamp',
  });

  return (
    <View style={[{ maxHeight, flexDirection: 'row' }, style]}>
      <ScrollView
        {...props}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        onContentSizeChange={handleContentSize}
        onLayout={handleLayout}
      >
        {children}
      </ScrollView>

      {showBar && (
        <View style={{
          width: 8,
          marginLeft: 4,
          borderRadius: 2,
          backgroundColor: `${Colors.primary}25`,
          height: containerHeightRef.current,
        }}>
          <Animated.View style={{
            width: 8,
            height: indicatorSize,
            borderRadius: 2,
            backgroundColor: Colors.primary,
            transform: [{ translateY: thumbTranslateY }],
          }} />
        </View>
      )}
    </View>
  );
}