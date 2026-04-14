import { Stack } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="camera" />
      <Stack.Screen name="product/confirm" />
      <Stack.Screen name="price/collaborate" />
      <Stack.Screen name="price/details/[id]" />
    </Stack>
  );
}
