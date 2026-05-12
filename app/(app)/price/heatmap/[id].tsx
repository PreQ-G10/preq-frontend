import { AppText, Spinner } from '@/components/atoms';
import { Colors } from '@/constants/theme';
import { priceService, productService } from '@/services/api';
import { LocationProductPrice, Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Heatmap, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

function formatPrice(value: number) {
  return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

export default function PriceHeatmapScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [pricePoints, setPricePoints] = useState<LocationProductPrice[]>([]);
  const [points, setPoints] = useState<{ latitude: number; longitude: number; weight: number }[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<LocationProductPrice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prod, { status }] = await Promise.all([
          productService.getById(Number(id)),
          Location.requestForegroundPermissionsAsync(),
        ]);

        setProduct(prod);
        let lat: number | undefined;
        let lng: number | undefined;

        if (status === 'granted') {
          const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
          setUserLocation({ latitude: lat, longitude: lng });
        }

        const data = await priceService.getHeatMapData(Number(id), lat, lng);
        setPricePoints(data);

        setPoints(data.map((p: any) => ({
          latitude: p.latitude,
          longitude: p.longitude,
          weight: p.price,
        })));
      } catch (error) {
        console.error('Error loading heatmap data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <Spinner fullScreen message="Cargando mapa de calor..." />;

  const initialRegion = points.length > 0 ? {
    latitude: points[0].latitude,
    longitude: points[0].longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  } : userLocation ? {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  } : {
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View>
          <AppText variant="h3">Distribución de precios</AppText>
          {product && (
            <AppText variant="bodySmall" color="secondary">{product.name} - {product.brand}</AppText>
          )}
        </View>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
        >
          {points.length > 0 && (
            <Heatmap
              points={points}
              radius={40}
              opacity={0.7}
              gradient={{
                colors: [Colors.success, Colors.warning, Colors.error],
                startPoints: [0.01, 0.5, 0.9],
                colorMapSize: 256,
              }}
            />
          )}

          {/* Individual location markers */}
          {pricePoints.map((p, index) => (
            <Marker
              key={`${index}-${p.latitude}-${p.longitude}`}
              coordinate={{ latitude: p.latitude, longitude: p.longitude }}
              onPress={() => setSelectedPoint(p)}
              pinColor={selectedPoint === p ? Colors.primary : Colors.secondary}
              tracksViewChanges={false}
            />
          ))}
        </MapView>
      </View>

      {/* Address and price details overlay */}
      {selectedPoint && (
        <View style={styles.addressOverlay}>
          <View style={styles.addressHeader}>
            <Ionicons name="location" size={18} color={Colors.primary} />
            <View style={styles.addressTitle}>
              <AppText variant="label">{formatPrice(selectedPoint.price)}</AppText>
              <AppText variant="caption" color="muted">Reportado en este lugar</AppText>
            </View>
            <TouchableOpacity 
              onPress={() => setSelectedPoint(null)}
              style={styles.closeButton}
            >
              <Ionicons name="close-circle" size={24} color={Colors.gray300} />
            </TouchableOpacity>
          </View>
          <View style={styles.addressContainer}>
            <Ionicons name="checkmark-circle" size={15} color={Colors.success} />
            <Text style={styles.addressText} numberOfLines={2}>
              {selectedPoint.address || 'Dirección no disponible'}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  backButton: {
    padding: 4,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  addressOverlay: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  addressTitle: {
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.gray50,
    borderRadius: 8,
    gap: 8,
  },
  addressText: {
    fontSize: 13,
    color: Colors.text,
    flex: 1,
  },
});