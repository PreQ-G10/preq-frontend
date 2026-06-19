import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { locationService } from '@/services/api';
import { MapboxPrediction, searchPlaces } from '@/services/maps';
import { LocationSearchResult } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { styles } from './BusinessRegisterForm.styles';

type FormMode = 'search' | 'results' | 'prefilled' | 'new';

export function BusinessRegisterForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<MapboxPrediction[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<MapboxPrediction | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<MapboxPrediction[]>([]);
  const [nearbyLocations, setNearbyLocations] = useState<LocationSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('search');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [locationNameLocked, setLocationNameLocked] = useState(false);
  const [locationAddressLocked, setLocationAddressLocked] = useState(false);

  const [ownerName, setOwnerName] = useState('');
  const [ownerLastName, setOwnerLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [cuit, setCuit] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const router = useRouter();

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setNearbyLocations([]);
    setFormMode('search');
    setSelectedPrediction(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) { setSearchSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      const results = await searchPlaces(text);
      setSearchSuggestions(results);
    }, 300);
  };

  const handleSelectAddressSuggestion = (prediction: MapboxPrediction) => {
    setLocationAddress(prediction.placeName ?? prediction.mainText);
    setAddressSuggestions([]);
  };

  const handleSearchChangeInForm = (text: string) => {
    setLocationAddress(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) { setAddressSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      const results = await searchPlaces(text);
      setAddressSuggestions(results);
    }, 300);
  };

  const handleSelectSearchSuggestion = async (prediction: MapboxPrediction) => {
    setSelectedPrediction(prediction);
    setSearchQuery(prediction.mainText);
    setSearchSuggestions([]);
    setSearching(true);
    try {
      const results = await locationService.searchNearby(prediction.latitude, prediction.longitude);
      setNearbyLocations(results);
      setFormMode('results');
    } catch {
      setError('Error al buscar negocios cercanos.');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectLocation = (location: LocationSearchResult) => {
    setSelectedLocationId(location.id);
    setLocationName(location.name);
    setLocationAddress(location.address);
    setLocationNameLocked(true);
    setLocationAddressLocked(true);
    setFormMode('prefilled');
    setAddressSuggestions([]);
  };

  const handleCreateNew = () => {
    setSelectedLocationId(null);
    setLocationName('');
    setLocationAddress(selectedPrediction?.placeName ?? '');
    setLocationNameLocked(false);
    setLocationAddressLocked(selectedPrediction != null);
    setFormMode('new');
     setAddressSuggestions([]);
  };

  const handleRegister = async () => {
    if (!ownerName || !ownerLastName || !email || !password || !businessPhone) {
      setError('Por favor completá los campos obligatorios.');
      return;
    }
    if ((formMode === 'new' || formMode === 'prefilled') && (!locationName || !locationAddress)) {
      setError('Ingresá el nombre y la dirección del negocio.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await locationService.register({
        ownerName,
        ownerLastName,
        email,
        password,
        businessPhone,
        cuit: cuit.trim() || undefined,
        ...(formMode === 'prefilled'
          ? { locationId: selectedLocationId! }
          : { locationName, locationAddress }),
      });
      await login(data.userRegisterResponse.accessToken, data.userRegisterResponse.refreshToken);
    } catch (e: any) {
      setError(e.message ?? 'Error al registrarse. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const showForm = formMode === 'prefilled' || formMode === 'new';

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>

      {/* Address search — always visible until form mode */}
      {!showForm && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Buscá tu negocio por dirección"
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={handleSearchChange}
            editable={!loading}
          />
          {searchSuggestions.length > 0 && (
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={searchSuggestions}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              style={styles.suggestionList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSelectSearchSuggestion(item)}
                >
                  <Text style={styles.suggestionMain}>{item.mainText}</Text>
                  <Text style={styles.suggestionSecondary}>{item.secondaryText}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}

      {/* Searching spinner */}
      {searching && <ActivityIndicator style={{ marginVertical: Spacing.md }} color={Colors.primary} />}

      {/* Results */}
      {formMode === 'results' && !searching && (
        <View style={styles.resultsContainer}>
          {nearbyLocations.length > 0 ? (
            <>
              <Text style={styles.resultsTitle}>Negocios cercanos</Text>
              <ScrollView style={styles.nearbyList} nestedScrollEnabled>
                {nearbyLocations.map((loc) => (
                  <TouchableOpacity
                    key={loc.id}
                    style={styles.nearbyItem}
                    onPress={() => handleSelectLocation(loc)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.nearbyName}>{loc.name}</Text>
                      <Text style={styles.nearbyAddress}>{loc.address}</Text>
                    </View>
                    <Text style={styles.nearbyChevron}>›</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No encontramos negocios registrados en esta dirección.
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.createButton} onPress={handleCreateNew}>
            <Text style={styles.createButtonText}>+ Crear mi negocio</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Form */}
      {showForm && (
        <>
          <Text style={styles.formSectionTitle}>
            {formMode === 'prefilled' ? 'Confirmar negocio' : 'Nuevo negocio'}
          </Text>

          <View style={styles.lockedFieldContainer}>
            <TextInput
              style={[styles.input, locationNameLocked && styles.inputLocked, { flex: 1, marginBottom: 0 }]}
              placeholder="Nombre del negocio *"
              placeholderTextColor={Colors.textMuted}
              value={locationName}
              onChangeText={setLocationName}
              editable={!locationNameLocked && !loading}
            />

            {locationNameLocked && (
              <TouchableOpacity onPress={() => setLocationNameLocked(false)} style={styles.editButton}>
                <Ionicons name="pencil" size={20} color={Colors.gray300} />
              </TouchableOpacity>
            )}
            
          </View>


          <View style={styles.lockedFieldContainer}>
            <TextInput
              style={[styles.input, locationAddressLocked && styles.inputLocked, { flex: 1, marginBottom: 0 }]}
              placeholder="Dirección *"
              placeholderTextColor={Colors.textMuted}
              value={locationAddress}
              onChangeText={handleSearchChangeInForm}
              editable={!locationAddressLocked && !loading}
            />
            {locationAddressLocked && (
              <TouchableOpacity onPress={() => setLocationAddressLocked(false)} style={styles.editButton}>
                <Ionicons name="pencil" size={20} color={Colors.gray300} />
              </TouchableOpacity>
            )}
          </View>

          {!locationAddressLocked && addressSuggestions.length > 0 && (
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={addressSuggestions}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              style={styles.suggestionList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSelectAddressSuggestion(item)}
                >
                  <Text style={styles.suggestionMain}>{item.mainText}</Text>
                  <Text style={styles.suggestionSecondary}>{item.secondaryText}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <TextInput style={styles.input} placeholder="Teléfono del negocio *" placeholderTextColor={Colors.textMuted}
            value={businessPhone} onChangeText={setBusinessPhone}
            keyboardType="phone-pad" editable={!loading} />

          <Text style={styles.formSectionTitle}>Datos del responsable</Text>

          <TextInput style={styles.input} placeholder="Nombre *" placeholderTextColor={Colors.textMuted}
            value={ownerName} onChangeText={setOwnerName} editable={!loading} />

          <TextInput style={styles.input} placeholder="Apellido *" placeholderTextColor={Colors.textMuted}
            value={ownerLastName} onChangeText={setOwnerLastName} editable={!loading} />

          <TextInput style={styles.input} placeholder="Email *" placeholderTextColor={Colors.textMuted}
            value={email} onChangeText={setEmail} autoCapitalize="none"
            keyboardType="email-address" editable={!loading} />

          <TextInput style={styles.input} placeholder="Contraseña *" placeholderTextColor={Colors.textMuted}
            value={password} onChangeText={setPassword} secureTextEntry editable={!loading} />

          <TextInput style={styles.input} placeholder="CUIT (opcional)" placeholderTextColor={Colors.textMuted}
            value={cuit} onChangeText={setCuit} keyboardType="numeric" editable={!loading} />

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Registrar negocio</Text>}
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity onPress={() => router.push('/(auth)/login')} disabled={loading}>
        <Text style={styles.link}>¿Ya tenés cuenta? Iniciá sesión</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}