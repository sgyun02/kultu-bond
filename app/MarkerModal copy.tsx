import React from 'react';
import { Modal, View, Text, Image, ScrollView, Button, TouchableOpacity, Linking, StyleSheet } from 'react-native';

interface MarkerModalProps {
  visible: boolean;
  title: string;
  overview: string;
  firstImage: string | null;
  homepage?: string;
  onClose: () => void;
  onQuizPress: () => void;
  userLocation: { latitude: number; longitude: number };
  markerLocation: { latitude: number; longitude: number };
}

const MarkerModal: React.FC<MarkerModalProps> = ({ visible, title, overview, firstImage, homepage, onClose, onQuizPress}) => {

  // 퀴즈 시작 버튼을 눌렀을 때 실행될 함수
  const handleQuizPress = () => {
      onQuizPress();
  };

  const splitTitle = title ? title.split(' (') : ["Unknown Title", "Unknown Korean Title"];
  const englishTitle = splitTitle[0] || "Unknown Title";
  const koreanTitle = splitTitle[1] ? splitTitle[1].replace(')', '') : "Unknown Korean Title";

  return (
    <Modal visible={visible} transparent={false} animationType="slide">

      <View style={styles.container}>
        {/* 영어 제목 */}
        <Text style={styles.title}>{englishTitle}</Text>
        {/* 한국어 제목 (괄호 제거) */}
        <Text style={styles.title}>{koreanTitle}</Text>

        {firstImage ? (
          <Image source={{ uri: firstImage }} style={styles.image} />
        ) : (
          null
        )}

        <ScrollView style={styles.overviewContainer} showsVerticalScrollIndicator={true} persistentScrollbar={true}>
          <Text style={styles.overviewText}>{overview}</Text>
        </ScrollView>

        {homepage && (
          <TouchableOpacity onPress={() => Linking.openURL(homepage)} style={styles.link}>
            <Text style={styles.linkText}>Visit Homepage</Text>
          </TouchableOpacity>
        )}

      <View style={{ flexDirection: 'column' }}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} >Location Verification</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity style={styles.button} onPress={handleQuizPress}>
          <Text style={styles.buttonText} >Start Quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { marginLeft: 10 }]} onPress={onClose}>
          <Text style={styles.buttonText} >Close</Text>
        </TouchableOpacity>
      </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  image: {
    marginTop: 20,
    width: '100%',
    height: 200,
  },
  overviewContainer: {
    marginTop: 20,
    marginHorizontal: 20,  // 좌우에 여백을 추가하여 너무 꽉 차는 것을 방지
    padding: 10,  // 내부에 패딩을 추가해 텍스트가 컨테이너에 더 잘 맞도록
    flex: 0.3,
    maxHeight: 200,
    borderWidth: 1,  // 컨테이너에 테두리를 추가해서 독립적인 영역처럼 보이도록
    borderColor: '#ddd',
    borderRadius: 10,  // 둥근 모서리 추가
  },
  overviewText: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'justify',
    paddingBottom: 30,
  },

  link: {
    marginTop: 10,
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  button: {
    marginTop: 15, 
    backgroundColor: '#14122D', // 버튼 배경색
    paddingVertical: 10, // 상하 패딩
    paddingHorizontal: 10, // 좌우 패딩
    borderRadius: 5, // 둥근 모서리
    alignItems: 'center', // 텍스트 가운데 정렬
    elevation: 3, // 안드로이드 그림자 효과
  },
  buttonText: {
    color: '#FFFFFF', // 글자 색상
    fontSize: 12, // 글자 크기
    fontWeight: 'bold', // 글자 두께
  },
});

export default MarkerModal;
