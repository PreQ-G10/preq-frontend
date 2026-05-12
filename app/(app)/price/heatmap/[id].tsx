import { AppText, Spinner } from '@/components/atoms';
import { Colors } from '@/constants/theme';
import { priceService, productService, userService } from '@/services/api';
import { HeatmapPointResponse, Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Heatmap, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { styles } from './[id].styles';

function formatPrice(value: number) {
  return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

const calculateRadius = (latitudeDelta: number): number => {
  return (latitudeDelta / 2) * 111000;
};

export default function PriceHeatmapScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [pricePoints, setPricePoints] = useState<HeatmapPointResponse[]>([]);
  const [points, setPoints] = useState<{ latitude: number; longitude: number; weight: number }[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<HeatmapPointResponse | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [mapRegion, setMapRegion] = useState<Region | null>(null);

  const fetchHeatmapData = useCallback(async (
    currentLatitude: number,
    currentLongitude: number,
    currentRadius: number
  ) => {
    try {
      const data = await priceService.getHeatMapData(
        Number(id),
        currentLatitude,
        currentLongitude,
        currentRadius
      );
      setPricePoints(data);

      if (data.length > 0) {
        const prices = data.map(p => p.avgPrice);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const range = maxPrice - minPrice;

        setPoints(data.map((p: HeatmapPointResponse) => ({
          latitude: p.latitude,
          longitude: p.longitude,
          weight: range === 0 ? 0.5 : (p.avgPrice - minPrice) / range,
        })));
      } else {
        setPoints([]);
      }
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
    }
  }, [id]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prod, { status }] = await Promise.all([
          productService.getById(Number(id)),
          Location.requestForegroundPermissionsAsync(),
        ]);

        setProduct(prod);

        let lat = -34.6037; // Default: Buenos Aires
        let lng = -58.3816;
        let delta = 0.1;
        let locationFound = false;

        if (status === 'granted') {
          try {
            const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
            delta = 0.05;
            locationFound = true;
          } catch (e) {
            console.warn('GPS failed, checking profile...');
          }
        }

        if (!locationFound) {
          try {
            const profile = await userService.getProfile();
            if (profile.latitude && profile.longitude) {
              lat = profile.latitude;
              lng = profile.longitude;
              delta = 0.05;
            }
          } catch (e) {}
        }

        setMapRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: delta,
          longitudeDelta: delta,
        });

        await fetchHeatmapData(lat, lng, calculateRadius(delta));

      } catch (error) {
        console.error('Error loading heatmap data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, fetchHeatmapData]);

  if (loading) return <Spinner fullScreen message="Determinando ubicación..." />;

  const handleRegionChangeComplete = (region: Region) => {
    if (
      Math.abs(region.latitude - mapRegion!.latitude) > 0.001 ||
      Math.abs(region.longitude - mapRegion!.longitude) > 0.001 ||
      Math.abs(region.latitudeDelta - mapRegion!.latitudeDelta) > 0.001
    ) {
      setMapRegion(region); 
      const currentRadius = calculateRadius(region.latitudeDelta);
      fetchHeatmapData(region.latitude, region.longitude, currentRadius);
    }
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
          initialRegion={mapRegion!}
          onRegionChangeComplete={handleRegionChangeComplete}
          minZoomLevel={11}
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
              pinColor={selectedPoint === p ? Colors.primary : Colors.primaryDark}
              tracksViewChanges={false}
            >
              <View
                style={{ opacity: 0,}}
              />
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Address and price details overlay */}
      {selectedPoint && (
        <View style={styles.addressOverlay}>
          <View style={styles.addressHeader}>
            <Ionicons name="location" size={18} color={Colors.primary} />
            <View style={styles.addressTitle}>
              <AppText variant="label">{formatPrice(selectedPoint.avgPrice)}</AppText>
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
              {selectedPoint.name +" ubicado en " + selectedPoint.address || 'Dirección no disponible'}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
