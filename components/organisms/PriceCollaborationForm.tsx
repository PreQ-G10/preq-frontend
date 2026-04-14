import React, { useState } from 'react';
import { View } from 'react-native';
import { AppText, Button, Divider } from '@/components/atoms';
import { LocationItem, PriceInput } from '@/components/molecules';
import { locationService, priceService } from '@/services/api';
import { Location } from '@/types';
import { styles } from './PriceCollaborationForm.styles';
import { SearchBar } from '../molecules/SearchBar';

interface PriceCollaborationFormProps {
  productId: number;
  onDone: () => void;
  onSkip: () => void;
}

export function PriceCollaborationForm({ productId, onDone, onSkip }: PriceCollaborationFormProps) {
  const [price, setPrice] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [priceError, setPriceError] = useState('');

  async function handleLocationSearch() {
    if (!locationQuery.trim()) return;
    const data = await locationService.search(locationQuery);
    setLocations(data);
  }

  async function handleSubmit() {
    if (!price.trim() || isNaN(Number(price))) {
      setPriceError('Ingresá un precio válido');
      return;
    }
    if (!selectedLocation) {
      return;
    }
    setPriceError('');
    setLoading(true);
    try {
      await priceService.report(productId, selectedLocation.id, Number(price));
      onDone();
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <PriceInput value={price} onChangeText={setPrice} error={priceError} />
      <View>
        <AppText variant="label" style={styles.sectionTitle}>¿Dónde lo viste?</AppText>
        <SearchBar
          value={locationQuery}
          onChangeText={setLocationQuery}
          onSubmit={handleLocationSearch}
          placeholder="Buscar local o supermercado..."
        />
      </View>
      <View style={styles.locationList}>
        {locations.length === 0 && locationQuery.length > 0 && (
          <AppText variant="bodySmall" color="muted" style={styles.noLocations}>
            No hay resultados
          </AppText>
        )}
        {locations.map((loc) => (
          <LocationItem
            key={loc.id}
            location={loc}
            selected={selectedLocation?.id === loc.id}
            onPress={() => setSelectedLocation(loc)}
          />
        ))}
      </View>
      <Divider />
      <View style={styles.createLocationRow}>
        <AppText variant="bodySmall" color="secondary">¿No encontrás el lugar?</AppText>
        <Button label="Agregar lugar" variant="ghost" size="sm" onPress={() => {}} />
      </View>
      <Button
        label="Enviar precio"
        onPress={handleSubmit}
        loading={loading}
        fullWidth
        disabled={!selectedLocation || !price}
        style={styles.submitButton}
      />
      <Button label="Saltar por ahora" variant="ghost" onPress={onSkip} fullWidth />
    </View>
  );
}
