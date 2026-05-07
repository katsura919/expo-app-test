import { Stack } from "expo-router";
import { ScrollView, Text, View } from "react-native";

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: "Home", headerShown: true }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 24, gap: 16 }}
      >
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 28, fontWeight: "700" }}>Welcome back!</Text>
          <Text style={{ fontSize: 16, color: "#666" }}>
            Your daily OS is ready.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}
