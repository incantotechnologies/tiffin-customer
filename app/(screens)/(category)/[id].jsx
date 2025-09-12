import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { images } from "../../../constants";
import FoodByCategory from "../../../components/FoodByCategory";
import { SafeAreaView } from "react-native-safe-area-context";

const Category = () => {
  const { id } = useLocalSearchParams();
  const [category, setCategory] = useState(id);
  return (
    <SafeAreaView className="flex-1 items-center w-full border bg-background">
      <View className="flex-row items-center w-90 gap-5 pt-3">
        <View className="w-24 h-24 bg-background rounded-full overflow-hidden shadow-xl shadow-gray-300 items-center justify-center border border-gray-100 ">
          <Image
            source={
              category === "Breakfast"
                ? images.breakfast
                : category === "Lunch"
                ? images.lunch
                : category === "Dinner"
                ? images.dinner
                : category === "Snacks"
                ? images.snacks
                : ""
            }
            className="w-90 h-90"
          />
        </View>
        <View className="gap-1">
          <Text className="font-SatoBlack text-gray-700 tracking-wide uppercase text-sm">
            {category} for you
          </Text>
          <Text className="font-SatoRegular text-sm text-gray-600">
            {category === "Breakfast"
              ? "Start Your Day, the Delicious Way."
              : category === "Lunch"
              ? "Your Midday Recharge Starts Here."
              : category === "Dinner"
              ? "A Perfect Dinner, A Perfect Night."
              : category === "Snacks"
              ? "Snack Happy, Snack Healthy."
              : ""}
          </Text>
        </View>
      </View>
      <View className="w-97 items-center gap-4 py-4">
        <View className="w-97 h-px bg-zinc-200" />

        <View className="w-full">
          <FoodByCategory category={category} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Category;
