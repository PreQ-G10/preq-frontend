import { AppText } from '@/components/atoms';
import { Colors } from '@/constants/theme';
import { PriceHistoryPoint } from '@/types';
import React from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { styles } from './PriceHistoryChart.styles';

interface Props {
  data: PriceHistoryPoint[];
}

function fillMissingWeeks(data: PriceHistoryPoint[]): PriceHistoryPoint[] {
  if (data.length === 0) return [];

  const result: PriceHistoryPoint[] = [];
  const end = new Date();
  const start = new Date(data[0].weekStart);

  let lastKnownPrice = data[0].avgPrice;
  let dataIndex = 0;
  const cursor = new Date(start);

  while (cursor <= end) {
    const cursorStr = cursor.toISOString().split('T')[0];
    const point = data[dataIndex];

    if (point && point.weekStart === cursorStr) {
      lastKnownPrice = point.avgPrice;
      result.push(point);
      dataIndex++;
    } else {
      result.push({ weekStart: cursorStr, avgPrice: lastKnownPrice });
    }

    cursor.setDate(cursor.getDate() + 7);
  }

  return result;
}

export function PriceHistoryChart({ data }: Props) {
  const filled = fillMissingWeeks(data);
  const prices = data.map((p) => p.avgPrice);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  if (data.length < 2) {
    return (
      <View style={styles.empty}>
        <AppText variant="body" color="muted">No hay suficiente historial para mostrar</AppText>
      </View>
    );
  }

  const chartData = filled.map((p) => ({
    value: p.avgPrice,
    label: new Date(p.weekStart).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }),
  }));

  return (
    <View style={styles.container}>
      <AppText variant="label" color="secondary" style={styles.title}>
        Evolución del precio — últimas 24 semanas
      </AppText>
      <LineChart
        data={chartData}
        height={180}
        spacing={50}
        color={Colors.primary}
        thickness={2}
        hideDataPoints={false}
        dataPointsColor={Colors.primary}
        dataPointsRadius={3}
        startFillColor={Colors.primary}
        endFillColor={Colors.surface}
        startOpacity={0.2}
        endOpacity={0}
        areaChart
        curved
        yAxisTextStyle={{ color: Colors.gray300, fontSize: 10 }}
        xAxisLabelTextStyle={{ color: Colors.gray300, fontSize: 10 }}
        yAxisColor="transparent"
        xAxisColor={Colors.gray300}
        rulesColor={Colors.gray100}
        rulesType="solid"
        noOfSections={4}
        yAxisLabelPrefix="$"
        hideYAxisText={false}
        maxValue={max * 1.5}
        scrollToEnd
      />
    </View>
  );
}