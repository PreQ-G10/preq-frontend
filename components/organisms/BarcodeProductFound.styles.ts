import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { gap: 12 },
  cardContent: { gap: 12 },
  image: { width: '100%', height: 200, borderRadius: 8 },
  imagePlaceholder: {
    width: '100%', height: 200, borderRadius: 8,
    backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center',
  },
  info: { gap: 4 },
  badge: { marginTop: 4 },
});