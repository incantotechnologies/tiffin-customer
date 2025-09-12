import * as Clipboard from "expo-clipboard";
import React, { useEffect, useState } from "react";
import { TextInput, View } from "react-native";

const InputOTP = ({ onCodeFilled, codeLength }) => {
  const [code, setCode] = useState("");

  useEffect(() => {
    const checkClipboard = async () => {
      const clipboardContent = await Clipboard.getStringAsync();
      if (
        clipboardContent.length === codeLength &&
        /^\d+$/.test(clipboardContent)
      ) {
        setCode(clipboardContent);
        onCodeFilled && onCodeFilled(clipboardContent);
      }
    };
    checkClipboard();
  }, []);

  const handleChangeText = (text) => {
    // Only allow numeric input and limit to codeLength
    const numericText = text.replace(/[^0-9]/g, '').slice(0, codeLength);
    setCode(numericText);
    console.log("numeric text is this", numericText, typeof(numericText));
    // Call onCodeFilled when the code reaches the required length
    if (numericText.length === codeLength) {
      onCodeFilled && onCodeFilled(Number(numericText));
    }
  };

  return (
    <View className="items-center">
      <TextInput
        className={`w-full h-16 border border-zinc-300 rounded-lg text-center text-lg font-SatoMedium ${
          code.length === codeLength ? "border-zinc-500 bg-primary/20" : ""
        }`}
        value={code}
        onChangeText={handleChangeText}
        keyboardType="numeric"
        maxLength={codeLength}
        placeholder={`Enter ${codeLength}-digit code`}
        selectTextOnFocus
      />
    </View>
  );
};

export default InputOTP;