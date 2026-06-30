import { AppText, Button, Card } from '@/components/atoms';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    addShoppingListItemQuantity,
    deleteShoppingList,
    formatShoppingListDate,
    loadShoppingLists,
    setShoppingListItemChecked,
    ShoppingList,
    ShoppingListEntry,
    subtractShoppingListItemQuantity,
} from '../../../utils/shoppingLists';
import { styles } from './lists.styles';

function ShoppingListCard({
  list,
  isNewest,
  onToggleItem,
  onAddItem,
  onSubtractItem,
  onDeleteList,
}: {
  list: ShoppingList;
  isNewest: boolean;
  onToggleItem: (productId: number) => void;
  onAddItem: (productId: number) => void;
  onSubtractItem: (productId: number) => void;
  onDeleteList: () => void;
}) {
  const isCompleted = list.items.length > 0 && list.items.every((item) => item.checked);

  return (
    <Card elevated padded style={styles.listCard}>
      <View style={styles.listHeader}>
        <View style={[
          styles.badge,
          isCompleted && styles.badgeCompleted,
          !isCompleted && isNewest && styles.badgeNew,
        ]}>
          <AppText variant="caption" color="secondary">
            {isCompleted ? 'Finalizada' : isNewest ? 'Nueva' : 'Guardada'}
          </AppText>
        </View>
        <View style={styles.listActions}>
          <View style={styles.listMeta}>
            <AppText variant="label">{list.totalItems} producto{list.totalItems !== 1 ? 's' : ''}</AppText>
            <AppText variant="caption" color="muted">
              {formatShoppingListDate(list.createdAt)}
            </AppText>
          </View>
          <TouchableOpacity onPress={onDeleteList} style={styles.deleteButton} activeOpacity={0.75}>
            <Ionicons name="trash-outline" size={18} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.items}>
        {list.items.map((item: ShoppingListEntry) => (
          <View key={`${list.id}-${item.productId}`} style={styles.itemRow}>
            <TouchableOpacity
              style={[styles.checkBox, item.checked && styles.checkBoxChecked]}
              activeOpacity={0.75}
              onPress={() => onToggleItem(item.productId)}
            >
              <Ionicons
                name={item.checked ? 'checkmark' : 'ellipse-outline'}
                size={16}
                color={item.checked ? Colors.white : Colors.textMuted}
              />
            </TouchableOpacity>
            <View style={styles.itemName}>
              <AppText variant="body" style={item.checked ? styles.itemNameChecked : undefined}>
                {item.name}
              </AppText>
              <AppText variant="bodySmall" color={item.checked ? 'muted' : 'secondary'}>
                {item.brand} · {item.quantity} {item.quantityType}
              </AppText>
            </View>
            <View style={styles.progressColumn}>
              <AppText variant="label" style={[styles.itemQuantity, item.checked && styles.itemQuantityChecked]}>
                {item.addedQuantity}/{item.cartQuantity}
              </AppText>
              <AppText variant="caption" color="muted">agregados</AppText>
            </View>
            <TouchableOpacity
              onPress={() => onSubtractItem(item.productId)}
              style={styles.subtractButton}
              activeOpacity={0.75}
            >
              <Ionicons name="remove" size={18} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onAddItem(item.productId)}
              style={styles.addButton}
              activeOpacity={0.75}
            >
              <Ionicons name="add" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </Card>
  );
}

export default function ShoppingListsScreen() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  const reloadLists = () => {
    setLoading(true);
    loadShoppingLists()
      .then(setLists)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reloadLists();
  }, []);

  const handleToggleItem = async (listId: string, productId: number) => {
    const updatedLists = await setShoppingListItemChecked(listId, productId, true);
    setLists(updatedLists);
  };

  const handleAddItem = async (listId: string, productId: number) => {
    const updatedLists = await addShoppingListItemQuantity(listId, productId);
    setLists(updatedLists);
  };

  const handleSubtractItem = async (listId: string, productId: number) => {
    const updatedLists = await subtractShoppingListItemQuantity(listId, productId);
    setLists(updatedLists);
  };

  const handleDeleteList = (listId: string) => {
    Alert.alert('Eliminar lista', 'Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const updatedLists = await deleteShoppingList(listId);
          setLists(updatedLists);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <AppText variant="h3" color="white" style={styles.headerTitle}>
          Mis listas de compras
        </AppText>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.empty}>
          <AppText variant="body" color="secondary">Cargando listas guardadas...</AppText>
        </View>
      ) : lists.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="list-outline" size={48} color={Colors.gray300} />
          </View>
          <AppText variant="h3" color="secondary">Todavía no guardaste listas</AppText>
          <AppText variant="body" color="muted" style={{ textAlign: 'center' }}>
            Guardá una canasta para verla acá junto con las anteriores.
          </AppText>
          <Button label="Volver al carrito" variant="primary" onPress={() => router.back()} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.summary}>
            <AppText variant="bodySmall" color="secondary">
              {lists.length} lista{lists.length !== 1 ? 's' : ''} guardada{lists.length !== 1 ? 's' : ''}
            </AppText>
          </View>

          {lists.map((list, index) => (
            <ShoppingListCard
              key={list.id}
              list={list}
              isNewest={index === 0}
              onToggleItem={(productId) => handleToggleItem(list.id, productId)}
              onAddItem={(productId) => handleAddItem(list.id, productId)}
              onSubtractItem={(productId) => handleSubtractItem(list.id, productId)}
              onDeleteList={() => handleDeleteList(list.id)}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}