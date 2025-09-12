import React from "react";
import { View } from "react-native";
import TabButton from "./TabButton";

const CustomTabBar = ({ position }) => {

  const states = [
    {
      position: 0,
      label: "Home",
      icon: "index",
      routeName: "Home",
    },
    {
      position: 1,
      label: "Search",
      icon: "search",
      routeName: "Search"
    },
    {
      position: 2,
      label: "Menu",
      icon: "widget",
      routeName: "Menu",
    },
    {
      position: 3,
      label: "Profile",
      icon: "profile",
      routeName: "Profile",
    },
  ]
  return (
    <View className="absolute bottom-0 flex-row justify-evenly items-center h-15 rounded-t-3xl overflow-hidden bg-white border-t border-zinc-100 shadow-xl shadow-zinc-400 pt-2">
      {states.map((route) => {

        const isFocused = position === route.position;

        return (
          <TabButton
            key={route.position}
            position={route.position}
            isFocused={isFocused}
            routeName={route.routeName}
            label={route.label}
          />
        );
      })}
    </View>
  );
};

export default CustomTabBar;

