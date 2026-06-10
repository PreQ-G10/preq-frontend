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
      title: 'Precio Verificado',
      message: 'Este precio es altamente confiable debido a la consistencia y recencia de los reportes recibidos.',
    };
  }
  if (score > 0.75) {
    return {
      title: 'Confiabilidad Media',
      message: 'Este precio tiene una confiabilidad aceptable, pero recomendamos verificar la fecha del reporte.',
    };
  }
  return {
    title: 'Baja Confiabilidad',
    message: 'Este precio tiene baja consistencia o es antiguo. Tomalo solo como una referencia.',
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