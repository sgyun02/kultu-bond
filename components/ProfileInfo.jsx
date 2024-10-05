import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import TravelPreferences from './TravelPreferences';
import PreferenceIcon from './PreferenceIcon';
import icons from '../constants/icons';
import { getCurrentUser, getUserProfile, updateUserProfile, updateAvatar } from '../lib/appwrite';
import useAppwrite from '../lib/useAppwrite';
import DropdownList from './DropDownList';
import FormField from './FormField';

const ProfileInfo = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [formValues, setFormValues] = useState({
    username: '',
    country: '',
    mbti: '',
    introduction: '',
    travel_preferences: [],
  });
  const [newAvatar, setNewAvatar] = useState(null);
  const { data: currentUser, loading: loadingUser } = useAppwrite(getCurrentUser);

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        console.log("Current user:", currentUser);
        try {
          const profile = await getUserProfile(currentUser.$id);
          if (profile) {
            setUserProfile(profile);
            setSelectedPreferences(profile.travel_preferences?.split(",") || []);
            setFormValues({
              username: profile.username,
              country: profile.country,
              mbti: profile.mbti,
              introduction: profile.introduction || '',
              travel_preferences: profile.travel_preferences?.split(",") || [],
            });
          } else {
            console.error("User profile not found");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleInfoEditToggle = () => {
    setShowModal(true);
  };

  const handleSaveInfo = async () => {
    try {
      const updatedPreferences = selectedPreferences.join(","); // Convert array to string
       setFormValues((prevValues) => ({
      ...prevValues,
      travel_preferences: updatedPreferences,
      }));
      
      await updateUserProfile(userProfile.accountId, {
        ...formValues,
        travel_preferences: updatedPreferences, // Use updated preferences
      });

      setShowModal(false);
      const updatedProfile = await getUserProfile(userProfile.accountId);
      setUserProfile(updatedProfile);
      setSelectedPreferences(updatedProfile.travel_preferences?.split(",") || []);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleAvatarUpload = async () => {
    if (newAvatar) {
      try {
        await updateAvatar(userProfile.accountId, newAvatar);
        const updatedProfile = await getUserProfile(userProfile.accountId);
        setUserProfile(updatedProfile);
        setNewAvatar(null);
      } catch (error) {
        console.error("Error updating avatar:", error);
      } finally {
        setShowAvatarModal(false);
      }
    }
  };

  if (loadingUser || !userProfile) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white', padding: 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: userProfile?.avatar }}
            style={{ width: 96, height: 96, borderRadius: 48 }}
          />
          <TouchableOpacity
            onPress={() => setShowAvatarModal(true)}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: '#3B82F6',
              borderRadius: 9999,
              padding: 8,
            }}
          >
            <icons.edit width={16} height={16} fill="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={{ marginLeft: 50, flex: 1 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{userProfile?.username || "No username"}</Text>
          <Text style={{ color: '#4B5563' }}>{userProfile?.full_name || "No full name provided"}</Text>
          <TouchableOpacity
            onPress={handleInfoEditToggle}
            style={{
              marginTop: 8,
              backgroundColor: '#E5E7EB',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 9999,
              alignSelf: 'flex-start',
            }}
          >
            <Text style={{ fontSize: 14 }}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Introduction</Text>
        <Text style={{ color: '#374151' }}>{userProfile.introduction || "No introduction provided"}</Text>
      </View>

      <View style={{ flexDirection: 'col', flexWrap: 'wrap', justifyContent: 'center'}}>
        <Text className="text-lg font-bold">Travel Preferences</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
          {selectedPreferences.length > 0 ? (
            selectedPreferences.map((pref, index) => {
              const lowercasePref = pref.toLowerCase();
              const icon = icons[lowercasePref];

              if (!icon) {
                console.warn(`Icon for ${lowercasePref} not found`);
                return null; // If no icon is found, skip rendering
              }
              return (
                <View style={{ margin: 8}} key={index}>
                  <PreferenceIcon key={index} name={pref} Icon={icon} />
                </View>
              );
          })
      ) : (
        <Text style={{ color: '#6B7280' }}>No travel preferences selected</Text>
      )}
      </View>
    </View>


      <View>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Additional Info</Text>
        <Text style={{ color: '#374151' }}>Country: {userProfile?.country || "Not specified"}</Text>
        <Text style={{ color: '#374151' }}>MBTI: {userProfile?.mbti || "Not specified"}</Text>
      </View>

      <Modal visible={showModal} transparent={true} animationType="slide">
  <ScrollView
    contentContainerStyle={{
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }}
  >
    <View
      style={{
        backgroundColor: 'white',
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderRadius: 8,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 20,
        }}
      >
        Edit Profile
      </Text>

      <FormField
        title="Username"
        placeholder="Enter username"
        value={formValues.username}
        onChangeText={(text) => setFormValues({ ...formValues, username: text })}
        otherStyles={{ marginBottom: 20 }}
      />

      <FormField
        title="Country"
        placeholder="Enter country"
        value={formValues.country}
        onChangeText={(text) => setFormValues({ ...formValues, country: text })}
        otherStyles={{ marginBottom: 20 }}
      />

      <Text
        style={{
          fontWeight: 'bold',
          marginBottom: 10,
        }}
      >
      </Text>

      <FormField
      title="Introduction"
      placeholder="Enter introduction"
      value={formValues.introduction}
      onChangeText={(text) => setFormValues({ ...formValues, introduction: text })}
      otherStyles={{ 
        marginTop: 10,
        padding: 10,  // Add padding here
        multiline: true,
      }}
      multiline={true} // If you want multiple lines
    />


      <DropdownList
        selectedValue={formValues.mbti}
        setSelectedValue={(itemValue) =>
          setFormValues({ ...formValues, mbti: itemValue })
        }
      />


      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          marginTop: 20,
          marginBottom: 30,
        }}
      >
        Travel Preferences:
      </Text>
      <TravelPreferences
        selectedPreferences={selectedPreferences}
        setSelectedPreferences={setSelectedPreferences}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 30,
        }}
      >
        <TouchableOpacity
          onPress={() => setShowModal(false)}
          style={{
            backgroundColor: 'grey',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSaveInfo}
          style={{
            backgroundColor: 'grey',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  </ScrollView>
</Modal>


      <Modal visible={showAvatarModal} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 8, width: '83.333333%' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Upload New Avatar</Text>
            <TouchableOpacity style={{ backgroundColor: '#3B82F6', padding: 12, borderRadius: 4, marginBottom: 16 }}>
              <Text style={{ color: 'white', textAlign: 'center' }}>Choose Image</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
              <TouchableOpacity onPress={() => setShowAvatarModal(false)} style={{ backgroundColor: '#D1D5DB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4 }}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAvatarUpload} style={{ backgroundColor: '#3B82F6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4 }}>
                <Text style={{ color: 'white' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProfileInfo;