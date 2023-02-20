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
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
// import * as Speech from "expo-speech";
// import Voice from "react-native-voice";

const Irula = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    axios
      .get("https://retoolapi.dev/2BDr23/data")
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSearch = (text) => {
    if (typeof text !== "string") {
      return;
    }

    const filtered = data.filter((item) => {
      return (
        (item.word && item.word.toLowerCase().includes(text.toLowerCase())) ||
        (item.tamilword &&
          item.tamilword.toLowerCase().includes(text.toLowerCase()))
      );
    });
    setFilteredData(filtered);
    setSearchText(text);
  };

  // const startRecording = async () => {
  //   setIsRecording(true);

  //   try {
  //     await Voice.start("en-US");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const stopRecording = async () => {
  //   setIsRecording(false);

  //   try {
  //     await Voice.stop();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const onSpeechResults = (event) => {
  //   const result = event.value[0];
  //   setSearchText(result);
  //   handleSearch(result);
  // };

  // const handleVoiceSearch = async () => {
  //   const { status } = await Speech.requestPermissionsAsync();
  //   if (status === "granted") {
  //     const result = await Speech.recognizeAsync({ language: "en-US" });
  //     if (result.status === "final") {
  //       setSearchTerm(result.transcription);
  //       handleSearch();
  //     }
  //   }
  // };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        flex: 1,
        flexDirection: "row",
        padding: 16,
        alignItems: "center",
      }}
      onPress={() => {
        setSelectedItem(item);
        setModalVisible(true);
      }}
    >
      {/* <Image source={{ uri: item.urlToImage }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 16 }} /> */}
      <View style={{ flex: 1, justifyContent: "center", marginLeft: 5 }}>
        <Text style={{ fontSize: 18, color: "red", marginBottom: 15 }}>
          {item.word}
        </Text>
        <Text style={{ fontSize: 18, color: "red", marginBottom: 15 }}>
          {item.tamilword}
        </Text>
        <Text style={{ fontSize: 12, color: "green", marginBottom: 15 }}>
          {item.endefinition}
        </Text>
        <Text style={{ fontSize: 12, color: "green", marginBottom: 15 }}>
          {item.tamildefinition}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.MainContainer}>
      <StatusBar style="auto" />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={handleSearch}
          placeholder="Search words"
        />
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={handleVoiceSearch}>
          <Ionicons name="mic" size={24} color="black" />
        </TouchableOpacity> */}
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 24 }}>
            {selectedItem ? selectedItem.tamildefinition : ""}
          </Text>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={{ color: "blue", marginTop: 16 }}>Close Modal</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    marginTop: 50,
    marginBottom: 50,
    marginHorizontal: 25,
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
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
  },
});

export default Irula;
