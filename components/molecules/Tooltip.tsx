import { AppText } from '@/components/atoms';
import { Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, View, ViewStyle } from 'react-native';
import { styles } from './Tooltip.styles';

interface TooltipProps {
  visible: boolean;
  onClose: () => void;
  x: number;
  y: number;
  width?: number;
  title?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * A generic tooltip component that appears relative to a touch point (x, y).
 * Includes a pointer triangle and handles backdrop dismissal.
 */
export function Tooltip({
  visible,
  onClose,
  x,
  y,
  width = 220,
  title,
  icon,
  iconColor,
  children,
  style,
}: TooltipProps) {
  const bubbleLeft = Math.max(Spacing.md, x - width / 2);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={{ flex: 1 }} onPress={onClose}>
        <View
          style={[
            styles.tooltip,
            {
                top: y - 110, // Default offset above touch point
                left: bubbleLeft,
                width: width,
            },
            style,
          ]}
        >
          {(title || icon) && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 6 }}>
              {icon && <Ionicons name={icon} size={16} color={iconColor} />}
              {title && <AppText variant="label" style={{ color: iconColor }}>{title}</AppText>}
            </View>
          )}
          {children}
          <View style={[styles.child,{left: x - bubbleLeft - 8, /*Center triangle under the original touch point*/}]} /> 
        </View>
      </Pressable>
    </Modal>
  );
}