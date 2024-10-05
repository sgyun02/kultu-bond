import { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import FormField from "../../components/FormField";
import icons from "../../constants/icons";
import { getCurrentUser, loginUser} from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import SecondaryButton from "../../components/SecondaryButton"; // Updated button

const SignIn = () => {
  const router = useRouter();
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      const loginResponse = await loginUser(form.email, form.password);
      console.log('Login Response:', loginResponse); // Log the login response
    
      const result = await getCurrentUser();
      console.log('Current User:', result); // Log the user info
    
      setUser(result);
      setIsLogged(true);
      Alert.alert("Success", "User signed in successfully");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
     finally {
      setSubmitting(false);
    }
  };

  const screenHeight = Dimensions.get("window").height;

  return (
    <SafeAreaView className="bg-[#12122C] h-full">
      {/* Background color updated */}
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-0"
          style={{
            minHeight: Dimensions.get("window").height - 100,
            //paddingTop: screenHeight * 0.2 ,
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/")} // Navigating to the index.jsx page
            className="absolute top-0 left-4 p-1"
          >
            <Image
              source={icons.backArrow} // Ensure this icon exists
              className="w-10 h-10 pt-20"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text className="text-5xl font-bold text-white mt-5 text-center">
            {/* Font size adjusted */}
            SIGN IN
          </Text>
          <View className="mt-10 bg-gray-200 p-6 rounded-2xl">
            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7 text-black"
              placeholder="Enter email"
              keyboardType="default"
            />

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7 text-black"
              placeholder="Enter Password"
            />

            <View className="flex items-left mt-10">
              {/* Centered the button */}
              <SecondaryButton
                title="Sign In"
                handlePress={submit}
                containerStyles=""
                isLoading={isSubmitting}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
