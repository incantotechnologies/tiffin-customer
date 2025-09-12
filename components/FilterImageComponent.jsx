import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import { primary } from "../constants/color";
import { Image } from "react-native";
import { images } from "../constants";

const filters = [
  //   {
  //     id: "1",
  //     label: "Vegetarian",
  //     image: images.breakfast,
  //   },
  {
    id: "2",
    label: "Breakfast",
    image: images.breakfast,
  },
  {
    id: "3",
    label: "Lunch",
    image: images.lunch,
  },
  {
    id: "4",
    label: "Dinner",
    image: images.dinner,
  },
  {
    id: "5",
    label: "Snacks",
    image: images.snacks,
  },
  {
    id: "6",
    label: "Dessert",
    image: images.dessert,
  },
];

const FilterImageComponent = ({ selectedCategory, setSelectedCategory }) => {
  const renderItem = ({ item }) => {
    const isSelected = selectedCategory === item.label;
    const isVegetarian = item.label === "Vegetarian";

    return (
      <TouchableOpacity
        className={`items-center gap-1 rounded-full mr-2`}
        onPress={() => setSelectedCategory(item.label)}
      >
        <View
          className={`w-20 h-20 bg-background rounded-full overflow-hidden shadow-xl shadow-gray-300 items-center justify-center border ${
            isSelected
              ? isVegetarian
                ? "bg-green-100 border border-green-500"
                : "bg-primary/10 border border-primary/50"
              : "border border-gray-200 bg-background"
          }`}
        >
          <Image source={item.image} className="w-90 h-90 object-center rounded-full" />
        </View>
        <Text
          className={`text-s ${
            isSelected
              ? isVegetarian
                ? "font-SatoRegular text-green-700"
                : "font-SatoRegular text-primary"
              : "font-SatoRegular text-black"
          }`}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="w-full py-2 flex-row items-center">
      {selectedCategory && (
        <View className="items-center gap-4 rounded-full mr-2">
          <TouchableOpacity
            className="flex-row items-center gap-1 w-14 h-14 justify-center rounded-full m bg-white border border-zinc-200"
            onPress={() => setSelectedCategory(null)}
          >
            <Entypo name="cross" size={16} color="#008080" />
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={filters}
        horizontal
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 4, paddingVertical: 2 }}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default FilterImageComponent;
