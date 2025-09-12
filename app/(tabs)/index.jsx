import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StatusBar,
  Text,
  View,
} from "react-native";
import CustomTabBar from "../../components/CustomTabBar";
import Header from "../../components/Header";
import SearchBox from "../../components/SearchBox";
import Tagline from "../../components/Tagline";
import VendorList from "../../components/VendorList";
import { FoodItemsContext } from "../../contexts/FoodItemsContext";
import HomeFeed from "../../components/HomeFeed";
import CategoryComponent from "../../components/CategoryComponent";
import { primary } from "../../constants/color";
import BannerAd from "../../components/BannerAd";

const Home = () => {
  const router = useRouter();
  const {
    fetchVendors,
    fetchFoodItemsAndImages,
    fetchCustomerDetails,
    foodItems,
    globalLoading,
  } = useContext(FoodItemsContext);
  const [loading, setLoading] = useState(false);
  const data = [
    { id: "header", component: <Header /> },
    {
      id: "search",
      component: (
        <View className="w-94 self-center">
          <SearchBox placeholder="Search your taste" />
          <Pressable
            onPress={() => router.push("/(tabs)/search")}
            className="absolute w-full h-full z-20"
          ></Pressable>
        </View>
      ),
    },
    // {
    //   id: "category",
    //   component: <CategoryComponent />,
    // },
    { id: "vendors", component: <VendorList /> },
   // { id: "vendorsBanner", component: <BannerAd /> },
    // { id: "foodScroll", component: <FoodScroll /> },
    { id: "homeFeed", component: <HomeFeed /> },
    { id: "spacer", component: <Tagline /> },
  ];

  const renderItem = ({ item }) => {
    return <View key={item.id}>{item.component}</View>;
  };

  const onRefresh = async () => {
    setLoading(true);
    await fetchCustomerDetails(); // Fetch customer details before fetching vendors and food items
    await fetchVendors();
    await fetchFoodItemsAndImages();
    setLoading(false);
  };

  return (
    <View
      style={{
        alignItems: "center",
        flex: 1,
      }}
      className="bg-background"
    >
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle={"light-content"}
      />
      {foodItems.length == 0 && globalLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color={primary} />
          <Text className="font-SatoRegular text-sm">
            Blending your taste...
          </Text>
        </View>
      )}
      <View className="w-full items-center h-full">
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ justifyContent: "center", gap: 24 }}
          style={{ width: "100%" }}
          nestedScrollEnabled={true}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
        />
      </View>
      {/* {foodItems.length == 0 && !globalLoading && (
        <View className="justify-between w-full h-full">
          <Header />
          <View className="flex justify-center items-center">
            <Text className="font-SatoRegular text-center text-md">
              No food Items in your place yet
            </Text>
          </View>
          <Tagline />
        </View>
      )} */}
      <CustomTabBar position={0} />
    </View>
  );
};

export default Home;

{
  /*}
    <View className="items-center bg-background flex-1">
      <StatusBar backgroundColor="transparent" translucent={true} barStyle={"light-content"} />
      <View className="w-full items-center h-full">
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ justifyContent: "center", gap: 20 }}
          style={{ width: "100%" }}
        />
      </View>
      <CustomTabBar position={0} />
    </View> */
}
