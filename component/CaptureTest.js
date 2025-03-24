import React, {useRef} from 'react';
import {
  View,
  Text,
  Button,
  PermissionsAndroid,
  Alert,
  Platform,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';

const ScreenCapture = () => {
  const viewShotRef = useRef();

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 29) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'This app needs access to your storage to download files.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        Alert.alert('Error', 'Permission denied: ' + err.message);
        return false;
      }
    }
    return true;
  };

  const captureAndSave = async () => {
    const hasPermission = await requestStoragePermission();

    if (!hasPermission) {
      Alert.alert(
        'Permission denied',
        'Cannot save screenshot without storage permission.',
      );
      return;
    }

    try {
      const uri = await viewShotRef.current.capture();
      const fileName = `screenshot_${Date.now()}.png`;
      const destPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      await RNFS.moveFile(uri, destPath);
      Alert.alert('Success', `Screenshot saved to Downloads as ${fileName}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to capture and save screenshot');
    }
  };

  return (
    <ViewShot
      ref={viewShotRef}
      style={{flex: 1}}
      options={{format: 'png', quality: 1.0}}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
        <Text style={{marginBottom: 20}}>
          Capture Screen and Save to Downloads
        </Text>
        <Button title="Capture & Save" onPress={captureAndSave} />
      </View>
    </ViewShot>
  );
};

export default ScreenCapture;
