import { useRouter } from "expo-router";
import { Button, StyleSheet, View } from "react-native";

export default function CameraButton() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button
        title="Open Camera"
        onPress={() => router.push("/camera")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});