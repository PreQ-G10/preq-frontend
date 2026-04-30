import { AppText, Button, Input } from '@/components/atoms';
import { Colors } from '@/constants/theme';
import { productService } from '@/services/api';
import { Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { styles } from './CreateProductForm.styles';

interface CreateProductFormProps {
  photoUri?: string;
  onCreated: (product: Product) => void;
}

interface CreateProductFormProps {
  photoUri?: string;
  initialBarcode?: string;
  onCreated: (product: Product) => void;
}

export function CreateProductForm({ photoUri, initialBarcode, onCreated }: CreateProductFormProps) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [quantity, setQuantity] = useState('');
  const [quantityType, setQuantityType] = useState('');
  const [barcode, setBarcode] = useState(initialBarcode ?? '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'El nombre es obligatorio';
    if (!brand.trim()) e.brand = 'La marca es obligatoria';
    if (!quantity.trim()) e.quantity = 'La cantidad es obligatoria';
    if (!quantityType.trim()) e.quantityType = 'La unidad es obligatoria';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
        const product = await productService.create({
            name,
            brand,
            quantity: Number(quantity),
            quantityType,
            barcode: barcode || undefined,
        }, photoUri);
        onCreated(product);
    } finally {
        setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.photoPreview} resizeMode="cover" />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Ionicons name="camera-outline" size={32} color={Colors.gray400} />
          <AppText variant="bodySmall" color="muted">Sin foto</AppText>
        </View>
      )}
      <Input label="Nombre del producto" value={name} onChangeText={setName} placeholder="Ej: Pasta de Maní Natural" error={errors.name} />
      <Input label="Marca" value={brand} onChangeText={setBrand} placeholder="Ej: Maní King" error={errors.brand} />
      <View style={styles.row}>
        <Input label="Cantidad" value={quantity} onChangeText={setQuantity} placeholder="485" keyboardType="numeric" error={errors.quantity} style={styles.flex} />
        <Input label="Unidad" value={quantityType} onChangeText={setQuantityType} placeholder="g / ml / u" error={errors.quantityType} style={styles.flex} />
      </View>
      <View>
        <Input
          label="Código de barras (opcional)"
          value={barcode}
          onChangeText={setBarcode}
          placeholder="7790001234567"
          keyboardType="numeric"
        />
        {initialBarcode && (
          <View style={styles.autocompleteBadge}>
            <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
            <AppText variant="bodySmall" color="success">Autocompletado desde el escaneo</AppText>
          </View>
        )}
      </View>
      <Button label="Crear producto" onPress={handleSubmit} loading={loading} fullWidth style={styles.submitButton} />
    </View>
  );
}
