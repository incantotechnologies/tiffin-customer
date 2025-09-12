import { Stack } from "expo-router";
import React from "react";

const MenuLayout = () => {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="today" />
        <Stack.Screen name="tomorrow" />
      </Stack>
    </>
  );
};

export default MenuLayout;
