import { AppText, Button, Chip, Input } from '@/components/atoms';
import { LOCATION_TYPES, LOCATION_TYPE_LABELS } from '@/constants/locations';
import { Colors, Spacing } from '@/constants/theme';
import { locationService } from '@/services/api';
import { Location } from '@/types';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

interface CreateLocationFormProps {
  onCreated: (location: Location) => void;
  onCancel: () => void;
}

export function CreateLocationForm({ onCreated, onCancel }: CreateLocationFormProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<Location['type']>('SUPERMARKET');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'El nombre es obligatorio';
    if (!address.trim()) e.address = 'La dirección es obligatoria';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
      const location = await locationService.create(name, address, type);
      onCreated(location);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppText variant="h3">Agregar lugar</AppText>
        <Button label="Cancelar" variant="ghost" size="sm" onPress={onCancel} />
      </View>
      <View style={styles.form}>
        <Input label="Nombre" value={name} onChangeText={setName} placeholder="Ej: Coto Express" error={errors.name} />
        <Input label="Dirección" value={address} onChangeText={setAddress} placeholder="Ej: Av Calchaqui 600" error={errors.address} />
        <AppText variant="label">Tipo</AppText>
        <View style={styles.chips}>
          {LOCATION_TYPES.map(t => (
            <Chip key={t} label={LOCATION_TYPE_LABELS[t]} selected={type === t} onPress={() => setType(t)} />
          ))}
        </View>
        <Button label="Guardar lugar" onPress={handleSubmit} loading={loading} fullWidth />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  form: { padding: Spacing.lg, gap: Spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
});