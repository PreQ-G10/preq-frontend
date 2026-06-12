import { AppText } from '@/components/atoms';
import { Tooltip } from '@/components/molecules/Tooltip';
import { Colors } from '@/constants/theme';
import React from 'react';

interface VerificationTooltipProps {
  visible: boolean;
  score: number;
  x: number;
  y: number;
  onClose: () => void;
}

export function getVerificationConfig(score: number) {
  if (score >= 0.9) {
    return { name: 'checkmark-circle' as const, color: Colors.success };
  }
  if (score > 0.75) {
    return { name: 'warning' as const, color: Colors.warning };
  }
  return { name: 'alert-circle' as const, color: Colors.error };
}

function getVerificationContent(score: number) {
  if (score >= 0.9) {
    return {
      title: 'Precio confiable',
      message: 'Este precio tiene un alto nivel de confianza según las verificaciones realizadas por la plataforma y es probable que refleje el valor actual del producto.',
    };
  }
  if (score > 0.75) {
    return {
      title: 'Precio con confianza moderada',
      message: 'Este precio presenta un nivel de confianza intermedio. Puede ser correcto, pero recomendamos verificarlo antes de tomar una decisión.',
    };
  }
  return {
    title: 'Precio poco confiable',
    message: 'Este precio tiene un bajo nivel de confianza y podría no reflejar el valor actual del producto. Considérelo con precaución o solo como referencia.',
  };
}

export function VerificationTooltip({ visible, score, x, y, onClose }: VerificationTooltipProps) {
  const content = getVerificationContent(score);
  const config = getVerificationConfig(score);
  
  return (
    <Tooltip
      visible={visible}
      onClose={onClose}
      x={x}
      y={y}
      title={content.title}
      icon={config.name}
      iconColor={config.color}
      style={{ top: y - 125 }} // Maintain specific height offset for this tooltip
    >
      <AppText variant="caption" color="secondary">{content.message}</AppText>
    </Tooltip>
  );
}