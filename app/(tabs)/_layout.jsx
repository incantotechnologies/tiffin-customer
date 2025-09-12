import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useRouter } from "expo-router";
import React, { useContext } from "react";
import { Pressable, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CartContext } from "../../contexts/CartContext";
const TabsLayout = () => {
  const router = useRouter()
  const { cartItems } = useContext(CartContext)
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false, // Hide the header globally
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="search" />
        <Stack.Screen name="(menu)" />
        <Stack.Screen name="profile" />
      </Stack>
      {/* {cartItems != 0 && <Pressable onPress={() => router.push("/(screens)/cart")} className="h-8 bg-primary w-full flex-row items-center justify-center">
        <Text className="font-RoboLight text-xs text-background">{cartItems.length} {cartItems < 2 ? "item" : "items"} in cart</Text>
        <MaterialIcons name="navigate-next" size={12} color="#f5f5f5" className="pt-px" />
      </Pressable>} */}
    </SafeAreaProvider>
  );
};

export default TabsLayout;
