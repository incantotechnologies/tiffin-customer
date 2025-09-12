{
  cartItems != 0 && (
    <View className="absolute left-0 bottom-36 flex-row items-center justify-center w-full">
      <TouchableOpacity
        onPress={() => {
          router.push("/(screens)/cart");
          setItemQty(1); // Reset itemqty to 1 on route change
        }}
        className="h-16 px-1.5 bg-gray-900 flex-row items-center gap-2 rounded-full  shadow-xl shadow-gray-400"
      >
        <View className="w-16 flex-row items-center relative">
          <View className="w-12 h-12 rounded-full flex-row items-center justify-center overflow-hidden absolute z-10 border border-gray-300">
            <Image
              source={{
                uri: cartItems[cartItems.length - 1].image,
              }}
              className="w-full h-full rounded-full"
            />
          </View>
          {cartItems[cartItems.length - 2]?.image && (
            <View className="w-12 h-12 rounded-full flex-row items-center justify-center overflow-hidden absolute right-0 border border-gray-300">
              <Image
                source={{
                  uri: cartItems[cartItems.length - 2]?.image,
                }}
                className="w-full h-full rounded-full"
              />
            </View>
          )}
        </View>

        <View className="flex-row items-center gap-3">
          <View>
            <Text className="text-xs pb-px font-SatoMedium text-white">
              {cartItems.length} Items
            </Text>
          </View>

          <Feather name="chevron-right" size={16} color="#f5f5f5" />
        </View>
      </TouchableOpacity>
    </View>
  );
}
