import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { useCallback, useContext, useEffect, useState } from "react";
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
import FilterComponent from "./FilterComponent";
import { primary } from "../constants/color";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const FoodItemsList = ({ itemsToDisplay }) => {
  const { foodItems, vendors } = useContext(FoodItemsContext);
  const { addToCart } = useContext(CartContext);
  const [selectedCategory, setSelectedCategory] = useState(null); // Initialize as null
  const [foodProducts, setFoodProducts] = useState(itemsToDisplay);
  const [loading, setLoading] = useState(false); // Loading state

  const router = useRouter();
  const itemqty = 1;

  // Update the foodProducts when foodItems or selectedCategory changes
  useEffect(() => {
    const filterFoodItems = async () => {
      setLoading(true);
      try {
        if (selectedCategory) {
          if (selectedCategory === "Vegetarian") {
            setFoodProducts(itemsToDisplay.filter((item) => item.type === "veg"));
          } else {
            setFoodProducts(
              itemsToDisplay.filter(
                (item) =>
                  item.category.toLowerCase() === selectedCategory.toLowerCase()
              )
            );
          }
        } else {
          const revFoodItems = [...itemsToDisplay].reverse(); // Reversing the array for demonstration
          setFoodProducts(revFoodItems);
        }
      } finally {
        setLoading(false);
      }
    };

    filterFoodItems();
  }, [itemsToDisplay, selectedCategory]); // Use itemsToDisplay instead of foodItems


  // Function to render each food item
  const renderFoodItem = useCallback(
    ({ item }) => {
      const vendor = vendors.find(
        (vendor) => vendor.vendorId === item.vendorId
      );
      const vendorName = vendor ? vendor.name : "Vendor"; // Fallback if vendor not found
      const vendorRating = vendor ? vendor.rating : 0;
      return (
        <Pressable
          onPress={() => router.push(`/(screens)/(item)/${item.foodItemId}`)}
          key={item.foodItemId}
          className=" bg-white rounded-3xl overflow-hidden shadow-xl shadow-zinc-300 border-zinc-100 border"
          style={{ width: "100%" }}
        >
          {item?.ordersAvailable < 1 && (
            <View className="w-full h-full bg-gray-200/40 absolute z-20 py-4 pr-3 items-end">
              <Text className="font-SatoMedium text-primary py-1 px-2.5 bg-white rounded-full text-sx w-fit">
                Out of orders
              </Text>
            </View>
          )}
          <View className="flex-row-reverse gap-3 p-2">
            <View className="w-[45%] h-32 rounded-2xl overflow-hidden">
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

            <View className="w-[50%] justify-around">
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
              {/* <View className="flex-row items-center justify-between h-12">
                <TouchableOpacity
                  onPress={() => addToCart(item, itemqty)}
                  className="w-full h-11 bg-primary/5 rounded-xl items-center justify-center z-10 flex-row gap-1 border border-primary/15"
                >
                  <AntDesign name="plus" size={12} color={primary} />
                  <Text className="text-sx font-SatoBold text-primary uppercase tracking-wide">
                    Add to cart
                  </Text>
                </TouchableOpacity>
              </View> */}
            </View>
          </View>
        </Pressable>
      );
    },
    [vendors]
  );

  return (
    <View className="w-full items-center">
      <View className="w-95">
        <View className="w-full py-5">
          <FilterComponent
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </View>

        {loading ? (
          <View className="h-96 justify-center">
            <ActivityIndicator size="large" color={primary} />
          </View>
        ) : (
          <FlatList
            data={foodProducts}
            renderItem={renderFoodItem}
            keyExtractor={(item) => item.foodItemId.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text>No items available</Text>}
            style={{ gap: 12, width: "100%" }}
            contentContainerStyle={{ alignItems: "center" }}
          />
        )}
      </View>
    </View>
  );
};

export default FoodItemsList;
