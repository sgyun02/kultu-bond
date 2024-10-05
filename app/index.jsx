import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import Loader from "../components/Loader";
import { useGlobalContext } from "../context/GlobalProvider"; // Assuming you have a global context setup

const Welcome = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      {/* Background Image */}
      <Loader isLoading={loading} />
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <Image
          source={images.mainBackground} // Update the image path based on your structure
          className="absolute w-full h-full"
          resizeMode="cover"
        />
        {/* Overlay */}
        <View className="absolute w-full h-full bg-black/50" />

        {/* Main Content */}
        <View className="flex flex-col justify-center items-center h-full">
          {/* Title */}
          <View className="w-full px-10 mt-10 mb-20">
            {/* Title Container with Flexbox */}
            <View className="flex flex-col">
              {/* "Kultu" aligned to the left */}
              <Text className="text-6xl font-bold text-white tracking-widest">
                KULTU
              </Text>

              {/* "Bond" aligned to the right and positioned below "Kultu" */}
              <Text className="text-6xl font-bold text-white tracking-widest text-right">
                BOND
              </Text>
            </View>
          </View>

          {/* Subtitle */}

          <Text className="text-center text-white text-base mb-10 px-6">
            Embark on an unforgettable journey through Korean culture along with
            fellow participants of World Youth Day 2027
          </Text>

          {/* Buttons */}
          <View className="flex-row space-x-4">
            {/* Join us button */}
            <PrimaryButton
              title="Join us"
              handlePress={() => router.push("/sign-up")}
              containerStyles="w-[140px] mr-4"
            />

            {/* Sign-in button */}
            <SecondaryButton
              title="Sign in"
              handlePress={() => router.push("/sign-in")}
              containerStyles="w-[140px] mr-4"
            />
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="transparent" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;