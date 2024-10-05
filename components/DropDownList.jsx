import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Image,
} from "react-native";
import icons from "../constants/icons";

const DropdownList = ({ selectedValue, setSelectedValue }) => {
  const [isPickerVisible, setPickerVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select your MBTI</Text>
      <TouchableOpacity onPress={() => setPickerVisible(true)} style={styles.picker}>
        <Text style={styles.selected}>{selectedValue}</Text>
      </TouchableOpacity>

      <Modal
        visible={isPickerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue) => setSelectedValue(itemValue)}
          >
            <Picker.Item label="ENFP" value="ENFP" />
            <Picker.Item label="INFP" value="INFP" />
            <Picker.Item label="ENTP" value="ENTP" />
            <Picker.Item label="INTP" value="INTP" />
            <Picker.Item label="ENFJ" value="ENFJ" />
            <Picker.Item label="INFJ" value="INFJ" />
            <Picker.Item label="ENTJ" value="ENTJ" />
            <Picker.Item label="INTJ" value="INTJ" />
            <Picker.Item label="ESFP" value="ESFP" />
            <Picker.Item label="ISFP" value="ISFP" />
            <Picker.Item label="ESTP" value="ESTP" />
            <Picker.Item label="ISTP" value="ISTP" />
            <Picker.Item label="ESFJ" value="ESFJ" />
            <Picker.Item label="ISFJ" value="ISFJ" />
            <Picker.Item label="ESTJ" value="ESTJ" />
            <Picker.Item label="ISTJ" value="ISTJ" />
          </Picker>
          
          <TouchableOpacity
            style={styles.tickButton}
            onPress={() => setPickerVisible(false)} // Close picker and confirm selection
          >
            <Image
              source={icons.check} // Ensure you have a tick icon
              style={styles.tickIcon}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "500",
    color: "#000",
  },
  picker: {
    height: 30,
    width: 120,
    borderColor: 'gray',
    backgroundColor: '#D9D9D9',
    borderWidth: 1.5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
  },
  tickButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  tickIcon: {
    width: 40,
    height: 40,
  },
});

export default DropdownList;
