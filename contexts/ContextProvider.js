import { CartProvider } from "./CartContext"
import { FoodItemsProvider } from "./FoodItemsContext"
import ToastProvider from "./ToastProvider"


const ContextProvider = ({ children }) => {
    return (
        <ToastProvider>
            <FoodItemsProvider>
                <CartProvider>
                    {children}
                </CartProvider>
            </FoodItemsProvider>
        </ToastProvider>
    )
}

export default ContextProvider