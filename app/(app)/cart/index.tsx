import { AppText, Button, Card } from '@/components/atoms';
import { Routes } from '@/constants/routes';
import { Colors } from '@/constants/theme';
import { useCart } from '@/context/cartContext';
import { saveShoppingList } from '@/utils/shoppingLists';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from './index.styles';

export default function CartScreen() {
  const { items, updateQuantity, clearCart, totalItems } = useCart();
  const [savingList, setSavingList] = useState(false);

  const handleSaveShoppingList = async () => {
    if (items.length === 0 || savingList) {
      return;
    }

    setSavingList(true);
    try {
      await saveShoppingList(items);
      router.push(Routes.cartLists as never);
    } catch {
      Alert.alert('No se pudo guardar', 'Intentá nuevamente en unos segundos.');
    } finally {
      setSavingList(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <AppText variant="h3" color="white" style={styles.headerTitle}>Mi canasta</AppText>
        {items.length > 0 ? (
          <TouchableOpacity onPress={clearCart} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={20} color={Colors.white} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 36 }} />
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="cart-outline" size={48} color={Colors.gray300} />
          </View>
          <AppText variant="h3" color="secondary">Tu canasta está vacía</AppText>
          <AppText variant="body" color="muted" style={{ textAlign: 'center' }}>
            Agregá productos para comparar precios entre locales
          </AppText>
          <Button
            label="Buscar productos"
            variant="primary"
            onPress={() => router.push(Routes.search)}
          />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <AppText variant="bodySmall" color="secondary" style={styles.itemCount}>
              {totalItems} producto{totalItems !== 1 ? 's' : ''} en tu canasta
            </AppText>

            {items.map(({ product, quantity }) => (
              <Card key={product.id} elevated padded>
                <View style={styles.itemRow}>
                  <View style={styles.itemIcon}>
                    <Ionicons name="cube-outline" size={24} color={Colors.primary} />
                  </View>
                  <View style={styles.itemInfo}>
                    <AppText variant="body">{product.name}</AppText>
                    <AppText variant="bodySmall" color="secondary">
                      {product.brand} · {product.quantity} {product.quantityType}
                    </AppText>
                  </View>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={[styles.qtyButton, quantity === 1 && styles.qtyButtonDanger]}
                      onPress={() => updateQuantity(product.id, quantity - 1)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={quantity === 1 ? 'trash-outline' : 'remove'}
                        size={16}
                        color={quantity === 1 ? Colors.error : Colors.text}
                      />
                    </TouchableOpacity>
                    <AppText variant="label" style={styles.qtyValue}>{quantity}</AppText>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => updateQuantity(product.id, quantity + 1)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="add" size={16} color={Colors.text} />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.footerActions}>
              <Button
                label="Comparar precios ubicación"
                variant="primary"
                fullWidth
                onPress={() => router.push(Routes.cartCompare)}
              />
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}