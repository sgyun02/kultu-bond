import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
  ActivityIndicator,
  ScrollView,
} from "react-native";

const App = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [numColumns, setNumColumns] = useState(2);

  const categories = {
    Seafood: ["Shrimp", "Fish", "Crab"],
    Vegetables: ["Spring Onion", "Green Onion", "Kimchi", "Garlic"],
    Noodles: ["Noodles", "Pasta"],
    Meat: ["Chicken", "Beef", "Pork", "Bacon", "Ham", "Duck"],
    Grains: ["Rice", "Bean", "Flour"],
    Herbs: ["Ginseng", "Medicinal Herbs"],
    Dairy: ["Egg", "Cream"],
    Fruits: ["Grape", "Green Plum"],
    Others: ["Mushrooms", "Mushroom"],
  };

  const API_URL = "https://seoul.openapi.redtable.global/api/menu-dscrn/eng";
  const serviceKey =
    "6z1RC5PjBbMaLViH8KhKHXaFQWcdGiN4609fn5AqaYSRbOLdZz177dwFVoQc63Ie";

  useEffect(() => {
    fetchData();
  }, [pageNo]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${API_URL}?serviceKey=${serviceKey}&pageNo=${pageNo}`
      );
      const json = await response.json();
      const filteredData = json.body.filter(
        (item) =>
          item.MENU_CTGRY_LCLAS_NM === "Korean Cuisine" &&
          item.MENU_DSCRN !== null
      );

      const groupedData = filteredData.reduce((acc, item) => {
        if (!acc[item.RSTR_NM]) {
          acc[item.RSTR_NM] = [];
        }
        acc[item.RSTR_NM].push({
          MENU_NM: item.MENU_NM,
          MENU_DSCRN: item.MENU_DSCRN.split(",").map((i) => i.trim()),
          RSTR_ID: item.RSTR_ID,
        });
        return acc;
      }, {});

      setData((prevData) => ({ ...prevData, ...groupedData }));
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity
      style={{
        padding: 10,
        backgroundColor: "#f8f8f8",
        marginBottom: 10,
        flex: 1,
        marginHorizontal: 5,
        height: 120,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
      }}
      onPress={() => {
        setSelectedRestaurant(item);
        setModalVisible(true);
        setFilteredMenu(data[item]);
      }}
      key={item}
    >
      <Text style={{ fontWeight: "bold", textAlign: "center", fontSize: 16 }}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const handleFilter = (ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(
        selectedIngredients.filter((item) => item !== ingredient)
      );
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const handleCategoryClick = (category) => {
    const ingredients = categories[category];
    const newSelectedIngredients = selectedIngredients.includes(ingredients[0])
      ? selectedIngredients.filter((item) => !ingredients.includes(item))
      : [...selectedIngredients, ...ingredients];

    setSelectedIngredients(newSelectedIngredients);
  };

  const applyFilter = () => {
    const allFilteredMenus = Object.keys(data).reduce((acc, restaurant) => {
      const filtered = data[restaurant].filter(
        (menuItem) =>
          !menuItem.MENU_DSCRN.some((ingredient) =>
            selectedIngredients.includes(ingredient)
          )
      );
      acc[restaurant] = filtered;
      return acc;
    }, {});

    setData(allFilteredMenus);
    setFilteredMenu(allFilteredMenus[selectedRestaurant]);
    setShowFilterModal(false);
  };

  const renderMenuItems = (restaurantName) => {
    const restaurantData = filteredMenu || [];
    return (
      <FlatList
        data={restaurantData}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {item.MENU_NM}
            </Text>
            {item.MENU_DSCRN &&
            Array.isArray(item.MENU_DSCRN) &&
            item.MENU_DSCRN.length > 0 ? (
              <Text>Ingredients: {item.MENU_DSCRN.join(", ")}</Text>
            ) : (
              <Text>No ingredients available</Text>
            )}
          </View>
        )}
        keyExtractor={(item) => `${item.MENU_NM}-${item.RSTR_ID}`}
      />
    );
  };

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: "#14122D",
              marginBottom: 20,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
            }}
            onPress={() => setShowFilterModal(true)}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              FILTER INGREDIENTS
            </Text>
          </TouchableOpacity>

          <FlatList
            data={Object.keys(data)}
            renderItem={renderRestaurantItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={numColumns}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            key={numColumns}
            onEndReached={() => setPageNo((prevPageNo) => prevPageNo + 1)}
            onEndReachedThreshold={0.5}
          />
        </>
      )}

      {selectedRestaurant && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={{ flex: 1, padding: 20 }}>
            <Text
              style={{ fontWeight: "bold", fontSize: 20, marginBottom: 20 }}
            >
              {selectedRestaurant}
            </Text>
            {renderMenuItems(selectedRestaurant)}
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      )}

      {showFilterModal && (
        <Modal
          animationType="slide"
          transparent={true} // Make the modal transparent to avoid fullscreen blocking
          visible={showFilterModal}
          onRequestClose={() => {
            setShowFilterModal(false);
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent background with a dark overlay
            }}
          >
            <View
              style={{
                width: "90%",
                maxHeight: "80%", // Limit the modal height to 80% of the screen
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: 20,
              }}
            >
              <ScrollView>
                <Text
                  style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10 }}
                >
                  Filter Ingredients
                </Text>
                <Text style={{ marginBottom: 10 }}>
                  Click on the bold rectangle to select all!
                </Text>
                {Object.keys(categories).map((category) => (
                  <View key={category} style={{ marginVertical: 10 }}>
                    <TouchableOpacity
                      onPress={() => handleCategoryClick(category)}
                      style={{
                        padding: 5,
                        backgroundColor: "#d3d3d3",
                        marginBottom: 5,
                        borderRadius: 5,
                      }}
                    >
                      <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {categories[category].map((ingredient) => (
                        <TouchableOpacity
                          key={ingredient}
                          onPress={() => handleFilter(ingredient)}
                          style={{
                            backgroundColor: selectedIngredients.includes(
                              ingredient
                            )
                              ? "#b0e0e6"
                              : "#f0f0f0",
                            padding: 5,
                            margin: 5,
                            borderRadius: 5,
                          }}
                        >
                          <Text style={{ textAlign: "center", fontSize: 14 }}>
                            {ingredient}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <Button title="Apply Filters" onPress={applyFilter} />
                <Button
                  title="Cancel"
                  onPress={() => setShowFilterModal(false)}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default App;
