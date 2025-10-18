import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SkeletonUILine, SkeletonUIRound } from "../components/SkeletonUI"; // Import skeleton component
import { FoodItemsContext } from "../contexts/FoodItemsContext";
import FontAwesome5 from "react-native-vector-icons";

const VendorCard = ({ product }) => {
  const router = useRouter();
  const [vendorDetails, setVendorDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Start loading initially
  const { jwtToken } = useContext(FoodItemsContext);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await axios.get(
          `https://tiffinblox-1.onrender.com/auth/customer/get-reviews?vendorId=${product.vendorId}&key=0`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`, // Replace with actual token if required
            },
          }
        );
        setVendorDetails(response.data.vendor); // Set the fetched data
      } catch (error) {
        console.error("Error fetching vendor details:", error);
      } finally {
        setLoading(false); // Stop loading after the request is finished
      }
    };

    if (product.vendorId) {
      fetchVendorDetails();
    }
  }, [product.vendorId]);

  return (
    <View className="w-full gap-2 py-1.5 px-3 rounded-2xl bg-white shadow-xl shadow-gray-200 items-center border border-gray-100">
      {loading ? (
        // Show skeleton UI while loading
        <View className="w-full flex-row items-center gap-3">
          <SkeletonUIRound className="w-10 h-10" />
          <View className="w-fit gap-1.5">
            <SkeletonUILine className="w-24 h-2" />
            <SkeletonUILine className="w-32 h-1.5" />
          </View>
        </View>
      ) : (
        vendorDetails && (
          <Pressable
            onPress={() =>
              router.push(`/(screens)/(vendor)/${vendorDetails.vendorId}`)
            }
            className="flex-row items-center justify-between py-1.5 w-full"
          >
            <View className="h-full flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 items-center justify-center">
                {vendorDetails?.image != null ? (
                  <Image
                    source={{
                      uri: `data:image/jpeg;base64,${
                        vendorDetails?.image || []
                      }`,
                    }}
                    className="rounded-full w-full h-full object-top"
                  />
                ) : (
                  <Text>{vendorDetails.name.charAt(0)}</Text>
                )}
              </View>
              <View className="w-fit">
                <Text className="font-SatoBlack text-sm tracking-wide">
                  {vendorDetails.name}
                </Text>
                <Text className="font-SatoLight text-s tracking-wide">
                  Explore all products
                </Text>
              </View>
            </View>
            <MaterialIcons name="navigate-next" size={20} color="black" />
          </Pressable>
        )
      )}
    </View>
  );
};

export default VendorCard;
