import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import VendorMenu from "../../../components/VendorMenu";
import WriteReview from "../../../components/WriteReview";
import { icons, images } from "../../../constants";
import { FoodItemsContext } from "../../../contexts/FoodItemsContext";

const VendorHeader = ({ vendor }) => {
  const router = useRouter();
  return (
    <SafeAreaView className="items-center w-full">
      <View className="w-93 h-16 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-white/75 w-11 h-11 items-center justify-center rounded-full shadow-xl shadow-gray-300 border border-gray-200"
        >
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={20}
            color="#333"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push(`/(screens)/(chat)/${vendor.vendorId}`)}
          className="h-11 px-4 flex-row items-center justify-center bg-white/75 rounded-full shadow-xl shadow-gray-300 border border-gray-200 gap-1"
        >
          <Text className="font-SatoRegular">Chat</Text>
          <Image source={icons.messages} className="w-4 h-4" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const VendorProfile = () => {
  const { id } = useLocalSearchParams();
  const { foodItems, jwtToken } = useContext(FoodItemsContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [vendorDetails, setVendorDetails] = useState(null);
  const [vendorProducts, setVendorProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVendorDetails = async () => {
    try {
      const response = await axios.get(
        `https://tiffinblox-1.onrender.com/auth/customer/get-reviews?vendorId=${id}&key=1`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      setVendorDetails(response.data.vendor);

      const vendorProduct = foodItems.filter(
        (food) => food.vendorId === Number(id)
      );
      setVendorProducts(vendorProduct);
    } catch (err) {
      console.error("Error fetching vendor details");
    }
  };

  useEffect(() => {
    fetchVendorDetails();
  }, [id]);

  if (!vendorDetails) {
    return (
      <View className="w-full h-full items-center justify-center bg-[#fff]">
        <ActivityIndicator size="large" color="#008080" />
        <Text className="font-SatoRegular text-sm text-gray-500 mt-4">
          Loading...
        </Text>
      </View>
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVendorDetails();
    setRefreshing(false);
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="bg-background"
      >
        <ImageBackground
          source={{
            uri: `data:image/jpeg;base64,${vendorDetails?.image || []}`,
          }}
          style={{ width: "100%", height: 280 }}
        >
          {vendorDetails.image != null ? (
            <LinearGradient
              colors={[
                "#000000a6",
                "transparent",
                "transparent",
                "transparent",
              ]}
              style={{ width: "100%", height: "100%" }}
            >
              <VendorHeader vendor={vendorDetails} />
            </LinearGradient>
          ) : (
            <View className="w-full h-full items-center bg-background">
              <VendorHeader vendor={vendorDetails} />
              <Image source={icons.image} className="w-8 h-8 mt-6" />
            </View>
          )}
        </ImageBackground>

        <View className="items-center gap-7" style={{ marginTop: -50 }}>
          <View className="gap-3 w-full px-3">
            <View className="w-full gap-2.5 pb-1 pt-3 rounded-2xl bg-white shadow-xl shadow-gray-200 items-center border border-gray-100">
              <View className="w-93 gap-1.5">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <View className="flex-row items-center gap-1">
                      <FontAwesome name="star" size={7} color="orange" />
                      <Text className="font-SatoRegular text-s">
                        ( {vendorDetails?.rating?.toFixed(1)} )
                      </Text>
                    </View>
                    {vendorDetails.fssai && (
                      <Image source={images.fssai} className="h-3.5 w-7" />
                    )}
                  </View>
                  <Text className="font-SatoRegular text-s">
                    {`${vendorDetails.reviews.length} reviews` ||
                      "No reviews yet"}
                  </Text>
                </View>
                <Text className="font-SatoBlack text-lg">
                  {vendorDetails.name}
                </Text>
                {vendorDetails.note && (
                  <Text className="text-s font-SatoRegular">
                    {vendorDetails?.note}
                  </Text>
                )}
              </View>
              <View className="h-9 border-t border-dashed border-gray-200 w-93 flex-row items-center justify-between">
                <Text className="text-xs font-SatoMedium">Phone number</Text>
                <Text className="font-SatoRegular tracking-wide text-s text-gray-700">
                  +91 {vendorDetails.phoneNumber}
                </Text>
              </View>
            </View>

            <View className="w-full py-3.5 rounded-2xl bg-white shadow-xl shadow-gray-200 items-center justify-center border border-gray-100 my-1">
              <View className="w-93 gap-1">
                <Text className="text-sm font-SatoMedium">Door Address</Text>
                <Text className="font-SatoRegular tracking-wide text-xs text-gray-700">
                  {
                    //more details regarding vendor available at vendorDetails.apartment
                  }
                  {vendorDetails?.apartment.address.substring(0, 45)}
                </Text>
              </View>
            </View>
          </View>

          <View className="w-93">
            <VendorMenu vendorProducts={vendorProducts} />
          </View>

          {vendorDetails.reviews.length !== 0 && (
            <View className="w-full py-3 px-3 gap-4">
              <Text className="font-SatoBold text-xs uppercase">Reviews</Text>
              <View className="gap-4">
                {vendorDetails.reviews.reverse().map((review, index) => (
                  <View
                    key={`${vendorDetails.vendorId}-${index}`}
                    className="px-4 py-5 bg-white gap-2 rounded-xl border border-gray-100 shadow-xl shadow-gray-200"
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="font-SatoBold text-base">
                        {review.customers.name}
                      </Text>
                      <Text className="font-SatoMedium text-xs text-gray-700">
                        Rating: {review.rating} ⭐
                      </Text>
                    </View>
                    {review.content && (
                      <Text className="text-xs font-SatoRegular leading-5">
                        {review.content}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View className="h-40" />
      </ScrollView>

      <WriteReview
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        vendorDetails={vendorDetails}
      />

      <View
        className={`bg-black/20 absolute top-0 left-0 w-full items-center justify-end ${
          modalVisible ? "h-full" : "h-0"
        }`}
      ></View>
    </>
  );
};

export default VendorProfile;
