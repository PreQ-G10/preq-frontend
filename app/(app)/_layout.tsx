import { Colors } from '@/constants/theme';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="search" />
      <Stack.Screen name="camera" />
      <Stack.Screen name="cameraSelection" />
      <Stack.Screen name="product/confirm" />
      <Stack.Screen name="price/collaborate" />
      <Stack.Screen name="price/details/[id]" />
      <Stack.Screen name="price/heatmap/[id]" />
      <Stack.Screen name="product/details/[id]" />
      <Stack.Screen name="cart/compare" />
      <Stack.Screen name="cart/lists" />
      <Stack.Screen name="cart/index" />
      <Stack.Screen name="catalogue/index" />
    </Stack>
  );
}
