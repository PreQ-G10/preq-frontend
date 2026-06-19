import { AppText } from '@/components/atoms';
import { BusinessHomeContent, UserHomeContent } from '@/components/organisms';
import { Routes } from '@/constants/routes';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { useCart } from '@/context/cartContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './index.styles';

export default function HomeScreen() {
  const { role } = useAuth();
  const { totalItems } = useCart();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>preq</Text>
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            {role !== 'BUSINESS' && (
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push(Routes.cart)}
              activeOpacity={0.8}
            >
              <Ionicons name="cart-outline" size={18} color={Colors.white} />
              {totalItems > 0 && (
                <View style={styles.cartCountBadge}>
                  <AppText variant="caption" color="white" style={{ fontSize: 9 }}>{totalItems}</AppText>
                </View>
              )}
            </TouchableOpacity>
          )}
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push(Routes.profile)}
              activeOpacity={0.8}
            >
              <Ionicons name="person-outline" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>Compará precios de productos en tu zona</Text>
      </View>
      {role === 'BUSINESS' ? <BusinessHomeContent /> : <UserHomeContent />}
    </SafeAreaView>
  );
}