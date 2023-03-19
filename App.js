import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNav from '././Screens/Navigation.js/StackNav';
import BottomTabs from '././Screens/Navigation.js/BottomTab';
function App() {
  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}

export default App;
