import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
// import * as Speech from "expo-speech";


const Irula = () => {
  const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  // const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  // const [isRecording, setIsRecording] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = () => {
    // setLoading(true);
    axios
      // .get("https://retoolapi.dev/2BDr23/data")
       .get("https://project-irula.azurewebsites.net/api/")
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data);
        // setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error(error);
        // setLoading(false);
        setRefreshing(false);
      });
  };

  // useEffect(() => {
  //   axios
  //     .get("https://retoolapi.dev/2BDr23/data")
  //     .then((response) => {
  //       setData(response.data);
  //       setFilteredData(response.data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);

  const handleSearch = (text) => {
    if (typeof text !== "string") {
      return;
    }

    const filtered = data.filter((item) => {

      return (
        (item.enWord && item.enWord.toLowerCase().includes(text.toLowerCase())) ||
        (item.taWord &&
          item.taWord.toLowerCase().includes(text.toLowerCase()))
      );
      // return (
      //   (item.word && item.word.toLowerCase().includes(text.toLowerCase())) ||
      //   (item.tamilword &&
      //     item.tamilword.toLowerCase().includes(text.toLowerCase()))
      // );
    });
    setFilteredData(filtered);
    setSearchText(text);
    setIsFocused(true);
  };
  const handleClearSearch = () => {
    setSearchText("");
    setIsFocused(false);
    setFilteredData(data);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        flex: 1,
        flexDirection: "row",
        padding: 16,
        alignItems: "center",
      //  marginTop: 30,
        margin: 16,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
      }}
      onPress={() => {
        setSelectedItem(item);
        setModalVisible(true);
      }}
    >
      <Image
        source={require("./assets/icon.png")}
        style={{ width: 95, height: 78 }}
      />
      {/* <Image source={{ uri: item.urlToImage }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 16 }} /> */}
      <View style={{ flex: 1, justifyContent: "center", marginLeft: 5 }}>
        <Text
          style={{
            fontSize: 15,
            color: "#284387",
            marginBottom: 7,
            fontWeight: "bold",
          }}
        >
          {/* {item.word} */}
          {item.enWord}
        </Text>
        <Text style={{ fontSize: 12, color: "green", marginBottom: 7 }}>
          {/* {item.tamilword} */}
          {item.taWord}
        </Text>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{ fontSize: 10, color: "#284387", marginBottom: 7 }}
        >
          {/* {item.endefinition} */}
          {item.enMeaning}
        </Text>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{ fontSize: 10, color: "green", marginBottom: 7 }}
        >
          {/* {item.tamildefinition} */}
          {item.taMeaning}
        </Text>
      </View>
    </TouchableOpacity>
  );

  //   if (loading) {
  //     return <View style={{flex: 1,
  //       backgroundColor: "#284387",justifyContent:'center'}}>
  // <Text style={{color:'white',textAlign:"center"}}>Loading...</Text>
  //     </View>;

  //   }
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.MainContainer}>
        <StatusBar style="auto" backgroundColor="#284387" />
        <View style={styles.logoContainer}>
          <Text style={{fontSize:20,fontWeight:'bold',color:'white',marginBottom: 20,}}>
            LearnIrula
          </Text>
      {/* <Image source={require('./assets/Logo.png')} style={styles.logo} /> */}
    </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={handleSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search..."
          />
          {isFocused && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.flatlistContainer}>
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            scrollIndicatorInsets={{ color: 'white' }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={["#9Bd35A", "#689F38"]}
                tintColor="#FFF"
                title="Loading..."
                titleColor="#FFF"
              />
            }
          />
        </View>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
          backdropOpacity={0.3}
        >
          <View style={{ flex: 1, backgroundColor: "#000000aa" }}>
            <View style={{ flex: 1, backgroundColor: "transparent" }} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 61,
              }}
            >
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle-outline" size={70} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContainer}>
              <View style={styles.titleContainer}>
                <View style={styles.wordtileContainer}>
                  <Text
                    style={{
                      color: "green",
                      fontSize: 16,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {/* {selectedItem ? selectedItem.tamilword : ""} */}
                    {selectedItem ? selectedItem.taWord : ""}
                  </Text>
                </View>

                <View style={styles.wordtileContainer}>
                  <Text
                    style={{
                      color: "#284387",
                      fontSize: 16,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {/* {selectedItem ? selectedItem.word : ""} */}
                    {selectedItem ? selectedItem.enWord : ""}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",

                  justifyContent: "space-evenly",

                  marginTop: 23,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-around",
                  }}
                >
                  <View style={styles.definitionContainer}>
                    <Text
                      style={{
                        color: "green",
                        fontSize: 14,
                      }}
                    >
                      {/* {selectedItem ? selectedItem.tamildefinition : ""} */}
                      {selectedItem ? selectedItem.taMeaning : ""}
                    </Text>
                  </View>

                  <View style={styles.definitionContainer}>
                    <Text
                      style={{
                        color: "#284387",
                        fontSize: 14,
                      }}
                    >
                      {/* {selectedItem ? selectedItem.endefinition : ""} */}
                      {selectedItem ? selectedItem.enMeaning : ""}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    width: 128,
                    height: 238,
                    borderRadius: 8,
                  }}
                >
                  <Image
                    style={{ width: 128, height: 238, borderRadius: 8 }}
                    source={require("./assets/pictures/fire.png")}
                  />
                </View>
              </View>
              <TouchableOpacity style={{ flex: 1, marginTop: 20 }}>
                <Text
                  style={{
                    fontSize: 24,
                    padding: 10,
                    borderWidth: 2,
                    borderColor: "white",
                    backgroundColor: "#4B639D",
                    color: "white",
                    borderRadius: 10,
                    textAlign: "center",
                  }}
                >
                  Hear this word
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "#284387",
  },

  button: {
    width: "80%",
    paddingTop: 2,
    paddingBottom: 2,
    backgroundColor: "#DD2C00",
    borderRadius: 3,
    marginTop: 20,
  },

  text: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    padding: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    // width:310,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
  },
  flatlistContainer: {
    flex: 1,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 8,
    margin: 24,
  },
  definitionContainer: {
    borderWidth: 1,
    borderColor: "#FFF",
    borderRadius: 8,
    padding: 5,
    width: "78%",
    backgroundColor: "#FFF",
  },
  wordtileContainer: {
    borderWidth: 1,
    borderColor: "#FFF",
    borderRadius: 8,
    padding: 5,
    width: "48%",
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  modalContainer: {
    height: "55%",
    backgroundColor: "#284387",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    // width: 100,
    // height: 100,
  },
});

export default Irula;
