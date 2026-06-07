import { Colors } from '@/constants/theme';
import { Location } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './LocationItem.styles';

const locationIcons: Record<Location['type'], keyof typeof Ionicons.glyphMap> = {
  SUPERMARKET: 'cart-outline',
  STORE: 'storefront-outline',
  PHARMACY: 'medical-outline',
  OTHER: 'location-outline',
};

interface LocationItemProps {
  location: Location;
  selected?: boolean;
  onPress: () => void;
}

export function LocationItem({ location, selected = false, onPress }: LocationItemProps) {
  return (
    <TouchableOpacity testID="location-item" style={[styles.container, selected && styles.selected]} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, selected && styles.iconContainerSelected]}>
        <Ionicons name={locationIcons[location.type]} size={20} color={selected ? Colors.primary : Colors.gray500} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, selected && styles.nameSelected]}>{location.name}</Text>
        <Text style={styles.address}>{location.address}</Text>
      </View>
      {selected && (
        <Ionicons name="checkmark-circle" size={22} color={Colors.primary} style={styles.checkIcon} />
      )}
    </TouchableOpacity>
  );
}