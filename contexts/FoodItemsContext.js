import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as FileSystem from "expo-file-system";

export const FoodItemsContext = createContext();

export const useFoodState = () => {
  return useContext(FoodItemsContext);
};

// Fetch food items and images whenever jwtToken changes
export const FoodItemsProvider = ({ children }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [combo, setCombo] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);
  const [apartmentId, setApartmentId] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [ordersAvailable, setOrdersAvailable] = useState([]);
  const [changeKey, setChangeKey] = useState(0);

  useEffect(() => {
    const fetchJWTToken = async () => {
      try {
        //await AsyncStorage.clear()
        axios.get("https://tiffinblox-1.onrender.com");
        const token = await AsyncStorage.getItem("cjwtToken");
        if (token) {
          setJwtToken(JSON.parse(token));
        }
      } catch (error) {
        console.error("Error fetching JWT token:", error);
      }
    };

    const fetchApartmentId = async () => {
      try {
        const id = await AsyncStorage.getItem("apartmentId");
        if (id) {
          setApartmentId(JSON.parse(id));
        }
      } catch (error) {
        console.error("Error fetching JWT token:", error);
      }
    };

    fetchJWTToken();
    fetchApartmentId();
  }, []); // Fetch the JWT token on mount

  const fetchFoodItemsAndImages = async () => {
    if (!jwtToken) {
      console.log("JWT token not available, skipping fetch.");
      return;
    }

    try {
      setGlobalLoading(true);
      const storedFoodItems = await AsyncStorage.getItem("storedFoodItems");
      const parsedStoredFoodItems = JSON.parse(storedFoodItems) || [];
      setFoodItems(parsedStoredFoodItems);

      const foodItemIds = parsedStoredFoodItems.map(
        (foodItem) => foodItem.foodItemId
      );

      const foodResponse = await axios.post(
        `https://tiffinblox-1.onrender.com/auth/customer/get-food-items`,
        {
          apartmentId,
          foodItemIds, // Axios automatically serializes arrays by repeating keys: foodItemIds=1&foodItemIds=2
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const foodDataItems = await foodResponse.data;
      const foodData = foodDataItems.foodItems || [];

      const { newFoodItems, updatedFoodItems, deletedFoodItemIds } = foodData;

      // Step 1: Remove deleted items from the stored list
      let retainUndeletedFoodItems = [];
      if (deletedFoodItemIds.length > 0) {
        const deletedItems = parsedStoredFoodItems.filter((foodItem) =>
          deletedFoodItemIds.includes(foodItem.foodItemId)
        );

        deletedItems.forEach(async (foodItem) => {
          const fileUri = foodItem.image;
          try {
            await FileSystem.deleteAsync(fileUri, { idempotent: true }); // Ensures no error if file doesn't exist
          } catch (error) {
            console.error(`Error deleting file ${fileUri}:`, error.message);
          }
        });

        retainUndeletedFoodItems = parsedStoredFoodItems.filter(
          (foodItem) => !deletedFoodItemIds.includes(foodItem.foodItemId) // Check `foodItemId`
        );
      } else {
        retainUndeletedFoodItems = [...parsedStoredFoodItems];
      }

      // Step 2: Handle updated food items
      let combinedUpdatedFoodItems = [];
      if (updatedFoodItems.length > 0) {
        // Retain food items that were not updated
        const retainUnchangedFoodItems = retainUndeletedFoodItems.filter(
          (foodItem) =>
            !updatedFoodItems.some(
              (updated) => updated.foodItemId === foodItem.foodItemId
            ) // Match `foodItemId`
        );

        // Update food items by replacing the image with a locally stored URI
        const storeUpdatedFoodItems = updatedFoodItems.map((foodItem) => {
          saveImageLocally(foodItem.image); // Save image locally
          const fileName = foodItem.image.split("/").pop();
          const fileUri = `${FileSystem.documentDirectory}-${fileName}`;
          return { ...foodItem, image: fileUri }; // Replace the image URI
        });

        combinedUpdatedFoodItems = [
          ...retainUnchangedFoodItems,
          ...storeUpdatedFoodItems,
        ];
      } else {
        combinedUpdatedFoodItems = [...retainUndeletedFoodItems];
      }

      // Step 3: Add new food items
      if (newFoodItems.length > 0) {
        const storeNewFoodItems = newFoodItems.map((foodItem) => {
          saveImageLocally(foodItem.image); // Save image locally
          const fileName = foodItem.image.split("/").pop();
          const fileUri = `${FileSystem.documentDirectory}-${fileName}`;
          return { ...foodItem, image: fileUri }; // Replace the image URI
        });

        combinedUpdatedFoodItems = [
          ...combinedUpdatedFoodItems,
          ...storeNewFoodItems,
        ];
      }

      await setAvailableOrders(combinedUpdatedFoodItems)

      await AsyncStorage.setItem(
        "storedFoodItems",
        JSON.stringify(combinedUpdatedFoodItems)
      ); // Save to AsyncStorage
    } catch (error) {
      console.error("Error fetching food items", error);
    } finally{
      setGlobalLoading(false);
    }
  };

  // const setAvailableOrders = async (foodItems) => {
  
  //   if (jwtToken && foodItems.length > 0) {
  //     try {
  //       const availableOrders = await fetchAvailableOrders(
  //         foodItems.map((foodItem) => foodItem.foodItemId)
  //       );
  
  //       setOrdersAvailable(availableOrders || []);
  
  //       setFoodItems((prevFoodItems) =>
  //         prevFoodItems.map((foodItem) => {
  //           const matchedOrder = availableOrders.find(
  //             (item) => item.foodItemId === foodItem.foodItemId
  //           );
  //           console.log("matched order for", foodItem.foodItemId, matchedOrder);
  //           return {
  //             ...foodItem,
  //             availableOrders: matchedOrder?.availableOrders,
  //           };
  //         })
  //       );

  //     } catch (err) {
  //       console.error("Failed to fetch available orders:", err);
  //     } finally {
  //       setChangeKey((prevKey) => prevKey + 1);
  //       foodItems.map((prevItems) => console.log("prevItems available orders are like this", prevItems.availableOrders ,"for food item id", prevItems.foodItemId))
  //     }
  //   }
  // };

  const setAvailableOrders = async (foodItems) => {
    if (jwtToken && foodItems.length > 0) {
      try {
        const availableOrders = await fetchAvailableOrders(
          foodItems.map((foodItem) => foodItem.foodItemId)
        );
  
        setOrdersAvailable(availableOrders || []);
  
        // Wrap state update in a Promise so caller can wait
        await new Promise((resolve) => {
          setFoodItems((prevFoodItems) =>
            prevFoodItems.map((foodItem, index, arr) => {
              const matchedOrder = availableOrders.find(
                (item) => item.foodItemId === foodItem.foodItemId
              );
              console.log("matched order for", foodItem.foodItemId, matchedOrder);
  
              // On last item, resolve the promise
              if (index === arr.length - 1) {
                setTimeout(resolve, 0); // defer until React applies update
              }
  
              return {
                ...foodItem,
                availableOrders: matchedOrder?.availableOrders,
              };
            })
          );
        });
  
      } catch (err) {
        console.error("Failed to fetch available orders:", err);
      } finally {
        setChangeKey((prevKey) => prevKey + 1);
        foodItems.map((prevItems) =>
          console.log(
            "prevItems available orders are like this",
            prevItems.availableOrders,
            "for food item id",
            prevItems.foodItemId
          )
        );
      }
    }
  };
  
  
  // Function to download and store the image
  const saveImageLocally = async (imageUri) => {
    try {
      // Define local file path
      const fileName = imageUri.split("/").pop();
      const fileUri = `${FileSystem.documentDirectory}-${fileName}`;

      // Download and save the image
      const downloadedFile = await FileSystem.downloadAsync(imageUri, fileUri);

      if (downloadedFile) {
        return downloadedFile.uri;
      } else {
        console.error("Failed to download image:", downloadedFile);
        return null;
      }
    } catch (error) {
      console.error("Error saving image locally:", error);
      return null;
    }
  };

  const fetchVendors = async () => {
    if (jwtToken && apartmentId) {
      try {
        const response = await fetch(
          `https://tiffinblox-1.onrender.com/auth/customer/get-vendors?apartmentId=${apartmentId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Update state with the fetched vendors
        setVendors(data.vendors || []); // Default to an empty array if no vendors
      } catch (e) {
        console.error("Error fetching vendors:", e);
      }
    } else {
      console.warn("Missing JWT token or apartment ID");
    }
  };

  const fetchCustomerDetails = async () => {
    if (jwtToken && apartmentId) {
      try {
        const response = await fetch(
          `https://tiffinblox-1.onrender.com/auth/customer/customer-details?apartmentId=${apartmentId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Update customer details in state, fallback to an empty object
        setCustomerDetails(data.customer || {});
      } catch (e) {
        console.error("Error fetching customer details:", e);
      }
    } else {
      console.warn("Missing JWT token or apartment ID");
    }
  };

  const fetchAvailableOrders = async(foodItemIds) => {
    if (jwtToken && apartmentId) {
      try {
        const response = await axios.post(
          `https://tiffinblox-1.onrender.com/auth/customer/available-orders`,{foodItemIds},
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data.ordersAvailable;
      } catch (e) {
        console.error("Error fetching customer details:", e.message);
      }
    } else {
      console.warn("Missing JWT token or apartment ID");
    }
  }

  // const fetchCombos = async () => {
  //   try {
  //     const response = await axios.get(
  //       `https://tiffinblox-1.onrender.com/auth/customer/combo-details?apartmentId=${apartmentId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${jwtToken}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.data && response.data.combos) {
  //       setCombo(response.data.combos);
  //     } else {
  //       console.warn("Unexpected response format", response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching combos:", error?.response?.data || error.message);
  //   }
  // };

  // Fetch food items and images whenever jwtToken changes
  useEffect(() => {
    
    fetchCustomerDetails();
    fetchVendors();
    fetchFoodItemsAndImages();
   // fetchCombos();
  }, [jwtToken]); // Only fetch food items when jwtToken is available

  useEffect(() => {
    // Initial call
    setAvailableOrders(foodItems);
  
    // Run every 1 minute
    const intervalId = setInterval(() => {
      setAvailableOrders(foodItems);
    }, 60000); // 60,000 ms = 1 minute
  
    // Cleanup when component unmounts
    return () => clearInterval(intervalId);
  }, [foodItems.length]);  

  const FoodState = {
    foodItems,
    jwtToken,
    setJwtToken,
    setApartmentId,
    apartmentId,
    vendors,
    fetchVendors,
    fetchFoodItemsAndImages,
    fetchCustomerDetails,
    customerDetails,
    globalLoading,
    ordersAvailable,
    setAvailableOrders,
    fetchAvailableOrders,
    changeKey,
    setChangeKey,
    combo
  };

  return (
    <FoodItemsContext.Provider value={FoodState}>
      {children}
    </FoodItemsContext.Provider>
  );
};
