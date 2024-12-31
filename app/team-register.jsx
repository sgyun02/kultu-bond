import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { createTeam, getUserAccountIdByEmail } from "../lib/appwrite"; // Import functions
import { useGlobalContext } from "../context/GlobalProvider"; // To get logged-in user
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook

const TeamRegister = () => {
  const { user } = useGlobalContext(); // Get current user from context
  const [teamName, setTeamName] = useState("");
  const [numberOfMembers, setNumberOfMembers] = useState(1); // Default to 1 member
  const [memberEmails, setMemberEmails] = useState([""]); // Start with one email input
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation(); // Initialize navigation

  // Handle change of number of members
  const handleMemberChange = (value) => {
    setNumberOfMembers(value);
    setMemberEmails(Array.from({ length: value }, () => "")); // Adjust the email input boxes
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Fetch accountId for each entered email
      const membersAccountIds = [];

      for (const email of memberEmails) {
        const accountId = await getUserAccountIdByEmail(email.trim());
        membersAccountIds.push(accountId);
      }

      // Add the current user (leader) to the members list
      membersAccountIds.push(user.$id);

      // Create the team
      await createTeam(teamName, user.$id, membersAccountIds);

      Alert.alert("Success", "Team registered successfully!");

      // Redirect to "My Team" page after successful registration
      navigation.navigate("my-team");
    } catch (error) {
      console.error("Error registering team:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle change of email input
  const handleEmailChange = (index, value) => {
    const updatedEmails = [...memberEmails];
    updatedEmails[index] = value;
    setMemberEmails(updatedEmails);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Register Your Team</Text>

      <TextInput
        placeholder="Team Name"
        value={teamName}
        onChangeText={setTeamName}
        style={{
          borderColor: "gray",
          borderWidth: 1,
          padding: 10,
          marginBottom: 20,
        }}
      />

      <Text>Select Number of Members</Text>
      <Picker
        selectedValue={numberOfMembers}
        onValueChange={(value) => handleMemberChange(value)}
        style={{ marginVertical: 20 }}
      >
        {[1, 2, 3, 4].map((num) => (
          <Picker.Item key={num} label={`${num}`} value={num} />
        ))}
      </Picker>

      {/* Dynamically generated member email input fields */}
      {memberEmails.map((email, index) => (
        <TextInput
          key={index}
          placeholder={`Member ${index + 1} Email`}
          value={email}
          onChangeText={(value) => handleEmailChange(index, value)}
          style={{
            borderColor: "gray",
            borderWidth: 1,
            padding: 10,
            marginBottom: 10,
          }}
        />
      ))}

      <Button
        title={loading ? "Registering..." : "Register Team"}
        onPress={handleSubmit}
        disabled={loading}
      />
    </View>
  );
};

export default TeamRegister;
