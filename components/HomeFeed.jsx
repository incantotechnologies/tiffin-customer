import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Pressable,
  Text,
  View
} from "react-native";
import { FoodItemsContext } from "../contexts/FoodItemsContext";
import FilterImageComponent from "./FilterImageComponent";

const HomeFeed = () => {
  const { foodItems, vendors } = useContext(FoodItemsContext);
  const [selectedCategory, setSelectedCategory] = useState(null); // Initialize as null
  const [foodProducts, setFoodProducts] = useState([]);

  const router = useRouter();

  // Update the foodProducts when foodItems or selectedCategory changes
  useEffect(() => {
    const filterFoodItems = async () => {
      try {
        if (selectedCategory) {
          if (selectedCategory === "Vegetarian") {
            setFoodProducts(foodItems.filter((item) => item.type === "veg"));
          } else {
            setFoodProducts(
              foodItems.filter(
                (item) =>
                  item.category.toLowerCase() === selectedCategory.toLowerCase()
              )
            );
          }
        } else {
          const revFoodItems = [...foodItems].reverse(); // Reversing the array for demonstration
          setFoodProducts(revFoodItems);
        }
      } finally {
      }
    };

    filterFoodItems();
  }, [foodItems, selectedCategory]);

  // Render "No items available" if no food items are present
  if (!foodItems) {
    return (
      <View className="w-full items-center py-7">
        <Text className="font-SatoRegular text-sm text-gray-500">
          No items available
        </Text>
      </View>
    );
  }

  const formatDeliveryDate = (delivery) => {
    const today = new Date();
    const deliveryDate = new Date(delivery);
    // Normalize the dates to the same time zone and strip time to just compare the date
    const todayString = today.toISOString().split("T")[0];
    const deliveryString = deliveryDate.toISOString().split("T")[0];

    if (todayString === deliveryString) {
      return "Today";
    } else {
      return "Tomorrow";
    }
  };

  // Function to render each food item
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
          key={item?.foodItemId.toString()}
          className="bg-white rounded-2xl overflow-hidden shadow-xl shadow-gray-200 border-gray-100 border mx-1"
          style={{ width: "48%" }}
          disabled={item?.availableOrders < 1}
        >
          {item?.availableOrders < 1 && (
            <View className="w-full h-full bg-gray-300/30 absolute z-20 py-2.5 pl-2.5 items-start">
              <Text className="font-SatoMedium text-primary py-1 px-2.5 bg-white rounded-full text-sx w-fit">
                Out of orders
              </Text>
            </View>
          )}
          <View className="w-full h-[140px]">
            <ImageBackground
              source={{ uri: item.image }}
              style={{ width: "100%", height: "100%" }}
              className="items-center justify-center"
            >
              <View className="w-93 items-end justify-between h-90">
                {/* Display vendor name */}
                <View className="p-1">
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
                <View className="py-1 px-2 rounded-full bg-gray-900/60">
                  <Text className="text-sx font-SatoMedium text-gray-100">
                    {vendorName}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </View>

          <View className="w-full p-2.5 justify-between gap-1">
            <View className="flex-row items-center justify-between w-full">
              <Text className="text-xs font-SatoBlack tracking-wide w-4/5 text-clip text-nowrap">
                {item.name}
              </Text>

              <View className="flex-row items-center gap-1">
                <FontAwesome name="star" size={8} color="orange" />
                <Text className="text-sx font-SatoMedium">
                  {vendorRating.toFixed(1)}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="gap-1.5 flex-row">
                <Text className="font-SatoRegular text-s">
                  ₹ {item.price}.00
                </Text>
                <Text className="font-SatoItalic text-s line-through text-blue-900/80">
                  ₹ {parseInt(item.price * 1.2)}.00
                </Text>
              </View>
              <Text className="font-SatoItalic text-gray-500 text-s">
                {formatDeliveryDate(item.delivery)}
              </Text>
            </View>
          </View>
        </Pressable>
      );
    },
    [vendors]
  );

  return (
    <View className="w-full items-center py-4">
      <View className="w-11/12 items-center gap-5">
        <View className="w-full items-center gap-3">
          <View>
            <Text className="font-SatoRegular tracking-widest uppercase text-s gap-1">
              <Text className="font-SatoBold">{vendors.length} </Text>
              Vendors offering you
            </Text>
          </View>
          <View className="w-full">
            {/* <FilterComponent
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            /> */}
            <FilterImageComponent
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </View>
          {foodProducts.length !== 0 && (
            <View className="w-full flex-row items-center justify-between">
              <View className="w-1/4 h-px bg-zinc-100" />
              <Text className="font-SatoBold text-gray-400 tracking-wider uppercase text-s">
                Suggested for you
              </Text>
              <View className="w-1/4 h-px bg-zinc-100" />
            </View>
          )}
        </View>

        {foodProducts.length === 0 ? (
          <Text className="font-SatoRegular">
            Fresh food updates coming soon!
          </Text>
        ) : (
          <FlatList
            data={foodProducts}
            renderItem={renderFoodItem}
            keyExtractor={(item) => item.foodItemId.toString()}
            showsVerticalScrollIndicator={false}
            style={{
              width: "100%", // Make the list span the full width
            }}
            contentContainerStyle={{
              alignItems: "center",
              paddingBottom: 16, // Add padding for the bottom
            }}
            columnWrapperStyle={{
              justifyContent: "start", // Add space between items in the row
              marginBottom: 16, // Add space between rows
            }}
            numColumns={2}
          />
        )}
      </View>
    </View>
  );
};

export default HomeFeed;
