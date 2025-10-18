import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import axios from "axios";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { icons } from "../constants";
import { FoodItemsContext } from "../contexts/FoodItemsContext";
import { useToast } from "../contexts/ToastProvider";

const WriteReview = ({ modalVisible, setModalVisible, vendorDetails }) => {
  const { showToast } = useToast();
  const [review, setReview] = useState({
    content: "",
    rating: 0,
  });
  const [loading, setLoading] = useState(false);
  const { jwtToken } = useContext(FoodItemsContext);

  const handleInputChange = (field, value) => {
    setReview((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = () => {
    if (!review.rating) {
      // Alert.alert("Error", "Please add a rating before submitting.");
      showToast({
        type: "warning",
        message: "Please add a rating before submitting",
      });
      return;
    }

    handleSubmitReview();
  };

  const handleSubmitReview = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://tiffinblox-1.onrender.com/auth/customer/write-review",
        { ...review, vendorId: vendorDetails.vendorId },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message) {
        setModalVisible(false);
        setReview({ content: "", rating: 0 }); // Clear review state
        // Alert.alert("Success", "Your review has been submitted!");
        showToast({
          type: "success",
          message: "Your review has been submitted",
        });
      } else {
        // Alert.alert("Error", "Something went wrong. Please try again.");
        showToast({
          type: "error",
          message: "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      // Alert.alert(
      //   "Error",
      //   "Unable to submit the review. Please try again later."
      // );
      showToast({
        type: "error",
        message: "Unable to submit the review.Try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleInputChange("rating", i)}
        >
          <FontAwesome
            name="star"
            size={24}
            color={i <= review.rating ? "orange" : "#D3D3D3"} // Highlight selected stars
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <View className="w-full items-center">
      <TouchableOpacity
        onPress={() => setModalVisible(!modalVisible)}
        className="p-5 bg-zinc-800 absolute bottom-6 items-center justify-center flex-row gap-2 rounded-full shadow-xl shadow-zinc-400"
      >
        <Image
          source={icons.pen}
          className="w-6 h-6"
          style={{ tintColor: "#f5f5f5" }}
        />
      </TouchableOpacity>

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
            <View className="flex-1 items-center w-full">
              <View className="w-full h-1/2 items-center justify-center">
                <View className="h-5/6 justify-end">
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    className="w-14 h-14 bg-black/60 rounded-full items-center justify-center"
                  >
                    <AntDesign name="close" size={20} color="#f5f5f5" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="bg-white w-full h-1/2 rounded-t-2xl items-center justify-center">
                <View className="w-93 h-5/6 gap-5">
                  <Text className="font-SatoMedium text-lg">
                    Share your experience
                  </Text>

                  {/* Review Input */}
                  <TextInput
                    className="w-full h-16 border border-zinc-300 rounded-lg px-3.5 text-sm font-SatoRegular"
                    placeholder="Write your review..."
                    value={review.content}
                    onChangeText={(text) => handleInputChange("content", text)}
                    multiline={true}
                  />

                  {/* Star Rating */}
                  <View className="w-full gap-1">
                    <Text className="font-SatoMedium text-sm mb-2">
                      Rate your experience
                    </Text>
                    <View className="flex-row gap-3 items-center">
                      {renderStars()}
                    </View>
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    onPress={handleSubmit}
                    className="w-full h-16 bg-primary items-center justify-center my-5 rounded-xl"
                  >
                    {!loading && (
                      <Text className="text-white font-SatoRegular text-sm">
                        Add Review
                      </Text>
                    )}
                    {loading && (
                      <ActivityIndicator size="small" color="yellow" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default WriteReview;
