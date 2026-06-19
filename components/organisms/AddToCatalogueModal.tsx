import { AppText } from '@/components/atoms';
import { Colors } from '@/constants/theme';
import { catalogueService } from '@/services/api';
import { Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
    Animated,
    KeyboardAvoidingView,
    Modal,
    Platform,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { styles } from './AddToCatalogueModal.styles';

interface Props {
  visible: boolean;
  product: Product;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddToCatalogueModal({ visible, product, onClose, onSuccess }: Props) {
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const showSuccess = () => {
    setSuccess(true);
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
    setTimeout(() => {
      setSuccess(false);
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(0);
      setPrice('');
      onSuccess?.();
      onClose();
    }, 2000);
  };

  const handleSubmit = async () => {
    const parsed = parseFloat(price.replace(',', '.'));
    if (!price.trim() || isNaN(parsed) || parsed <= 0) {
      setError('Ingresá un precio válido.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await catalogueService.addToCatalogue({ productId: product.id, price: parsed });
      showSuccess();
    } catch (e: any) {
      setError(e.message ?? 'Error al agregar al catálogo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
        >
        <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
                {success ? (
                  <Animated.View style={[styles.successContainer, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
                    <View style={styles.successIcon}>
                      <Ionicons name="checkmark" size={40} color={Colors.white} />
                    </View>
                    <AppText variant="h3" style={styles.successTitle}>¡Agregado!</AppText>
                    <AppText variant="body" color="secondary">{product.name} fue agregado a tu catálogo.</AppText>
                  </Animated.View>
                ) : (
                  <>
                    <AppText variant="h3" style={styles.title}>Agregar al catálogo</AppText>
                    <AppText variant="body" color="secondary" style={styles.productName}>
                      {product.name} · {product.brand}
                    </AppText>
                    <AppText variant="bodySmall" color="secondary" style={styles.productMeta}>
                      {product.quantity} {product.quantityType}
                    </AppText>
                
                    <AppText variant="label" style={styles.priceLabel}>Precio actual ($)</AppText>
                    <TextInput
                      style={styles.input}
                      value={price}
                      onChangeText={setPrice}
                      placeholder="Ej: 1500.00"
                      placeholderTextColor={Colors.textMuted}
                      keyboardType="number-pad"
                      onSubmitEditing={handleSubmit}
                      autoFocus
                    />
    
                    {error && (
                      <AppText variant="bodySmall" color="error" style={styles.error}>{error}</AppText>
                    )}
    
                    <TouchableOpacity
                      style={[styles.button, loading && styles.buttonDisabled]}
                      onPress={handleSubmit}
                      disabled={loading}
                    >
                      <AppText variant="label" color="white">
                        {loading ? 'Agregando...' : 'Agregar al catálogo'}
                      </AppText>
                    </TouchableOpacity>
                
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                      <AppText variant="label" color="secondary">Cancelar</AppText>
                    </TouchableOpacity>
                  </>
                )}
                </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    </Modal>
    );
}