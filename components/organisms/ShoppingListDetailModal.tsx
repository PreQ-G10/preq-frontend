import { AppText, Button, Spinner } from '@/components/atoms';
import { Colors } from '@/constants/theme';
import { shoppingListService } from '@/services/api';
import { ShoppingListResponse, UpdateShoppingListRequest } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from './ShoppingListDetailModal.styles';

interface LocalItem {
  id: number;
  productId: number;
  name: string;
  brand: string;
  quantity: string;
  quantityType: string;
  cartQuantity: number;
  localCheckedQuantity: number;
}

function formatSavedAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 10) return 'Guardado ahora';
  if (seconds < 60) return `Guardado hace ${seconds} segundos`;
  const minutes = Math.floor(seconds / 60);
  return `Guardado hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
}

interface ShoppingListDetailModalProps {
  listId: number;
  visible: boolean;
  onClose: () => void;
  onUpdated: (id: number, completed: boolean) => void;
}

export function ShoppingListDetailModal({
  listId,
  visible,
  onClose,
  onUpdated,
}: ShoppingListDetailModalProps) {
  const [list, setList] = useState<ShoppingListResponse | null>(null);
  const [items, setItems] = useState<LocalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [savedAgoText, setSavedAgoText] = useState('');
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const savedAgoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await shoppingListService.getById(listId);
      setList(data);
      setItems(data.items.map((item) => ({
        ...item,
        localCheckedQuantity: item.checkedQuantity,
      })));
    } finally {
      setLoading(false);
    }
  }, [listId]);

  useEffect(() => {
    if (visible) load();
  }, [visible, load]);

  useEffect(() => {
    if (!lastSaved) return;
    setSavedAgoText(formatSavedAgo(lastSaved));
    savedAgoRef.current = setInterval(() => {
      setSavedAgoText(formatSavedAgo(lastSaved));
    }, 10000);
    return () => { if (savedAgoRef.current) clearInterval(savedAgoRef.current); };
  }, [lastSaved]);

  const buildUpdateRequest = useCallback((completed: boolean): UpdateShoppingListRequest => ({
    completed,
    items: items.map((item) => ({
      itemId: item.id,
      checkedQuantity: item.localCheckedQuantity,
    })),
  }), [items]);

  const save = useCallback(async (completed: boolean) => {
    if (!list) return;
    setSaving(true);
    try {
      const updated = await shoppingListService.update(list.id, buildUpdateRequest(completed));
      setList(updated);
      setLastSaved(new Date());
      onUpdated(list.id, updated.completed);
    } finally {
      setSaving(false);
    }
  }, [list, buildUpdateRequest, onUpdated]);

  useEffect(() => {
    if (!list || loading) return;
    autoSaveRef.current = setInterval(() => { save(list.completed); }, 2 * 60 * 1000);
    return () => { if (autoSaveRef.current) clearInterval(autoSaveRef.current); };
  }, [list, loading, save]);

  const handleAdd = (productId: number) => {
    setItems((prev) => prev.map((item) =>
      item.productId === productId && item.localCheckedQuantity < item.cartQuantity
        ? { ...item, localCheckedQuantity: item.localCheckedQuantity + 1 }
        : item
    ));
  };

  const handleSubtract = (productId: number) => {
    setItems((prev) => prev.map((item) =>
      item.productId === productId && item.localCheckedQuantity > 0
        ? { ...item, localCheckedQuantity: item.localCheckedQuantity - 1 }
        : item
    ));
  };

  const handleComplete = () => {
    Alert.alert('Finalizar lista', '¿Marcar esta lista como finalizada?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Finalizar', onPress: () => save(true) },
    ]);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <SafeAreaView style={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <AppText variant="h3" color="white" numberOfLines={1}>
              {list?.locationName ?? ''}
            </AppText>
            {lastSaved && (
              <AppText variant="caption" style={styles.savedAgo}>{savedAgoText}</AppText>
            )}
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {loading ? (
          <Spinner fullScreen />
        ) : !list ? (
          <View style={styles.empty}>
            <AppText variant="body" color="muted">No se pudo cargar la lista.</AppText>
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
              <AppText variant="bodySmall" color="secondary" style={styles.address}>
                {list.locationAddress}
              </AppText>

              <View style={styles.items}>
                {items.map((item) => {
                  const isChecked = item.localCheckedQuantity === item.cartQuantity;
                  return (
                    <View key={item.id} style={styles.itemRow}>
                      <View style={[styles.checkBox, isChecked && styles.checkBoxChecked]}>
                        <Ionicons
                          name={isChecked ? 'checkmark' : 'ellipse-outline'}
                          size={16}
                          color={isChecked ? Colors.white : Colors.textMuted}
                        />
                      </View>
                      <View style={styles.itemName}>
                        <AppText variant="body" style={isChecked ? styles.itemNameChecked : undefined}>
                          {item.name}
                        </AppText>
                        <AppText variant="bodySmall" color={isChecked ? 'muted' : 'secondary'}>
                          {item.brand} · {item.quantity} {item.quantityType}
                        </AppText>
                      </View>
                      <View style={styles.progressColumn}>
                        <AppText variant="label" style={[styles.itemQuantity, isChecked && styles.itemQuantityChecked]}>
                          {item.localCheckedQuantity}/{item.cartQuantity}
                        </AppText>
                        <AppText variant="caption" color="muted">agregados</AppText>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleSubtract(item.productId)}
                        style={styles.subtractButton}
                        activeOpacity={0.75}
                        disabled={item.localCheckedQuantity === 0}
                      >
                        <Ionicons name="remove" size={18} color={Colors.white} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleAdd(item.productId)}
                        style={styles.addButton}
                        activeOpacity={0.75}
                        disabled={isChecked}
                      >
                        <Ionicons name="add" size={18} color={Colors.white} />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.footer}>
              {!list.completed && (
                <Button
                  label="Marcar como finalizada"
                  variant="ghost"
                  fullWidth
                  onPress={handleComplete}
                />
              )}
              <Button
                label="Guardar"
                variant="primary"
                fullWidth
                loading={saving}
                onPress={() => save(list.completed)}
              />
            </View>
          </>
        )}
      </SafeAreaView>
    </Modal>
  );
}