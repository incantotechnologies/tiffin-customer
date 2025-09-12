import React, { createContext, useState, useContext, useRef } from "react";
import { View, Text, Image, Animated, Platform } from "react-native";
import { icons } from "../constants";

// Create Context
const ToastContext = createContext();

// Custom Hook for Toast Context
export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({
        visible: false,
        type: "success", // 'success' | 'warning' | 'error'
        message: "",
    });

    // Persisted Animated Value for Toast
    const translateY = useRef(new Animated.Value(-100)).current;

    // Show Toast
    const showToast = ({ type = "success", message }) => {
        setToast({ visible: true, type, message });
        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(hideToast, 3000);
        });
    };

    // Hide Toast
    const hideToast = () => {
        Animated.timing(translateY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setToast({ ...toast, visible: false });
        });
    };

    // Toast Context Value
    const value = { showToast };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Animated.View
                style={{
                    transform: [{ translateY }],
                    zIndex: 999,
                    position: "absolute",
                    top: Platform.OS === "ios" ? 48 : 56, // Consider safe area for iOS
                    alignSelf: "center",
                    opacity: toast.visible ? 1 : 0,
                }}
                className={`w-11/12 bg-white rounded-xl items-center justify-center shadow-xl shadow-gray-400 h-14 border border-gray-200`}
            >
                <View className="w-11/12 flex-row items-center gap-4">
                    {toast.type === "warning" && (
                        <Image
                            source={icons.alert}
                            className="w-6 h-6"
                            style={{ tintColor: "orange" }}
                        />
                    )}
                    {toast.type === "success" && (
                        <Image
                            source={icons.check}
                            className="w-6 h-6"
                            style={{ tintColor: "green" }}
                        />
                    )}
                    {toast.type === "error" && (
                        <Image
                            source={icons.ban}
                            className="w-6 h-6"
                            style={{ tintColor: "red" }}
                        />
                    )}
                    <Text className="font-SatoRegular text-sm text-gray-800">{toast.message}</Text>
                </View>
            </Animated.View>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
