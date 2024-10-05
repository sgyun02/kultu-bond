import { Client, Databases, Query } from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.trio.kultubond",
  projectId: "66faafc9002ad8bed1f6",
  databaseId: "66fab2bc000944d087a5",
  userCollectionId: "66fab2e3003470cd78b6",
  chatRoomCollectionId: "66fbaec600130320aa11",
  messageCollectionId: "66fbb1df000cc198d25e",
  storageId: "66fab4710008a01e7c8c",
};

// Init your React Native SDK
const client = new Client();

client.setEndpoint(config.endpoint).setProject(config.projectId);

// Databases instance
const databases = new Databases(client);

// Function to fetch users from Appwrite collection
export const fetchUsers = async (searchTerm = "") => {
  try {
    let queries = [];

    // If there is a search term, use Query.equal for exact match
    if (searchTerm) {
      queries.push(Query.equal("username", searchTerm));
      queries.push(Query.equal("full_name", searchTerm));
    }

    // Fetch users from Appwrite
    const response = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      queries.length > 0 ? queries : [] // Fetch all users if no search query
    );

    return response.documents;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getOrCreateChatroom = async (user1Id, user2Id) => {
  try {
    // Check if a chatroom already exists between these two users
    const response = await databases.listDocuments(
      config.databaseId,
      config.chatroomCollectionId,
      [
        Query.equal("user1_id", [user1Id, user2Id]),
        Query.equal("user2_id", [user1Id, user2Id]),
      ]
    );

    // If chatroom exists, return it
    if (response.total > 0) {
      return response.documents[0];
    }

    // If no chatroom exists, create a new one
    const chatroom = await databases.createDocument(
      config.databaseId,
      config.chatroomCollectionId,
      {
        user1_id: user1Id,
        user2_id: user2Id,
      }
    );

    return chatroom;
  } catch (error) {
    console.error("Error fetching or creating chatroom:", error);
  }
};

// Fetch chat history for a specific chatroom
export const fetchChatHistory = async (chatroomId) => {
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.messageCollectionId,
      [Query.equal("chatroom_id", chatroomId)],
      { orderBy: "timestamp", orderDirection: "ASC" }
    );

    return response.documents;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
};

// Send a new message to a chatroom
export const sendMessage = async (chatroomId, senderId, message) => {
  try {
    const newMessage = await databases.createDocument(
      config.databaseId,
      config.messageCollectionId,
      {
        chatroom_id: chatroomId,
        sender_id: senderId,
        message,
        timestamp: new Date().toISOString(),
      }
    );

    return newMessage;
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// Fetch chatrooms for a user
export const fetchChatroomsForUser = async (userId) => {
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.chatroomCollectionId,
      [Query.equal("user1_id", userId), Query.equal("user2_id", userId)]
    );

    return response.documents;
  } catch (error) {
    console.error("Error fetching chatrooms:", error);
    return [];
  }
};