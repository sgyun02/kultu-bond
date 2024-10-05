import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, FlatList } from "react-native";
import {
  getTeamByAccountId,
  getUserProfilesByIds,
  updateTeam,
  addMemberToTeam,
  removeMemberFromTeam,
  getUserProfile,
} from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";

const MyTeam = () => {
  const { user } = useGlobalContext();
  const [team, setTeam] = useState(null);
  const [leader, setLeader] = useState(null); // State for team leader's profile
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLeader, setIsLeader] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // Function to fetch the team data and refresh the page
  const fetchTeamData = async () => {
    try {
      setLoading(true); // Show loading state
      // Fetch the team by the user's account ID
      const fetchedTeam = await getTeamByAccountId(user.$id);
      setTeam(fetchedTeam);
      setNewTeamName(fetchedTeam.team_name);

      // Check if the current user is the team leader
      setIsLeader(fetchedTeam.leader_id === user.$id);

      // Fetch the leader's profile
      const leaderProfile = await getUserProfile(fetchedTeam.leader_id);
      setLeader(leaderProfile);

      // Fetch team members' profiles, excluding the leader
      const nonLeaderMembersIds = fetchedTeam.members_id.filter(
        (id) => id !== fetchedTeam.leader_id
      );
      const membersProfiles = await getUserProfilesByIds(nonLeaderMembersIds);
      setTeamMembers(membersProfiles);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  useEffect(() => {
    fetchTeamData(); // Initial fetch of team data on page load
  }, [user]);

  const handleUpdateTeam = async () => {
    try {
      await updateTeam(team.team_id, { team_name: newTeamName });
      Alert.alert("Success", "Team name updated.");
      fetchTeamData(); // Refresh the page after updating the team
      setEditMode(false); // Exit edit mode
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleAddMember = async () => {
    try {
      await addMemberToTeam(team.team_id, newMemberEmail);
      Alert.alert("Success", "Member added.");
      fetchTeamData(); // Refresh the page after adding a new member
      setNewMemberEmail(""); // Clear the email input field
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await removeMemberFromTeam(team.team_id, memberId);
      Alert.alert("Success", "Member removed.");
      fetchTeamData(); // Refresh the page after removing a member
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  if (loading) {
    return <Text>Loading team data...</Text>;
  }

  return (
    <View style={{ padding: 20 }}>
      {team ? (
        <>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Team Name:
            {editMode ? (
              <TextInput
                value={newTeamName}
                onChangeText={setNewTeamName}
                style={{ borderColor: "gray", borderWidth: 1, padding: 5 }}
              />
            ) : (
              team.team_name
            )}
          </Text>
          <Text>Score: {team.score}</Text>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}>
            Team Leader:
          </Text>
          <Text>{leader?.full_name}</Text>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}>
            Team Members:
          </Text>
          <FlatList
            data={teamMembers}
            keyExtractor={(item) => item.accountId}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Text>{item.full_name}</Text>
                {editMode &&
                  isLeader && ( // Show remove button only in edit mode
                    <Button
                      title="Remove"
                      onPress={() => handleRemoveMember(item.accountId)}
                    />
                  )}
              </View>
            )}
          />
          {isLeader && (
            <>
              {editMode ? (
                <View>
                  <TextInput
                    placeholder="New Member Email"
                    value={newMemberEmail}
                    onChangeText={setNewMemberEmail}
                    style={{
                      borderColor: "gray",
                      borderWidth: 1,
                      padding: 10,
                      marginTop: 20,
                    }}
                  />
                  <Button title="Add Member" onPress={handleAddMember} />

                  <Button
                    title="Save Changes"
                    onPress={handleUpdateTeam}
                    style={{ marginTop: 20 }}
                  />
                  <Button
                    title="Cancel"
                    onPress={() => setEditMode(false)}
                    style={{ marginTop: 10 }}
                  />
                </View>
              ) : (
                <Button
                  title="Edit Team"
                  onPress={() => setEditMode(true)}
                  style={{ marginTop: 20 }}
                />
              )}
            </>
          )}
        </>
      ) : (
        <Text>No team found for the user.</Text>
      )}
    </View>
  );
};

export default MyTeam;
