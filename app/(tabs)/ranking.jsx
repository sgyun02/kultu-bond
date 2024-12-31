import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { Client, Databases } from "appwrite";

const TeamLeaderboard = () => {
  const [teams, setTeams] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Initialize Appwrite client
  const client = new Client();
  client
    .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
    .setProject("66faafc9002ad8bed1f6"); // Your Appwrite project ID

  // Initialize Appwrite database instance
  const databases = new Databases(client);

  // Fetch teams when the component mounts
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setRefreshing(true); // Start the refresh indicator
      const response = await databases.listDocuments(
        "66fab2bc000944d087a5", // Your database ID
        "67014a8600203d13f0e9" // Your collection ID
      );
      const teams = response.documents.map((team) => ({
        team_name: team.team_name,
        score: team.score,
      }));

      // Sort teams by score in descending order
      const sortedTeams = teams.sort((a, b) => b.score - a.score);
      setTeams(sortedTeams); // Update state with sorted teams
    } catch (error) {
      console.error("Error fetching teams:", error.message || error);
    } finally {
      setRefreshing(false); // Stop the refresh indicator
    }
  };

  const onRefresh = () => {
    fetchTeams(); // Fetch teams again on pull-to-refresh
  };

  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.teamRow,
        index === 0
          ? styles.firstPlace
          : index === 1
          ? styles.secondPlace
          : index === 2
          ? styles.thirdPlace
          : index % 2 === 0
          ? styles.evenRow
          : styles.oddRow,
      ]}
    >
      <View style={styles.rankContainer}>
        {index < 3 ? (
          <Text style={styles.rankIcon}>
            {index + 1 === 1 ? "🥇" : index + 1 === 2 ? "🥈" : "🥉"}
          </Text>
        ) : (
          <Text style={styles.rankText}>{index + 1}th</Text>
        )}
      </View>
      <View style={styles.teamInfo}>
        <Text style={styles.teamName}>{item.team_name}</Text>
        <View style={styles.teamAvatars}>
          {/* Add avatars dynamically here */}
          {[...Array(5)].map((_, i) => (
            <Text key={i} style={styles.avatarIcon}>
              ⭐
            </Text>
          ))}
        </View>
      </View>
      <Text style={styles.score}>{item.score}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking</Text>
      <FlatList
        data={teams}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.team_name + index}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F0F0F0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#FFFFFF",
    backgroundColor: "#0D0B4A",
    paddingVertical: 10,
  },
  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  firstPlace: {
    backgroundColor: "#F6F7FB",
    borderColor: "#FFDD57",
    borderWidth: 2,
  },
  secondPlace: {
    backgroundColor: "#F6F7FB",
    borderColor: "#C0C0C0",
    borderWidth: 2,
  },
  thirdPlace: {
    backgroundColor: "#F6F7FB",
    borderColor: "#CD7F32",
    borderWidth: 2,
  },
  evenRow: {
    backgroundColor: "#E5E5FF",
  },
  oddRow: {
    backgroundColor: "#D5D5FF",
  },
  rankContainer: {
    flex: 1,
    alignItems: "center",
  },
  rankIcon: {
    fontSize: 24,
  },
  rankText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  teamInfo: {
    flex: 3,
    flexDirection: "column",
  },
  teamName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  teamAvatars: {
    flexDirection: "row",
  },
  avatarIcon: {
    marginHorizontal: 5,
    fontSize: 18,
  },
  score: {
    flex: 1,
    textAlign: "right",
    fontSize: 20,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#0D0B4A",
    paddingVertical: 10,
  },
});

export default TeamLeaderboard;
