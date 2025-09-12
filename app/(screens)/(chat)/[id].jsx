import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import io from "socket.io-client";
import { icons } from "../../../constants";
import { FoodItemsContext } from "../../../contexts/FoodItemsContext";
import { background } from "../../../constants/color";

const ChatHeader = ({ vendorDetails }) => {
  const router = useRouter();
  return (
    <SafeAreaView className="items-center bg-white w-full ">
      <View className="w-94 h-20 flex-row items-center justify-between shadow-xl shadow-gray-300">
        <View className="flex-row items-center gap-2 w-1/2">
          <Pressable onPress={() => router.back()}>
            <Ionicons
              name="chevron-back"
              size={22}
              color="black"
              className="pt-1"
            />
          </Pressable>
        </View>
        <View className="flex-row items-start gap-4 px-3">
          <Text className="text-base font-SatoMedium tracking-wide">
            {vendorDetails?.name || "Loading..."}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const ChatBox = () => {
  const { id } = useLocalSearchParams();
  const [vendorDetails, setVendorDetails] = useState(null);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const { jwtToken } = useContext(FoodItemsContext);

  // Fetch vendor details
  const fetchVendorDetails = async () => {
    try {
      const response = await axios.get(
        `https://maneuta-backend.onrender.com/auth/customer/get-reviews?vendorId=${id}&key=1`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Replace with actual token if required
          },
        }
      );
      setVendorDetails(response.data.vendor);
    } catch (error) {
      console.error("Error fetching vendor details:", error);
    }
  };

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("https://tiffinbox-chat.onrender.com");
    setSocket(newSocket);

    // Emit "join" with the jwtToken after connecting
    newSocket.on("connect", () => {
      newSocket.emit("join", { jwtToken }); // Send token for backend identification
    });

    return () => newSocket.disconnect();
  }, []);

  // Send message
  const handleSendMessage = async () => {
    if (message.trim() && socket) {
      socket.emit("send_message", {
        jwtToken,
        message,
        recipientId: id,
        isCustomer: true,
      }); // Include token with the message
      handleStoreMessage(id, "self", message); // Store sent message
      setMessage(""); // Clear input field
    }
  };

  useEffect(() => {
    // Fetch messages in real time
    const handleFetchMessage = () => {
      if (socket) {
        socket.on("receive_message", async (data) => {
          await handleStoreMessage(id, "vendor", data.message); // Store received message
        });
      }
    };
    handleFetchMessage();
  }, [socket]);

  const handleFetchOfflineMessages = async () => {
    try {
      // Fetch offline messages
      const response = await axios.get(
        `https://tiffinbox-chat.onrender.com/auth/chat/retrieve-customer-messages`,
        {
          params: { vendorId: id }, // Pass the vendorId as required
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Include the JWT token in the headers
          },
        }
      );

      // Store the messages locally
      const storedResponse = await handleStoreMessage(
        id,
        "vendor",
        response.data.messages
      );
      if (!storedResponse) {
        console.error("Failed to store offline messages");
        return;
      }

      // Extract message IDs from the fetched messages
      const messageIds = response.data.messages.map((msg) => msg.messageId);

      if (messageIds.length > 0) {
        // Send DELETE request to remove these messages from the database
        const deleteResponse = await axios.delete(
          `https://tiffinbox-chat.onrender.com/auth/chat/delete-messages`,
          {
            data: { messageIds }, // Pass the array of message IDs in the request body
            headers: {
              Authorization: `Bearer ${jwtToken}`, // Include the JWT token in the headers
            },
          }
        );
      }
    } catch (error) {
      console.error("Error fetching or deleting offline messages:", error);
    }
  };

  const displayMessage = async (id) => {
    try {
      // Retrieve stored messages from AsyncStorage
      const storedMessages = await AsyncStorage.getItem("cchats");
      if (!storedMessages) {
        console.error("No messages found in AsyncStorage.");
        return;
      }

      // Parse the stored messages
      const parsedMessages = JSON.parse(storedMessages);

      // Find the chat that matches the provided chat ID
      const matchingChat = parsedMessages.find((chat) => chat.id === id);
      if (!matchingChat) {
        return;
      }

      // Update the state with the matched chat messages
      setChat(matchingChat.messages || []);
    } catch (error) {
      console.error("Error retrieving or parsing messages:", error);
    }
  };

  // Store messages locally
  const handleStoreMessage = async (id, sender, messages) => {
    try {
      const storedChats = await AsyncStorage.getItem("cchats");
      const parsedChats = storedChats ? JSON.parse(storedChats) : [];

      const chatIndex = parsedChats.findIndex((chat) => chat.id === id);

      const newMessages = Array.isArray(messages)
        ? messages.map((msg) => ({
          sender,
          time: Date.now(),
          message: typeof msg === "string" ? msg : msg.message,
        }))
        : [
          {
            sender,
            time: Date.now(),
            message: messages,
          },
        ];

      if (chatIndex !== -1) {
        parsedChats[chatIndex].messages.push(...newMessages);
      } else {
        parsedChats.push({
          id,
          messages: newMessages,
        });
      }

      await AsyncStorage.setItem("cchats", JSON.stringify(parsedChats));
      setChat(parsedChats[chatIndex]?.messages || []);
      return true;
    } catch (error) {
      console.error("Error storing messages:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchVendorDetails();
    handleFetchOfflineMessages();

    if (id) displayMessage();
  }, [id]);

  const scrollViewRef = useRef();

  // Automatically scroll to the bottom when chat updates
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chat]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-background">
        <ChatHeader vendorDetails={vendorDetails} />
        <ScrollView
          ref={scrollViewRef}
          className="w-full py-5"
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: 50,
          }}
          style={{ maxHeight: "80%", backgroundColor: background }}
        >
          <View className="w-94 gap-2">
            {chat.map((msg, index) => (
              <View
                key={index}
                className={`flex-row items-center ${msg.sender === "self" ? "justify-end" : ""
                  } gap-1.5`}
              >
                {msg.sender === "vendor" && (
                  <View className="w-10 h-10 bg-emerald-100 items-center justify-center rounded-full overflow-hidden shadow-xl shadow-zinc-300">
                    <Image
                      source={{
                        uri: `data:image/jpeg;base64,${vendorDetails?.image || []
                          }`,
                      }}
                      className="w-full h-full"
                    />
                  </View>
                )}
                <View className="py-2 bg-white justify-center px-4 rounded-xl shadow-xl shadow-zinc-300">
                  <Text className="text-sm font-SatoRegular">
                    {msg.message}
                  </Text>
                </View>
                {msg.sender === "self" && (
                  <View className="w-10 h-10 bg-gray-300 items-center justify-center rounded-full overflow-hidden shadow-xl shadow-zinc-300">
                    <Image source={icons.user} className="w-4 h-4" />
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="absolute bottom-0 w-full"
        >
          <View className="bg-gray-100 absolute bottom-4 h-16 w-93 self-center items-center justify-center rounded-full overflow-hidden shadow-xl shadow-gray-200">
            <View className="flex-row items-center justify-between w-full h-full">
              <TextInput
                className="h-full bg-gray-200 w-4/5 px-5 text-sm font-SatoRegular"
                placeholder="Write here..."
                multiline
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                className="bg-primary h-full w-1/5 items-center justify-center"
              >
                <Ionicons name="send-sharp" size={20} color="#f5f5f5" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChatBox;
