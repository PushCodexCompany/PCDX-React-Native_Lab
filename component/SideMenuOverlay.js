import React, {useState} from 'react';
import {View, Text, Animated, Dimensions, TouchableOpacity} from 'react-native';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';

const {width} = Dimensions.get('window');

const SideMenuOverlay = () => {
  const [visible, setVisible] = useState(false);
  const translateX = new Animated.Value(-width); // Offscreen by default

  const toggleMenu = () => {
    Animated.timing(translateX, {
      toValue: visible ? -width : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setVisible(!visible);
  };

  const tripleTap = Gesture.Tap()
    .numberOfTaps(3)
    .onEnd((_, success) => {
      if (success) toggleMenu();
    });

  return (
    <View style={{flex: 1}}>
      <GestureDetector gesture={tripleTap}>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 100,
            height: 100,
          }}
        />
      </GestureDetector>

      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: width * 0.75,
          backgroundColor: '#333',
          transform: [{translateX}],
          padding: 20,
        }}>
        <Text style={{color: '#fff', fontSize: 20, marginBottom: 20}}>
          Side Menu
        </Text>
        <TouchableOpacity onPress={toggleMenu}>
          <Text style={{color: '#fff'}}>Close</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default SideMenuOverlay;
