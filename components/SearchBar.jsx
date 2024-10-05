import { useState } from "react";
import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, Image, TextInput, Alert } from "react-native";
import icons from "../constants/icons";

const SearchInput = () => {
  //const pathname = usePathname();
  //const [query, setQuery] = useState(initialQuery || "");

  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-gray-400 rounded-2xl border-2 border-gray-200 focus:border-black">
      <TextInput
        className="text-base mt-0.5 text-black flex-1 font-pregular"
        //value={query}
        placeholder="Search for friends"
        placeholderTextColor="white"
        //onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        /* onPress={() => {
          if (query === "")
            return Alert.alert(
              "Missing Query",
              "Please input something to search results across database"
            );

          if (pathname.startsWith("/search")) router.setParams({ query });
          else router.push(`/search/${query}`);
        }} */
      >
        <icons.search width={5} height={5} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;