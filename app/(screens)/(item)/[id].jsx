import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"; // Import Reanimated
import { FoodItemsContext } from "../../../contexts/FoodItemsContext";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import SimilarItems from "../../../components/SimilarItems";
import VendorCard from "../../../components/VendorCard";
import { icons, images } from "../../../constants";
import { primary } from "../../../constants/color";
import { CartContext } from "../../../contexts/CartContext";

const ItemHeader = ({ product, setItemQty }) => {
  const router = useRouter();
  const { cartItems } = useContext(CartContext);

  const handleShare = async () => {
    try {
      // Share product name and product URL or any relevant details
      const result = await Share.share({
        message: `Check out this amazing product: ${product.name}\n\n${
          product.url || "https://yourwebsite.com"
        }`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type: ", result.activityType);
        } else {
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.error("Error sharing product:", error.message);
    }
  };

  return (
    <SafeAreaView className="items-center w-full">
      <View className="w-93 h-18 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-white/75 w-11 h-11 items-center justify-center rounded-full shadow-xl shadow-gray-400"
        >
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={20}
            color="#333"
          />
        </TouchableOpacity>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => {
              router.push("/(screens)/cart");
              setItemQty(1); // Reset itemqty to 1 on route change
            }}
            className="bg-white/75 w-11 h-11 items-center justify-center rounded-full shadow-xl shadow-gray-400"
          >
            <Image source={icons.bag} className="h-5 w-5" />
            {cartItems != 0 && (
              <View className="absolute -top-1 -right-1 w-[16px] h-[16px] flex-row rounded-full items-center justify-center bg-black border border-gray-300">
                <Text className="font-SatoRegular text-sx text-white">
                  {cartItems.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleShare} // Add onPress handler for sharing
            className="h-11 w-11 items-center justify-center bg-white/75 rounded-full shadow-xl shadow-gray-400"
          >
            <Image source={icons.share} className="w-5 h-5" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Main Component
const ItemPage = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const { foodItems, vendors, changeKey } = useContext(FoodItemsContext);
  const { addToCart, cartItems } = useContext(CartContext);
  const [itemqty, setItemQty] = useState(1);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [selectedDeliveryOption, setSelectedDeliveryOption] =
    useState("Get Delivered");
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    setItemQty(1); // Reset itemqty to 1 on route change
  }, [id]);

  useEffect(() => {
    const itemId = parseInt(id);
    if (foodItems.length > 0) {
      // Simulate fetching delay
      const fetchProduct = () => {
        const selectedItem = foodItems.find(
          (food) => food.foodItemId === itemId
        );
        setProduct(selectedItem);
      };
      const timer = setTimeout(fetchProduct, 1000); // Delay for 3 seconds

      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [id, foodItems, changeKey]);

  const handleDeliveryOptionSelect = (option) => {
    setSelectedDeliveryOption(option);
  };

  const calculateDeliveryCharges = () => {
    if (selectedDeliveryOption === "Get Delivered") {
      return product?.deliveryPrice;
    }
    return 0;
  };

  // Reanimated style for the accordion content (smooth height transition)
  const animatedStyle = useAnimatedStyle(() => {
    return {
      maxHeight: withTiming(isDetailsVisible ? 300 : 0, { duration: 300 }),
      overflow: "hidden",
    };
  });

  if (!product) {
    return (
      <View className="w-full h-full absolute bottom-0 justify-center items-center bg-white z-40">
        <ActivityIndicator size="large" color="#008080" />
        <Text className="font-SatoRegular text-sm text-gray-500 mt-4">
          Loading...
        </Text>
      </View>
    );
  }

  // Helper function to format the expiry time
  const formatExpiryTime = (expiry) => {
    const date = new Date(expiry);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
  };

  const formatDeliveryDate = (delivery) => {
    const date = new Date(delivery);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options); // Format the date
  };

  const handleAddToCart = async (product, itemqty, selectedDeliveryOption) => {
    try {
      setAddingToCart(true);
      await addToCart(product, itemqty, selectedDeliveryOption);
      setItemQty(1);
    } catch (error) {
      console.log("Failed to add to cart");
    } finally {
      // wait 1 second before releasing lock
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("lock on add to cart button released");
      setAddingToCart(false);
    }
  };
  

  const vendor = vendors.find((vendor) => vendor.vendorId === product.vendorId);
  const vendorRating = vendor ? vendor.rating : 0;

  return (
    <View className="flex-1 items-center bg-background">
      <View
        style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 0 }}
      >
        <ImageBackground
          source={{ uri: product.image }}
          style={{ width: "100%", height: 300 }} // Fixed size for the image
        >
          <LinearGradient
            colors={[
              "transparent",
              "transparent",
              "transparent",
              "transparent",
              "transparent",
              "#f5f5f5",
            ]}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <ItemHeader product={product} setItemQty={setItemQty} />
          </LinearGradient>
        </ImageBackground>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "100%", marginTop: 256, height: "100%" }}
      >
        <View className="gap-3 px-3 w-full">
          <View className="w-full gap-2 pt-4 rounded-2xl bg-white shadow-xl shadow-gray-200 items-center border border-gray-100">
            <View className="w-93 gap-1">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className="flex-row items-center gap-1">
                    <FontAwesome name="star" size={8} color="orange" />
                    <Text className="text-sx font-SatoMedium">
                      ( {vendorRating.toFixed(1)} )
                    </Text>
                  </View>
                  <Text className="font-SatoBlack text-sx uppercase tracking-wider">
                    {product.category}
                  </Text>
                </View>
                <Image source={images.fssai} className="h-3.5 w-7" />
              </View>

              {/* Product Name and Expiry Time */}
              <View className="flex-row justify-between items-center">
                <Text className="font-SatoBlack text-lg pt-1 uppercase tracking-wide">
                  {product.name}
                </Text>
                <View>
                  {product.type === "veg" ? (
                    <View className="flex-row items-center gap-2">
                      <View className="p-1 bg-white border border-green-500">
                        <View className="w-2 h-2 bg-green-500 rounded-full" />
                      </View>
                    </View>
                  ) : (
                    <View className="flex-row items-center gap-2">
                      <View className="p-1 bg-white border border-red-500">
                        <View className="w-2 h-2 bg-red-500 rounded-full" />
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View className="flex-row items-center justify-between w-93">
              <View className="flex-row items-center gap-2">
                <Text className="text-lg font-SatoBlack text-gray-800">
                  ₹ {product.price}.00
                </Text>
                <View className="flex-row items-center gap-1 pt-px">
                  <Text className="font-SatoItalic text-xs text-gray-400">
                    MRP
                  </Text>
                  <Text className="font-SatoItalic text-xs line-through text-gray-400">
                    ₹ {(product.price * 1.2).toFixed(2)}
                  </Text>
                </View>
              </View>
              <Text className="font-SatoRegular pt-1 text-xs">
                Order by{" "}
                <Text className="font-SatoMedium">
                  {formatExpiryTime(product.expiry)}
                </Text>
              </Text>
            </View>

            <View className="w-93 gap-3 my-1">
              {product.description && (
                <Text className="text-xs font-SatoRegular">
                  {product.description}
                </Text>
              )}

              <View className="flex-row items-center justify-between w-full">
                <View className="flex-row items-center gap-1">
                  <Text className="text-xs text-gray-700 font-SatoMedium">
                    Serves:
                  </Text>
                  <Text className="font-SatoBold text-xs">
                    {product.serves}
                  </Text>
                </View>
                {product.availableOrders ? (
                  <View className="flex-row items-center gap-1">
                    <Text className="text-xs text-gray-700 font-SatoMedium">
                      Orders left:
                    </Text>
                    <Text className="font-SatoBold text-xs">
                      {product.availableOrders || "N/A"}
                    </Text>
                  </View>
                ) : (
                  <View className="flex-row items-center gap-1">
                    <Text className="text-xs text-blue-600 font-SatoMedium">
                      No orders left
                    </Text>
                    {/* <Text className="font-SatoBold text-xs">
                      {product.availableOrders || "N/A"}
                    </Text> */}
                  </View>
                )}
              </View>
            </View>

            <View className="border-t border-dashed py-3.5 border-gray-200 px-3.5 w-full">
              {/* Accordion Button */}
              <View className="flex-row-reverse items-center justify-between w-full">
                <TouchableOpacity
                  onPress={() => {
                    setIsDetailsVisible(!isDetailsVisible);
                  }}
                  className=" border-gray-100 flex-row items-center"
                >
                  <Text className="font-SatoBold text-green-600 text-xs">
                    {isDetailsVisible ? "Delivery Information" : "More details"}
                  </Text>
                  <MaterialIcons
                    name={isDetailsVisible ? "expand-less" : "expand-more"}
                    size={16}
                    color="#16a34a"
                    className="pt-px"
                  />
                </TouchableOpacity>
                <View className="flex-row items-center justify-center gap-1">
                  <View>
                    {product.isDelivery.toLowerCase() === "yes" ? (
                      <View className="flex-row items-center gap-2">
                        <View className="p-1 bg-white">
                          <View className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        </View>
                      </View>
                    ) : (
                      <View className="flex-row items-center gap-2">
                        <View className="p-1 bg-white">
                          <View className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                        </View>
                      </View>
                    )}
                  </View>
                  <Text className="font-SatoRegular text-xs">
                    {product.isDelivery.toLowerCase() === "yes"
                      ? "Delivery available"
                      : "No delivery"}
                  </Text>
                </View>
              </View>

              {/* Animated Accordion Content */}
              <Animated.View style={animatedStyle} className="w-full">
                {isDetailsVisible && (
                  <View className="w-full pt-4">
                    <View className="w-full gap-4">
                      <View className="flex-row items-center justify-between">
                        {/* <View className="flex-row items-center gap-1">
                          <Text className="text-xs text-gray-700 font-SatoMedium">
                            Available:
                          </Text>
                          <Text className="font-SatoBold text-xs capitalize">
                            {product.isDelivery}
                          </Text>
                        </View> */}
                        {/* <View className="w-px h-4 bg-gray-300" /> */}

                        <View className="flex-row items-center gap-1">
                          <Text className="text-xs text-gray-700 font-SatoMedium">
                            Date:
                          </Text>
                          <Text className="font-SatoBold text-xs">
                            {formatDeliveryDate(product.delivery)}
                          </Text>
                        </View>
                        <View className="w-px h-4 bg-gray-300" />

                        <View className="flex-row items-center gap-1">
                          <Text className="text-xs text-gray-700 font-SatoMedium">
                            Time:
                          </Text>
                          <Text className="font-SatoBold text-xs">
                            {formatExpiryTime(product.delivery)}
                          </Text>
                        </View>
                      </View>
                      <View className="gap-2">
                        {product.deliveryPrice && (
                          <View className="flex-row items-center gap-1">
                            <Text className="text-xs text-gray-700 font-SatoMedium">
                              Price:
                            </Text>
                            <Text className="font-SatoBold text-xs">
                              ₹ {product.deliveryPrice || "N/A"}
                            </Text>
                          </View>
                        )}
                        {product.deliveryDescription &&
                          product.deliveryDescription !== "N/A" && (
                            <View className="flex-row items-center gap-1">
                              <Text className="text-xs text-gray-700 font-SatoMedium">
                                Description:
                                <Text className="font-SatoMedium text-xs capitalize px-1">
                                  {product.deliveryDescription || "N/A"}
                                </Text>
                              </Text>
                            </View>
                          )}
                      </View>
                    </View>
                  </View>
                )}
              </Animated.View>
            </View>
          </View>

          <VendorCard product={product} />
          <SimilarItems product={product} foodItems={foodItems} />
        </View>

        <View className="h-32"></View>
      </ScrollView>

      <View className="absolute left-0 bottom-0 items-center justify-end w-full bg-white border-t border-gray-100 shadow-xl shadow-zinc-400 rounded-t-3xl">
        {product.isDelivery.toLowerCase() === "yes" && (
          <View className="flex-row items-center justify-center w-full h-14 border-b border-gray-200 border-dashed">
            <View className="flex-row items-center justify-between w-85">
              <View>
                <Text className="font-SatoBlack">
                  ₹{" "}
                  {selectedDeliveryOption === "Get Delivered"
                    ? product.price + product.deliveryPrice
                    : product.price}
                  .00
                </Text>
                {selectedDeliveryOption === "Get Delivered" && (
                  <Text className="font-SatoRegular text-s text-green-600">
                    + ₹{calculateDeliveryCharges()} delivery charges
                  </Text>
                )}
              </View>
              <View className="flex-row items-center gap-2.5">
                <TouchableOpacity
                  onPress={() => handleDeliveryOptionSelect("Get Delivered")}
                  style={{
                    borderColor:
                      selectedDeliveryOption === "Get Delivered"
                        ? primary
                        : "#BDBDBD",
                    backgroundColor:
                      selectedDeliveryOption === "Get Delivered"
                        ? "#0080801a"
                        : "transparent",
                  }}
                  className="flex-row items-center gap-1.5 p-2 border border-gray-100 rounded-lg"
                >
                  <MaterialIcons
                    name="delivery-dining"
                    size={14}
                    color="#333"
                  />
                  {/* <Text className="text-s font-SatoRegular">Deliver</Text> */}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeliveryOptionSelect("Visit Vendor")}
                  style={{
                    borderColor:
                      selectedDeliveryOption === "Visit Vendor"
                        ? primary
                        : "#BDBDBD",
                    backgroundColor:
                      selectedDeliveryOption === "Visit Vendor"
                        ? "#0080801a"
                        : "transparent",
                  }}
                  className="flex-row items-center gap-1.5 p-2 border border-gray-100 rounded-lg"
                >
                  <MaterialIcons name="sensor-door" size={14} color="#333" />
                  {/* <Text className="text-s font-SatoRegular">Visit</Text> */}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        <View className="flex-row items-center justify-center w-full pt-3 pb-px">
          <View className="flex-row items-center justify-between w-11/12">
            <View className="flex-row items-center gap-4 border border-gray-400 h-14 px-2 rounded-full">
              <TouchableOpacity
                onPress={() => setItemQty(itemqty > 1 ? itemqty - 1 : 1)}
                className="w-7 h-7 border border-gray-600 items-center justify-center rounded-full"
                disabled={product.availableOrders < 1 || addingToCart}
              >
                <Feather name="minus" size={16} color="#222" />
              </TouchableOpacity>
              <View className="w-6 items-center">
                <Text className="text-lg font-SatoBold pt-1">{itemqty}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (product && itemqty < product.availableOrders) {
                    setItemQty(itemqty + 1);
                  }
                }}
                className="w-7 h-7 bg-primary/10 border border-primary/50 items-center justify-center rounded-full"
                disabled={product.availableOrders < 1 || addingToCart}
              >
                <Feather name="plus" size={16} color={primary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                handleAddToCart(product, itemqty, selectedDeliveryOption);
              }} // Pass item and quantity to addToCart
              className="bg-gray-900 w-3/5 h-14 rounded-full items-center justify-center disabled:bg-gray-300"
              disabled={
                product.availableOrders < 1 || addingToCart ? true : false
              }
            >
              <Text
                className={`${
                  product.availableOrders < 1 ? "text-gray-600" : "text-white"
                } font-SatoBold pt-px uppercase text-xs`}
              >
                {product.availableOrders < 1 ? "Out of orders" : "Add to cart"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ItemPage;
