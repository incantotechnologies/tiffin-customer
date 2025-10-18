import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "./ToastProvider";
import { FoodItemsContext } from "./FoodItemsContext";

export const CartContext = createContext();

export const useCartState = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const {
    jwtToken,
    fetchAvailableOrders,
    apartmentId,
    setAvailableOrders,
    foodItems,
    changeKey,
    setChangeKey,
  } = useContext(FoodItemsContext);
  const { showToast } = useToast();

  const addToCart = async (item, quantity, selectedDeliveryOption) => {
    try {
      const response = await fetch(
        "https://tiffinblox-1.onrender.com/auth/customer/reserve-cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`, // if using JWT
          },
          body: JSON.stringify({
            foodItemId: item.foodItemId,
            quantity: quantity,
            apartmentId: apartmentId,
          }),
        }
      );

      console.log("response is this", response);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update DB");
      }

      // If DB update successful, update cart in UI
      const cartItem = {
        ...item,
        quantity,
        deliveryType: selectedDeliveryOption,
      };

      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (cartItem) => cartItem.foodItemId === item.foodItemId
        );

        if (existingItemIndex > -1) {
          const updatedCartItems = [...prevItems];
          updatedCartItems[existingItemIndex].quantity += quantity;
          return updatedCartItems;
        } else {
          return [...prevItems, cartItem];
        }
      });
      await setAvailableOrders(foodItems);
      console.log("foodItems updated with availableOrders");
      setChangeKey((prevKey) => prevKey + 1);
      showToast({
        type: "success",
        message: "Item added to cart",
      });
    } catch (error) {
      console.error("Error adding to cart:", error, error.message);
      showToast({
        type: "error",
        message: "Could not add item to cart",
      });
    }
  };

  const removeFromCart = async (item) => {
    const { foodItemId } = item;
    try {
      const response = await fetch(
        "https://tiffinblox-1.onrender.com/auth/customer/remove-cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            foodItemId: foodItemId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update DB");
      }

      // Update cart locally
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.foodItemId !== foodItemId)
      );

      showToast({
        type: "info",
        message: "Item removed from cart",
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      showToast({
        type: "error",
        message: "Could not remove item from cart",
      });
    } finally {
      await setAvailableOrders(foodItems);
      setChangeKey((prevKey) => prevKey + 1);
    }
  };

  const clearCart = async (orderPlaced) => {
    if (cartItems.length === 0) return;
    try {
      await fetch(
        `https://tiffinblox-1.onrender.com/auth/customer/remove-cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            orderPlaced: orderPlaced,
          }),
        }
      );
    } catch (err) {
      console.error(`Failed to update order for item ${foodItemId}`, err);
    }

    await setAvailableOrders(foodItems);
    setChangeKey((prevKey) => prevKey + 1);
    setCartItems([]);

    showToast({
      type: "info",
      message: "Cart cleared and orders restored",
    });
  };

  useEffect(() => {
    let interval;
    
    if (cartItems.length > 0 && !timerActive) {
      // Start 5-minute timer (300 seconds)
      setTimeRemaining(300);
      setTimerActive(true);
    } else if (cartItems.length === 0) {
      // Reset timer when cart is empty
      setTimeRemaining(0);
      setTimerActive(false);
    }
    
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            clearCart(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cartItems.length, timerActive, timeRemaining]);

  const CartState = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    timeRemaining,
    timerActive,
  };

  return (
    <CartContext.Provider value={CartState}>{children}</CartContext.Provider>
  );
};
