// components/organisms/BusinessHomeContent.tsx
import { AppText, Card } from '@/components/atoms';
import { SearchBar } from '@/components/molecules';
import { Routes } from '@/constants/routes';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { styles } from './BusinessHomeContent.styles';

const actions = [
  { icon: 'pricetag-outline', text: 'Publicá y actualizá los precios de tus productos'},
  { icon: 'storefront-outline', text: 'Administrá la información de tu negocio', route: Routes.profile },
  { icon: 'bar-chart-outline', text: 'Revisá las estadísticas de tu local'},
];

export function BusinessHomeContent() {
  const [query, setQuery] = useState('');

  return (
    <ScrollView
      style={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="on-drag"
      contentContainerStyle={styles.contentContainer}
    >
      <SearchBar
        value={query}
        onChangeText={setQuery}
        onSubmit={() => router.push({ pathname: Routes.search, params: { query } })}
        onClear={() => setQuery('')}
        placeholder="Buscá un producto para agregar..."
      />

      <TouchableOpacity style={styles.catalogueButton} onPress={() => router.push(Routes.catalogue)}>
        <Ionicons name="grid-outline" size={20} color={Colors.white} />
        <AppText variant="label" color="white">Mi catálogo</AppText>
      </TouchableOpacity>

      <AppText variant="h3">¿Qué podés hacer?</AppText>
      <Card elevated>
        <View style={styles.tipCard}>
          {actions.map((action, i) => (
            <TouchableOpacity
              key={i}
              style={styles.tipRow}
              activeOpacity={0.7}
            >
              <View style={styles.tipIcon}>
                <Ionicons name={action.icon as any} size={20} color={Colors.primary} />
              </View>
              <AppText variant="bodySmall" color="secondary" style={styles.tipText}>
                {action.text}
              </AppText>
              <Ionicons name="chevron-forward-outline" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}