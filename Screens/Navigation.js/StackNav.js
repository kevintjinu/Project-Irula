import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabs from './BottomTab';
import Wordslist from '.././Wordslist';
import Search from '.././search';

const Stack = createStackNavigator();

function StackNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={BottomTabs} />
      <Stack.Screen name="Wordslist" component={Wordslist} />
      <Stack.Screen name="Search" component={Search} />
    </Stack.Navigator>
  );
}

export default StackNav;
