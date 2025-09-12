import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { icons } from "../constants/index";
import { primary } from "../constants/color";

const TabButton = (props) => {
  const { position, isFocused, routeName, label } = props;
  const router = useRouter();
  const color = isFocused ? primary : "#666";

  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0);
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const translateX = interpolate(scale.value, [0, 0], [0, 0]); // Move icon to the left when focused
    return {
      transform: [{ translateX }],
    };
  });

  const handleTabNavigation = () => {
    if (position === 0) {
      router.push("/(tabs)/");
    } else if (position === 1) {
      router.push("/(tabs)/search");
    } else if (position === 2) {
      router.push("/(tabs)/(menu)/");
    } else if (position === 3) {
      router.push("/(tabs)/profile");
    }
  };

  const icon = {
    home: () => (
      <Image
        source={icons.home}
        style={{ width: 18, height: 18, tintColor: color }}
      />
    ),
    search: () => (
      <Image
        source={icons.search}
        style={{ width: 18, height: 18, tintColor: color }}
      />
    ),
    menu: () => (
      <Image
        source={icons.widget}
        style={{ width: 18, height: 18, tintColor: color }}
      />
    ),
    profile: () => (
      <Image
        source={icons.profile}
        style={{ width: 18, height: 18, tintColor: color }}
      />
    ),
  };

  const IconComponent = icon[label.toLowerCase()] || (() => <Text>?</Text>);

  return (
    <Pressable
      key={position}
      onPress={handleTabNavigation}
      className={`w-1/4 justify-center items-center h-full`}
    >
      <View className={`items-center justify-center gap-1.5 h-full`}>
        {/* Icon */}
        <Animated.View style={[animatedIconStyle]} className="">
          {IconComponent()}
        </Animated.View>

        <Animated.Text
          className={`text-sx uppercase tracking-wide ${
            isFocused
              ? "font-SatoBlack text-primary"
              : " font-SatoRegular text-[#666]"
          }`}
        >
          {routeName}
        </Animated.Text>
      </View>
    </Pressable>
  );
};

export default TabButton;
