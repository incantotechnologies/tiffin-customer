import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
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

const SimilarItems = ({ product }) => {
  const router = useRouter();
  const [relatedFood, setRelatedFood] = useState([]);
  const { foodItems } = useContext(FoodItemsContext);
  const { addToCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const itemqty = 1;

  // Updated filter function to exclude the current product
  const filterRelatedFood = () => {
    const relatedItems = foodItems.filter(
      (item) =>
        item.category === product.category &&
        item.foodItemId !== product.foodItemId // Exclude current product
    );
    setRelatedFood(relatedItems);
  };

  useEffect(() => {
    filterRelatedFood();
  }, [product]); // Re-run filter when the product changes

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, [1250]);
        router.push(`/(screens)/(item)/${item.foodItemId}`);
      }}
      key={item.foodItemId}
      className="bg-white p-1 pb-2 gap-1 rounded-[18px] border border-zinc-100 shadow-lg shadow-zinc-300"
      style={{ width: 140 }}
      disabled={item?.availableOrders < 1}
    >
      {item?.availableOrders < 1 && (
        <View className="w-full h-full bg-gray-300/30 absolute z-20 py-1.5 pl-1.5 items-start">
          <Text className="font-SatoMedium text-primary py-0.5 px-1.5 bg-white rounded-full text-xs w-fit">
            Out of orders
          </Text>
        </View>
      )}
      <View className="w-full h-36 rounded-2xl overflow-hidden">
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

      <View className="px-1 w-full">
        <Text className="text-xs font-SatoBold">{item.name}</Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-s font-SatoMedium">₹ {item.price}.00</Text>
          <TouchableOpacity
            onPress={() => addToCart(item, itemqty)}
            className="w-8 h-8 bg-primary/5 rounded-full items-center justify-center z-10 flex-row gap-1 border border-primary/15"
            disabled={item?.availableOrders < 1}
          >
            <AntDesign name="plus" size={12} color={item?.availableOrders < 1 ? "#ccc" : "#008080"} />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );

  return (
    <>
      {relatedFood.length > 0 && !loading && (
        <View className="w-full items-center py-4">
          <View className="w-93 flex-row items-center gap-3 justify-center">
            <View className="w-1/3 h-px bg-zinc-200" />
            <Text className="text-xs text-primary font-SatoBold tracking-wider uppercase">
              Similar items
            </Text>
            <View className="w-1/3 h-px bg-zinc-200" />
          </View>
          <FlatList
            horizontal
            data={relatedFood}
            renderItem={renderItem}
            keyExtractor={(item) => item.foodItemId.toString()}
            contentContainerStyle={{ gap: 7, paddingVertical: 10 }}
            showsHorizontalScrollIndicator={false}
            style={{ width: "100%", gap: 5 }}
          />
        </View>
      )}
      {loading && <ActivityIndicator size={32} color="#008080" />}
    </>
  );
};

export default SimilarItems;
