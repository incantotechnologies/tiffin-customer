import { View, ActivityIndicator, Text, StatusBar } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import "../global.css";
import { useFonts } from "expo-font";
import ContextProvider from "../contexts/ContextProvider";
import { enableScreens } from "react-native-screens";
import { background } from "../constants/color";

const RootLayout = () => {
  enableScreens();

  const [fontsLoaded] = useFonts({
    RoboBlack: require("../assets/fonts/roboto/Roboto-Black.ttf"),
    RoboBlackItalic: require("../assets/fonts/roboto/Roboto-BlackItalic.ttf"),
    RoboBold: require("../assets/fonts/roboto/Roboto-Bold.ttf"),
    RoboBoldItalic: require("../assets/fonts/roboto/Roboto-BoldItalic.ttf"),
    RoboMedium: require("../assets/fonts/roboto/Roboto-Medium.ttf"),
    RoboMediumItalic: require("../assets/fonts/roboto/Roboto-MediumItalic.ttf"),
    RoboRegular: require("../assets/fonts/roboto/Roboto-Regular.ttf"),
    RoboItalic: require("../assets/fonts/roboto/Roboto-Italic.ttf"),
    RoboLight: require("../assets/fonts/roboto/Roboto-Light.ttf"),
    RoboLightItalic: require("../assets/fonts/roboto/Roboto-LightItalic.ttf"),
    Anton: require("../assets/fonts/Anton.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    PoppinsExtraBold: require("../assets/fonts/Poppins-ExtraBold.ttf"),
    // Satoshi
    SatoBlack: require("../assets/fonts/Satoshi-Black.ttf"),
    SatoBlackItalic: require("../assets/fonts/Satoshi-BlackItalic.ttf"),
    SatoBold: require("../assets/fonts/Satoshi-Bold.ttf"),
    SatoBoldItalic: require("../assets/fonts/Satoshi-BoldItalic.ttf"),
    SatoMedium: require("../assets/fonts/Satoshi-Medium.ttf"),
    SatoMediumItalic: require("../assets/fonts/Satoshi-MediumItalic.ttf"),
    SatoRegular: require("../assets/fonts/Satoshi-Regular.ttf"),
    SatoItalic: require("../assets/fonts/Satoshi-Italic.ttf"),
    SatoLight: require("../assets/fonts/Satoshi-Light.ttf"),
    SatoLightItalic: require("../assets/fonts/Satoshi-LightItalic.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          backgroundColor: background,
        }}
      ></View>
    );
  }

  return (
    <>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ContextProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)" options={{ headerShown: false }} />
          <Stack.Screen name="(onboard)" options={{ headerShown: false }} />
        </Stack>
      </ContextProvider>
    </>
  );
};

export default RootLayout;
