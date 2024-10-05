import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location'; // expo install expo-location

interface LocationType {
  latitude: number;
  longitude: number;
}

const useCurrentLocation = (): LocationType | null => {
  const [location, setLocation] = useState<LocationType | null>(null);

  const getLocation = async () => {
    try {
      // 권한 요청
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Please allow location access in settings.');
        return;
      }

      // 현재 위치 정보 가져오기
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High, // 정확도 설정
      });

      // 위치 설정
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    } catch (error) {
      Alert.alert("Can't find your location.", 'Please try again!');
    }
  };

  useEffect(() => {
    getLocation(); // 컴포넌트 마운트 시 호출

    const interval = setInterval(() => {
      getLocation(); // 주기적으로 위치 업데이트
    }, 10000); // 10초마다 위치 업데이트

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 클리어
  }, []);

  return location;
};

export default useCurrentLocation;
