import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomTabBar from "../../components/CustomTabBar";
import { icons, images } from "../../constants";
import { FoodItemsContext } from "../../contexts/FoodItemsContext";
import { gradient, primary } from "../../constants/color";
import { useToast } from "../../contexts/ToastProvider";

const Profile = () => {
  const { showToast } = useToast();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [helpQuery, setHelpQuery] = useState("");
  const { customerDetails, jwtToken } = useContext(FoodItemsContext);
  const [address, setAddress] = useState(
    customerDetails?.apartment.address || "Provident - Flat 143, 5th Floor..."
  );
  const [loading, setLoading] = useState(false);

  const options = [
    {
      id: "1",
      label: "My Orders",
      icon: icons.food,
      route: "/(screens)/orders",
    },
    {
      id: "2",
      label: "My Address",
      icon: icons.address,
      action: () => setModalVisible(true),
    },
    {
      id: "3",
      label: "Help",
      icon: icons.help,
      action: () => setHelpModalVisible(true),
    },
    {
      id: "4",
      label: "Become a chef",
      icon: icons.chef,
      action: () =>
        Linking.openURL(
          "https://play.google.com/store/apps/details?id=com.example.vendorapp"
        ).catch((err) => console.error("Failed to open URL:", err)),
    },
    {
      id: "5",
      label: "Logout",
      icon: icons.logout,
      action: async () => {
        try {
          Alert.alert("Logout Alert", "Do you really want to log out?", [
            {
              text: "Logout",
              onPress: async () => {
                await AsyncStorage.clear();
                router.replace("(onboard)/signin");
              },
            },
            { text: "cancel" },
          ]);
        } catch (error) {
          console.error("Error during logout:", error);
        }
      },
    },
  ];

  const handlePostQuery = async () => {
    if (!helpQuery || helpQuery.trim() === "") {
      showToast({ type: "warning", message: "Please enter your query" });
      console.warn("Help query is empty!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `https://maneuta-backend.onrender.com/auth/customer/customer-query`,
        { query: helpQuery },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.message) {
        showToast({ type: "success", message: "Query submitted successfully" });
      } else {
        console.warn("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Error posting customer query:", error);
      showToast({
        type: "error",
        message: "Something went wrong. Try again later",
      });
    } finally {
      setLoading(false); // Ensure loading state is updated
      setHelpModalVisible(false);
    }
  };

  const handlePress = (item) => {
    if (item.action) {
      item.action();
    } else if (item.route) {
      router.push(item.route);
    }
  };

  const renderOptions = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      className="flex-row items-center justify-between border-b border-zinc-300 h-16 px-1"
    >
      <View className="flex-row items-center gap-4">
        <Image
          source={item.icon}
          className="w-6 h-6"
          style={{ tintColor: primary }}
        />
        <Text className="font-SatoRegular">{item.label}</Text>
      </View>
      <FontAwesome name="angle-right" size={18} color="#6b7280" />
    </TouchableOpacity>
  );

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
                <View className="flex-row items-center gap-1">
                  <Text className="font-SatoBlack text-xs text-white tracking-wide">
                    {customerDetails?.name || "Dee"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                  className="flex-row items-center gap-2"
                >
                  <FontAwesome6 name="location-dot" size={12} color="#f2c438" />
                  <Text className="font-SatoBold text-sx uppercase text-white tracking-wider">
                    {customerDetails?.apartment.name +
                      "," +
                      " " +
                      customerDetails?.apartment.address.substring(0, 15) ||
                      address.substring(0, 15)}
                    ...
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>

      <View className="items-center justify-center w-full flex-1 bg-background">
        <View className="w-full h-5/6 items-center justify-start">
          <View className="w-93 items-center justify-center h-fit gap-7">
            <FlatList
              data={options}
              keyExtractor={(item) => item.id}
              renderItem={renderOptions}
              contentContainerStyle={{
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 12,
                overflow: "hidden",
                paddingHorizontal: 10,
              }}
              style={{ width: "100%" }}
            />

            <View className="flex-row items-center justify-center w-1/3">
              <FontAwesome6 name="instagram" size={20} color="#555" />
            </View>
            <View className="w-full items-center gap-2">
              <Text className="text-xs text-zinc-500 font-SatoLight">
                ©️ 2024 IncantoTechnologies Llp.
              </Text>
            </View>
            <Image
              source={images.tiffinblox}
              alt=""
              width={100}
              height={100}
              className="w-[65px] h-[65px]"
            />
          </View>
        </View>
        {/* Address Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View className="flex-1 items-center justify-end bg-transparent w-full">
                <View className="w-full h-3/4 items-center justify-center">
                  <View className="w-full h-5/6 justify-end items-center">
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      className="w-14 h-14 bg-black/60 rounded-full items-center justify-center"
                    >
                      <AntDesign name="close" size={20} color="#f5f5f5" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="bg-white w-full h-1/4 rounded-t-2xl items-center justify-center">
                  <View className="w-93 h-4/6 gap-4">
                    <Text className="font-SatoMedium text-lg">
                      Your Address
                    </Text>
                    <View className="w-full gap-4 bg-primary/10 p-3 rounded-xl">
                      <Text className="text-sm font-SatoMedium leading-7">
                        {address}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>

        {/* Help Modal */}
        <Modal
          visible={helpModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setHelpModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View className="flex-1 justify-end items-center bg-transparent w-full">
                <View className="w-full h-1/2 items-center justify-center">
                  <View className="w-full h-5/6 justify-end items-center">
                    <TouchableOpacity
                      onPress={() => setHelpModalVisible(false)}
                      className="w-14 h-14 bg-black/60 rounded-full items-center justify-center z-30"
                    >
                      <AntDesign name="close" size={20} color="#f5f5f5" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="bg-white w-full h-1/2 rounded-t-2xl items-center justify-center">
                  <View className="w-93 h-5/6 gap-4">
                    <Text className="font-SatoMedium text-lg">
                      Submit Your Query
                    </Text>
                    <View className="w-full gap-4">
                      <TextInput
                        value={helpQuery}
                        onChangeText={setHelpQuery}
                        placeholder="Enter your query"
                        multiline
                        className="border border-gray-300 rounded-xl px-2.5 h-32 text-start"
                      />
                      <TouchableOpacity
                        onPress={handlePostQuery}
                        className="bg-teal-500 w-full h-16 items-center justify-center rounded-xl"
                      >
                        {!loading && (
                          <Text className="text-white text-center">Submit</Text>
                        )}
                        {loading && (
                          <ActivityIndicator size={28} color="yellow" />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      </View>

      <CustomTabBar position={3} />
      <View
        className={`bg-black/20 absolute top-0 left-0 w-full items-center justify-end ${
          modalVisible || helpModalVisible ? "h-full" : "h-0"
        }`}
      ></View>
    </>
  );
};

export default Profile;
