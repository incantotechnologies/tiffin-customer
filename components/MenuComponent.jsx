import React, { useContext, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { FoodItemsContext } from "../contexts/FoodItemsContext";
import CustomTabBar from "./CustomTabBar";
import FoodItemsList from "./FoodItemsList";

const MenuComponent = ({ itemsToDisplay }) => {
  const [loading, setLoading] = useState(false);
  const { fetchFoodItemsAndImages } = useContext(FoodItemsContext);
  const data = [
    { type: "foodItemsList", component: <FoodItemsList itemsToDisplay={itemsToDisplay} /> },
    { type: "View", component: <View className="h-6"></View> },
  ];

  const renderItem = ({ item }) => {
    return <View className="">{item.component}</View>;
  };

  const onRefresh = async () => {
    setLoading(true);
    await fetchFoodItemsAndImages();
    setLoading(false);
  };

  return (
    <View
      style={{
        alignItems: "center",
        flex: 1,
      }}
      className="bg-background"
    >
      <View className="w-full">
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            width: "100%",
            gap: 20,
            // paddingTop: 10,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
        />
      </View>
      <CustomTabBar position={2} />
    </View>
  );
};

export default MenuComponent;
