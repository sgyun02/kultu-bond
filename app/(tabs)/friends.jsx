import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  RefreshControl, // Import RefreshControl
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchUsers } from "../../lib/findFriends";
import { styled } from "nativewind";
import { Avatar } from "../../components/Avatar";
import SecondaryButton from "../../components/SecondaryButton";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getCurrentUserTeams } from "../../lib/appwrite"; // Import function to check if user is in a team
import icons from "../../constants/icons";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 10;
const CARD_WIDTH = (width - 3 * CARD_MARGIN) / 2.5;
const CARD_HEIGHT = 200;

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

const FindFriend = () => {
  const navigation = useNavigation();
  const { user } = useGlobalContext(); // Get the logged-in user from the context
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isInTeam, setIsInTeam] = useState(false); // Track if the user is in a team
  const [refreshing, setRefreshing] = useState(false); // State for refreshing

  useEffect(() => {
    const fetchUserData = async () => {
      const usersData = await fetchUsers();
      const filteredData = usersData.filter((u) => u.accountId !== user.$id);
      setAllUsers(filteredData);
      setFilteredUsers(filteredData);
    };
    fetchUserData();
  }, [user]);

  // Check if the user is in a team
  useEffect(() => {
    const checkUserTeam = async () => {
      if (user) {
        const isUserInTeam = await getCurrentUserTeams(user.$id);
        setIsInTeam(isUserInTeam); // Update state based on whether the user is in a team
      }
    };
    checkUserTeam();
  }, [user]);

  const handleSearch = () => {
    if (searchTerm === "") {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleAvatarClick = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleTeamButtonClick = () => {
    if (isInTeam) {
      navigation.navigate("my-team"); // Navigate to my-team page if user is in a team
    } else {
      navigation.navigate("team-register"); // Navigate to team-register page if user is not in a team
    }
  };

  // Function to refresh data
  const onRefresh = async () => {
    setRefreshing(true); // Set refreshing state to true
    const usersData = await fetchUsers();
    const filteredData = usersData.filter((u) => u.accountId !== user.$id);
    setAllUsers(filteredData);
    setFilteredUsers(filteredData);
    setRefreshing(false); // Set refreshing state to false once done
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleAvatarClick(item)}
      style={{ margin: CARD_MARGIN }}
    >
      <StyledView
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        className="bg-white p-4 rounded-lg shadow-md items-center"
      >
        <Image
          source={{ uri: item.avatar }}
          className="w-20 h-20 rounded-full mb-2"
        />
        <StyledText className="text-lg font-bold">{item.full_name}</StyledText>
        <StyledText className="text-sm text-gray-500 mb-5">
          @{item.username}
        </StyledText>
      </StyledView>
    </TouchableOpacity>
  );

  return (
    <StyledView className="flex-1 p-4">
      <StyledView className="flex-row items-center mb-4">
        <StyledTextInput
          className="border rounded p-2 flex-grow"
          placeholder="Search for a friend..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity
          className="bg-gray-400 p-2 ml-2 rounded"
          onPress={handleSearch}
        >
          <StyledText className="text-white">Search</StyledText>
        </TouchableOpacity>
      </StyledView>

      <StyledView className="flex items-center mb-4">
        <SecondaryButton
          title={isInTeam ? "My Team" : "Register Your Team"} // Change button text
          containerStyles="my-2"
          handlePress={handleTeamButtonClick} // Navigate to correct screen
        />
      </StyledView>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Add RefreshControl
        }
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 10,
        }}
        style={{ alignSelf: "center" }}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <StyledView className="flex-1 justify-center items-center bg-gray-800 bg-opacity-75">
          <StyledView className="bg-white p-6 rounded-lg w-4/5 ">
            <TouchableOpacity
              className="absolute top-3 right-3"
              onPress={() => setModalVisible(false)}
            >
              <StyledText className="text-xl text-gray-600">✖</StyledText>
            </TouchableOpacity>

            <StyledView className="flex items-center mb-4">
              <Avatar url={selectedUser?.avatar} />
            </StyledView>

            {selectedUser && (
              <>
                <StyledText className="text-xl font-bold text-center mb-2">
                  {selectedUser.full_name}
                </StyledText>
                <StyledText className="text-center text-gray-600 mb-4">
                  @{selectedUser.username}
                </StyledText>
                <StyledText className="mt-2">
                  MBTI: {selectedUser.mbti}
                </StyledText>
                <StyledText className="mt-2">
                  Country: {selectedUser.country}
                </StyledText>
                <StyledText className="mt-2">
                  Introduction: {selectedUser.introduction}
                </StyledText>
                {/* <StyledText className="mt-2">
                  Travel Preferences: {selectedUser.travel_preferences}
                </StyledText> */}
              </>
            )}
          </StyledView>
        </StyledView>
      </Modal>
    </StyledView>
  );
};

export default FindFriend;
