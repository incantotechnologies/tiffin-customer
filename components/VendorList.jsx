import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SkeletonUIRound } from "../components/SkeletonUI"; // Importing skeleton components
import { FoodItemsContext } from "../contexts/FoodItemsContext";

// Function to generate a unique color based on a string
const generateUniqueColor = (id) => {
  const hash = id
    .split("")
    .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const color = `hsl(${hash % 360}, 70%, 75%)`; // Generate HSL color
  return color;
};

const VendorList = () => {
  const router = useRouter();
  const { vendors } = useContext(FoodItemsContext);
  const [showSkeleton, setShowSkeleton] = useState(true); // State to track skeleton visibility

  useEffect(() => {
    // If there are no vendors, display skeleton for a few seconds, then hide it
    if (vendors?.length === 0) {
      const timer = setTimeout(() => {
        setShowSkeleton(false); // Hide skeleton after 3 seconds
      }, 1000); // Adjust the time duration as per your requirement

      // Cleanup timeout if the component is unmounted or vendors data changes
      return () => clearTimeout(timer);
    } else {
      setShowSkeleton(false); // Hide skeleton when vendors data is available
    }
  }, [vendors]);

  const renderItem = ({ item }) => {
    const backgroundColor = generateUniqueColor(item.vendorId.toString());
    return (
      <View className="items-center gap-1">
        <Pressable
          onPress={() => router.push(`/(screens)/(vendor)/${item.vendorId}`)}
          className="w-20 h-20 border-[1px] border-primary rounded-full p-[2px] overflow-hidden"
        >
          {item.image != null && (
            <Image
              source={{ uri: `data:image/png;base64,${item.image}` }}
              className="rounded-full w-full h-full object-top"
            />
          )}
          {item.image == null && (
            <View
              className="w-full h-full items-center justify-center rounded-full"
              style={{ backgroundColor }}
            >
              <Text className="text-zinc-700 text-lg font-SatoBold">
                {item.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </Pressable>
        <Text className="text-s font-SatoMedium tracking-wide">
          {item.name}
        </Text>
      </View>
    );
  };

  const renderSkeletonItem = () => (
    <View className="items-center gap-1">
      <SkeletonUIRound className={"w-20 h-20"} />
    </View>
  );

  return (
    <View className="items-center gap-5">
      <View className="w-11/12 flex-row items-center gap-3 justify-center">
        <View className="w-1/3 h-px bg-zinc-100" />
        <Text className="font-SatoBold text-gray-600 tracking-wider uppercase text-xs">
          Popular chefs
        </Text>
        <View className="w-1/3 h-px bg-zinc-100" />
      </View>
      {showSkeleton ? (
        <FlatList
          data={Array.from({ length: 2 })}
          renderItem={renderSkeletonItem}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
          style={{ width: "91%" }}
        />
      ) : vendors?.length > 0 ? (
        <FlatList
          data={vendors}
          renderItem={renderItem}
          keyExtractor={(item, index) => `vendor-${item.vendorId}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
          style={{ width: "91%" }}
        />
      ) : null}
    </View>
  );
};

export default VendorList;
