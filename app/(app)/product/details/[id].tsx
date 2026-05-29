import { AppText, Button, Card, Spinner } from '@/components/atoms';
import { Routes } from '@/constants/routes';
import { Colors, Spacing } from '@/constants/theme';
import { useCart } from '@/context/cartContext';
import { priceService, productService } from '@/services/api';
import { PriceSummaryResponse, Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from './[id].styles';

const { width } = Dimensions.get('window');

function formatPrice(value: number) {
  return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart, items, updateQuantity } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [summary, setSummary] = useState<PriceSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // Contest state
  const [contestModalVisible, setContestModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState<{ key: string; label: string } | null>(null);
  const [contestValue, setContestValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const inCart = items.some((i) => i.product.id === Number(id));
  const cartQuantity = items.find((i) => i.product.id === Number(id))?.quantity ?? 0;

  useEffect(() => {
    Promise.all([
      productService.getById(Number(id)),
      priceService.getSummary(Number(id)).catch(() => null),
    ]).then(([prod, sum]) => {
      setProduct(prod);
      setSummary(sum);
    }).finally(() => setLoading(false));
  }, [id]);

  const openContest = (field: string, label: string, initialValue: string | number) => {
    setSelectedField({ key: field, label });
    setContestValue(initialValue.toString());
    setContestModalVisible(true);
  };

  const handleContestSubmit = async () => {
    if (!selectedField || !contestValue.trim()) return;

    const isNumeric = selectedField.key === 'QUANTITY';
    const finalValue = isNumeric ? parseFloat(contestValue) : contestValue;

    if (isNumeric && (isNaN(finalValue as number) || (finalValue as number) < 0)) {
      Alert.alert('Error', 'Por favor ingresá un valor numérico válido.');
      return;
    }

    setIsSubmitting(true);
    try {
      await productService.contestProductField(Number(id), selectedField.key, finalValue);
      Alert.alert('¡Gracias!', 'Tu reporte ha sido enviado para revisión.');
      setContestModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el reporte. Intentalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Spinner fullScreen message="Cargando producto..." />;
  if (!product) return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centered}>
        <AppText variant="body" color="secondary">Producto no encontrado.</AppText>
        <Button label="Volver" variant="ghost" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );

  const hasImages = product.images && product.images.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <AppText variant="h3" color="white" style={styles.headerTitle}>Producto</AppText>
        <TouchableOpacity onPress={() => router.push(Routes.cart)} style={styles.headerButton}>
          <Ionicons name="cart-outline" size={22} color={Colors.white} />
          {inCart && <View style={styles.cartDot} />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Image gallery */}
        {hasImages ? (
          <View style={styles.galleryContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                setActiveImage(Math.round(e.nativeEvent.contentOffset.x / (width - Spacing.lg * 2)));
              }}
            >
              {product.images.map((uri, index) => (
                <Image key={index} source={{ uri }} style={styles.productImage} resizeMode="cover" />
              ))}
            </ScrollView>
            {product.images.length > 1 && (
              <View style={styles.dots}>
                {product.images.map((_, index) => (
                  <View key={index} style={[styles.dot, index === activeImage && styles.dotActive]} />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="cube-outline" size={48} color={Colors.gray300} />
          </View>
        )}

        {/* Product identity */}
        <View style={styles.productSection}>
          <TouchableOpacity onPress={() => openContest('NAME', 'Nombre', product.name)}>
            <AppText variant="h2">{product.name}</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openContest('BRAND', 'Marca', product.brand)}>
            <AppText variant="body" color="secondary">{product.brand}</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openContest('QUANTITY', 'Cantidad', product.quantity)}>
            <AppText variant="bodySmall" color="muted">{product.quantity} {product.quantityType}</AppText>
          </TouchableOpacity>
        </View>

        {/* Price snapshot */}
        {summary && summary.weightedPrice > 0 ? (
          <Card elevated padded>
            <View style={styles.priceSnapshot}>
              <View style={styles.priceMain}>
                <AppText variant="label" color="primary">Precio estimado actual</AppText>
                <AppText style={styles.priceValue}>{formatPrice(summary.weightedPrice)}</AppText>
                <AppText variant="caption" color="muted">Ajustado por inflación reciente</AppText>
              </View>
              <View style={styles.priceDivider} />
              <View style={styles.priceRange}>
                <View style={styles.priceRangeItem}>
                  <Ionicons name="arrow-down" size={14} color={Colors.success} />
                  <AppText variant="bodySmall" color="secondary">{formatPrice(summary.minPrice)}</AppText>
                  <AppText variant="caption" color="muted">mínimo</AppText>
                </View>
                <View style={styles.priceRangeItem}>
                  <Ionicons name="arrow-up" size={14} color={Colors.error} />
                  <AppText variant="bodySmall" color="secondary">{formatPrice(summary.maxPrice)}</AppText>
                  <AppText variant="caption" color="muted">máximo</AppText>
                </View>
              </View>
            </View>
          </Card>
        ) : (
          <Card elevated padded>
            <View style={styles.emptyPrice}>
              <Ionicons name="pricetag-outline" size={32} color={Colors.gray300} />
              <AppText variant="body" color="secondary">Sin precios todavía</AppText>
              <AppText variant="caption" color="muted" style={{ textAlign: 'center' }}>
                Sé el primero en colaborar con el precio
              </AppText>
            </View>
          </Card>
        )}

        {/* Cart */}
        <Card elevated padded>
          <View style={styles.cartSection}>
            <View style={styles.cartInfo}>
              <AppText variant="label">Mi canasta</AppText>
              <AppText variant="bodySmall" color="secondary">
                {inCart
                  ? `${cartQuantity} unidad${cartQuantity > 1 ? 'es' : ''} en tu canasta`
                  : 'Agregá este producto para comparar su precio'}
              </AppText>
            </View>
            <View style={styles.quantityControls}>
              {inCart ? (
                <>
                  <TouchableOpacity
                    style={[styles.qtyButton, cartQuantity === 1 && styles.qtyButtonDanger]}
                    onPress={() => updateQuantity(product.id, cartQuantity - 1)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={cartQuantity === 1 ? 'trash-outline' : 'remove'}
                      size={16}
                      color={cartQuantity === 1 ? Colors.error : Colors.text}
                    />
                  </TouchableOpacity>
                  <AppText variant="label" style={styles.qtyValue}>{cartQuantity}</AppText>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => updateQuantity(product.id, cartQuantity + 1)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add" size={16} color={Colors.text} />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addToCart(product)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add" size={18} color={Colors.white} />
                  <AppText variant="label" color="white">Agregar</AppText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          {summary && summary.avgPrice > 0 && (
            <Button
              label="Ver detalle de precios"
              variant="secondary"
              onPress={() => router.push(Routes.priceDetails(Number(id)))}
            />
          )}
          <Button
            label="Colaborar con el precio"
            variant="primary"
            onPress={() => router.push({ pathname: Routes.priceCollaborate, params: { productId: id } })}
          />
        </View>

      </ScrollView>

      <Modal visible={contestModalVisible} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: Spacing.lg }}>
          <View style={{ backgroundColor: Colors.background, borderRadius: 12, padding: Spacing.lg }}>
            <AppText variant="h3">Corregir {selectedField?.label}</AppText>
            <AppText variant="bodySmall" color="secondary" style={{ marginVertical: Spacing.sm }}>
              ¿Cuál es el valor correcto para este campo?
            </AppText>
            
            <TextInput
              style={{ 
                borderWidth: 1, 
                borderColor: Colors.gray300, 
                borderRadius: 8, 
                padding: Spacing.md, 
                fontSize: 16,
                marginVertical: Spacing.md,
                color: Colors.text 
              }}
              value={contestValue}
              onChangeText={setContestValue}
              keyboardType={selectedField?.key === 'QUANTITY' ? 'numeric' : 'default'}
              autoFocus
            />

            <View style={{ gap: Spacing.sm }}>
              <Button 
                label="Enviar corrección" 
                onPress={handleContestSubmit} 
                loading={isSubmitting}
              />
              <TouchableOpacity onPress={() => setContestModalVisible(false)} style={{ alignSelf: 'center', padding: Spacing.sm }}>
                <AppText variant="label" color="muted">Cancelar</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}