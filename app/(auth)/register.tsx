import { BusinessRegisterForm } from '@/components/organisms/BusinessRegisterForm';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { authService } from '@/services/api';
import { MapboxPrediction, searchPlaces } from '@/services/maps';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from './register.styles';

type Tab = 'user' | 'business';

export default function RegisterScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('user');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [addressQuery, setAddressQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MapboxPrediction[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<MapboxPrediction | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectingRef = useRef(false);

  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (selectedAddress) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const results = await searchPlaces(addressQuery);
      setSuggestions(results);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [addressQuery]);

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

  const handleRegister = async () => {
    if (!name || !lastName || !email || !password) {
      setError('Por favor completá los campos obligatorios.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register({
        name,
        lastName,
        address: selectedAddress?.placeName ?? undefined,
        latitude: selectedAddress?.latitude ?? undefined,
        longitude: selectedAddress?.longitude ?? undefined,
        role: activeTab.toUpperCase(),
        email,
        password,
      });
      await login(data.accessToken, data.refreshToken);
    } catch (e: any) {
      setError(e.message ?? 'Error al registrarse. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Crear cuenta</Text>

        {/* Folder tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'user' && styles.tabActive]}
            onPress={() => setActiveTab('user')}
          >
            <Text style={[styles.tabText, activeTab === 'user' && styles.tabTextActive]}>
              Persona
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'business' && styles.tabActive]}
            onPress={() => setActiveTab('business')}
          >
            <Text style={[styles.tabText, activeTab === 'business' && styles.tabTextActive]}>
              Negocio
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form card — connects to active tab */}
        <View style={styles.formCard}>
          {activeTab === 'business' ? (
            <BusinessRegisterForm />
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nombre *"
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={setName}
                editable={!loading}
              />

              <TextInput
                style={styles.input}
                placeholder="Apellido *"
                placeholderTextColor={Colors.textMuted}
                value={lastName}
                onChangeText={setLastName}
                editable={!loading}
              />

              <View style={{ marginBottom: Spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                    editable={!loading && !selectedAddress}
                  />
                  {selectedAddress && (
                    <TouchableOpacity onPress={handleClearAddress} style={{ marginLeft: Spacing.sm, padding: Spacing.sm }}>
                      <Text style={{ color: Colors.textSecondary, fontSize: Typography.sizes.lg }}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {suggestions.length > 0 && (
                  <FlatList
                    keyboardShouldPersistTaps="handled"
                    data={suggestions}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    style={styles.suggestionList}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleSelectSuggestion(item)}
                        style={styles.suggestionItem}
                      >
                        <Text style={styles.suggestionMain}>{item.mainText}</Text>
                        <Text style={styles.suggestionSecondary}>{item.secondaryText}</Text>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>

              <TextInput
                style={styles.input}
                placeholder="Email *"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />

              <TextInput
                style={styles.input}
                placeholder="Contraseña *"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />

              {error && <Text style={styles.error}>{error}</Text>}

              <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Registrarse</Text>}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/(auth)/login')} disabled={loading}>
                <Text style={styles.link}>¿Ya tenés cuenta? Iniciá sesión</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}