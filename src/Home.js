import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect,useRef,useCallback } from "react";

import {  StyleSheet,
    FlatList,
    Text,
    View,
    Image,
    TouchableOpacity,
    Modal,
    TextInput,
    SafeAreaView,
    RefreshControl,PanResponder, Keyboard,Dimensions } from 'react-native';
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import NetInfo from '@react-native-community/netinfo';
// import CacheStore from 'react-native-cache-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

export default function Home() {

    const [data, setData] = useState([]);
    
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
  
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [numItemsToRender, setNumItemsToRender] = useState(35);
    const [isFocused, setIsFocused] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const searchInput = useRef(null);
  
    

    useEffect(() => {
        fetchData();
      }, []);

const fetchData = useCallback(() => {
    // Check internet connection
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        // Fetch data from API
        axios
          .get('https://project-irula.azurewebsites.net/api/')
          .then((response) => {
            // Cache data using AsyncStorage
            const data = response.data;
            AsyncStorage.setItem('data', JSON.stringify(data));
            const shuffledData = data.sort(() => Math.random() - 0.5);
            setData(shuffledData);
            setFilteredData(data);
            setRefreshing(false);
          })
          .catch((error) => {
            console.error(error);
            setRefreshing(false);
          });
      } else {
        // Get cached data from AsyncStorage
        AsyncStorage.getItem('data')
          .then((cachedData) => {
            if (cachedData !== null) {
              const data = JSON.parse(cachedData);
              const shuffledData = data.sort(() => Math.random() - 0.5);
              setData(shuffledData);
              setFilteredData(data);
            }
            setRefreshing(false);
          })
          .catch((error) => {
            console.error(error);
            setRefreshing(false);
          });
      }
    });
  }, []);
  

  const handleSearch = (text) => {
    if (typeof text !== "string") {
      return;
    }

    const filtered = data.filter((item) => {

      return (
        (item.enWord && item.enWord.toLowerCase().startsWith(text.toLowerCase())) ||
        (item.taWord &&
          item.taWord.toLowerCase().startsWith(text.toLowerCase()))
      );
     
    });
    setFilteredData(filtered);
    setSearchText(text);
    setIsFocused(true);
  };
  const handleClearSearch = () => {
    setSearchText("");
    setIsFocused(false);
    setFilteredData(data);
    Keyboard.dismiss();
  };

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={{
        flex: 1,
        flexDirection: "row",
        padding: 16,
        alignItems: "center",
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
        // source={require("../assets/icon.png")}
        source={{uri: item.picturePath}}
       
        // source={{uri: 'https://arizsiddiqui.blob.core.windows.net/project-irula-assets/fire.jpg'}}
        style={{ width: 95, height: 78,borderRadius:8 }}
      />
      {/* <Image source={{ uri: item.urlToImage }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 16 }} /> */}
      <View style={{ flex: 1, justifyContent: "center", marginLeft: 10, }}>
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
          {item.lexicalUnit}
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
  ),[]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    handleClearSearch();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      
      <View style={styles.MainContainer}
      // {...panResponder.panHandlers}
      >
        <StatusBar style="light" backgroundColor="#284387" />
        <View style={styles.searchContainer}>
          <TextInput
          ref={searchInput}
            style={styles.searchInput}
            value={searchText}
            onChangeText={handleSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search..."
            placeholderTextColor="#284387" 
          />
          {isFocused && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close" size={24} color="#284387" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={24} color="#284387" />
          </TouchableOpacity>
        </View>
        {filteredData.length ? (
        <View style={styles.flatlistContainer}>
          <FlatList
            //data={filteredData}
            data={filteredData.slice(0, numItemsToRender)}
            renderItem={renderItem}
            // keyExtractor={(item, index) => index.toString()}
            keyExtractor={(item) => item._id}
            scrollIndicatorInsets={{ color: 'white' }}
            onEndReached={() => {
    setNumItemsToRender(numItemsToRender + 35);
  }}
  onEndReachedThreshold={0.1}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={["green", "#284387"]}
                tintColor="#FFF"
                title="Loading..."
                titleColor="#FFF"
              />
            }
          />
        </View>
        ):(
          <View style={styles.flatlistContainer}>
          
           <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",marginTop:10
            }}
            >Please wait and try to refresh...</Text>
            
            <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",marginTop:10
            }}
            >தயவுசெய்து காத்திருந்து புதுப்பிக்க முயற்சிக்கவும்...</Text>
            </View>
        
        )}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
          backdropOpacity={0.3}
          propagateSwipe={true}
        >
          <View style={{ flex: 1, backgroundColor: "#000000aa" }}>
            <View style={{ flex: 1, backgroundColor: "transparent" }} />
            <View
              style={{
                
                flexDirection: "row",
                justifyContent: "center",
                marginBottom:20,
              }}
            >

              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle-outline" size={70} color="white" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContainer}>
            {/* <TouchableOpacity > */}
            {/* <ScrollView >  */}
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
                  {/* <MyTextInput
                  style={{
                    color: "green",
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                  
      label="Tamil Word"
      value={selectedItem ? selectedItem.taWord : ""}
      editable={false}
      mode="outlined"
      labelStyle={{
        color: 'green',
      }}
  
    /> */}
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

                  justifyContent: "space-between",

                  marginTop: 23,
                  //height:320, 
                  height: Dimensions.get('window').height*.5,
                  //backgroundColor: "pink",
                }}
              >
                <View
                  style={{
                    // flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-around",
                   // backgroundColor: "red",
                    width: "48%",
                  }}
                >
                  <View style={styles.definitionContainer}>
                    <ScrollView>
                    <Text
                      style={{
                        color: "#284387",
                        fontSize: 14,
                      }}
                    >
                      {/* {selectedItem ? selectedItem.tamildefinition : ""} */}
                      {selectedItem ? selectedItem.grammaticalInfo : ""}
                    </Text>
                    </ScrollView>
                  </View>

                  <View style={styles.definitionContainer}>
                  <ScrollView>
                    <Text
                      style={{
                        color: "green",
                        fontSize: 14,
                      }}
                    >
                      {/* {selectedItem ? selectedItem.endefinition : ""} */}
                      {selectedItem ? selectedItem.taMeaning : ""}
                    </Text>
                    </ScrollView>
                  </View>
                  <View style={styles.definitionContainer}>
                  <ScrollView>
                    <Text
                      style={{
                        color: "#284387",
                        fontSize: 14,
                      }}
                    >
                      {/* {selectedItem ? selectedItem.endefinition : ""} */}
                      {selectedItem ? selectedItem.enMeaning : ""}
                    </Text>
                    </ScrollView>
                  </View>
                  <View style={styles.definitionContainer}>
                  <ScrollView>
                    <Text
                      style={{
                        color: "green",
                        fontSize: 14,
                      }}
                    >
                      {/* {selectedItem ? selectedItem.endefinition : ""} */}
                      {selectedItem ? selectedItem.irulaWord : ""}
                    </Text>
                    </ScrollView>
                  </View>
                </View>

                <View
                  style={{
                    // flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-around",
                   // backgroundColor: "red",
                    width: "48%", 
                    alignItems: "flex-end",
                  }}
                >
                <View
                  style={{
                    width: 128,
                    height: 238,
                    borderRadius: 8,
                  }}
                >
                 <Image
                  
                  style={{ width: 128, height: 238, borderRadius: 8 }}
                  //source={require("../assets/pictures/fire.png")}
                //  source={{uri: 'https://arizsiddiqui.blob.core.windows.net/project-irula-assets/fire.jpg'}}
                  source={{ uri: selectedItem ? selectedItem.picturePath : ""}}
                />
                </View>
                <View style={styles.definitionContainer}>
                  <ScrollView>
                    <Text
                      style={{
                        color: "green",
                        fontSize: 14,
                      }}
                    >
                      {/* {selectedItem ? selectedItem.endefinition : ""} */}
                      {selectedItem ? selectedItem.irulaWord : ""}
                    </Text>
                    </ScrollView>
                  </View>
                  <View style={styles.definitionContainer}>
                  <ScrollView>
                    <Text
                      style={{
                        color: "red",
                        fontSize: 14,
                      }}
                    >
                      {/* {selectedItem ? selectedItem.endefinition : ""} */}
                      {selectedItem ? selectedItem.lexicalUnit : ""}
                    </Text>
                    </ScrollView>
                  </View>
                </View>
              </View>
              {/* <View style={styles.definitionContainer}>
                    <Text
                      style={{
                        color: "#284387",
                        fontSize: 14,
                      }}
                    > */}
                      {/* {selectedItem ? selectedItem.endefinition : ""} */}
                      {/* {selectedItem ? selectedItem.lexicalUnit : "lexicalUnit"} */}
{/* </Text> */}
                  {/* </View> */}
              <TouchableOpacity style={{ flex: 1, marginTop: 20,width:"100%",backgroundColor: "#4B639D", 
                    
                    borderRadius: 10,}}
              onPress={async () => {
                const soundObject = new Audio.Sound();
                try {
                  await soundObject.loadAsync(
                   // require('../assets/audio/fire.mp3')
                   {
                    //uri: "https://arizsiddiqui.blob.core.windows.net/project-irula-assets/fire.mp3",
                    uri: selectedItem ? selectedItem.audioPath : ""
                  }
                    );

                  await soundObject.playAsync();
                } catch (error) {
                  console.error('Error playing sound:', error);
                }
              }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    padding: 10,
                    borderWidth: 2,
                    borderColor: "white",
                    
                    color: "white",
                    borderRadius: 10,
                    textAlign: "center",
                  }}
                >
<Ionicons name="ios-volume-high" size={24} color="white" />
                       Hear this word
                  
                </Text>

              </TouchableOpacity>      
              {/* </ScrollView>      */}
            {/* </TouchableOpacity> */}
            </ScrollView>
          </View>
        </Modal>
      </View>
    </SafeAreaView> 
  );
}

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
        
        // flex:1/2,
        borderWidth: 1,
        borderColor: "#FFF",
        borderRadius: 8,
        padding: 5,
        width: "100%",
        //maxHeight: '65%',
        maxHeight: Dimensions.get('window').height*0.15,
        // height:'45%',
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
       
        //height: "55%",
        height: Dimensions.get('window').height*0.65,
       // maxHeight: 500,
        // height: deviceHeight * 0.55,
        backgroundColor: "#284387",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 25,
        //paddingVertical: 15,
      },
      titleContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 35,
        //  marginVertical:15
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
