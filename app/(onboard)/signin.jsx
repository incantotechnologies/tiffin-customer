import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import axios from "axios";
import InputPhone from "../../components/InputPhone";
import { useToast } from "../../contexts/ToastProvider";

const Signin = () => {
  const { showToast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const dismissKeyboard = () => Keyboard.dismiss();

  const handleVerifyPhoneNumber = async () => {
    // Validate phone number

    if (phoneNumber.trim() === "") {
      // Alert.alert("Alert", "Please enter your phone number.", [
      //   { text: "Ok" },
      // ]);
      showToast({
        type: "warning",
        message: "Please enter your phone number.",
      });
      return;
    }
    if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      // Alert.alert("Alert", "Please enter a valid 10-digit phone number.", [
      //   { text: "Ok" },
      // ]);
      showToast({
        type: "warning",
        message: "Enter a valid 10-digit phone number.",
      });
      return;
    }
    try {
      setLoading(true);
      const formattedNumber = `91${phoneNumber}`;
      // API Endpoint for submitting details
      const response = await axios.post(
        "https://tiffinblox-1.onrender.com/auth/vendor/verify-contact",
        {
          phoneNumber: formattedNumber,
        }
      );
      if (response.data.message) {
        showToast({
          type: "success",
          message: `OTP sent to ${phoneNumber}`,
        });
        router.push({
          pathname: "(onboard)/verify",
          params: { receivedOTP: response.data.OTP, phoneNumber },
        });
      } else {
        showToast({
          type: "error",
          message: "Failed to respond with otp",
        });
      }
    } catch (e) {
      console.error("An error occurred while validating phone", e);
      showToast({
        type: "warning",
        message: "Failed to validate phone number",
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-between bg-background">
      <TouchableWithoutFeedback onPress={dismissKeyboard} className="w-full">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-full items-center justify-between"
        >
          <View className="h-1/2 w-full gap-5">
            <View className="w-full h-full">
              <Image
                source={require("../../assets/samosa.jpeg")}
                className="w-full h-full"
              />
            </View>
          </View>
          <View className="w-full h-1/2">
            <View className="w-full items-center h-5/6">
              <View className="w-full gap-1.5 items-center justify-around h-full ">
                <View className="gap-1 items-center">
                  <Text className="font-SatoBlack text-base uppercase">
                    India's kitchen for home food
                  </Text>
                  <Text className="text-xs uppercase text-gray-500 font-SatoRegular">
                    Login or signup to continue
                  </Text>
                </View>
                <View className="w-93 gap-5">
                  <View className="gap-1">
                    <Text className="font-SatoMedium text-xs text-gray-600">
                      Enter phone number
                    </Text>
                    <InputPhone
                      placeholder="Enter phone number"
                      textContentType="telephoneNumber"
                      value={phoneNumber}
                      onChangeText={(value) => setPhoneNumber(value)}
                      keyboardType="phone-pad"
                      phone={true}
                    />
                  </View>

                  <TouchableOpacity
                    disabled={loading ? true : false}
                    onPress={handleVerifyPhoneNumber}
                    className="h-16 bg-black w-full items-center justify-center rounded-lg"
                  >
                    <Text className="font-SatoRegular text-white">
                      {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        "Continue"
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <View className="w-full bg-gray-200 items-center h-7 justify-center">
        <Text className="text-sx font-SatoRegular tracking-wide space-x-1">
          By continuing, you agree to our{" "}
          <Link href={""} className="underline">
            Terms of services & Privacy policy
          </Link>
        </Text>
      </View>
    </View>
  );
};

export default Signin;
