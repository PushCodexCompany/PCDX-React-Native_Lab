import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import RNFS from 'react-native-fs';
import axios from 'axios';

const ApiTest = () => {
  const [downloading, setDownloading] = useState(false);

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

  const getFormattedDate = () => {
    const now = new Date();
    return `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
  };

  const folderPath = `${
    RNFS.DownloadDirectoryPath
  }/media_${getFormattedDate()}`;

  const fetchAndDownloadFiles = async () => {
    setDownloading(true);

    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission denied',
        'Cannot save screenshot without storage permission.',
      );
      return;
    }

    try {
      // const response = await axios.get(
      //   'https://dgs.push-signage.com/api/getassets.php?account=auUpa8dN4g&brand=MUd7J&branch=M6s1X&screen=xGnMoInjJJ',
      // );

      const response = await axios.get(
        'https://pushcodex.com/lab/getassets.php',
      );

      const assets = response.data; // Axios automatically parses JSON
      const folderName = `media_${getFormattedDate()}`;
      const folderPath = `${RNFS.DownloadDirectoryPath}/${folderName}`;
      // Ensure the folder exists
      await RNFS.mkdir(folderPath);
      for (let i = 0; i < assets.length; i++) {
        const {key, filesize} = assets[i];
        await downloadAndVerifyFile(key, filesize, folderPath, i + 1);
      }
      Alert.alert('Download Complete', `Files saved in ${folderName}`);
    } catch (error) {
      console.error('Error fetching assets:', error);
      Alert.alert('Error', 'Failed to download assets.');
    } finally {
      setDownloading(false);
    }
  };

  const downloadAndVerifyFile = async (
    fileUrl,
    expectedSize,
    folderPath,
    index,
  ) => {
    try {
      const fileExtension = fileUrl.split('.').pop();
      const fileName = `${index}.${fileExtension}`;
      const localFilePath = `${folderPath}/${fileName}`;

      const downloadResult = await RNFS.downloadFile({
        fromUrl: fileUrl,
        toFile: localFilePath,
      }).promise;

      const fileStats = await RNFS.stat(localFilePath);
      if (parseInt(fileStats.size) === expectedSize) {
        console.log(`Downloaded & Verified: ${fileName}`);
      } else {
        console.log(
          `Size Mismatch: ${fileName} (Expected: ${expectedSize}, Got: ${fileStats.size})`,
        );
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const deleteFirstFile = async () => {
    try {
      // Read files in the folder
      const files = await RNFS.readDir(folderPath);

      if (files.length === 0) {
        Alert.alert('No Files', 'The folder is empty.');
        return;
      }

      // Get the first file (index 0)
      const firstFile = files[0].path;

      // Delete the file
      await RNFS.unlink(firstFile);

      Alert.alert('Deleted', `File ${files[0].name} has been deleted.`);
      console.log(`Deleted: ${firstFile}`);
    } catch (error) {
      console.error('Error deleting file:', error);
      Alert.alert('Error', 'Failed to delete the file.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Download Assets</Text>

      <View style={styles.buttonContainer}>
        <Button
          title={downloading ? 'Downloading...' : 'Start Download'}
          onPress={fetchAndDownloadFiles}
          disabled={downloading}
          color="#007bff"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Delete First File"
          onPress={deleteFirstFile}
          color="#dc3545"
        />
      </View>
    </View>
  );
};

export default ApiTest;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa', // Light background
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 15,
  },
});
