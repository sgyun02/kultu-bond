import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Client, Databases } from "appwrite";
import { useGlobalContext } from "../context/GlobalProvider";
import {
  getTeamByAccountId,
  updateTeamQuizStatus,
  updateTeamScore,
} from "../lib/appwrite"; // Assuming these are in appwrite.js

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject("66faafc9002ad8bed1f6"); // Replace with your Appwrite project ID

const QuizModal = ({ visible, onClose, apicontentId }) => {
  const { user } = useGlobalContext();
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState(null);

  // Function to fetch the team and set it
  const fetchTeam = async () => {
    try {
      const teamData = await getTeamByAccountId(user.$id);
      setTeam(teamData);
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchTeam(); // Fetch team when modal opens
      fetchQuizDataFromAppwrite(); // Fetch quiz data when modal opens
    }
  }, [visible, apicontentId]);

  // Function to fetch quiz data from Appwrite
  const fetchQuizDataFromAppwrite = async () => {
    try {
      const databases = new Databases(client);
      const response = await databases.listDocuments(
        "66fab2bc000944d087a5", // Your Database ID
        "66fbe65b000af4eebfb7" // Your Quiz Collection ID
      );
      const filteredQuizData = response.documents
        .filter((quiz) => quiz.contentId === apicontentId)
        .map((quiz) => ({
          ...quiz,
          selectedOption: null,
          isSubmitted: false,
        }));
      setQuizData(filteredQuizData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quiz data:", error.message);
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (index) => {
    if (!team) return;

    const updatedQuizData = [...quizData];
    const selectedOption = updatedQuizData[index].selectedOption;

    if (selectedOption === updatedQuizData[index].answer) {
      Alert.alert("That's correct! You get 1 point.");
      try {
        // Update team score and add quiz to completed_quizzes
        await updateTeamScore(team.$id, team.score + 1);
        await updateTeamQuizStatus(team.$id, apicontentId);
      } catch (error) {
        console.error("Error updating team score or quiz status:", error);
      }
    } else {
      Alert.alert(
        "That's wrong!",
        `The correct answer is \"${updatedQuizData[index].answer}\"`
      );
    }

    updatedQuizData[index].isSubmitted = true;
    setQuizData(updatedQuizData);
  };

  const handleOptionSelect = (index, option) => {
    const updatedQuizData = [...quizData];
    updatedQuizData[index].selectedOption = option;
    setQuizData(updatedQuizData);
  };

  const isTeamLeader = team && user && team.leader_id === user.$id;
  const hasCompletedQuiz =
    team && team.completed_quizzes.includes(apicontentId);

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : quizData.length > 0 ? (
            <>
              <Text style={styles.title}>Quiz</Text>
              {quizData.map((quiz, index) => (
                <View key={index} style={styles.quizItem}>
                  <Text>{quiz.intro}</Text>
                  <Text style={styles.question}>{quiz.question}</Text>

                  <View style={styles.optionsContainer}>
                    {quiz.options.map((option, idx) => (
                      <View key={idx} style={styles.optionWrapper}>
                        <TouchableOpacity
                          onPress={() => handleOptionSelect(index, option)}
                          disabled={quiz.isSubmitted || hasCompletedQuiz}
                          style={[
                            styles.optionButton,
                            quiz.selectedOption === option
                              ? styles.selectedOption
                              : null,
                          ]}
                        >
                          <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>

                  {isTeamLeader && !quiz.isSubmitted && !hasCompletedQuiz && (
                    <Button
                      title="Submit Answer"
                      onPress={() => handleSubmitAnswer(index)}
                      color={quiz.selectedOption ? "#A3D2E3" : "#B7C9E6"}
                      disabled={!quiz.selectedOption}
                    />
                  )}

                  <Text>{quiz.ps}</Text>
                </View>
              ))}

              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>CLOSE</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text>No quiz data available</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#14122D",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  quizItem: {
    marginVertical: 10,
  },
  question: {
    marginVertical: 10,
    fontWeight: "bold",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionWrapper: {
    width: "48%",
    marginVertical: 5,
  },
  optionButton: {
    backgroundColor: "#B7C9E6",
    padding: 10,
    borderRadius: 5,
    minHeight: 50,
    justifyContent: "center",
  },
  selectedOption: {
    backgroundColor: "#14122D",
  },
  optionText: {
    color: "black",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#B7C9E6",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
});

export default QuizModal;
