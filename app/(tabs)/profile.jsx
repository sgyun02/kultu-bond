import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import ProfileInfo from "../../components/ProfileInfo";
import { useGlobalContext } from "../../context/GlobalProvider";
//import TravelPreferences from '../../components/TravelPreferences';

const profile = () => {
  const { user } = useGlobalContext();
  return (
    <ScrollView className="flex overflow-hidden flex-col mx-auto w-full bg-white max-w-[480px]">
      <View className="flex flex-col px-8 mt-5 w-full">
        <ProfileInfo />
      </View>
    </ScrollView>
  );
};

export default profile;
