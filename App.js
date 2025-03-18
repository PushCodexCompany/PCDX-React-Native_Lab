import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Text,
  View,
  AppState,
  BackHandler,
  NativeModules,
  Button,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Immersive from 'react-native-immersive';

import VideoTest from './component/VideoTest';
import IframeTest from './component/IframeTest';

// Create Tab Navigator
const Tab = createBottomTabNavigator();

// Example Screens
function HomeScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home Screen</Text>
      <Button title="Exit Kiosk" onPress={exitKioskMode} />
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

const disableBackButton = () => true;

const exitKioskMode = () => {
  NativeModules.UnlockModule.exitKioskMode();
};

export default function App() {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    // Add event listener and store the subscription
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      disableBackButton,
    );

    return () => {
      // Remove the subscription correctly
      backHandler.remove();
    };
  }, []);

  // This function will handle app state changes
  const handleAppStateChange = nextAppState => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
      // Re-enable immersive mode when the app comes to the foreground
      Immersive.on();
      Immersive.setImmersive(true);
    }
    setAppState(nextAppState);
  };

  useEffect(() => {
    // Enable immersive mode when the app starts
    Immersive.on();
    Immersive.setImmersive(true); // Hides both system navigation and status bars

    // Add event listener for app state change
    const appStateListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Clean up the event listener on component unmount
    return () => {
      appStateListener.remove(); // Use the remove method to unsubscribe
      Immersive.off(); // Optional: Disable immersive mode when app is closed or backgrounded
    };
  }, [appState]);

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
