import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MenuComponent from "../../../components/MenuComponent";
import TopTabBar from "../../../components/TopTabBar";
import { gradient, primary } from "../../../constants/color";
import { FoodItemsContext } from "../../../contexts/FoodItemsContext";

const Today = () => {
  const { foodItems } = useContext(FoodItemsContext);
  const [todayItems, setTodayItems] = useState([]);

  useEffect(() => {
    // Get today's date
    const todayDate = new Date();
    const currentDate = todayDate.getDate();  // Get the day of the month

    // Filter foodItems based on the current date
    const filteredItems = foodItems.filter((item) => {
      const itemDelivery = new Date(item.delivery);
      const deliveryDate = itemDelivery.getDate();  // Extract day of the month from delivery date
      return deliveryDate - currentDate === 0;  // Compare with today's date
    });

    setTodayItems(filteredItems);
  }, [foodItems]);  // This hook now runs whenever foodItems change

  return (
    <>
      <View className="items-center">
        <View className="w-full h-24">
          <LinearGradient end={{ x: 0.5, y: 3 }} colors={gradient} className="w-full h-full items-center justify-center gap-2">
            <View className="items-center w-full h-18 justify-end">
              <Text className="font-SatoBlack text-white uppercase">Menu</Text>
            </View>
          </LinearGradient>
        </View>
      </View>
      <View className="w-full h-20 items-center justify-center bg-background">
        <TopTabBar position={0} />
      </View>
      <MenuComponent itemsToDisplay={todayItems} />
    </>
  );
};

export default Today;

const styles = StyleSheet.create({});
