import { AppText, Button, Card, Spinner } from '@/components/atoms';
import { ContestProductModal } from '@/components/organisms/ContestProductModal';
import { ProductCameraModal } from '@/components/organisms/ProductCameraModal';
import { Routes } from '@/constants/routes';
import { Colors } from '@/constants/theme';
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
  Platform,
  SafeAreaView,
  ScrollView,
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
  const [contestModalVisible, setContestModalVisible] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);

  const inCart = items.some((i) => i.product.id === Number(id));
  const cartQuantity = items.find((i) => i.product.id === Number(id))?.quantity ?? 0;

  useEffect(() => {
    Promise.all([
      productService.getById(Number(id)),
      priceService.getSummary(Number(id)).catch(() => null),
    ])
      .then(([prod, sum]) => {
        setProduct(prod);
        setSummary(sum);
      })
      .finally(() => setLoading(false));
  }, [id]);

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

      {/* ── Top navigation bar ── */}
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

        {/* ── Image gallery ── */}
        {hasImages ? (
          <View style={styles.galleryContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                setActiveImage(
                  Math.round(e.nativeEvent.contentOffset.x / width)
                );
              }}
            >
              {product.images.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.addPhotoButton} onPress={() => setCameraVisible(true)}>
              <Ionicons name="camera" size={20} color={Colors.white} />
            </TouchableOpacity>

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
            <TouchableOpacity style={styles.addPhotoPlaceholder} onPress={() => setCameraVisible(true)}>
              <AppText variant="label" color="primary">Añadir foto</AppText>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Product identity ── */}
        <View style={styles.productSection}>
          {/* Name + barcode badge */}
          <View style={styles.nameRow}>
            <AppText variant="h2" style={styles.productName}>{product.name}</AppText>
            {product.barcode && (
              <View style={styles.barcodeBadge}>
                <Ionicons name="barcode-outline" size={13} color={Colors.text} />
                <AppText variant="caption" color="secondary" style={styles.barcodeText}>
                  {product.barcode}
                </AppText>
              </View>
            )}
          </View>

          <AppText variant="body" color="secondary" style={styles.brandText}>{product.brand}</AppText>
          <AppText variant="bodySmall" color="muted" style={styles.quantityText}>
            {product.quantity}{product.quantityType ? ` ${product.quantityType}` : ''}
          </AppText>

          <TouchableOpacity
            onPress={() => setContestModalVisible(true)}
            style={styles.contestTrigger}
          >
            <Ionicons name="alert-circle-outline" size={15} color={Colors.primary} />
            <AppText variant="label" color="primary">¿Esta información no es correcta o falta información?</AppText>
          </TouchableOpacity>
        </View>

        {/* ── Price snapshot ── */}
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
              <AppText variant="caption" color="muted" style={styles.emptyPriceCaption}>
                Sé el primero en colaborar con el precio
              </AppText>
            </View>
          </Card>
        )}

        {/* ── Cart ── */}
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

        {/* ── Actions ── */}
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

      {/* ── Modals ── */}
      <ContestProductModal
        visible={contestModalVisible}
        product={product}
        onClose={() => setContestModalVisible(false)}
        onSuccess={() => productService.getById(Number(id)).then(setProduct)}
      />

      <ProductCameraModal
        visible={cameraVisible}
        productId={Number(id)}
        onClose={() => setCameraVisible(false)}
        onSuccess={() => {
          if (Platform.OS === 'android') {
            Alert.alert('Éxito', 'Foto enviada correctamente');
          } else {
            Alert.alert('Éxito', 'Foto enviada correctamente');
          }
          productService.getById(Number(id)).then(setProduct);
        }}
      />

    </SafeAreaView>
  );
}