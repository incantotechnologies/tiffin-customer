import React, { useEffect } from "react";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

// Hook for the color-changing glow effect
const useColorGlowEffect = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    // Animate progress value between 0 and 1 repeatedly
    progress.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // Infinite repetitions
      true // Reverse the animation
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ["#f4f4f5", "#e4e4e7"] // Lighter and darker shades of neutral gray
    );

    return {
      backgroundColor,
    };
  });

  return animatedStyle;
};

// Round Skeleton with Color Glow
export const SkeletonUIRound = ({ className }) => {
  const animatedStyle = useColorGlowEffect();

  return (
    <Animated.View
      style={[animatedStyle]}
      className={`w-14 h-14 rounded-full ${className}`}
    />
  );
};

export const SkeletonUISquare = ({ className }) => {
  const animatedStyle = useColorGlowEffect();

  return (
    <Animated.View
      style={[animatedStyle]}
      className={`w-16 h-16 rounded-xl ${className}`}
    />
  );
};

// Line Skeleton with Color Glow
export const SkeletonUILine = ({ className }) => {
  const animatedStyle = useColorGlowEffect();

  return (
    <Animated.View
      style={[animatedStyle]}
      className={`w-14 h-2 rounded-full ${className}`}
    />
  );
};
