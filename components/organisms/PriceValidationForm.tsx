import { priceService } from '@/services/api';
import { PendingValidationResponse } from '@/types';
import * as ExpoLocation from 'expo-location';
import React, { useRef, useState } from 'react';
import { Animated, Easing, ScrollView, View } from 'react-native';
import { AppText } from '../atoms';
import { DisputePriceModal } from '../molecules/DisputePriceModal';
import { SwipeHint } from '../molecules/SwipeHint';
import { SwipeableValidationCard, SwipeableValidationCardHandle } from '../molecules/SwipeableValidationCard';
import { styles } from './PriceValidationForm.styles';

interface PriceValidationFormProps {
  reports: PendingValidationResponse[];
  onValidated: (reportId: number) => void;
}

async function getCurrentLocation() {
  const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;
  return ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.Accuracy.Balanced });
}

function AnimatedCardRow({ children, animate }: { children: React.ReactNode; animate: boolean }) {
  const scale = useRef(new Animated.Value(animate ? 0.94 : 1)).current;
  const opacity = useRef(new Animated.Value(animate ? 0.5 : 1)).current;

  React.useEffect(() => {
    if (animate) {
      Animated.parallel([
        Animated.timing(scale, { toValue: 1, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
      ]).start();
    }
  }, [animate]);

  return (
    <Animated.View style={{ transform: [{ scale }], opacity }}>
      {children}
    </Animated.View>
  );
}

export function PriceValidationForm({ reports, onValidated }: PriceValidationFormProps) {
  const [validatedIds, setValidatedIds] = useState<Set<number>>(new Set());
  const [lastValidatedId, setLastValidatedId] = useState<number | null>(null);
  const [isCardSwiping, setIsCardSwiping] = useState(false);
  const [disputingReport, setDisputingReport] = useState<PendingValidationResponse | null>(null);

  // Keep a ref per card so we can call reset() on cancel
  const cardRefs = useRef<Map<number, SwipeableValidationCardHandle>>(new Map());

  const remaining = reports.filter((r) => !validatedIds.has(r.id));

  function markValidated(id: number) {
    setLastValidatedId(id);
    setValidatedIds((prev) => new Set([...prev, id]));
    onValidated(id);
  }

  async function handleConfirm(reportId: number) {
    try {
      await priceService.confirmPrice(reportId);
      markValidated(reportId);
    } catch (e) {
      console.error('Confirm failed:', e);
    }
  }

  function handleDisputeOpen(report: PendingValidationResponse) {
    setDisputingReport(report);
  }

  function handleDisputeCancel() {
    // Snap the card that was swiped back into place
    if (disputingReport) {
      cardRefs.current.get(disputingReport.id)?.reset();
    }
    setDisputingReport(null);
  }

  async function handleDisputeConfirm(alternativePrice: number) {
    if (!disputingReport) return;
    const reportId = disputingReport.id;
    setDisputingReport(null);
    try {
      const pos = await getCurrentLocation();
      await priceService.disputePrice(reportId, {
        alternativePrice,
        userLatitude: pos?.coords.latitude,
        userLongitude: pos?.coords.longitude,
      });
      markValidated(reportId);
    } catch (e) {
      console.error('Dispute failed:', e);
    }
  }

  if (remaining.length === 0) {
    return (
      <View style={styles.empty}>
        <AppText variant="body" color="secondary">
          No hay precios pendientes de validación cerca tuyo.
        </AppText>
      </View>
    );
  }

  const newFirstId = lastValidatedId !== null ? remaining[0]?.id : null;

  return (
    <>
      <SwipeHint />

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled
        scrollEnabled={!isCardSwiping}
      >
        {remaining.map((report, index) => (
          <AnimatedCardRow key={report.id} animate={index === 0 && report.id === newFirstId}>
            <SwipeableValidationCard
              ref={(handle) => {
                if (handle) cardRefs.current.set(report.id, handle);
                else cardRefs.current.delete(report.id);
              }}
              report={report}
              onConfirm={() => handleConfirm(report.id)}
              onDisputeOpen={() => handleDisputeOpen(report)}
              onSwipeStart={() => setIsCardSwiping(true)}
              onSwipeEnd={() => setIsCardSwiping(false)}
            />
          </AnimatedCardRow>
        ))}
      </ScrollView>

      <DisputePriceModal
        visible={disputingReport !== null}
        report={disputingReport}
        onConfirm={handleDisputeConfirm}
        onCancel={handleDisputeCancel}
      />
    </>
  );
}