import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, SafeAreaView } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import useCurrentLocation from "../../components/location";
import MarkerModal from "../MarkerModal copy";
import QuizModal from "../QuizModal";

// 공공데이터 API 호출 함수
const fetchTourInfo = async (contentId) => {
  const serviceKey =
    "a0HzUjdhfiDRG2V%2FjMIlAzgk1QEk6W4zt2B9TAEBe7a1FjXLS90DPxsidoetDbYSeljkTdKvXKSGeYw%2BPawgww%3D%3D";
  const url = `http://apis.data.go.kr/B551011/EngService1/detailCommon1?MobileOS=AND&MobileApp=AppTest&serviceKey=${serviceKey}&contentId=${contentId}&firstImageYN=Y&mapinfoYN=Y&overviewYN=Y&_type=json&defaultYN=Y`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const item = data.response.body.items.item[0];

    // HTML 태그 제거
    if (item && item.overview) {
      item.overview = item.overview.replace(/(<([^>]+)>)/gi, "");
    }

    // homepage URL 처리
    const homepage = item.homepage
      ? item.homepage.replace(
          /<a[^>]*href=["']?([^"']+)["']?[^>]*>.*?<\/a>/,
          "$1"
        )
      : "";

    return {
      ...item,
      firstImage: item.firstimage || "",
      homepage, // 추가된 homepage
    };
  } catch (error) {
    console.error("API 호출 에러:", error);
    return null;
  }
};

const TourInfoWithMap = () => {
  const [tourData, setTourData] = useState([]);
  const location = useCurrentLocation();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quizVisible, setQuizVisible] = useState(false);

  useEffect(() => {
    // 필터링할 contentId 배열 (appwrite에서 가져온 것과 공공데이터 contentId 비교)
    const contentIds = [
      264337, 561382, 264354, 264550, 264348, 264134, 264316, 1796840, 1748008,
      264352, 2493015, 264465, 2490739, 2590278, 264106, 1748004, 789696,
    ];

    const fetchData = async () => {
      try {
        // 공공데이터 contentId 기반으로 API 호출
        const results = await Promise.all(
          contentIds.map((id) => fetchTourInfo(id))
        );
        // 성공적으로 데이터를 받아온 항목들만 필터링
        setTourData(results.filter(Boolean));
        setLoading(false);
      } catch (error) {
        console.error("데이터 로딩 중 오류:", error);
      }
    };

    fetchData();
  }, []);

  if (!location) {
    return <Text>Loading location...</Text>;
  }

  if (loading) {
    return <Text>Loading tour data...</Text>;
  }

  if (tourData.length === 0) {
    return <Text>No data available</Text>;
  }

  const customMarkerImage =
    "https://cdn.iconscout.com/icon/premium/png-256-thumb/current-location-2824172-2343934.png";
  const markerImage = require("../../components/wydmarker.png");

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        provider={PROVIDER_GOOGLE}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="My Location"
          description={`You are here`}
        >
          <Image
            source={{ uri: customMarkerImage }}
            style={{ width: 25, height: 25 }}
          />
        </Marker>

        <Marker
          coordinate={{
            latitude: 35.169162,
            longitude: 129.1338,
          }}
          pinColor="#2D63E2"
          title="위치 예시"
          description="테스트"
          onPress={() => {
            setSelectedItem({
              title: "가까운 위치일 때 (퀴즈를 풀 수 있는지 확인)",
              overview:
                "현재 위치에서 1km 이내라서 퀴즈 버튼을 누르면 퀴즈 창이 뜹니다!",
              firstImage: null, // 이미지가 없으면 null로 설정
              homepage: null, // 홈페이지가 없으면 null로 설정
              apicontentId: "test", // contentId를 test로 설정
              mapx: 129.1338,
              mapy: 35.169162,
            });
            setModalVisible(true);
          }}
        />

        {tourData.map((item, index) => {
          if (!item || !item.mapy || !item.mapx) {
            return null;
          }

          const markerTitle = item.title
            ? String(item.title)
            : "No title available";
          const markerOverview = item.overview
            ? String(item.overview)
            : "No overview available";
          const homepage = item.homepage ? item.homepage : null;

          return (
            <Marker
              key={index}
              coordinate={{
                latitude: parseFloat(item.mapy),
                longitude: parseFloat(item.mapx),
              }}
              title={markerTitle}
              onPress={() => {
                // 선택한 마커의 정보 설정
                setSelectedItem({
                  title: markerTitle,
                  overview: markerOverview,
                  firstImage: item.firstImage,
                  homepage: homepage,
                  apicontentId: item.contentid, // contentId를 apicontentId로 설정
                  mapx: parseFloat(item.mapx), // 마커의 x 좌표 설정
                  mapy: parseFloat(item.mapy), // 마커의 y 좌표 설정
                });
                setModalVisible(true);
              }}
            >
              <Image
                source={markerImage}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </Marker>
          );
        })}
      </MapView>

      {/* Modal for displaying additional information */}
      <MarkerModal
        visible={modalVisible}
        title={selectedItem?.title}
        overview={selectedItem?.overview}
        firstImage={selectedItem?.firstImage}
        homepage={selectedItem?.homepage} // 추가된 homepage
        onClose={() => setModalVisible(false)}
        onQuizPress={() => {
          setQuizVisible(true); // 퀴즈 모달 보이기
          setModalVisible(false); // 다른 모달 닫기
        }}
        userLocation={{
          latitude: location?.latitude, // 사용자의 현재 위치 전달
          longitude: location?.longitude,
        }}
        markerLocation={{
          latitude: parseFloat(selectedItem?.mapy),
          longitude: parseFloat(selectedItem?.mapx),
        }} // 선택된 마커의 위치 전달
      />

      {/* Quiz Modal 추가 */}
      <QuizModal
        visible={quizVisible}
        onClose={() => setQuizVisible(false)}
        apicontentId={selectedItem?.apicontentId} // QuizModal에 apicontentId 전달
      />
    </SafeAreaView>
  );
};

export default TourInfoWithMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
