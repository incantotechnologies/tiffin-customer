import { useRouter } from "expo-router";
import React from "react";
import { FlatList, ImageBackground, Pressable, Text, View } from "react-native";

const VendorMenu = ({ vendorProducts }) => {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => router.push(`/(screens)/(item)/${item.foodItemId}`)}
      key={item.id}
      className="bg-white p-1 pb-2 gap-1 rounded-2xl border border-zinc-100 shadow-lg shadow-zinc-200"
      style={{ width: 140 }}
    >
      <View className="w-full h-36 rounded-xl overflow-hidden">
        <ImageBackground
          source={{ uri: item.image }}
          style={{ width: "100%", height: "100%" }}
        >
          <View className="w-full h-full items-center justify-end bg-black/5">
            <View className="flex-row items-center justify-end w-10/12 h-10">
              <View>
                {item.type === "veg" ? (
                  <View className="p-1 bg-white border border-green-500">
                    <View className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  </View>
                ) : (
                  <View className="p-1 bg-white border border-red-500">
                    <View className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  </View>
                )}
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      <View className="gap-1 p-px">
        <Text className="text-xs font-SatoBlack">{item.name}</Text>

        <View className="flex-row items-center justify-between w-full px-px">
          <View className="">
            <Text className="text-s font-SatoBold">₹ {item.price}.00</Text>

            <View className="flex-row items-center gap-1 pt-px">
              <Text className="font-SatoItalic text-sx line-through text-blue-900/90">
                ₹ {parseInt(item.price * 1.2)}.00
              </Text>
            </View>
          </View>
          <Text className="font-SatoMedium text-sx uppercase">
            {item.category}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View className="w-full">
      {vendorProducts && vendorProducts.length > 0 ? (
        <View className="w-full">
          <View className="w-93 flex-row items-center gap-3 justify-center">
            <View className="w-1/3 h-px bg-zinc-100" />
            <Text className="font-SatoMedium tracking-widest uppercase text-xs">
              Vendor menu
            </Text>
            <View className="w-1/3 h-px bg-zinc-100" />
          </View>
          <FlatList
            data={vendorProducts}
            horizontal
            keyExtractor={(item) => item.foodItemId.toString()}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10, gap: 7 }}
          />
        </View>
      ) : (
        <Text className="text-center text-zinc-500">No items available</Text>
      )}
    </View>
  );
};

export default VendorMenu;
