import { StyleSheet } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', borderRadius: Radius.full },
  primary: { backgroundColor: Colors.primary },
  secondary: { backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.primary },
  ghost: { backgroundColor: 'transparent' },
});
