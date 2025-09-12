import { View, Text, FlatList, Image, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { images } from "../constants";

const category = [
  {
    id: 1,
    name: "Breakfast",
    image: images.breakfast,
  },
  {
    id: 2,
    name: "Lunch",
    image: images.lunch,
  },
  {
    id: 3,
    name: "Dinner",
    image: images.dinner,
  },
  {
    id: 4,
    name: "Snacks",
    image: images.snacks,
  },
  // {
  //   id: 5,
  //   name: "Icecream",
  //   image: images.icecream,
  // },
];

const CategoryComponent = () => {
  const router = useRouter();
  const renderItem = ({ item }) => {
    return (
      <View className="items-center gap-1">
        <Pressable
          onPress={() => router.push(`/(screens)/(category)/${item.name}`)}
          className="w-24 h-24 bg-background rounded-full overflow-hidden shadow-xl shadow-gray-300 items-center justify-center border border-gray-100"
        >
          <Image source={item.image} className="w-90 h-90 object-center" />
        </Pressable>
        <Text className="text-s font-SatoMedium tracking-wide">
          {item.name}
        </Text>
      </View>
    );
  };

  return (
    <View className="items-center gap-5">
      <View className="w-11/12 flex-row items-center gap-3 justify-center">
        <View className="w-1/3 h-px bg-zinc-100" />
        <Text className="font-SatoBold tracking-wider text-gray-700 uppercase text-xs">
          Choose by category
        </Text>
        <View className="w-1/3 h-px bg-zinc-100" />
      </View>
      <FlatList
        data={category}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          paddingHorizontal: 10,
        }}
        style={{ width: "95%" }}
      />
    </View>
  );
};

export default CategoryComponent;
