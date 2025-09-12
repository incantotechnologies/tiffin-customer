import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, View } from "react-native";
import { images } from "../constants";

const BannerAd = () => {
  return (
    <View className="w-full items-center py-1">
      <View className="w-93 h-44 rounded-3xl overflow-hidden">
        <ImageBackground
          source={images.seafood}
          className="w-full h-full items-center justify-center object-right"
        >
          <LinearGradient
            end={{ x: 0.5, y: 3 }}
            colors={["#00000034", "#00000034"]}
            className="w-full h-full items-center justify-center"
          >
            <View className="w-93 h-5/6 justify-around"></View>
          </LinearGradient>
        </ImageBackground>
      </View>
    </View>
  );
};

export default BannerAd;
