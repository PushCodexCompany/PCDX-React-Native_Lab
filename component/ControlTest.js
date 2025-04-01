import React from 'react';
import {View, Button} from 'react-native';
import RNRestart from 'react-native-restart';
import {NativeModules, Alert} from 'react-native';

const {DeviceControl} = NativeModules; // Custom native module for shutdown/restart

const ControlTest = () => {
  const shutdownDevice = () => {
    console.log('DeviceControl Shutdown', DeviceControl);
    if (DeviceControl?.shutdown) {
      DeviceControl.shutdown();
    } else {
      Alert.alert('Error', 'Shutdown function not available');
    }
  };

  const restartDevice = () => {
    console.log('DeviceControl restart', DeviceControl);
    if (DeviceControl?.restart) {
      DeviceControl.restart();
    } else {
      Alert.alert('Error', 'Restart function not available');
    }
  };

  const restartApp = () => {
    console.log('restart');
    RNRestart.Restart(); // Restart application
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button title="Shutdown Device" onPress={shutdownDevice} color="red" />
      <Button title="Restart Device" onPress={restartDevice} color="orange" />
      <Button title="Restart Application" onPress={restartApp} color="blue" />
    </View>
  );
};

export default ControlTest;
