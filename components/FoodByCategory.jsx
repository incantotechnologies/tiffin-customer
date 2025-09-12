import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  ImageBackground,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { FoodItemsContext } from "../contexts/FoodItemsContext";
import { useRouter } from "expo-router";
import { CartContext } from "../contexts/CartContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { primary } from "../constants/color";

const FoodByCategory = ({ category }) => {
  const router = useRouter();
  const { foodItems, vendors } = useContext(FoodItemsContext);
  const { addToCart } = useContext(CartContext);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category); // Initialize as null

  useEffect(() => {
    const filteredItems = foodItems.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
    setItems(filteredItems);
  }, [selectedCategory]);

  const renderFoodItem = useCallback(
    ({ item }) => {
      // Find the vendor name based on the vendorId
      const vendor = vendors.find(
        (vendor) => vendor.vendorId === item.vendorId
      );
      const vendorName = vendor ? vendor.name : "Vendor"; // Fallback if vendor not found
      const vendorRating = vendor ? vendor.rating : 0; // Fallback if vendor not found

      return (
        <Pressable
          onPress={() => router.push(`/(screens)/(item)/${item.foodItemId}`)}
          key={item.foodItemId}
          className="flex-row-reverse gap-3 bg-white rounded-2xl overflow-hidden shadow-xl shadow-zinc-300 p-1.5 border-zinc-100 border"
          style={{ width: "100%" }}
        >
          <View className="w-[45%] h-36 rounded-2xl overflow-hidden">
            <ImageBackground
              source={{ uri: item.image }}
              style={{ width: "100%", height: "100%" }}
            >
              <View className="w-93 items-end h-10 justify-center">
                <View className="p-px">
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
            </ImageBackground>
          </View>

          <View className="w-[50%] py-1 justify-between overflow-hidden">
            <View className="flex-row items-center justify-between w-full">
              <Text className="text-sm font-SatoBlack tracking-wide">
                {item.name}
              </Text>
            </View>
            <View className="flex-row w-full justify-between">
              <View className="gap-1.5 flex-row">
                <Text className="text-xs font-SatoBold text-zinc-600">
                  ₹ {item.price}.00
                </Text>
                <View className="flex-row items-center gap-1">
                  <Text className="font-SatoItalic text-sx line-through text-blue-900/80">
                    ₹ {parseInt(item.price * 1.2)}.00
                  </Text>
                </View>
              </View>
              <Text className="text-[7px] uppercase font-SatoBold tracking-wide">
                {item.category}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Text className="text-s font-SatoMedium">{vendorName}</Text>
              <View className="flex-row items-center gap-1">
                <FontAwesome name="star" size={8} color="orange" />
                <Text className="text-sx font-SatoMedium">
                  ( {vendorRating.toFixed(1)} )
                </Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between h-12">
              <TouchableOpacity
                onPress={() => addToCart(item, itemqty)}
                className="w-full h-11 bg-primary/5 rounded-xl items-center justify-center z-10 flex-row gap-1 border border-primary/15"
              >
                <AntDesign name="plus" size={12} color={primary} />
                <Text className="text-sx font-SatoBold text-primary uppercase tracking-wide">
                  Add to cart
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      );
    },
    [vendors]
  );

  return (
    <>
      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={renderFoodItem}
          keyExtractor={(item) => item.foodItemId.toString()}
          showsVerticalScrollIndicator={false}
          style={{
            width: "100%", // Make the list span the full width
          }}
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: 16, // Add padding for the bottom
            // borderWidth: 1,
            paddingHorizontal: 10,
          }}
          columnWrapperStyle={{
            // justifyContent: "start", // Add space between items in the row
            marginBottom: 16, // Add space between rows
          }}
          numColumns={2}
        />
      ) : (
        <Text className="text-center font-SatoRegular">No items available</Text>
      )}
    </>
  );
};

export default FoodByCategory;
