// import React, { useEffect, useState } from "react";
// import {
//   View,
//   StyleSheet,
//   Text,
//   Image,
//   SafeAreaView,
//   TouchableOpacity,
// } from "react-native";
// import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
// import useCurrentLocation from "../../components/location";
// import MarkerModal from "../MarkerModal copy";
// import QuizModal from "../QuizModal";

// // 공공데이터 API 호출 함수
// const fetchTourInfo = async (contentId) => {
//   const serviceKey =
//     "VrE85zJZ4klGbKdn7BH9aFEjM%2FF46CU4o0dGj%2FR6cxBdV9usTJ0xxF0NHRpqrn5u2vt8WfY15xdWkhKbBijmRA%3D%3D";
//   const url = `http://apis.data.go.kr/B551011/EngService1/detailCommon1?MobileOS=AND&MobileApp=AppTest&serviceKey=${serviceKey}&contentId=${contentId}&firstImageYN=Y&mapinfoYN=Y&overviewYN=Y&_type=json&defaultYN=Y`;

//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     const item = data.response.body.items.item[0];

//     // HTML 태그 제거
//     if (item && item.overview) {
//       item.overview = item.overview.replace(/(<([^>]+)>)/gi, "");
//     }

//     // homepage URL 처리
//     const homepage = item.homepage
//       ? item.homepage.replace(
//           /<a[^>]*href=["']?([^"']+)["']?[^>]*>.*?<\/a>/,
//           "$1"
//         )
//       : "";

//     return {
//       ...item,
//       firstImage: item.firstimage || "",
//       homepage, // 추가된 homepage
//     };
//   } catch (error) {
//     console.error("API 호출 에러:", error);
//     return null;
//   }
// };

// const TourInfoWithMap = () => {
//   const [tourData, setTourData] = useState([]);
//   const location = useCurrentLocation();
//   const [loading, setLoading] = useState(true);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [quizVisible, setQuizVisible] = useState(false);
//   const [bingoStates, setBingoStates] = useState(Array(9).fill(false)); // 3x3 형태의 상태 배열
//   const contentIds = [
//     264635, 1748008, 1935817, 264143, 264465, 264352, 1748354, 1911833, 1134541,
//   ]; // 제공된 contentId 배열

//   const handleBingoPress = (index) => {
//     if (!bingoStates[index]) {
//       const updatedBingoStates = [...bingoStates];
//       updatedBingoStates[index] = true; // 해당 버튼 상태를 true로 변경
//       setBingoStates(updatedBingoStates);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const results = await Promise.all(
//           contentIds.map((id) => fetchTourInfo(id))
//         );
//         setTourData(results.filter(Boolean));
//         setLoading(false);
//       } catch (error) {
//         console.error("데이터 로딩 중 오류:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   if (!location) {
//     return <Text>Loading location...</Text>;
//   }

//   if (loading) {
//     return <Text>Loading tour data...</Text>;
//   }

//   if (tourData.length === 0) {
//     return <Text>No data available</Text>;
//   }

//   const customMarkerImage =
//     "https://cdn.iconscout.com/icon/premium/png-256-thumb/current-location-2824172-2343934.png";
//   const markerImage = require("../../components/wydmarker.png");

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.bingoContainer}>
//         {bingoStates.map((state, index) => (
//           <TouchableOpacity
//             key={index}
//             style={[
//               styles.bingoButton,
//               { backgroundColor: state ? "lightgray" : "#14122D" },
//             ]} // 상태에 따라 색상 변경
//             onPress={() => handleBingoPress(index)} // 버튼 클릭 시 핸들러 호출
//           >
//             <Text style={styles.bingoText}>
//               {tourData[index]
//                 ? tourData[index].title.split("(")[0].trim()
//                 : contentIds[index]}{" "}
//               {/* 영어 제목 표시 */}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: location.latitude,
//           longitude: location.longitude,
//           latitudeDelta: 0.05,
//           longitudeDelta: 0.05,
//         }}
//         provider={PROVIDER_GOOGLE}
//       >
//         <Marker
//           coordinate={{
//             latitude: location.latitude,
//             longitude: location.longitude,
//           }}
//           title="My Location"
//           description={`You are here`}
//         >
//           <Image
//             source={{ uri: customMarkerImage }}
//             style={{ width: 25, height: 25 }}
//           />
//         </Marker>

//         {tourData.map((item, index) => {
//           if (!item || !item.mapy || !item.mapx) {
//             return null;
//           }

//           const markerTitle = item.title ? String(item.title) : "No Title";
//           const markerDescription = item.overview
//             ? String(item.overview)
//             : "No Description";

//           return (
//             <Marker
//               key={index}
//               coordinate={{
//                 latitude: item.mapy,
//                 longitude: item.mapx,
//               }}
//               pinColor="#D12138"
//               title={markerTitle}
//               description={markerDescription}
//               onPress={() => {
//                 setSelectedItem(item);
//                 setModalVisible(true);
//               }}
//             />
//           );
//         })}
//       </MapView>

//       {selectedItem && (
//         <MarkerModal
//           modalVisible={modalVisible}
//           setModalVisible={setModalVisible}
//           item={selectedItem}
//           setQuizVisible={setQuizVisible}
//         />
//       )}

//       {quizVisible && (
//         <QuizModal
//           modalVisible={quizVisible}
//           setModalVisible={setQuizVisible}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// export default TourInfoWithMap;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: "column", // 수직 방향으로 배치
//   },
//   map: {
//     flex: 0.7, // 맵이 전체의 70%를 차지
//   },
//   bingoContainer: {
//     flex: 0.3, // 빙고가 전체의 30%를 차지
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "center",
//     margin: 10,
//   },
//   bingoButton: {
//     width: 100,
//     height: 100,
//     justifyContent: "center",
//     alignItems: "center",
//     margin: 5,
//     borderRadius: 10,
//   },
//   bingoText: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
// });
