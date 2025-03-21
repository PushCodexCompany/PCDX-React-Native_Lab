import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';
// import io from 'socket.io-client';

// const SOCKET_SERVER_URL = 'ws://dgs.push-signage.com';
const SOCKET_SERVER_URL = 'ws://10.0.2.2:8080';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  text: {
    fontSize: 18,
    color: 'black',
    margin: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

const SocketTest = () => {
  const [message, setMessage] = useState('Connecting...');
  const [error, setError] = useState(null);
  const socket = React.useRef(null); // Store the WebSocket instance

  useEffect(() => {
    // Create a WebSocket connection
    socket.current = new WebSocket(SOCKET_SERVER_URL);

    // Event listener for WebSocket connection established
    socket.current.onopen = () => {
      setMessage('Connected to WebSocket server');
      console.log('WebSocket connected');
    };

    // Event listener for incoming messages
    socket.current.onmessage = e => {
      const data = e.data;
      setMessage(`Message from server: ${data}`);
      console.log('Message from server:', data);
    };

    // Event listener for WebSocket errors
    socket.current.onerror = e => {
      setError('WebSocket Error: ' + e.message);
      console.error('WebSocket Error:', e.message);
    };

    // Event listener for WebSocket closure
    socket.current.onclose = e => {
      setMessage('Disconnected from WebSocket server');
      console.log('WebSocket closed:', e);
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send('Hello from React Native!');
    } else {
      console.log('WebSocket is not open');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Button title="Send Message" onPress={sendMessage} />
    </View>
  );
};

export default SocketTest;
