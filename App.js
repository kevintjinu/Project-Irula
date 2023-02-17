import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet,FlatList, Text, View, Image, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';

const Irula = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    axios.get('https://retoolapi.dev/2BDr23/data')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })  
      .catch(error => {
        console.error(error);
      });
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', padding: 16, alignItems: 'center' }} onPress={() => { setSelectedItem(item); setModalVisible(true); }}>
      {/* <Image source={{ uri: item.urlToImage }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 16 }} /> */}
      <View style={{flex:1,justifyContent: 'center',marginLeft:5 }}>
                 <Text style={{fontSize:18,color:'red', marginBottom:15}}>
                     {item.word}
                 </Text>
                 <Text style={{fontSize:18,color:'red', marginBottom:15}}>
                     {item.tamilword}
                 </Text>
                 <Text style={{fontSize:18,color:'green', marginBottom:15}}>{item.endefinition}</Text>
                 <Text style={{fontSize:18,color:'green', marginBottom:15}}>{item.tamildefinition}</Text>

             </View>
            
    </TouchableOpacity>
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.MainContainer}>
      
      <StatusBar style="auto" />
      <FlatList
        data={data}
        renderItem={renderItem}
        // keyExtractor={item => item.id}
        keyExtractor={(item,index)=> index}
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 24 }}>{selectedItem ? selectedItem.tamildefinition : ''}</Text>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={{ color: 'blue', marginTop: 16 }}>Close Modal</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      
    </View>
  );
};

const styles = StyleSheet.create({
 
  MainContainer: {
 
    flex: 1,
    backgroundColor:'#F5FCFF',
  marginTop:50,
  marginBottom:50,
  marginHorizontal:25
  },
 
  button: {
 
    width: '80%',
    paddingTop: 2,
    paddingBottom: 2,
    backgroundColor: '#DD2C00',
    borderRadius: 3,
    marginTop: 20
  },
 
  text: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    padding: 5
  }
 
});

export default Irula;
