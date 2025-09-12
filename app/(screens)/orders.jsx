import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FoodItemsContext } from "../../contexts/FoodItemsContext";
import { LinearGradient } from "expo-linear-gradient";
import { gradient } from "../../constants/color";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const { jwtToken } = useContext(FoodItemsContext);
  const [loading, setLoading] = useState(false);
  const [openOrderId, setOpenOrderId] = useState(null);

  useEffect(() => {
    const fetchOrderedItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://maneuta-backend.onrender.com/auth/customer/fetch-orders",
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`, // Replace `yourJwtToken` with the actual JWT token
            },
          }
        );

        console.log("fetched orders are", response.data);
        const fetchedOrders = response.data.orders
          .sort((a, b) => a.orderId - b.orderId)
          ?.reverse();
        // Assuming the response data contains the orders
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchOrderedItems();
  }, []);

  const formatTime = (time) => {
    const date = new Date(time);
    const options = {
      day: "2-digit",
      month: "short",
      // year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  return (
    <>
      <View className="items-center w-full h-24">
        <View className="w-full h-full">
          <LinearGradient
            end={{ x: 0.5, y: 3 }}
            colors={gradient}
            className="w-full items-center justify-center gap-2 h-full"
          >
            <View className="w-93 h-18 items-end justify-end">
              <View className="flex-row items-center justify-between w-full">
                <View className="flex-row items-center justify-center w-full gap-1">
                  <Text className="font-SatoBlack uppercase text-white text-center">
                    Order History
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>
      <SafeAreaView className="items-center py-1 w-full bg-background min-h-screen">
        {!loading && (
          <ScrollView
            contentContainerStyle={{ alignItems: "center", gap: 10 }}
            className="h-full py-1 w-full"
            showsVerticalScrollIndicator={false}
          >
            <View className="w-11/12 gap-3">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <View key={order.orderId}>
                    {/* Touchable to open the modal */}
                    <TouchableOpacity
                      onPress={() => setOpenOrderId(order.orderId)}
                      className="px-4 py-5 shadow-xl shadow-zinc-400 bg-white gap-3 rounded-lg"
                    >
                      <View className="flex-row items-center justify-between">
                        <Text className="text-s uppercase">
                          ID: {order.orderId}
                        </Text>
                        <View className="flex-row items-center justify-between">
                          <Text className="text-s uppercase font-SatoMedium">
                            Status:{" "}
                            <Text className="font-SatoBlack">
                              {order.foodItems[0]?.status}
                            </Text>
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-center gap-1 flex-wrap">
                        {order.foodItems.map((foodItem, index) => (
                          <Text
                            key={foodItem.foodItemId}
                            className="font-SatoMedium"
                          >
                            {foodItem.name}
                            {index < order.foodItems.length - 1 && ", "}
                          </Text>
                        ))}
                      </View>

                      <View className="flex-row items-center justify-between">
                        <Text className="text-xs font-SatoMedium">
                          Ordered on:{" "}
                        </Text>
                        <Text className="font-SatoBold text-s">
                          {formatTime(order.created_at)}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Modal for this order */}
                    <Modal
                      visible={openOrderId === order.orderId}
                      animationType="slide"
                      transparent={true}
                      onRequestClose={() => setOpenOrderId(null)}
                    >
                      <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{ flex: 1 }}
                      >
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                          <View className="flex-1 justify-end items-center bg-transparent w-full">
                            <View className="w-full h-1/4 items-center justify-center">
                              <View className="w-full h-5/6 justify-end items-center">
                                <TouchableOpacity
                                  onPress={() => setOpenOrderId(null)}
                                  className="w-14 h-14 bg-black/60 rounded-full items-center justify-center z-30"
                                >
                                  <AntDesign
                                    name="close"
                                    size={20}
                                    color="#f5f5f5"
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                            <View className="bg-white w-full h-3/4 rounded-t-2xl items-center justify-center">
                              <View className="w-93 h-90 gap-4">
                                <View className="gap-2">
                                  <Text className="font-SatoMedium text-lg">
                                    Order Details
                                  </Text>
                                  <View className="flex-row items-center justify-between w-full">
                                    <Text className="text-s uppercase font-SatoMedium">
                                      ID: {order.orderId}
                                    </Text>
                                    <Text className="text-s font-SatoMedium">
                                      Ordered on:{" "}
                                      <Text className="font-SatoBold">
                                        {formatTime(
                                          order.created_at
                                        )}
                                      </Text>
                                    </Text>
                                  </View>
                                </View>
                                <ScrollView
                                  showsVerticalScrollIndicator={false}
                                  className="border-t border-dashed"
                                >
                                  {order.foodItems.map((foodItem) => (
                                    <View
                                      key={foodItem.foodItemId}
                                      className="border-b border-dashed border-zinc-300 py-3.5 gap-3.5"
                                    >
                                      <View className="flex-row items-center justify-between">
                                        <Text className="text-xs uppercase font-SatoBlack">
                                          {foodItem.name}
                                        </Text>
                                        <Text className="font-SatoMedium text-sm">
                                          x {foodItem.quantity}
                                        </Text>
                                      </View>

                                      <View className="flex-row items-center justify-between w-full">
                                        <View className="flex-row items-center gap-1">
                                          <MaterialIcons
                                            name="delivery-dining"
                                            size={14}
                                            color="black"
                                          />
                                          <Text className="font-SatoMedium text-sm">
                                            Time
                                          </Text>
                                        </View>
                                        <Text className="font-SatoBold text-s">
                                          {formatTime(foodItem.delivery)}
                                        </Text>
                                      </View>

                                      <View className="flex-row items-center justify-between">
                                        <Text className="text-s uppercase font-SatoMedium">
                                          Status:{" "}
                                          <Text className="font-SatoBold text-primary">
                                            {foodItem.status}
                                          </Text>
                                        </Text>
                                        <Text className="text-xs text-primary font-SatoBlack">
                                          ₹{" "}
                                          {(
                                            foodItem.price * foodItem.quantity
                                          ).toFixed(2)}
                                        </Text>
                                      </View>
                                    </View>
                                  ))}
                                </ScrollView>
                              </View>
                            </View>
                          </View>
                        </ScrollView>
                      </KeyboardAvoidingView>
                    </Modal>
                  </View>
                ))
              ) : (
                <Text className="text-lg font-SatoBold text-center mt-4">
                  No orders found.
                </Text>
              )}
            </View>
          </ScrollView>
        )}
        {loading && <ActivityIndicator size={32} color="#008080" />}
      </SafeAreaView>
      <View
        className={`bg-black/20 absolute top-0 left-0 w-full items-center justify-end ${
          openOrderId ? "h-full" : "h-0"
        }`}
      ></View>
    </>
  );
};

export default OrderHistory;
