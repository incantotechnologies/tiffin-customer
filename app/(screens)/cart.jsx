import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axios from "axios";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartContext } from "../../contexts/CartContext";
import { FoodItemsContext } from "../../contexts/FoodItemsContext";
import { useToast } from "../../contexts/ToastProvider";

export const CartHeader = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { clearCart, timeRemaining, timerActive } = useContext(CartContext);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleClearCart = async() => {
    setLoading(true);
    await clearCart(false);
    setLoading(false);
  }
  return (
    <SafeAreaView className="items-center justify-end bg-white h-28 shadow-xl shadow-gray-400 border-b border-gray-200">
      <View className="w-93 h-full flex-row items-end justify-between">
        <View className="flex-row items-center justify-between h-4/6 w-full">
          <View className="flex-row items-center gap-2 w-1/2">
            <TouchableOpacity
              onPress={() => router.back()}
              className=" w-11 h-11 items-center justify-center"
            >
              <MaterialCommunityIcons
                name="keyboard-backspace"
                size={20}
                color="#333"
              />
            </TouchableOpacity>
            <View>
              <Text className="font-SatoBlack">Checkout</Text>
              {timerActive && timeRemaining > 0 && (
                <Text className="font-SatoRegular text-xs text-red-500">
                  Auto-clear in {formatTime(timeRemaining)}
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            disabled={loading}
            onPress={handleClearCart} // Clear the entire cart
            className="bg-gray-100 flex-row items-center gap-1 py-1.5 px-2 rounded-md"
          >
            <MaterialCommunityIcons name="cart-remove" size={12} color="#555" />
            <Text className="text-s font-outfit font-SatoBold uppercase">
              Clear
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const CartPage = () => {
  const { showToast } = useToast();
  const { cartItems, removeFromCart, clearCart, timeRemaining, timerActive } = useContext(CartContext);
  const { jwtToken, apartmentId, fetchFoodItemsAndImages, setAvailableOrders } =
    useContext(FoodItemsContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [removeItemloading, setRemoveItemLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState({
    totalFee: 0,
    gstFee: 0,
    handlingFee: 0,
    deliveryFee: 0,
    itemsFee: 0,
  });
  //

  const calculateGrandTotal = () => {
    let total = 0,
      delivery = 0;
    cartItems.forEach((item) => {
      const isDelivery = item.deliveryType == "Get Delivered";
      total += item.price * item.quantity;
      delivery += isDelivery * (item.deliveryPrice || 0);
    });
    const handlingFee = total * 0.05;
    const gst = 0;
    const totalPrice = total + delivery + handlingFee + gst;
    setTotalPrice({
      totalFee: totalPrice.toFixed(2),
      itemsFee: total.toFixed(2),
      handlingFee: handlingFee.toFixed(2),
      gstFee: gst.toFixed(2),
      deliveryFee: delivery.toFixed(2),
    });
  };

  useEffect(() => {
    calculateGrandTotal();
  }, [cartItems.length, cartItems]);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Ensure token exists
      if (!jwtToken) {
        throw new Error("Authorization token is missing.");
      }

      // Prepare the payload
      const orderPayload = {
        foodItems: cartItems.map((item) => ({
          foodItemId: item.foodItemId,
          quantity: item.quantity,
          deliveryType: item.deliveryType,
        })),
        apartmentId, // Extract foodItemIds and quantities from cartItems
      };

      // Make the POST request
      const response = await axios.post(
        "https://tiffinblox-1.onrender.com/auth/customer/place-order",
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Add the JWT token in the Authorization header
          },
        }
      );
      fetchFoodItemsAndImages();
      setAvailableOrders();
      // Handle the response
      if (response) {
        router.replace("(tabs)/");
        showToast({ type: "success", message: "Order placed successfully" });
        clearCart(true);
      } else {
        console.error("Unexpected response:", response.data);
        // alert("Something went wrong. Please try again.");
        showToast({
          type: "error",
          message: "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      // Handle errors
      console.error("Error placing order:", error);
      // alert("Failed to place order. Please try again later.");
      showToast({
        type: "error",
        message: "Failed to place order. Try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItemFromCart = async(item) => {
    setRemoveItemLoading(true);
    await removeFromCart(item);
    setRemoveItemLoading(false);
  }


  return (
    <>
      <CartHeader />
      {cartItems.length !== 0 ? (
        <ScrollView
          contentContainerStyle={{ alignItems: "center" }}
          className="py-4 gap-4 bg-background"
        >
          <View className="w-93 gap-4">
            {/* Timer Display */}
            {timerActive && timeRemaining > 0 && (
              <View className="w-full justify-center bg-red-50 rounded-2xl overflow-hidden shadow-xl shadow-gray-200 border border-red-200">
                <View className="px-3 py-3 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="timer" size={20} color="#ef4444" />
                    <Text className="font-SatoBold text-red-600 text-sm">
                      Cart Auto-Clear Timer
                    </Text>
                  </View>
                  <Text className="font-SatoBlack text-red-600 text-lg">
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </Text>
                </View>
                <View className="px-3 pb-2">
                  <Text className="font-SatoRegular text-red-500 text-xs">
                    Your cart will be automatically cleared when the timer reaches 00:00
                  </Text>
                </View>
              </View>
            )}
            {/* Cart Items List */}
            <View className="w-full justify-center space-y-px bg-white rounded-2xl overflow-hidden shadow-xl shadow-gray-200 border border-gray-100">
              <View className="px-2.5 h-12 justify-center border-b border-gray-200">
                <Text className="font-SatoBlack text-sm uppercase">
                  Cart Items
                </Text>
              </View>
              {cartItems.map((item) => (
                <View
                  key={item.foodItemId}
                  className="w-full h-[115px] bg-white flex-row items-center justify-between p-3 border-b border-gray-200"
                >
                  <View className="rounded-lg overflow-hidden">
                    <Image
                      source={{ uri: item.image }}
                      className="aspect-square h-full"
                    />
                  </View>
                  <View className="w-[65%] h-full justify-between p-px">
                    <View>
                      <View className="flex-row items-center justify-between">
                        <Text className="font-SatoBold uppercase text-xs">
                          {item.name}
                        </Text>
                        <TouchableOpacity disabled={removeItemloading} onPress={() => handleRemoveItemFromCart(item)}>
                          <MaterialIcons name="close" size={16} color="#555" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View className="py-px flex-row items-center justify-between">
                      <Text className="text-s uppercase font-outfit font-bold">
                        Quantity: {item.quantity}
                      </Text>
                      {item.isDelivery === "yes" && (
                        <View className="flex-row items-center gap-1">
                          {item.deliveryType === "Get Delivered" ? (
                            <MaterialIcons
                              name="delivery-dining"
                              size={14}
                              color="#333"
                            />
                          ) : (
                            <MaterialIcons
                              name="sensor-door"
                              size={14}
                              color="#333"
                            />
                          )}
                          <Text className="text-s font-SatoMedium">
                            {item.deliveryType}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View className="flex-row items-center justify-between w-full">
                      <Text className="font-SatoBold capitalize text-xs text-gray-700">
                        {item.category}
                      </Text>
                      <Text className="text-sm font-SatoBlack text-primary">
                        ₹{" "}
                        {item.price * item.quantity +
                          (item.deliveryType == "Get Delivered"
                            ? item.deliveryPrice
                            : 0)}
                        .00
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View className="w-full justify-center space-y-px bg-white rounded-2xl overflow-hidden shadow-xl shadow-gray-200 border border-gray-100">
              <View className="px-3.5 h-12 justify-center border-b border-gray-200">
                <Text className="font-SatoBlack text-sm uppercase">
                  Price breakdown
                </Text>
              </View>
              <View className="w-full bg-white items-center justify-between p-4 border-b border-gray-200 gap-3">
                <View className="flex-row items-center justify-between w-full">
                  <Text className="font-SatoRegular text-sm">Items total</Text>
                  <Text className="font-SatoRegular text-sm">
                    ₹ {totalPrice.itemsFee}
                  </Text>
                </View>
                {/* <View className="flex-row items-center justify-between w-full">
                  <Text className="font-SatoRegular text-sm">GST</Text>
                  <Text className="font-SatoRegular text-sm">
                    ₹ {totalPrice.gstFee || 0}
                  </Text>
                </View> */}
                <View className="flex-row items-center justify-between w-full">
                  <Text className="font-SatoRegular text-sm">Handling fee</Text>
                  <Text className="font-SatoRegular text-sm">
                    ₹ {totalPrice.handlingFee || "--"}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between w-full">
                  <Text className="font-SatoRegular text-sm">
                    Delivery charges
                  </Text>
                  <Text className="font-SatoRegular text-sm">
                    {" "}
                    ₹ {totalPrice.deliveryFee}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between w-full border-t border-gray-200 pt-3">
                  <Text className="font-SatoMedium text-sm">
                    Payable amount
                  </Text>
                  <Text className="font-SatoBold text-sm">
                    ₹ {totalPrice.totalFee}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="h-40"></View>
        </ScrollView>
      ) : (
        <View className="h-5/6 items-center justify-center">
          <Text className="uppercase font-anton text-lg tracking-widest text-gray-400">
            Your cart is empty
          </Text>
        </View>
      )}

      {cartItems.length !== 0 && (
        <View className="absolute left-0 bottom-0 flex-row items-center justify-center w-full bg-white py-2.5 shadow-xl shadow-gray-200 border-t border-gray-100">
          <View className="flex-row items-center justify-between w-93">
            <View>
              <Text className="font-SatoBlack text-lg">
                ₹ {totalPrice?.totalFee || "-"}
              </Text>
              <Text className="font-SatoRegular">Total</Text>
            </View>
            <TouchableOpacity
              className="bg-primary w-1/2 h-12 rounded-full items-center justify-center"
              onPress={() => {
                Alert.alert(
                  "Place Order",
                  `Do you want to place the order for ₹ ${
                    totalPrice?.totalFee || "-"
                  }?`,
                  [
                    {
                      text: "Yes",
                      onPress: () => handlePlaceOrder(),
                    },
                    { text: "No" },
                  ]
                );
              }}
            >
              <View className="flex-row items-center gap-2">
                <Text className="text-gray-100 uppercase font-SatoBold text-sm">
                  {!loading ? "Place Order" : "Placing oreder..."}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default CartPage;
