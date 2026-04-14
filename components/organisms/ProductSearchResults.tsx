import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Button, Divider } from '@/components/atoms';
import { SearchBar } from '@/components/molecules';
import { Colors } from '@/constants/theme';
import { productService } from '@/services/api';
import { Product } from '@/types';
import { styles } from './ProductSearchResults.styles';

interface ProductSearchResultsProps {
  onSelect: (product: Product) => void;
  onCreateNew: () => void;
}

export function ProductSearchResults({ onSelect, onCreateNew }: ProductSearchResultsProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await productService.search(query);
      setResults(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        onSubmit={handleSearch}
        placeholder="Buscá por nombre o marca..."
      />
      <ScrollView scrollEnabled={false}>
        <View style={styles.list}>
          {results.length === 0 && query.length > 0 && !loading && (
            <View style={styles.emptyContainer}>
              <AppText variant="body" color="secondary">No hay resultados para "{query}"</AppText>
            </View>
          )}
          {results.map((product) => (
            <TouchableOpacity key={product.id} style={styles.resultItem} onPress={() => onSelect(product)} activeOpacity={0.7}>
              <View style={styles.resultInfo}>
                <AppText variant="body">{product.name}</AppText>
                <AppText variant="bodySmall" color="secondary">{product.brand} · {product.quantity}{product.quantityType}</AppText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.gray400} style={styles.arrow} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <Divider label="¿No encontrás el producto?" />
      <View style={styles.createRow}>
        <AppText variant="bodySmall" color="secondary">Podés crearlo vos mismo</AppText>
        <Button label="Crear producto" variant="ghost" size="sm" onPress={onCreateNew} />
      </View>
    </View>
  );
}
