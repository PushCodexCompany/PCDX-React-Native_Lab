import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import VideoTest from './component/VideoTest';
import IframeTest from './component/IframeTest';

// Create Tab Navigator
const Tab = createBottomTabNavigator();

// Example Screens
function HomeScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home Screen</Text>
    </View>
  );
}

function VideoScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <VideoTest />
    </View>
  );
}

function IframScreen() {
  return (
    <View style={{flex: 1}}>
      <IframeTest />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Video') {
              iconName = focused ? 'video' : 'video-outline';
            } else if (route.name === 'Iframe') {
              iconName = focused ? 'iframe' : 'iframe-outline';
            }

            // Return the icon component
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6200ee',
          tabBarInactiveTintColor: 'gray',
          headerShown: false, // Hide header for a clean look
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Video" component={VideoScreen} />
        <Tab.Screen name="Iframe" component={IframScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
