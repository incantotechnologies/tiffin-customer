import React, { useCallback, useContext, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomTabBar from "../../components/CustomTabBar";
import SearchBox from "../../components/SearchBox";
import VendorList from "../../components/VendorList";
import { FoodItemsContext } from "../../contexts/FoodItemsContext";
import { CartContext } from "../../contexts/CartContext";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";

const Search = () => {
  const { foodItems, vendors } = useContext(FoodItemsContext);
  const { addToCart } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const router = useRouter();
  const itemqty = 1;

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]); // Clear search results if query is empty
      return;
    }

    // Filter foodItems based on the search query
    const results = foodItems.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results); // Update search results state
  };

  // Handle search on every keystroke or when user finishes typing
  React.useEffect(() => {
    handleSearch();
  }, [searchQuery]);

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
          className="bg-white rounded-2xl overflow-hidden shadow-xl shadow-gray-300 border-gray-200 border"
          style={{ width: "48%" }}
        >
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

          <View className="w-full p-2 justify-between gap-1">
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

            <View className="flex-row items-center w-full justify-between">
              <View className="gap-1.5 flex-row">
                <Text className="font-SatoRegular text-s">
                  ₹ {item.price}.00
                </Text>
                <Text className="font-SatoItalic text-s line-through text-blue-900/80">
                  ₹ {parseInt(item.price * 1.2)}.00
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => addToCart(item, itemqty)}
                className="w-8 h-8 bg-primary/5 rounded-full items-center justify-center z-10 flex-row gap-1 border border-primary/15"
              >
                <AntDesign name="plus" size={12} color="#008080" />
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      );
    },
    [vendors]
  );

  return (
    <SafeAreaView className="items-center flex-1 bg-background">
      <View className="w-full py-2 gap-5 items-center justify-between">
        <View className="w-93 py-2">
          <View className="w-full">
            <SearchBox
              placeholder="Search your taste"
              value={searchQuery}
              onChangeText={setSearchQuery} // Update query when user types
            />
          </View>
        </View>

        {searchResults.length < 1 && (
          <View className="w-full px-1 text-zinc-200">
            <VendorList />
          </View>
        )}
        {searchResults.length < 1 && searchQuery.trim() !== "" && (
          <View className="w-full items-center text-center h-12 justify-center">
            <Text className="font-SatoRegular text-gray-500">
              No items available
            </Text>
          </View>
        )}
        <View className="w-95 items-center gap-5">
          {searchResults.length !== 0 && (
            <View className="gap-2 w-full">
              <Text className="font-SatoRegular">Your search results</Text>
              <FlatList
                data={searchResults}
                renderItem={renderFoodItem}
                keyExtractor={(item) => item.foodItemId}
                showsVerticalScrollIndicator={false}
                style={{
                  width: "100%", // Make the list span the full width
                  gap: 10,
                  //   borderWidth: 1,
                }}
                contentContainerStyle={{
                  gap: 10,
                  paddingBottom: 400, // Add space between rows
                }}
                columnWrapperStyle={{
                  justifyContent: "start", // Add space between items in the row
                  gap: 10,
                }}
                numColumns={2}
              />
            </View>
          )}
        </View>
      </View>

      <CustomTabBar position={1} />
    </SafeAreaView>
  );
};

export default Search;
