import { AppText, Button, Chip } from '@/components/atoms';
import { LocationMap } from '@/components/molecules/LocationMap';
import { LOCATION_TYPES, LOCATION_TYPE_LABELS } from '@/constants/locations';
import { Colors } from '@/constants/theme';
import { locationService } from '@/services/api';
import { MapboxPrediction, reverseGeocode, searchPlaces } from '@/services/maps';
import { Location } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from './CreateLocationForm.styles';

interface ResolvedPlace {
  address: string;
  latitude: number;
  longitude: number;
}

interface CreateLocationFormProps {
  onCreated: (location: Location) => void;
  onCancel: () => void;
}

export function CreateLocationForm({ onCreated, onCancel }: CreateLocationFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<Location['type']>('SUPERMARKET');
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<MapboxPrediction[]>([]);
  const [searching, setSearching] = useState(false);
  const [resolvedPlace, setResolvedPlace] = useState<ResolvedPlace | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (searchQuery.trim().length < 2) { setPredictions([]); return; }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchPlaces(searchQuery);
        setPredictions(results);
      } finally {
        setSearching(false);
      }
    }, 350);
  }, [searchQuery]);

  function handleSelectPrediction(p: MapboxPrediction) {
    setResolvedPlace({ address: p.placeName, latitude: p.latitude, longitude: p.longitude });
    setSearchQuery(p.placeName);
    setPredictions([]);
  }

  function handleClearPlace() {
    setResolvedPlace(null);
    setSearchQuery('');
    setPredictions([]);
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'El nombre es obligatorio';
    if (!resolvedPlace) e.search = 'Buscá y seleccioná una dirección';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const location = await locationService.create(
        name,
        resolvedPlace!.address,
        type,
        resolvedPlace!.latitude,
        resolvedPlace!.longitude,
      );
      onCreated(location);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppText variant="h3">Agregar lugar</AppText>
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        {/* Name */}
        <View>
          <Text style={styles.label}>Nombre del lugar</Text>
          <TextInput
            style={[styles.input, !!errors.name && styles.inputError]}
            value={name}
            onChangeText={setName}
            placeholder="Ej: Coto Express Bernal"
            placeholderTextColor={Colors.textMuted}
          />
          {!!errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Address search */}
        <View style={styles.searchSection}>
          <Text style={styles.label}>Dirección o nombre del lugar</Text>
          <View style={[styles.searchRow, !!errors.search && styles.inputError]}>
            <Ionicons name="search-outline" size={16} color={Colors.gray400} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={(t) => { setSearchQuery(t); if (resolvedPlace) setResolvedPlace(null); }}
              placeholder="Ej: Av. Calchaquí 600 o Coto"
              placeholderTextColor={Colors.textMuted}
              editable={!resolvedPlace}
            />
            {searching && <ActivityIndicator size="small" color={Colors.primary} />}
            {resolvedPlace && (
              <TouchableOpacity onPress={handleClearPlace}>
                <Ionicons name="close-circle" size={18} color={Colors.gray400} />
              </TouchableOpacity>
            )}
          </View>
          {!!errors.search && <Text style={styles.errorText}>{errors.search}</Text>}

          {/* Predictions dropdown */}
          {predictions.length > 0 && !resolvedPlace && (
            <View style={styles.dropdown}>
              <View style={{ maxHeight: 180 }}>
                {predictions.slice(0, 3).map((item, index) => (
                  <View key={String(item.id)}>
                    <TouchableOpacity
                      style={styles.predictionItem}
                      onPress={() => handleSelectPrediction(item)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="location-outline" size={14} color={Colors.primary} />
                      <View style={styles.predictionText}>
                        <Text style={styles.predictionMain}>{item.mainText}</Text>
                        <Text style={styles.predictionSub}>{item.secondaryText}</Text>
                      </View>
                    </TouchableOpacity>
                    {index < 2 && <View style={styles.separator} />}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Mini map */}
        {resolvedPlace && (
          <View style={styles.mapCard}>
            <View style={styles.mapHeader}>
              <Ionicons name="map-outline" size={14} color={Colors.primary} />
              <Text style={styles.mapHeaderText}>Verificá la ubicación</Text>
            </View>
            <LocationMap
              latitude={resolvedPlace.latitude}
              longitude={resolvedPlace.longitude}
              onLocationChange={async (lat, lng) => {
                const address = await reverseGeocode(lat, lng);
                setResolvedPlace({ 
                  address: address || resolvedPlace.address, 
                  latitude: lat, 
                  longitude: lng 
                });
                setSearchQuery(address || resolvedPlace.address);
              }}
            />
            <View style={styles.mapAddress}>
              <Ionicons name="checkmark-circle" size={15} color={Colors.success} />
              <Text style={styles.mapAddressText} numberOfLines={2}>{resolvedPlace.address}</Text>
            </View>
            <TouchableOpacity style={styles.correctButton} onPress={handleClearPlace}>
              <Ionicons name="pencil-outline" size={13} color={Colors.primary} />
              <Text style={styles.correctButtonText}>Corregir dirección</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Type */}
        <View>
          <Text style={styles.label}>Tipo de local</Text>
          <View style={styles.chips}>
            {LOCATION_TYPES.map(t => (
              <Chip key={t} label={LOCATION_TYPE_LABELS[t]} selected={type === t} onPress={() => setType(t)} />
            ))}
          </View>
        </View>

        <Button
          label="Guardar lugar"
          onPress={handleSubmit}
          loading={submitting}
          disabled={!resolvedPlace || !name.trim()}
          fullWidth
        />
      </ScrollView>
    </SafeAreaView>
  );
};