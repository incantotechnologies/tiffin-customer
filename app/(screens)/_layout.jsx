import { Stack } from "expo-router";
import React from "react";

const ScreensLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(item)/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="(dailyItem)/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="cart" options={{ headerShown: false }} />
      <Stack.Screen name="(vendor)/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="(category)/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="(chat)/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="orders" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ScreensLayout;
