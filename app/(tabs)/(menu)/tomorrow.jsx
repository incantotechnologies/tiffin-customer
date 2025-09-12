import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import MenuComponent from "../../../components/MenuComponent";
import TopTabBar from "../../../components/TopTabBar";
import { gradient } from "../../../constants/color";
import { FoodItemsContext } from "../../../contexts/FoodItemsContext";

const Tomorrow = () => {
  const { foodItems } = useContext(FoodItemsContext);
  const [tomorrowItems, setTomorrowItems] = useState([]);
  const [date, setDate] = useState(null); // Initialize state as null to handle the logic properly

  // Effect to set today's date
  useEffect(() => {
    let todayDate = new Date(Date.now());
    setDate(todayDate.getDate());
  }, []); // This effect runs only once when the component mounts

  // Effect to filter tomorrow's items based on the updated date
  useEffect(() => {
    if (date !== null) { // Ensure that date is not null before filtering
      const handleTomorrowFilter = () => {
        const filteredItems = foodItems.filter((item) => {
          const itemDelivery = new Date(item.delivery);
          const deliveryDate = itemDelivery.getDate(); // Get day of the month from delivery date
          return deliveryDate - date === 1; // Items delivered tomorrow
        });
        setTomorrowItems(filteredItems);
      };
      handleTomorrowFilter(); // Filter items when date is set
    }
  }, [date, foodItems]); // Dependency on date and foodItems to ensure the filter runs after the date update

  return (
    <>
      <View className="items-center">
        <View className="w-full h-24">
          <LinearGradient
            end={{ x: 0.5, y: 3 }}
            colors={gradient}
            className="w-full h-full items-center justify-center gap-2"
          >
            <View className="items-center w-full h-18 justify-end">
              <Text className="font-SatoBlack text-white uppercase">Menu</Text>
            </View>
          </LinearGradient>
        </View>
      </View>
      <View className="w-full h-20 items-center justify-center bg-background">
        <TopTabBar position={1} />
      </View>
      <MenuComponent itemsToDisplay={tomorrowItems} />
    </>
  );
};

export default Tomorrow;
