import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import { primary } from "../constants/color";

const filters = [
  {
    id: "1",
    label: "Vegetarian",
    icon: <FontAwesome5 name="dot-circle" size={12} color="green" />,
  },
  {
    id: "2",
    label: "Breakfast",
    icon: <MaterialIcons name="free-breakfast" size={12} color={primary} />,
  },
  {
    id: "3",
    label: "Lunch",
    icon: <MaterialIcons name="lunch-dining" size={12} color={primary} />,
  },
  {
    id: "4",
    label: "Dinner",
    icon: <MaterialIcons name="dinner-dining" size={12} color={primary} />,
  },
  {
    id: "5",
    label: "Snacks",
    icon: (
      <MaterialCommunityIcons name="food-outline" size={12} color={primary} />
    ),
  },
];

const FilterComponent = ({ selectedCategory, setSelectedCategory }) => {
  const renderItem = ({ item }) => {
    const isSelected = selectedCategory === item.label;
    const isVegetarian = item.label === "Vegetarian";

    return (
      <TouchableOpacity
        className={`flex-row items-center gap-1 py-2.5 px-3 rounded-xl mr-2 ${
          isSelected
            ? isVegetarian
              ? "bg-green-100 border border-green-500"
              : "bg-primary/10 border border-primary/50"
            : "border border-gray-200 bg-background"
        }`}
        onPress={() => setSelectedCategory(item.label)}
      >
        {item.icon}
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
        <TouchableOpacity
          className="flex-row items-center gap-1 p-1.5 rounded-lg mr-1 bg-white border border-zinc-200"
          onPress={() => setSelectedCategory(null)}
        >
          <Entypo name="cross" size={16} color="#008080" />
        </TouchableOpacity>
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

export default FilterComponent;
