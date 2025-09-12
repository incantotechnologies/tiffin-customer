import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputOTP from "../../components/InputOTP";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { FoodItemsContext } from "../../contexts/FoodItemsContext";
import { useToast } from "../../contexts/ToastProvider";

const Verify = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [OTP, setOTP] = useState(null);
  const { receivedOTP } = useLocalSearchParams();
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams();
  const { setJwtToken, setApartmentId } = useContext(FoodItemsContext);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(30);
  const [actualOTP, setAcutalOTP] = useState(null);

  useEffect(() => {
    // Start countdown when component mounts or resend is clicked
    let interval;
    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false); // Enable resend after 30 seconds
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval); // Clean up on unmount
  }, [isResendDisabled]);

  useEffect(() => {
    setAcutalOTP(receivedOTP);
  }, []);

  const handleVerifyPhoneNumber = async () => {
    try {
      // Format phone number for API request (add country code 91 for India)
      const formattedNumber = `91${phoneNumber}`;
      // API Endpoint for submitting details
      setLoading(true);
      const response = await axios.post(
        "https://maneuta-backend.onrender.com/auth/vendor/verify-contact",
        {
          phoneNumber: formattedNumber,
        }
      );
      if (response.data.message) {
        setAcutalOTP(response.data.OTP);
        showToast({
          type: "success",
          message: `OTP resent to ${phoneNumber}`,
        });
      } else {
        console.log("error while responding with otp for the contact ");
      }
    } catch (e) {
      console.error("An error occurred while validating phone", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckExistingUser = async () => {
    try {
      // Check if OTP is provided and matches the received OTP
      if (OTP !== Number(actualOTP)) {
        showToast({ type: "error", message: "Invalid OTP. Try again" });
        return;
      }
      setLoading(true);
      const response = await axios.post(
        "https://maneuta-backend.onrender.com/auth/customer/check-user",
        { phoneNumber }
      );

      if (response.data.exists) {
        // Vendor exists, retrieve token and vendorId
        const { token, apartmentId } = response.data;
        // Redirect to location page or appropriate action
        await AsyncStorage.setItem("cjwtToken", JSON.stringify(token));
        await AsyncStorage.setItem("apartmentId", JSON.stringify(apartmentId));
        setJwtToken(token); //
        setApartmentId(apartmentId);
        showToast({ type: "success", message: "Login successful" });
        router.push("(tabs)/");
      } else {
        // Vendor does not exist, proceed to signup
        console.log("customer does not exist. Proceed to signup.");
        router.push({
          pathname: "/(onboard)/location",
          params: { phoneNumber },
        });
      }
    } catch (error) {
      console.error("Error checking existing user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (OTP) => {
    setOTP(OTP);
  };

  const handleResendOTP = () => {
    setIsResendDisabled(true);
    setTimer(30); // Restart timer
    showToast({ type: "info", message: "OTP resent successfully." });
    // Logic to resend OTP via API
    handleVerifyPhoneNumber(); // Simulate API call for sending OTP to the phone number
  };

  return (
    <SafeAreaView className="flex-1 items-center bg-[#FCFCFF]">
      <View className="w-11/12 h-3/5 justify-center gap-10">
        <View className="gap-1.5">
          <Text className="font-SatoBlack text-xl">Verify your details</Text>
          <Text className="text-sm text-zinc-500 font-SatoRegular tracking-wide">
            Enter OTP sent to{" "}
            <Text className="font-SatoMedium text-zinc-700">{phoneNumber}</Text>{" "}
            via sms
          </Text>
        </View>
        <View className="gap-4">
          <View className="gap-2">
            <Text className="font-SatoMedium">Enter the OTP</Text>
            <InputOTP onCodeFilled={handleOTPChange} codeLength={4} />
          </View>

          <View className="flex-row items-center gap-1.5">
            <Text className="font-SatoRegular">Didn't receive OTP?</Text>
            {isResendDisabled ? (
              <Text className="text-zinc-400 font-SatoRegular">
                Resend in {timer}s
              </Text>
            ) : (
              <Text
                onPress={handleResendOTP}
                className="text-primary font-SatoRegular"
              >
                Resend
              </Text>
            )}
          </View>
        </View>
        <Pressable
          onPress={handleCheckExistingUser}
          className="h-16 bg-black w-full items-center justify-center rounded-lg"
        >
          {!loading && (
            <Text className="font-SatoRegular text-white">Continue</Text>
          )}
          {loading && <ActivityIndicator size="small" color="#fff" />}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Verify;

