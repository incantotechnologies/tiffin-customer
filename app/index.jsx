import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { background } from "../constants/color";
import * as NavigationBar from "expo-navigation-bar";
import { FoodItemsContext } from "../contexts/FoodItemsContext";

const Index = () => {
  NavigationBar.setBackgroundColorAsync("#fff");
  const [loading, setLoading] = useState(true); // State to handle loading
  const [redirectPath, setRedirectPath] = useState(null); // State to handle redirection path
  const { fetchFoodItemsAndImages, setAvailableOrders } =
    useContext(FoodItemsContext);

  useEffect(() => {
    const checkJwtToken = async () => {
      try {
        const token = await AsyncStorage.getItem("cjwtToken");
        if (token) {
          setRedirectPath("/(tabs)/"); // Redirect to tabs if token exists
        } else {
          setRedirectPath("/(onboard)/signin"); // Redirect to onboard if no token
        }
      } catch (error) {
        console.error("Error checking JWT token:", error);
        setRedirectPath("/(onboard)/signin"); // Safe fallback
      } finally {
        setLoading(false); // Stop loading
      }
    };

    checkJwtToken();
  }, []);

  useEffect(() => {
    fetchFoodItemsAndImages();
    setAvailableOrders();

    const interval = setInterval(() => {
      fetchFoodItemsAndImages();
      setAvailableOrders();
    }, 5 * 60 * 1000); // 15 minutes in milliseconds

    // Cleanup when component unmounts
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: background,
        }}
      >
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        backgroundColor: background,
      }}
    >
      {redirectPath && <Redirect href={redirectPath} />}
    </View>
  );
};

export default Index;
