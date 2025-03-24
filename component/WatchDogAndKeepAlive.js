import React, {useEffect, useState} from 'react';
import {View, Text, Button, Alert, PermissionsAndroid} from 'react-native';
import RNFS from 'react-native-fs';
import KeepAwake from 'react-native-keep-awake'; // Import KeepAwake
import Restart from 'react-native-restart'; // Import Restart from the package
const LOG_FILE_PATH = RNFS.DownloadDirectoryPath + '/error_log.txt';

const logErrorToFile = async message => {
  try {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    await RNFS.appendFile(LOG_FILE_PATH, logMessage, 'utf8');
    console.log('Error logged:', message);
  } catch (err) {
    console.error('Failed to write to log file:', err);
  }
};

const WatchdogKeepalive = () => {
  useEffect(() => {
    requestStoragePermission();
    const interval = setInterval(() => {
      watchdog();
      keepalive();
    }, 2000); // Runs every 2 seconds

    return () => {
      clearInterval(interval);
      KeepAwake.deactivate();
    };
  }, []);

  const appStartTime = new Date();

  const [watchdogTime, setWatchdogTime] = useState('00:00:00');

  const watchdog = () => {
    try {
      const currentTime = new Date();
      const elapsedTime = Math.floor((currentTime - appStartTime) / 1000); // Seconds since app start
      const formattedTime = new Date(elapsedTime * 1000)
        .toISOString()
        .substr(11, 8); // HH:mm:ss format
      setWatchdogTime(formattedTime);
      console.log(
        `Watchdog is monitoring the app... (Time since open: ${formattedTime})`,
      );
    } catch (error) {
      logErrorToFile(`Watchdog error: ${error.message}`);
    }
  };

  const keepalive = () => {
    try {
      // Simulate keepalive logic (e.g., send heartbeat)
      KeepAwake.activate();
      console.log('Keepalive ping sent');
    } catch (error) {
      logErrorToFile(`Keepalive error: ${error.message}`);
    }
  };

  const simulateError = () => {
    try {
      // Force an uncaught exception that crashes the app
      setTimeout(() => {
        throw new Error('Simulated Fatal Error for Testing'); // This will cause a crash
      }, 0); // Set the error to happen immediately
    } catch (error) {
      logErrorToFile(`Simulated error: ${error.message}`);
      Alert.alert('Error', 'A simulated error has occurred');
      Restart.restart(); // Restart the app after the crash
    }
  };

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your storage to save log files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 20, marginBottom: 20}}>
        Watchdog and Keepalive Monitor
      </Text>
      <Text style={{fontSize: 20, marginBottom: 10}}>
        Watchdog Time: {watchdogTime}
      </Text>

      <Button title="Simulate Error" onPress={simulateError} />
    </View>
  );
};

export default WatchdogKeepalive;
