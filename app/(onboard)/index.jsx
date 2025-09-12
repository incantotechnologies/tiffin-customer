import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
const Welcome = () => {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center bg-lime-200">
      <View className="items-center h-4/6 justify-center gap-10">
        <Text className="font-RoboRegular text-lg uppercase">Welcome to</Text>
        <View className="items-center">
          <Text className="font-RoboBlack uppercase text-5xl py-3.5">
            Tiffinbox
          </Text>
          <Text className="font-RoboMedium uppercase -mt-6">Vendor</Text>
        </View>
      </View>

      <TouchableOpacity
        className="bg-black w-20 h-20 rounded-full justify-center flex-row items-center"
        onPress={() => router.push("/(onboard)/signin")}
      >
        {/* <Text className="text-white"
                >Continue</Text> */}
        <AntDesign name="right" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default Welcome;
