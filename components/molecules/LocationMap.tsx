import { Colors } from '@/constants/theme';
import React, { useRef } from 'react';
import { View } from 'react-native';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
import { styles } from './LocationMap.styles';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export function LocationMap({ latitude, longitude, onLocationChange }: LocationMapProps) {
  const mapRef = useRef<MapView>(null);

  const region: Region = {
    latitude,
    longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  function handlePress(e: MapPressEvent) {
    const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
    onLocationChange(lat, lng);
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        showsUserLocation
        showsMyLocationButton
        onPress={handlePress}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          draggable
          onDragEnd={(e: { nativeEvent: { coordinate: { latitude: any; longitude: any; }; }; }) => {
            const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
            onLocationChange(lat, lng);
          }}
          pinColor={Colors.primary}
        />
      </MapView>
    </View>
  );
}
