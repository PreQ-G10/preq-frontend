import { AppText, Button, Card, Spinner } from '@/components/atoms';
import { ShoppingListDetailModal } from '@/components/organisms';
import { Colors } from '@/constants/theme';
import { shoppingListService } from '@/services/api';
import { ShoppingListSummaryResponse } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { styles } from './lists.styles';

export default function ShoppingListsScreen() {
  const [lists, setLists] = useState<ShoppingListSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await shoppingListService.getAll();
      setLists(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = (id: number, locationName: string) => {
    Alert.alert('Eliminar lista', `¿Eliminar la lista de ${locationName}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await shoppingListService.delete(id);
          setLists((prev) => prev.filter((l) => l.id !== id));
        },
      },
    ]);
  };

  const handleListUpdated = (id: number, completed: boolean) => {
    setLists((prev) => prev.map((l) => l.id === id ? { ...l, completed } : l));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <AppText variant="h3" color="white" style={styles.headerTitle}>Mis listas de compras</AppText>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <Spinner fullScreen />
      ) : lists.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="list-outline" size={48} color={Colors.gray300} />
          </View>
          <AppText variant="h3" color="secondary">Todavía no guardaste listas</AppText>
          <AppText variant="body" color="muted" style={{ textAlign: 'center' }}>
            Guardá una canasta desde la comparación de precios para verla acá.
          </AppText>
          <Button label="Volver" variant="ghost" onPress={() => router.back()} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <AppText variant="bodySmall" color="secondary" style={styles.summary}>
            {lists.length} lista{lists.length !== 1 ? 's' : ''} guardada{lists.length !== 1 ? 's' : ''}
          </AppText>

          {lists.map((list) => (
            <Card key={list.id} elevated padded style={styles.listCard}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSelectedListId(list.id)}
              >
                <View style={styles.listHeader}>
                  <View style={[styles.badge, list.completed && styles.badgeCompleted]}>
                    <Ionicons
                      name={list.completed ? 'checkmark-circle' : 'time-outline'}
                      size={12}
                      color={list.completed ? Colors.white : Colors.textSecondary}
                    />
                    <AppText
                      variant="caption"
                      style={{ color: list.completed ? Colors.white : Colors.textSecondary }}
                    >
                      {list.completed ? 'Finalizada' : 'Pendiente'}
                    </AppText>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(list.id, list.locationName)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={18} color={Colors.error} />
                  </TouchableOpacity>
                </View>

                <View style={styles.locationRow}>
                  <Ionicons name="storefront-outline" size={16} color={Colors.primary} />
                  <AppText variant="body" style={styles.locationName}>{list.locationName}</AppText>
                </View>
                <AppText variant="bodySmall" color="secondary">{list.locationAddress}</AppText>

                <View style={styles.listMeta}>
                  <AppText variant="caption" color="muted">
                    {list.itemCount} producto{list.itemCount !== 1 ? 's' : ''}
                  </AppText>
                  <AppText variant="caption" color="muted">
                    {new Date(list.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </AppText>
                </View>
              </TouchableOpacity>
            </Card>
          ))}
        </ScrollView>
      )}

      {selectedListId !== null && (
        <ShoppingListDetailModal
          listId={selectedListId}
          visible={selectedListId !== null}
          onClose={() => setSelectedListId(null)}
          onUpdated={handleListUpdated}
        />
      )}
    </SafeAreaView>
  );
}