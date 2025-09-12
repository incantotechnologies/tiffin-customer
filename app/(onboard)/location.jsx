import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FoodItemsContext } from "../../contexts/FoodItemsContext";
import { useToast } from "../../contexts/ToastProvider";
import { primary } from "../../constants/color";
import { SkeletonUILine } from "../../components/SkeletonUI";

const LocationComponent = () => {
  const { showToast } = useToast();
  const router = useRouter();
  const [apartments, setApartments] = useState([]); // All apartments from database
  const [loading, setLoading] = useState(false);
  const [filteredApartments, setFilteredApartments] = useState([]); // Filtered apartments based on search
  const [searchText, setSearchText] = useState(""); // Search input
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [apartmentName, setApartmentName] = useState(""); // State for apartment name inp
  const [apartmentIdLocal, setApartmentIdLocal] = useState(null); // State for storing apartment id
  const { phoneNumber } = useLocalSearchParams();
  const { setJwtToken, setApartmentId } = useContext(FoodItemsContext);
  const [closeDropDown, setCloseDropDown] = useState(false);
  const [newApartment, setNewApartment] = useState({
    latitude: null,
    longitude: null,
    name: null,
    address: null,
    pincode: null,
  });
  const [name, setName] = useState(null);
  const [newAddress, setNewAddress] = useState(null);

  const fetchApartments = async () => {
    try {
      const response = await fetch(
        "https://maneuta-backend.onrender.com/auth/customer/all-apartments"
      );
      const data = await response.json();
      setApartments(data.apartments);
    } catch (error) {
      console.error("Error fetching apartments:", error);
    }
  };

  // Fetch all apartments from the database
  useEffect(() => {
    fetchApartments();
  }, []);



  // Handle search input change with improved filtering
  const handleSearchChange = (text) => {
    setCloseDropDown(false);
    setSearchText(text);

    // Filter apartments and sort based on relevance
    const filtered = apartments
      .filter((apartment) =>
        apartment.name.toLowerCase().includes(text.toLowerCase())
      )
      .sort((a, b) => {
        // Sort by relevance: shorter matching substring comes first
        const aIndex = a.name.toLowerCase().indexOf(text.toLowerCase());
        const bIndex = b.name.toLowerCase().indexOf(text.toLowerCase());
        return aIndex - bIndex;
      });

    setFilteredApartments(filtered);

  };

  // Handle "Apartment Not Found" click
  const handleApartmentNotFound = () => {
    setModalVisible(true); // Open the modal for location details
    handleAccessLocation();
  };

  const handleSubmitDetails = async () => {
    if (!apartmentIdLocal || !name) {
      showToast({
        type: "warning",
        message: "Fill in required * details.",
      });
      return;
    }
    try {
      // Assuming phoneNumber is a state variable that holds the phone number
      if (phoneNumber.trim() === "" || phoneNumber.length !== 10) {
        // Alert.alert("Alert", "Please enter a valid 10-digit phone number.", [
        //   { text: "Ok" },
        // ]);
        showToast({
          type: "error",
          message: "Enter a valid 10-digit phone number.",
        });
        return;
      }

      // API Endpoint for submitting details
      const endpoint =
        "https://maneuta-backend.onrender.com/auth/customer/signup";

      // Payload to send to the server
      const payload = {
        phoneNumber,
        name,
        apartmentIdLocal,
      };

      // Sending a POST request to the API
      const response = await axios.post(endpoint, payload);

      const result = response.data;

      if (result.message) {
        // Check if response contains the JWT token
        if (result.token) {
          // Save the JWT token to AsyncStorage
          await AsyncStorage.setItem("cjwtToken", JSON.stringify(result.token));
          await AsyncStorage.setItem(
            "apartmentId",
            JSON.stringify(apartmentIdLocal)
          );
          console.log("JWT token saved successfully.");
          setJwtToken(result.token); //
          setApartmentId(apartmentIdLocal);

          // Navigate to the next page or show a success message
          // Alert.alert("Success", "Details submitted successfully.", [
          //   { text: "Ok", onPress: router.replace("/(tabs)/") },
          // ]);
          showToast({
            type: "success",
            message: "Details submitted successfully.",
          });
          router.push("/(tabs)/");
        } else {
          // Alert.alert("Error", "No token received from the server.", [
          //   { text: "Ok" },
          // ]);
          showToast({
            type: "error",
            message: "No token received from the server.",
          });
        }
      } else {
        // Handle errors from the server
        // Alert.alert(
        //   "Error",
        //   result.message || "Failed to submit details. Please try again.",
        //   [{ text: "Ok" }]
        // );
        showToast({
          type: "error",
          message: "Failed to submit details.Try again.",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      // Alert.alert("Error", "An unexpected error occurred. Please try again.", [
      //   { text: "Ok" },
      // ]);
      showToast({
        type: "error",
        message: "Unexpected error occurred.Try again later",
      });
    }
  };

  const handleAccessLocation = async () => {
    try {
      setLoading(true);
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return Alert.alert(
          "Permission Denied",
          "Location access is required to proceed.",
          [{ text: "OK" }]
        );
      }

      // Get the user's current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Perform reverse geocoding to get the address
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Display address to the user
      if (address.length > 0) {
        const { formattedAddress, postalCode } = address[0];
        setNewAddress(formattedAddress);
        setNewApartment({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          name: apartmentName,
          address: formattedAddress,
          pincode: postalCode,
        });
      } else {
        // Alert.alert("Address Not Found", "Unable to fetch address details.", [
        //   { text: "OK" },
        // ]);
        showToast({
          type: "error",
          message: "Unable to fetch address details.",
        });
      }

      // Log or store the address details for further use
    } catch (error) {
      console.error("Error accessing location or reverse geocoding:", error);
      // Alert.alert("Error", "Failed to access location or address.", [
      //   { text: "OK" },
      // ]);
      showToast({
        type: "error",
        message: "Failed to access location or address.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Submit the new apartment details
  const handleSubmitNewApartment = async () => {
    if (!apartmentName) {
      showToast({
        type: "warning",
        message: "Apartment name is required",
      });
      return;
    }
    try {
      if (newApartment) {
        setLoading(true);
        const response = await axios.post(
          "https://maneuta-backend.onrender.com/auth/customer/save-apartment",
          newApartment
        );
        if (response.data.message) {
          setModalVisible(false);
          setApartmentName({
            latitude: null,
            longitude: null,
            name: null,
            address: null,
            pincode: null,
          });
          setNewApartment({ name });
        }
      } else {
        console.error("Error saving new apartment:", response.statusText);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
      // Alert.alert(
      //   "location saved",
      //   "you can now seach for the apartment and name to proceed",
      //   [{ text: "OK" }]
      // );
      showToast({
        type: "success",
        message: "location saved, seach for the apartment",
      });
      setNewAddress(null);
      fetchApartments();
    }
  };

  return (
    <>
      <SafeAreaView className="flex-1 items-center justify-center">
        <View className="w-11/12 h-5/6 items-center gap-6">
          <View className="w-full gap-2">
            {/* Full Name Input */}
            <Text className="font-SatoBold text-sm w-full">Full name *</Text>
            <TextInput
              className="w-full font-SatoRegular
       h-16 border border-gray-300 rounded-lg px-4"
              placeholder="Your name"
              value={name}
              onChangeText={(text) => setName(text)} // Update the name state
            />
          </View>
          <View className="w-full gap-6">
            <View className="w-full gap-3">
              <Text className="font-SatoBold text-sm w-full">
                Search Apartment *
              </Text>

              {/* Search Bar */}
              <TextInput
                className="w-full font-SatoRegular
       h-16 border border-gray-300 rounded-lg px-4"
                placeholder="Type your apartment name"
                value={searchText}
                onChangeText={handleSearchChange}
              />

              {/* Dropdown List */}
              {searchText !== "" && !closeDropDown && (
                <View className="w-full border border-gray-300 rounded-lg">
                  <FlatList
                    data={filteredApartments}
                    keyExtractor={(item) => item.apartmentId.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className="w-full py-3 border-b border-gray-300 justify-center px-3 gap-1.5"
                        onPress={() => {
                          setSearchText(item.name);
                          setApartmentIdLocal(item.apartmentId);
                          setCloseDropDown(true); // Close the dropdown after selecting an apartment
                        }}
                      >
                        <View className="flex-row items-center justify-between">
                          <Text className="font-SatoMedium">{item.name}</Text>

                          <Text className="font-SatoRegular text-xs text-gray-700">
                            Pincode:{" "}
                            <Text className="font-SatoMedium">
                              {item.pincode}
                            </Text>
                          </Text>
                        </View>
                        <Text className="font-SatoRegular text-xs text-gray-700 leading-4">
                          {item.address.substring(0, 70)}...
                        </Text>
                      </TouchableOpacity>
                    )}
                    style={{
                      height: 180, // Set a fixed height for the FlatList
                      width: "100%",
                      borderWidth: filteredApartments.length ? 0.5 : 0,
                      borderColor: "#ccc",
                      borderRadius: 5,
                      overflow: "hidden",
                    }}
                    contentContainerStyle={{
                      paddingBottom: 10, // Add some padding at the bottom for smooth scrolling
                    }}
                    ListEmptyComponent={() => (
                      <View className="w-full items-center py-4">
                        <Text className="font-SatoRegular text-gray-500">
                          No results found.
                        </Text>
                      </View>
                    )}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              )}
              <TouchableOpacity
                onPress={handleSubmitDetails}
                className="w-full h-16 bg-zinc-800 rounded-lg items-center justify-center"
              >
                <Text className="font-SatoRegular text-white">Continue</Text>
              </TouchableOpacity>
            </View>

            {/* Apartment Not Found Button */}
            <TouchableOpacity
              onPress={handleApartmentNotFound}
              className="w-full items-center text-center"
            >
              <Text className="font-SatoRegular text-sm text-[#016FEA]">
                Didn't find your apartment?{" "}
                <Text className="font-SatoMedium text-zinc-800">Add one</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal for New Apartment Details */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
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
                      onPress={() => setModalVisible(false)}
                      className="w-14 h-14 bg-black/60 rounded-full items-center justify-center z-30"
                    >
                      <AntDesign name="close" size={20} color="#f5f5f5" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="bg-white w-full h-2/5 rounded-t-3xl items-center justify-center overflow-hidden">
                  <View className="w-11/12 h-90 justify-around">
                    <Text className="font-SatoBold">
                      Enter Your Apartment Name
                    </Text>

                    <View className="gap-2">
                      <Text className="font-SatoRegular text-sm text-zinc-800">
                        Apartment *
                      </Text>
                      <TextInput
                        className="w-full h-16 border border-zinc-300 rounded-lg px-3.5"
                        placeholder="Apartment Name"
                        value={apartmentName}
                        onChangeText={setApartmentName}
                      />

                      {/* {newAddress === null && (
                          <TouchableOpacity
                            onPress={handleAccessLocation}
                            className="w-full h-16 border border-black rounded-lg items-center justify-center"
                          >
                            <Text className="font-SatoRegular text-black">
                              Allow access to location
                            </Text>
                          </TouchableOpacity>
                        )} */}
                    </View>

                    {loading ? (
                      <View className="gap-2">
                        <Text className="font-SatoRegular text-sm text-zinc-800">
                          Accessing Location
                        </Text>
                        <SkeletonUILine className="w-48" />
                      </View>
                    ) : (
                      <View>
                        {newAddress !== null && (
                          <View className="flex-row items-center gap-3">
                            <Text className="font-SatoRegular text-gray-500 text-sm leading-6">
                              <Text className="font-SatoMedium text-black">
                                Your Location:{" "}
                              </Text>
                              {newAddress}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}

                    <View className="flex-row items-center justify-between">
                      <TouchableOpacity
                        onPress={handleSubmitNewApartment} // Submit the new apartment details
                        className="w-full h-16 bg-black rounded-lg items-center justify-center"
                        disabled={loading ? true : false}
                      >
                        <Text className="font-SatoRegular text-white">
                          Submit
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
      <View
        className={`bg-black/20 absolute top-0 left-0 w-full items-center justify-end ${
          modalVisible ? "h-full" : "h-0"
        }`}
      ></View>
    </>
  );
};

export default LocationComponent;
