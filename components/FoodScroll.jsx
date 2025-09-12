import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CartContext } from "../contexts/CartContext";
import { FoodItemsContext } from "../contexts/FoodItemsContext";

const FoodScroll = () => {
  const router = useRouter();
  const { foodItems, isLoading } = useContext(FoodItemsContext); // Assuming isLoading is provided in the context
  const { addToCart } = useContext(CartContext);
  const itemqty = 1;

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => router.push(`/(screens)/(item)/${item.foodItemId}`)}
      key={item.id}
      className="bg-white gap-1 rounded-[18px] overflow-hidden border border-zinc-200 shadow-xl shadow-zinc-300"
      style={{ width: 190 }}
    >
      <View className="w-full h-40">
        <ImageBackground
          source={{ uri: item.image }}
          style={{ width: "100%", height: "100%" }}
        >
          <View className="w-full h-full items-center justify-end bg-black/5">
            <View className="flex-row items-center justify-end w-10/12 h-10">
              <View>
                {item.type === "veg" ? (
                  <View className="p-1 bg-white border border-green-500">
                    <View className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  </View>
                ) : (
                  <View className="p-1 bg-white border border-red-500">
                    <View className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  </View>
                )}
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      <View className="gap-1 py-1.5 px-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-SatoBlack tracking-wide">
            {item.name}
          </Text>
          <Text className="text-sx font-SatoBold uppercase tracking-wide">
            {item.category}
          </Text>
        </View>
        <View>
          <Text className="text-sx leading-4 font-SatoLight text-justify">
            {item.description}.
          </Text>
        </View>
        <View className="flex-row items-center justify-between w-full px-px border-t border-zinc-200 pt-1">
          <View className="flex-row gap-1.5">
            <Text className="text-sm font-SatoBold text-zinc-600">
              ₹ {item.price}.00
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => addToCart(item, itemqty)}
            className="w-10 h-10 bg-primary/5 rounded-full items-center justify-center z-10 flex-row gap-1 border border-primary/15"
          >
            <AntDesign name="plus" size={12} color="#008080" />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View className="w-full rounded-2xl items-center">
      <Text className="w-93 px-1 font-SatoBold text-xs uppercase tracking-wide">
        Suggested for you
      </Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#008080" /> // Show ActivityIndicator while loading
      ) : (
        <FlatList
          horizontal
          data={foodItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.foodItemId.toString()}
          contentContainerStyle={{ gap: 7, paddingVertical: 10 }}
          showsHorizontalScrollIndicator={false}
          style={{ width: "93%", gap: 5 }}
        />
      )}
    </View>
  );
};

export default FoodScroll;
