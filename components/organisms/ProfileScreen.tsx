import { AppText, Button } from '@/components/atoms';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { userService } from '@/services/api';
import { MapboxPrediction, searchPlaces } from '@/services/maps';
import { UserProfile } from '@/types';
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
import { styles } from './ProfileScreen.styles';

export default function ProfileScreen() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [addressQuery, setAddressQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MapboxPrediction[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<MapboxPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectingRef = useRef(false);
  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    userService.getProfile().then((data) => {
      setProfile(data);
      setName(data.name);
      setLastName(data.lastName);
      if (data.address) {
        setAddressQuery(data.address);
        if (data.latitude && data.longitude) {
          setSelectedAddress({
            id: 'stored',
            placeName: data.address,
            mainText: data.address,
            secondaryText: '',
            latitude: data.latitude,
            longitude: data.longitude,
          });
        }
      }
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedAddress) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const results = await searchPlaces(addressQuery);
      setSuggestions(results);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [addressQuery]);

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
    setSuggestions([]);
  };

  const handleClearAddress = () => {
    setSelectedAddress(null);
    setAddressQuery('');
    setSuggestions([]);
  };

  const handleSave = async () => {
    if (!name || !lastName) {
      setError('Nombre y apellido son obligatorios.');
      clearBannerAfterDelay();
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await userService.updateProfile({
        name,
        lastName,
        address: selectedAddress?.placeName ?? (addressQuery.trim() || undefined),
        latitude: selectedAddress?.latitude ?? undefined,
        longitude: selectedAddress?.longitude ?? undefined,
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

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <AppText variant="h3" color="white">Mi perfil</AppText>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <AppText variant="h2" color="white">
                {name.charAt(0).toUpperCase()}{lastName.charAt(0).toUpperCase()}
              </AppText>
            </View>
            <AppText variant="body" color="secondary">{profile?.email}</AppText>
          </View>

          <View style={styles.form}>
            <AppText variant="label" color="secondary" style={styles.fieldLabel}>Nombre *</AppText>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
              editable={!saving}
            />

            <AppText variant="label" color="secondary" style={styles.fieldLabel}>Apellido *</AppText>
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              placeholderTextColor={Colors.textMuted}
              value={lastName}
              onChangeText={setLastName}
              editable={!saving}
            />

            <AppText variant="label" color="secondary" style={styles.fieldLabel}>Dirección</AppText>
            <View style={styles.addressRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Dirección (opcional)"
                placeholderTextColor={Colors.textMuted}
                value={addressQuery}
                onChangeText={(text) => {
                  setAddressQuery(text);
                  if (selectedAddress && !selectingRef.current) setSelectedAddress(null);
                  selectingRef.current = false;
                }}
                editable={!saving && !selectedAddress}
              />
              {selectedAddress && (
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
                  <TouchableOpacity onPress={() => handleSelectSuggestion(item)} style={styles.suggestionItem}>
                    <Ionicons name="location-outline" size={16} color={Colors.textMuted} style={{ marginRight: Spacing.sm }} />
                    <View style={{ flex: 1 }}>
                      <AppText variant="body">{item.mainText}</AppText>
                      <AppText variant="bodySmall" color="secondary">{item.secondaryText}</AppText>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
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

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={18} color={Colors.error} />
            <AppText variant="label" color="error" style={{ marginBottom: Spacing.md, marginLeft: Spacing.xs }}>
              Cerrar sesión
            </AppText>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}