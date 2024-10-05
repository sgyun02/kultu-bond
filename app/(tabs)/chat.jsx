import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  ActivityIndicator,
  Image,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import {
  getCurrentUser,
  getUserProfile,
  createPost,
  fetchPosts,
} from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";

const Chat = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const { data: currentUser, loading: loadingUser } =
    useAppwrite(getCurrentUser);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          const profile = await getUserProfile(currentUser.$id);
          if (profile) {
            setUserProfile(profile);
          } else {
            console.error("User profile not found");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserProfile();
  }, [currentUser]);

  const loadPosts = async () => {
    try {
      const fetchedPosts = await fetchPosts();

      // Sort posts by createdAt in descending order
      const sortedPosts = fetchedPosts.documents.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    loadPosts(); // Load posts on component mount
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadPosts();
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePostSubmit = async () => {
    if (content && userProfile) {
      const newPost = {
        userId: currentUser.$id,
        username: userProfile.username,
        content,
        createdAt: new Date().toISOString(),
      };

      try {
        const response = await createPost(
          newPost.userId,
          newPost.username,
          newPost.content
        );

        // Prepend the new post and ensure posts are sorted
        setPosts((prevPosts) =>
          [newPost, ...prevPosts].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
        setContent("");
      } catch (error) {
        console.error("Error creating post:", error);
      }
    } else {
      console.error("Content or username is missing");
    }
  };

  // Helper function to format the date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading || loadingUser) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 24 }}>
      {userProfile ? (
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              padding: 10,
            }}
          >
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                resizeMode: "contain",
              }}
              source={{
                uri:
                  userProfile.avatar ||
                  "https://cdn-icons-png.flaticon.com/128/149/149071.png",
              }}
            />
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Welcome, {userProfile.username}
            </Text>
          </View>

          <TextInput
            value={content}
            onChangeText={(text) => setContent(text)}
            placeholder="Type your message..."
            style={{
              borderColor: "gray",
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              marginBottom: 10,
            }}
            multiline
          />
          <TouchableOpacity className="bg-gray-400">
            <Button onPress={handlePostSubmit} title="Share Post" />
          </TouchableOpacity>

          {/* FlatList to display posts */}
          <FlatList
            data={posts}
            keyExtractor={(item) => item.createdAt}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{item.username}</Text>
                <Text>{item.content}</Text>
                <Text style={{ fontSize: 12, color: "gray" }}>
                  {formatDate(item.createdAt)} {/* Display formatted date */}
                </Text>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      ) : (
        <Text>No user profile found.</Text>
      )}
    </SafeAreaView>
  );
};

export default Chat;
