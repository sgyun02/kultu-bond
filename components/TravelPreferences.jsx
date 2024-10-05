import React, { useState } from 'react';
import { View } from 'react-native';
import PreferenceIcon from './PreferenceIcon';
import icons from "../constants/icons";

const preferences = [
  { id: 1, name: 'Cultural', Icon: icons.cultural },
  { id: 2, name: 'Modern', Icon: icons.modern },
  { id: 3, name: 'Nature', Icon: icons.nature },
  { id: 4, name: 'Relax', Icon: icons.relax },
  { id: 5, name: 'Food', Icon: icons.food },
  { id: 6, name: 'Religion', Icon: icons.religion },
  { id: 7, name: 'Historical', Icon: icons.historical},
  { id: 8, name: 'Museum', Icon: icons.museum },
  { id: 9, name: 'Walking', Icon: icons.walking },
];

const TravelPreferences = ({ selectedPreferences, setSelectedPreferences }) => {
  const handlePreferenceToggle = (name) => {
    setSelectedPreferences((prev) => {
      if (prev.includes(name)) {
        return prev.filter((pref) => pref !== name); // Deselect if already selected
      } else {
        return [...prev, name]; // Select if not already selected
      }
    });
  };

  return (
    <View className="flex flex-col items-center max-w-[298px]">
      <View className="flex-row flex-wrap items-center gap-8 mx-auto max-w-full">
        {preferences.map((pref) => (
          <View key={pref.id} className="w-[20%]">
            <PreferenceIcon
              name={pref.name}
              Icon={pref.Icon}
              isSelected={selectedPreferences.includes(pref.name)}
              onPress={() => handlePreferenceToggle(pref.name)}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default TravelPreferences;
