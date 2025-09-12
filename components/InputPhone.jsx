import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const InputPhone = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  phone,
  ...props
}) => {
  return (
    <View
      className={`border border-gray-300  h-16 rounded-xl flex-row items-center gap-1 w-full ${containerStyle}`}
    >
      {icon && <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />}
      {phone && <Text className="ml-4 font-SatoRegular">+91</Text>}
      <TextInput
        className={`px-3 font-SatoRegular tracking-wide ${inputStyle} text-left h-full w-4/5`}
        secureTextEntry={secureTextEntry}
        keyboardType={phone ? "numeric" : "default"} // Numeric keyboard if phone prop is present
        maxLength={phone ? 10 : undefined} // Optional: Limit length if phone number
        {...props}
      />
    </View>
  );
};

export default InputPhone;
