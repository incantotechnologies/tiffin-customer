import React from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { icons } from "../constants/index";

const SearchBox = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  phone,
  value,
  onChangeText,
  ...props
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          className={`w-full h-14 flex flex-row justify-start items-center relative bg-white rounded-2xl shadow shadow-gray-400 border border-zinc-200 ${containerStyle}`}
        >
          <Image
            source={icons.search}
            className={`w-[18px] h-[18px] mx-4 ${iconStyle}`}
            style={{ tintColor: "#555" }}
          />
          <View className="w-px h-2/5 bg-gray-300" />
          <TextInput
            className={`px-4 flex-1 h-full font-SatoRegular text-sm tracking-wide ${inputStyle}`}
            secureTextEntry={secureTextEntry}
            value={value} // Control the input value
            onChangeText={onChangeText} // Update search query when user types
            {...props}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SearchBox;
