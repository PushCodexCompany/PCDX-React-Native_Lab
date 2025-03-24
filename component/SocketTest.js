import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';
import io from 'socket.io-client';

// const SOCKET_SERVER_URL = 'ws://dgs.push-signage.com';
const SOCKET_SERVER_URL = 'https://pushcodex.com/';
// const SOCKET_SERVER_URL = 'ws://10.0.2.2:8080';

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
  // const socket = React.useRef(null); // Store the WebSocket instance

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);
    console.log('socket', socket);
    socket.on('connect', () => {
      setMessage('Connected to Socket Server');
      console.log('Connected to socket server');
    });

    socket.on('disconnect', () => {
      setMessage('Disconnected from Socket Server');
      console.log('Disconnected from socket server');
    });

    socket.on('message', data => {
      setMessage(`Message: ${data}`);
      console.log('Message from server:', data);
    });

    // Clean up the connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // useEffect(() => {
  //   socket.current = new WebSocket(SOCKET_SERVER_URL);

  //   socket.current.onopen = () => {
  //     setMessage('Connected to WebSocket server');
  //     console.log('WebSocket connected');
  //   };

  //   socket.current.onmessage = e => {
  //     const data = e.data;
  //     setMessage(`Message from server: ${data}`);
  //     console.log('Message from server:', data);
  //   };

  //   socket.current.onerror = e => {
  //     setError('WebSocket Error: ' + e.message);
  //     console.error('WebSocket Error:', e.message);
  //   };

  //   socket.current.onclose = e => {
  //     setMessage('Disconnected from WebSocket server');
  //     console.log('WebSocket closed:', e);
  //   };

  //   return () => {
  //     if (socket.current) {
  //       socket.current.close();
  //     }
  //   };
  // }, []);

  // const sendMessage = () => {
  //   if (socket.current && socket.current.readyState === WebSocket.OPEN) {
  //     socket.current.send('Hello from React Native!');
  //   } else {
  //     console.log('WebSocket is not open');
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      {/* {error && <Text style={styles.errorText}>{error}</Text>}
      <Button title="Send Message" onPress={sendMessage} /> */}
    </View>
  );
};

export default SocketTest;
