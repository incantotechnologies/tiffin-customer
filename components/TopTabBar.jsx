import { useRouter } from "expo-router";
import { Animated, Text, TouchableOpacity, View } from "react-native";

const TopTabBar = ({ position }) => {
  const router = useRouter();
  const orderState = [
    {
      position: 0,
      label: "Today",
      routeName: "today",
    },
    {
      position: 1,
      label: "Tomorrow",
      routeName: "tomorrow",
    },
  ];

  const handleTabNavigation = (position) => {
    if (position === 0) {
      router.replace("/(tabs)/(menu)/today");
    } else if (position === 1) {
      router.replace("/(tabs)/(menu)/tomorrow");
    }
  };

  return (
    <View className="items-center justify-center h-16 w-full gap-1">
      {/* <Text className="font-SatoRegular text-sm">Delivered</Text> */}

      <View className="flex-row justify-center items-center w-3/5  h-5/6 border border-secondary/50 rounded-2xl overflow-hidden p-1">
        {orderState.map((route) => {
          const isFocused = route.position === position;

          return (
            <TouchableOpacity
              key={route.position} // Ensure each key is unique
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={() => handleTabNavigation(route.position)}
              className={`h-full justify-center items-center w-1/2 rounded-xl ${isFocused ? "bg-secondary" : ""
                }`}
            >
              <Animated.Text
                className={`  text-sm flex-row text-center w-full tracking-wide ${isFocused ? "font-SatoMedium text-white" : "font-SatoRegular"
                  }`}
              >
                {route.label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>

    </View>
  );
};

export default TopTabBar;
