import React from "react";
import { View, Text, Image, ScrollView, Button } from "react-native";
import ProfileInfo from "../../components/ProfileInfo";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

const profile = () => {
  const { user } = useGlobalContext();
  const navigation = useNavigation(); // Use the navigation hook

  return (
    <ScrollView className="flex overflow-hidden flex-col mx-auto w-full bg-white max-w-[480px]">
      <View className="flex flex-col px-8 mt-5 w-full">
        <ProfileInfo />
      </View>

      {/* Button to navigate to food.jsx */}
      <View className="px-8 mt-5">
        <Button
          title="Go to Food Page"
          onPress={() => navigation.navigate("food")}
        />
      </View>
    </ScrollView>
  );
};

export default profile;
