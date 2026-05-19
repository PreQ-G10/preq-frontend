import { AppText, Button, Divider } from '@/components/atoms';
import { LocationItem, PriceInput } from '@/components/molecules';
import { locationService, priceService } from '@/services/api';
import { getDetectedLocation } from '@/services/maps';
import { Location, LocationDetectionResponse } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as ExpoLocation from 'expo-location';
import React, { useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { SearchBar } from '../molecules/SearchBar';
import { CreateLocationForm } from './CreateLocationForm';
import { styles } from './PriceCollaborationForm.styles';

interface PriceCollaborationFormProps {
  productId: number;
  onDone: () => void;
  onSkip: () => void;
}

export function PriceCollaborationForm({ productId, onDone, onSkip }: PriceCollaborationFormProps) {
  const detected: LocationDetectionResponse | null = getDetectedLocation();

  const [price, setPrice] = useState('');
  const [priceError, setPriceError] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    detected?.location ?? null
  );

  // Manual search
  const [locationQuery, setLocationQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);

  // Create location modal
  const [showCreate, setShowCreate] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  async function getLocation() {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') return null;
      return ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.Accuracy.Balanced });
    }

  async function handleLocationSearch() {
    if (!locationQuery.trim()) return;
    const data = await locationService.search(locationQuery);
    setSearchResults(data);
  }

  async function handleSubmit() {
    if (!price.trim() || isNaN(Number(price))) {
        setPriceError('Ingresá un precio válido');
        return;
    }
    if (!selectedLocation) return;
    setPriceError('');
    setSubmitting(true);
    try {
        const pos = await getLocation();
        await priceService.report(
            productId,
            selectedLocation.id,
            Number(price),
            pos?.coords.latitude,
            pos?.coords.longitude,
        );
        onDone();
    } finally {
        setSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <PriceInput value={price} onChangeText={setPrice} error={priceError} />

      <View>
        <AppText variant="label" style={styles.sectionTitle}>¿Dónde lo viste?</AppText>

        {/* Selected location */}
        {selectedLocation ? (
          <View style={styles.selectedChip}>
            <Ionicons name="checkmark-circle" size={16} style={styles.successColor} />
            <View style={styles.selectedInfo}>
              <AppText variant="body">{selectedLocation.name}</AppText>
              <AppText variant="bodySmall" color="secondary">{selectedLocation.address}</AppText>
            </View>
            <TouchableOpacity
              onPress={() => setSelectedLocation(null)}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <Ionicons name="close-circle-outline" size={18} style={styles.grayColor} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <SearchBar
              value={locationQuery}
              onChangeText={setLocationQuery}
              onSubmit={handleLocationSearch}
              placeholder="Buscar local o supermercado..."
            />
            <View style={styles.locationList}>
              {searchResults.length === 0 && locationQuery.length > 0 && (
                <AppText variant="bodySmall" color="muted" style={styles.noLocations}>
                  No hay resultados
                </AppText>
              )}
              {searchResults.map((loc) => (
                <LocationItem
                  key={loc.id}
                  location={loc}
                  selected={false}
                  onPress={() => setSelectedLocation(loc)}
                />
              ))}
            </View>
          </>
        )}
      </View>

      <Divider />

      <View style={styles.createLocationRow}>
        <AppText variant="bodySmall" color="secondary">¿No encontrás el lugar?</AppText>
        <Button label="Agregar lugar" variant="ghost" size="sm" onPress={() => setShowCreate(true)} />
      </View>

      <Button
        label="Enviar precio"
        onPress={handleSubmit}
        loading={submitting}
        fullWidth
        disabled={!selectedLocation || !price}
        style={styles.submitButton}
      />
      <Button label="Saltar por ahora" variant="ghost" onPress={onSkip} fullWidth />

      <Modal visible={showCreate} animationType="slide" presentationStyle="pageSheet">
        <CreateLocationForm
          onCreated={(location) => {
            setSelectedLocation(location);
            setShowCreate(false);
          }}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>
    </View>
  );
}
