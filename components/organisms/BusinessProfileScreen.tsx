import { AppText, Button } from '@/components/atoms';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { locationService } from '@/services/api';
import { MapboxPrediction, searchPlaces } from '@/services/maps';
import { BusinessProfileResponse } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from './BusinessProfileScreen.styles';

type ClaimStatus = 'UNCLAIMED' | 'PENDING' | 'PENDING_FORMAL' | 'CLAIMED';

export default function BusinessProfileScreen() {
  const { logout } = useAuth();
  const [ownerName, setOwnerName] = useState('');
  const [ownerLastName, setOwnerLastName] = useState('');
  const [email, setEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [cuit, setCuit] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>('PENDING');
  const [locationNameLocked, setLocationNameLocked] = useState(true);
  const [locationAddressLocked, setLocationAddressLocked] = useState(true);

  const [addressQuery, setAddressQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MapboxPrediction[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<MapboxPrediction | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectingRef = useRef(false);
  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    locationService.getProfile().then((data: BusinessProfileResponse) => {
      setOwnerName(data.ownerName);
      setOwnerLastName(data.ownerLastName);
      setEmail(data.email);
      setBusinessPhone(data.businessPhone);
      setCuit(data.cuit ?? '');
      setLocationName(data.locationName);
      setLocationAddress(data.locationAddress);
      setAddressQuery(data.locationAddress);
      setClaimStatus(data.claimStatus);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (locationAddressLocked || selectedAddress) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!addressQuery.trim()) { setSuggestions([]); return; }
      const results = await searchPlaces(addressQuery);
      setSuggestions(results);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [addressQuery, locationAddressLocked]);

  useEffect(() => {
    return () => { if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current); };
  }, []);

  const clearBannerAfterDelay = () => {
    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    bannerTimerRef.current = setTimeout(() => {
      setError(null);
      setSuccess(false);
    }, 3000);
  };

  const handleSelectSuggestion = (prediction: MapboxPrediction) => {
    selectingRef.current = true;
    setSelectedAddress(prediction);
    setAddressQuery(prediction.mainText);
    setLocationAddress(prediction.placeName);
    setSuggestions([]);
  };

  const handleUnlockAddress = () => {
    setLocationAddressLocked(false);
    setSelectedAddress(null);
    setSuggestions([]);
  };

  const handleLockAddress = () => {
    setLocationAddressLocked(true);
    setSuggestions([]);
  };

  const handleClearAddress = () => {
    setSelectedAddress(null);
    setAddressQuery('');
    setLocationAddress('');
    setSuggestions([]);
  };

  const handleSave = async () => {
    if (!ownerName || !ownerLastName || !businessPhone) {
      setError('Por favor completá los campos obligatorios.');
      clearBannerAfterDelay();
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await locationService.updateProfile({
        ownerName,
        ownerLastName,
        businessPhone,
        cuit: cuit.trim() || undefined,
        locationName: locationNameLocked ? undefined : locationName,
        locationAddress: locationAddressLocked ? undefined : locationAddress,
      });
      setSuccess(true);
      clearBannerAfterDelay();
    } catch (e: any) {
      setError(e.message ?? 'Error al guardar los cambios.');
      clearBannerAfterDelay();
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.flex, styles.centered]}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  const isPending = claimStatus === 'PENDING' || claimStatus === 'PENDING_FORMAL';

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <AppText variant="h3" color="white">Mi negocio</AppText>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <AppText variant="h2" color="white">
                {locationName.charAt(0).toUpperCase()}
              </AppText>
            </View>
            <AppText variant="body" color="secondary">{email}</AppText>
            {isPending && (
              <View style={styles.pendingBadge}>
                <Ionicons name="time-outline" size={13} color={Colors.warning} />
                <AppText variant="caption" style={styles.pendingBadgeText}>
                  {claimStatus === 'PENDING_FORMAL' ? 'Verificación pendiente' : 'Aprobación pendiente'}
                </AppText>
              </View>
            )}
          </View>

          <View style={styles.form}>
            <AppText variant="label" color="secondary" style={styles.fieldLabel}>Negocio</AppText>
            <View style={styles.lockedRow}>
              <TextInput
                style={[styles.input, locationNameLocked && styles.inputLocked, { flex: 1, marginBottom: 0 }]}
                value={locationName}
                onChangeText={setLocationName}
                editable={!locationNameLocked && !saving}
                placeholderTextColor={Colors.textMuted}
              />
              <TouchableOpacity
                onPress={() => setLocationNameLocked(v => !v)}
                style={styles.editButton}
              >
                <Ionicons
                  name={locationNameLocked ? 'pencil-outline' : 'checkmark-outline'}
                  size={18}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </View>

            <AppText variant="label" color="secondary" style={styles.fieldLabel}>Dirección</AppText>
            <View style={styles.lockedRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.addressRow}>
                  <TextInput
                    style={[styles.input, locationAddressLocked && styles.inputLocked, { flex: 1, marginBottom: 0 }]}
                    value={addressQuery}
                    onChangeText={(text) => {
                      setAddressQuery(text);
                      if (selectedAddress && !selectingRef.current) setSelectedAddress(null);
                      selectingRef.current = false;
                    }}
                    editable={!locationAddressLocked && !saving}
                    placeholderTextColor={Colors.textMuted}
                  />
                  {!locationAddressLocked && selectedAddress && (
                    <TouchableOpacity onPress={handleClearAddress} style={styles.clearButton}>
                      <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
                    </TouchableOpacity>
                  )}
                </View>
                {suggestions.length > 0 && (
                  <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.id}
                    keyboardShouldPersistTaps="handled"
                    scrollEnabled={false}
                    style={styles.suggestions}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleSelectSuggestion(item)}
                        style={styles.suggestionItem}
                      >
                        <Ionicons name="location-outline" size={16} color={Colors.textMuted}
                          style={{ marginRight: Spacing.sm }} />
                        <View style={{ flex: 1 }}>
                          <AppText variant="body">{item.mainText}</AppText>
                          <AppText variant="bodySmall" color="secondary">{item.secondaryText}</AppText>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
              <TouchableOpacity
                onPress={locationAddressLocked ? handleUnlockAddress : handleLockAddress}
                style={styles.editButton}
              >
                <Ionicons
                  name={locationAddressLocked ? 'pencil-outline' : 'checkmark-outline'}
                  size={18}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </View>

            <AppText variant="label" color="secondary" style={styles.fieldLabel}>Nombre del responsable *</AppText>
            <TextInput style={styles.input} value={ownerName} onChangeText={setOwnerName}
              editable={!saving} placeholderTextColor={Colors.textMuted} />

            <AppText variant="label" color="secondary" style={styles.fieldLabel}>Apellido *</AppText>
            <TextInput style={styles.input} value={ownerLastName} onChangeText={setOwnerLastName}
              editable={!saving} placeholderTextColor={Colors.textMuted} />

            <AppText variant="label" color="secondary" style={styles.fieldLabel}>Teléfono *</AppText>
            <TextInput style={styles.input} value={businessPhone} onChangeText={setBusinessPhone}
              keyboardType="phone-pad" editable={!saving} placeholderTextColor={Colors.textMuted} />

            <AppText variant="label" color="secondary" style={styles.fieldLabel}>CUIT (opcional)</AppText>
            <TextInput style={styles.input} value={cuit} onChangeText={setCuit}
              keyboardType="numeric" editable={!saving} placeholderTextColor={Colors.textMuted} />
          </View>

          {error && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={18} color={Colors.white} />
              <AppText variant="bodySmall" style={styles.bannerText}>{error}</AppText>
            </View>
          )}
          {success && (
            <View style={styles.successBanner}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.white} />
              <AppText variant="bodySmall" style={styles.bannerText}>Cambios guardados correctamente.</AppText>
            </View>
          )}

          <Button label="Guardar cambios" onPress={handleSave} loading={saving} fullWidth />

          <TouchableOpacity onPress={handleLogout} style={[styles.logoutButton, { marginBottom: Spacing.lg }]}>
            <Ionicons name="log-out-outline" size={18} color={Colors.error} />
            <AppText variant="label" color="error" style={{ marginLeft: Spacing.xs }}>Cerrar sesión</AppText>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}