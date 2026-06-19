import { AppText, Spinner } from '@/components/atoms';
import { Colors } from '@/constants/theme';
import { catalogueService } from '@/services/api';
import { CatalogueItem } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from './index.styles';

type SortKey = 'name' | 'price' | 'updatedAt';

export default function CatalogueScreen() {
  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [filtered, setFiltered] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogueItem | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [updatingPrice, setUpdatingPrice] = useState(false);
  const longPressRef = useRef(false);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let result = [...items];
    if (search.trim()) {
      result = result.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.brand.toLowerCase().includes(search.toLowerCase())
      );
    }
    result.sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name);
      if (sortKey === 'price') return a.price - b.price;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    setFiltered(result);
  }, [items, search, sortKey]);

  async function load() {
    setLoading(true);
    try {
      const data = await catalogueService.getCatalogue();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  function handleLongPress(id: number) {
    longPressRef.current = true;
    setSelectionMode(true);
    setSelectedIds(new Set([id]));
  }

  function handlePress(id: number) {
    if (!selectionMode) return;
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      if (next.size === 0) setSelectionMode(false);
      return next;
    });
  }

  function handleDeletePress(ids: number[]) {
    setDeletingIds(ids);
    setDeleteModalVisible(true);
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      const { deletedProductIds } = await catalogueService.deleteFromCatalogue({ productIds: deletingIds });
      setItems(prev => prev.filter(i => !deletedProductIds.includes(i.productId)));
      setSelectedIds(new Set());
      setSelectionMode(false);
    } catch {
      Alert.alert('Error', 'No se pudo eliminar. Intentá de nuevo.');
    } finally {
      setDeleting(false);
      setDeleteModalVisible(false);
    }
  }

  async function handleUpdatePrice() {
    if (!editingItem) return;
    const parsed = parseFloat(newPrice.replace(',', '.'));
    if (isNaN(parsed) || parsed <= 0) return;
    setUpdatingPrice(true);
    try {
      const updated = await catalogueService.updatePrices({
        updates: [{ productId: editingItem.productId, price: parsed }],
      });
      setItems(prev => prev.map(i => i.productId === editingItem.productId ? updated[0] : i));
      setEditingItem(null);
      setNewPrice('');
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el precio.');
    } finally {
      setUpdatingPrice(false);
    }
  }

  function exitSelectionMode() {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }

  const renderItem = ({ item }: { item: CatalogueItem }) => {
    const isSelected = selectedIds.has(item.productId);
    return (
      <TouchableOpacity
        style={[styles.itemCard, isSelected && styles.itemCardSelected]}
        onPress={() => handlePress(item.productId)}
        onLongPress={() => handleLongPress(item.productId)}
        activeOpacity={0.7}
      >
        {selectionMode && (
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <Ionicons name="checkmark" size={14} color={Colors.white} />}
          </View>
        )}

        <View style={styles.itemIconWrap}>
          <Ionicons name="cube-outline" size={20} color={Colors.primary} />
        </View>

        <View style={styles.itemInfo}>
          <AppText variant="body" style={styles.itemName}>{item.name}</AppText>
          <AppText variant="bodySmall" color="secondary">
            {item.brand} · {item.quantity} {item.quantityType}
          </AppText>
        </View>
        <View style={styles.itemActions}>
          <AppText style={styles.itemPrice}>${item.price.toFixed(2)}</AppText>
          {!selectionMode && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => { setEditingItem(item); setNewPrice(String(item.price)); }}
              >
                <Ionicons name="pencil-outline" size={18} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteActionButton]}
                onPress={() => handleDeletePress([item.productId])}
              >
                <Ionicons name="trash-outline" size={18} color={Colors.error} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {selectionMode ? (
          <>
            <TouchableOpacity onPress={exitSelectionMode}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
            <AppText variant="h3">{selectedIds.size} seleccionados</AppText>
            <TouchableOpacity onPress={() => handleDeletePress(Array.from(selectedIds))}>
              <Ionicons name="trash-outline" size={24} color={Colors.error} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            <AppText variant="h3">Mi catálogo</AppText>
            <View style={{ width: 24 }} />
          </>
        )}
      </View>

      <View style={styles.toolbar}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={16} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar en catálogo..."
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <AppText style={styles.sortLabel}>Ordenar por</AppText>
        <View style={styles.sortRow}>
          {(['name', 'price', 'updatedAt'] as SortKey[]).map(key => (
            <TouchableOpacity
              key={key}
              style={[styles.sortButton, sortKey === key && styles.sortButtonActive]}
              onPress={() => setSortKey(key)}
            >
              <AppText
                variant="caption"
                style={sortKey === key ? styles.sortTextActive : styles.sortText}
              >
                {key === 'name' ? 'Nombre' : key === 'price' ? 'Precio' : 'Reciente'}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.scorecard}>
        <AppText style={styles.scorecardNumber}>{items.length}</AppText>
        <AppText style={styles.scorecardLabel}>
          {items.length === 1 ? 'Producto' : 'Productos'}
        </AppText>
      </View>

      {loading ? (
        <Spinner message="Cargando catálogo..." />
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="grid-outline" size={48} color={Colors.gray300} />
          <AppText variant="body" color="secondary">
            {search ? 'Sin resultados para tu búsqueda' : 'Tu catálogo está vacío'}
          </AppText>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => String(item.productId)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Delete confirm modal */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <AppText variant="h3" style={styles.popupTitle}>¿Eliminár del catálogo?</AppText>
            <AppText variant="body" color="secondary" style={styles.popupSubtitle}>
              {deletingIds.length === 1
                ? 'Este producto será eliminado de tu catálogo.'
                : `${deletingIds.length} productos serán eliminados de tu catálogo.`}
            </AppText>
            <TouchableOpacity
              style={[styles.deleteButton, deleting && { opacity: 0.6 }]}
              onPress={confirmDelete}
              disabled={deleting}
            >
              {deleting
                ? <ActivityIndicator color={Colors.white} />
                : <AppText variant="label" color="white">Eliminar</AppText>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setDeleteModalVisible(false)}>
              <AppText variant="label" color="secondary">Cancelar</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Update price modal */}
      <Modal visible={!!editingItem} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <AppText variant="h3" style={styles.popupTitle}>Actualizar precio</AppText>
            <AppText variant="body" color="secondary" style={styles.popupSubtitle}>
              {editingItem?.name}
            </AppText>
            <TextInput
              style={styles.priceInput}
              value={newPrice}
              onChangeText={setNewPrice}
              keyboardType="decimal-pad"
              placeholder="Nuevo precio"
              placeholderTextColor={Colors.textMuted}
              autoFocus
            />
            <TouchableOpacity
              style={[styles.deleteButton, updatingPrice && { opacity: 0.6 }]}
              onPress={handleUpdatePrice}
              disabled={updatingPrice}
            >
              {updatingPrice
                ? <ActivityIndicator color={Colors.white} />
                : <AppText variant="label" color="white">Actualizar</AppText>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditingItem(null)}>
              <AppText variant="label" color="secondary">Cancelar</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}