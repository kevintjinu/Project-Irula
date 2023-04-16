import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const Search = () => {
  const [words, setWords] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [scrollbarLetter, setScrollbarLetter] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    axios
      .get('https://project-irula.azurewebsites.net/api/')
      .then((response) => {
        const sortedWords = response.data.sort((a, b) =>
          a.enWord.localeCompare(b.enWord, undefined, { ignorePunctuation: true })
        );
        setWords(sortedWords);
      })
      .catch((error) => console.error(error));
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.wordContainer}>
        <Text style={styles.wordEn}>{item.enWord}</Text>
        <Text style={styles.wordMeaning}>{item.enMeaning}</Text>
      </View>
    );
  };

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollFraction = contentOffset.y / (contentSize.height - layoutMeasurement.height);
    const index = Math.floor(scrollFraction * words.length);
    const item = words[index];
    if (item) {
      const letter = item.enWord[0].toLowerCase();
      if (letter !== scrollbarLetter) {
        setScrollbarLetter(letter);
        setSelectedLetter(letter);
      }
    }
  };
  

  const handleLetterPress = (letter) => {
    setSelectedLetter(letter);
    const index = words.findIndex((item) => item.enWord.toLowerCase().startsWith(letter));
    flatListRef.current.scrollToIndex({ animated: true, index });
  };

  const alphabetList = words.reduce((acc, word) => {
    const firstLetter = word.enWord[0].toLowerCase();
    if (!acc.includes(firstLetter)) {
      acc.push(firstLetter);
    }
    return acc;
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={words}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        onScroll={handleScroll}
      />
      <View style={styles.scrollbarContainer}>
        {alphabetList.map((letter, index) => (
          <Text
            key={index}
            style={[
              styles.scrollbarText,
              selectedLetter === letter && styles.scrollbarSelectedText,
            ]}
            onPress={() => handleLetterPress(letter)}
          >
            {letter.toUpperCase()}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#284387',
    
  },
  wordContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'white',
    marginRight: 35,
    marginLeft:15,
    marginVertical:20,borderRadius:10
  },
  wordEn: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  wordMeaning: {
    fontSize: 16,
    color: '#777',
  },
  scrollbarContainer: {
    position: 'absolute',
   
    top: 0,
    bottom: 0,
    right: 0,
    width: 20,
    backgroundColor: '#284387',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollbarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#a8a8a8',
    marginVertical: 2,
  },
  scrollbarSelectedText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffff',
  },
});

export default Search
