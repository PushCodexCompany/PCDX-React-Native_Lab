import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {WebView} from 'react-native-webview';
import RNFS from 'react-native-fs';
import axios from 'axios';

const IframeTest = () => {
  const iframeHtml = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;">
        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
          <iframe 
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
            src="https://www.youtube.com/embed/tgbNymZ7vqY" 
            frameborder="0" 
            allowfullscreen>
          </iframe>
        </div>
      </body>
    </html>
  `;

  const fileUrls = ['https://pushcodex.com/images/gallery_02.png'];

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

  const downloadFile = async url => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Storage permission is required to download files.',
      );
      return;
    }

    try {
      const fileName = url.split('/').pop();
      const path =
        Platform.OS === 'android' && Platform.Version < 29
          ? `${RNFS.DownloadDirectoryPath}/${fileName}` // Save to Download folder for older Android
          : `${RNFS.DownloadDirectoryPath}/${fileName}`; // For Android 10 and above

      const download = RNFS.downloadFile({
        fromUrl: url,
        toFile: path,
      });

      const result = await download.promise;

      if (result.statusCode === 200) {
        Alert.alert('Success', `File downloaded to: ${path}`);
      } else {
        Alert.alert('Error', 'Download failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred: ' + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Iframe Test Page</Text>
      <View style={styles.webviewContainer}>
        <WebView
          originWhitelist={['*']}
          source={{html: iframeHtml}}
          style={styles.webview}
        />
      </View>

      <Text style={styles.title}>File Download Example</Text>

      <View style={styles.buttonContainer}>
        {fileUrls.map((url, index) => (
          <Button
            key={index}
            title={`Download ${url.split('/').pop()}`}
            onPress={() => downloadFile(url)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    marginVertical: 10,
  },
  webviewContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fb1616',
    height: '100%',
  },
  webview: {
    flex: 1,
    height: '100%', // Set to full height
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default IframeTest;
