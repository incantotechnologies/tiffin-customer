import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { FoodItemsContext } from "../contexts/FoodItemsContext";
import { gradient, primary, secondary } from "../constants/color";
import { icons, images } from "../constants";
import SearchBox from "./SearchBox";
import { CartContext } from "../contexts/CartContext";
const Header = () => {
  const { cartItems } = useContext(CartContext);
  const router = useRouter();
  return (
    <View className="">
      <View className="w-full h-fit justify-end">
        <LinearGradient
          end={{ x: 0.5, y: 3 }}
          colors={gradient}
          className="w-full  items-center justify-between pb-3.5"
        >
          <View className="w-95 h-24 items-end justify-end">
            <View className="flex-row items-center justify-between w-full px-1">
              <View className="flex-row items-center gap-1">
                <Image
                  source={images.tiffinblox}
                  alt=""
                  width={100}
                  height={100}
                  className="w-10 h-10"
                />
                <Text className="font-SatoBlack text-sm uppercase text-white tracking-wider">
                  TiffinBlox
                </Text>
              </View>
              {/* <TouchableOpacity
                onPress={() => router.push("/(tabs)/profile")}
                className="flex-row items-center gap-1"
              >
                <Image
                  source={icons.user}
                  className="h-6 w-6"
                  tintColor={secondary}
                />
                <View className="gap-px">
                  <Text className="font-SatoMedium text-xs text-white tracking-wider">
                    {customerDetails?.name || "Provident"}
                  </Text>
                  <Text className="font-SatoRegular text-sx text-white tracking-wider">
                    {customerDetails?.apartment?.name +
                      "," +
                      " " +
                      customerDetails?.apartment?.address.substring(0, 15) ||
                      address.substring(0, 15)}
                    ...
                  </Text>
                </View>
              </TouchableOpacity> */}

              <TouchableOpacity
                onPress={() => router.push("/(screens)/cart")}
                className=" rounded-full p-2"
              >
                <Image
                  source={icons.bag}
                  className="w-5 h-5"
                  tintColor={"#fff"}
                />
                {cartItems != 0 && (
                  <View className="absolute -right-0 w-4 h-4 flex-row rounded-full items-center justify-center bg-black ">
                    <Text className="font-SatoRegular text-sx text-white">
                      {cartItems.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
          {/* <View className="w-94 items-center">
            <SearchBox placeholder="Search your taste" />
            <Pressable
              onPress={() => router.push("/(tabs)/search")}
              className="absolute w-full h-full z-20"
            ></Pressable>
          </View> */}
        </LinearGradient>
      </View>
    </View>
  );
};

export default Header;
