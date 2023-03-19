import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

function Search({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Search Screen</Text>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate('LearnIrula')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Search;
