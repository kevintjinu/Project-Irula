import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Wordslist from '.././Wordslist';
import Search from '.././search';

const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      
    screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
            backgroundColor: '#284387',
            borderBottomWidth: 0,
            borderTopWidth: 0
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#a8a8a8',
        tabBarStyle: [
          {
            display: 'flex',
            backgroundColor: '#284387',
            borderTopWidth: 0,
          },
          null,
        ],
      }}
    >
      <Tab.Screen
        name="LearnIrula"
        component={Wordslist}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-home" color={color} size={size} />
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-search" color={color} size={size} />
          ),
          tabBarLabel: 'Search',
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabs;
