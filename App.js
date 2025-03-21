import React, {useEffect, useState, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Text,
  View,
  AppState,
  BackHandler,
  NativeModules,
  Button,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Immersive from 'react-native-immersive';

import VideoTest from './component/VideoTest';
import IframeTest from './component/IframeTest';
import SocketTest from './component/SocketTest';
import WatchDogAndKeepAlive from './component/WatchDogAndKeepAlive';
import ErrorBoundary from './component/ErrorBoundary'; // Make sure this is the correct path

// Create Tab Navigator
const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  overlay: {
    position: 'absolute',
    bottom: 0, // Position at the bottom
    left: 0, // Position at the left
    width: 100,
    height: 100,
    // backgroundColor: 'red', // Red clickable area
    opacity: 0.5, // Semi-transparent for better visibility
  },
  buttonContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    color: 'black',
    margin: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
  },
  brightnessOverlay: {
    position: 'absolute',
    top: 0, // Position at the top
    left: 0, // Position at the left
    right: 0, // Position at the right
    bottom: 0, // Position at the bottom
    backgroundColor: 'black', // Black background for the overlay
    opacity: 0.5, // Semi-transparent for better visibility
  },
});

// Home Screen Component
function HomeScreen() {
  const [showButton, setShowButton] = useState(false);
  const tapCount = useRef(0);
  const lastTap = useRef(0);

  const handleTripleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      tapCount.current += 1;
    } else {
      tapCount.current = 1;
    }
    lastTap.current = now;

    if (tapCount.current === 3) {
      setShowButton(prev => !prev); // Toggle the button visibility
      tapCount.current = 0;
    }
  };

  const exitKioskMode = () => {
    setShowButton(false);
    NativeModules.UnlockModule.exitKioskMode();
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleTripleTap}>
        <View style={styles.overlay}>
          {showButton && (
            <Animated.View style={styles.buttonContainer}>
              <Button title="Exit Kiosk" onPress={exitKioskMode} />
            </Animated.View>
          )}
        </View>
      </TouchableWithoutFeedback>
      <Text>Home Screen</Text>
    </View>
  );
}

function BrightnessScreen() {
  const [opacity, setOpacity] = useState(0); // Start with 0 opacity (fully bright)
  const [animOpacity] = useState(new Animated.Value(opacity));

  const changeBrightness = direction => {
    let newOpacity = opacity;

    // Adjust opacity based on button click
    if (direction === 'increase' && opacity < 1) {
      newOpacity += 0.1;
    } else if (direction === 'decrease' && opacity > 0) {
      newOpacity -= 0.1;
    }

    setOpacity(newOpacity);

    // Animate the change in opacity
    Animated.timing(animOpacity, {
      toValue: newOpacity,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Brightness Control (Fake)</Text>

      {/* Black box with adjustable opacity */}
      <Animated.View style={[styles.brightnessOverlay, {opacity: animOpacity}]}>
        <Text style={styles.overlayText}>Simulated Brightness</Text>
      </Animated.View>

      <View style={styles.buttonsContainer}>
        <Button
          title="Increase Brightness"
          onPress={() => changeBrightness('increase')}
        />
        <Button
          title="Decrease Brightness"
          onPress={() => changeBrightness('decrease')}
        />
      </View>
    </View>
  );
}

// Video Screen Component
function VideoScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <VideoTest />
    </View>
  );
}

// Iframe Screen Component
function SocketScreen() {
  return (
    <View style={{flex: 1}}>
      <SocketTest />
    </View>
  );
}

function WatchDogAndKeepAliveScreen() {
  return (
    // <ErrorBoundary>
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <WatchDogAndKeepAlive />
    </View>
    // </ErrorBoundary>
  );
}

// Iframe Screen Component
function IframScreen() {
  return (
    <View style={{flex: 1}}>
      <IframeTest />
    </View>
  );
}

// Disable Back Button
const disableBackButton = () => true;

// Main App Component
export default function App() {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    // Handle back button press
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      disableBackButton,
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  // Handle app state changes
  const handleAppStateChange = nextAppState => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
      Immersive.on();
      Immersive.setImmersive(true);
    }
    setAppState(nextAppState);
  };

  useEffect(() => {
    // Enable immersive mode on start
    Immersive.on();
    Immersive.setImmersive(true);

    // Listen for app state changes
    const appStateListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      appStateListener.remove();
      Immersive.off();
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
              iconName = focused ? 'videocam' : 'videocam-outline';
            } else if (route.name === 'Iframe') {
              iconName = focused ? 'globe' : 'globe-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6200ee',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Brightness" component={BrightnessScreen} />
        <Tab.Screen name="Video" component={VideoScreen} />
        <Tab.Screen name="Socket" component={SocketScreen} />
        <Tab.Screen
          name="WatchDog&KeepAlive"
          component={WatchDogAndKeepAliveScreen}
        />
        <Tab.Screen name="Iframe" component={IframScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
