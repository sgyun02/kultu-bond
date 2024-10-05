import { StatusBar } from "expo-status-bar";
import { router, Tabs } from "expo-router";
import { Text, View, Alert } from "react-native";
import icons from "../../constants/icons";
import { TouchableOpacity } from "react-native";
import { logoutUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import useCurrentLocation from "../../components/location";
//import IrishGrover from "../../assets/fonts/IrishGrover-Regular.ttf";

const TabIcon = ({ IconComponent, color, name, focused }) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        backgroundColor: focused ? "#727081" : "#FFFFFF",
        borderRadius: 32,
        height: focused ? 60 : 51,
        width: focused ? 60 : 51,
        borderWidth: 1,
        borderColor: "#CDCDE0",
      }}
    >
      <IconComponent width={24} height={24} fill={"#000000"} />
      <Text
        style={{
          color: color,
          fontWeight: focused ? "600" : "400",
          fontSize: 10,
        }}
      >
        {name}
      </Text>
    </View>
  );
};

const logout = async (setUser, setIsLogged) => {
  await logoutUser();
  setUser(null);
  setIsLogged(false);

  router.replace("/");
};

const TabLayout = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const handleLogout = () => {
    // Implement your logout functionality here
    Alert.alert("Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log Out",
        onPress: () => logout(setUser, setIsLogged),
      },
    ]);
  };
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#000000",
          tabBarInactiveTintColor: "#000000",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#14122D",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
            paddingTop: 16,
          },
          headerStyle: {
            backgroundColor: "#14122D",
          },
          headerTitleContainerStyle: {
            flex: 10, // Use flex: 1 to take the full width
            alignItems: "center", // Center horizontally
            justifyContent: "center", // Center vertically
            paddingTop: 10,
            paddingBottom: 10,
          },
          headerTitleStyle: {
            color: "#FFFFFF",
            fontSize: 26,
          },
          headerLeft: () => (
            <TouchableOpacity style={{ marginLeft: 10 }} onPress={handleLogout}>
              <icons.logout width={24} height={24} stroke="#FFFFFF" />
            </TouchableOpacity>
          ),
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "KULTU BOND",
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                IconComponent={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chats",
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                IconComponent={icons.chat}
                color={color}
                name="Chat"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="friends"
          options={{
            title: "Friends",
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                IconComponent={icons.friends}
                color={color}
                name="Friends"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="ranking"
          options={{
            title: "Ranking",
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                IconComponent={icons.ranking}
                color={color}
                name="Ranking"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                IconComponent={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
        {/* <Tabs.Screen
          name="bingo"
          options={{
            title: "Profile",
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                IconComponent={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        /> */}
      </Tabs>

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default TabLayout;
