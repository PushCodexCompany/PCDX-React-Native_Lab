import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  Button,
  StatusBar,
} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker'; // Import the library
import {
  showNavigationBar,
  hideNavigationBar,
} from 'react-native-navigation-bar-color';
import {useFocusEffect} from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Slides with images, videos, and HLS streams
const slides = [
  {
    type: 'image',
    source: require('../assets/img1.png'),
    resizeMode: 'contain ',
  },
  {
    type: 'video',
    source: require('../assets/video1.mp4'),
    resizeMode: 'contain ',
  },
  {
    type: 'image',
    source: require('../assets/img2.jpg'),
    resizeMode: 'contain ',
  },
  {
    type: 'video',
    source: require('../assets/video2.mp4'),
    resizeMode: 'contain ',
  },
  {
    type: 'image',
    source: require('../assets/img3.jpg'),
    resizeMode: 'contain ',
  },
  {
    type: 'hls',
    source: {
      uri: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    },
    resizeMode: 'contain ',
  },
];

export default function VideoTest() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef(null);
  const videoRef1 = useRef(null); // Top video player reference
  const videoRef2 = useRef(null); // Bottom video player reference
  const [video1Ended, setVideo1Ended] = useState(false);
  const [video2Ended, setVideo2Ended] = useState(false);
  const [isPlaying1, setIsPlaying1] = useState(true); // Control for video 1
  const [isPlaying2, setIsPlaying2] = useState(true); // Control for video 2
  const [isLooping1, setIsLooping1] = useState(false); // Loop control for video 1
  const [isLooping2, setIsLooping2] = useState(false); // Loop control for video 2

  useFocusEffect(
    React.useCallback(() => {
      // Resume playing when the screen gains focus
      setIsPlaying1(true);
      setIsPlaying2(true);

      return () => {
        // Pause both videos when the screen loses focus
        setIsPlaying1(false);
        setIsPlaying2(false);
      };
    }, []),
  );

  useEffect(() => {
    // Unlock all orientations to enable auto-rotation
    Orientation.unlockAllOrientations();

    // Clean up the listener when the component is unmounted
    return () => {
      Orientation.unlockAllOrientations(); // Unlock orientations on cleanup
    };
  }, []);

  useEffect(() => {
    hideNavigationBar(true); // Hide the navigation bar
    return () => {
      showNavigationBar(true); // Optionally restore it when leaving the screen
    };
  }, []);

  useEffect(() => {
    // Hide both status bar and navigation bar (immersive full-screen mode)
    StatusBar.setHidden(true, 'fade');
    return () => {
      // Optionally, reset back to default when component unmounts
      StatusBar.setHidden(false);
    };
  }, []);

  // Function to change to the next slide
  const nextSlide = () => {
    setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
    setVideo1Ended(false);
    setVideo2Ended(false);
    setIsLooping1(false); // Reset loop state for top video
    setIsLooping2(false); // Reset loop state for bottom video
    setIsPlaying1(true); // Reset play state for top video
    setIsPlaying2(true); // Reset play state for bottom video
  };

  // Check if both videos have ended
  useEffect(() => {
    if (video1Ended || video2Ended) {
      if (!isLooping1 && !isLooping2) {
        nextSlide();
      }
    }
  }, [video1Ended, video2Ended, isLooping1, isLooping2]);

  // Handle images changing every 5 seconds
  useEffect(() => {
    if (
      slides[currentSlide]?.type === 'image' &&
      slides[(currentSlide + 1) % slides.length]?.type === 'image'
    ) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }

    return () => clearInterval(intervalRef.current);
  }, [currentSlide]);

  // Handle video end events
  const handleVideo1End = () => {
    if (isLooping1) {
      setVideo1Ended(false);
    } else {
      setVideo1Ended(true);
    }
  };

  const handleVideo2End = () => {
    if (isLooping2) {
      setVideo2Ended(false);
    } else {
      setVideo2Ended(true);
    }
  };

  // Video control functions
  const togglePlayPause1 = () => {
    setIsPlaying1(prev => !prev);
  };

  const togglePlayPause2 = () => {
    setIsPlaying2(prev => !prev);
  };

  const resetVideo1 = () => {
    videoRef1.current?.seek(0);
    setIsPlaying1(true); // Set the video to play immediately
  };

  const resetVideo2 = () => {
    videoRef2.current?.seek(0);
    setIsPlaying2(true); // Set the video to play immediately
  };

  const playAtPosition1 = seconds => {
    videoRef1.current?.seek(seconds);
    setIsPlaying1(true);
  };

  const playAtPosition2 = seconds => {
    videoRef2.current?.seek(seconds);
    setIsPlaying2(true);
  };

  const toggleLoop1 = () => {
    setIsLooping1(prev => !prev);
  };

  const toggleLoop2 = () => {
    setIsLooping2(prev => !prev);
  };

  return (
    <View style={styles.container}>
      {/* Top Half */}
      <View style={styles.mediaContainer}>
        {slides[currentSlide]?.type === 'image' ? (
          <Image
            source={slides[currentSlide]?.source}
            style={styles.image}
            resizeMode={slides[currentSlide]?.resizeMode}
          />
        ) : (
          <Video
            ref={videoRef1}
            style={styles.video}
            source={slides[currentSlide]?.source}
            resizeMode={slides[currentSlide]?.resizeMode}
            onEnd={handleVideo1End}
            repeat={isLooping1} // Looping for video 1
            muted={false}
            volume={1.0}
            paused={!isPlaying1}
          />
        )}
        {slides[currentSlide]?.type === 'video' ||
        slides[currentSlide]?.type === 'hls' ? (
          <View style={styles.controls}>
            <Button
              title={isPlaying2 ? 'Pause' : 'Play'}
              onPress={togglePlayPause1}
            />
            <Button title="Reset" onPress={resetVideo1} />
            <Button title="Seek 8s" onPress={() => playAtPosition1(8)} />
            <Button
              title={isLooping1 ? 'Loop On' : 'Loop Off'}
              color={isLooping1 ? 'green' : 'gray'}
              onPress={toggleLoop1}
            />
          </View>
        ) : (
          <></>
        )}
      </View>

      {/* Bottom Half */}
      <View style={styles.mediaContainer}>
        {slides[(currentSlide + 1) % slides.length]?.type === 'image' ? (
          <Image
            source={slides[(currentSlide + 1) % slides.length]?.source}
            style={styles.image}
            resizeMode={slides[(currentSlide + 1) % slides.length]?.resizeMode}
          />
        ) : (
          <Video
            ref={videoRef2}
            style={styles.video}
            source={slides[(currentSlide + 1) % slides.length]?.source}
            resizeMode={slides[(currentSlide + 1) % slides.length]?.resizeMode}
            onEnd={handleVideo2End}
            repeat={isLooping2} // Looping for video 2
            muted={false}
            volume={1.0}
            paused={!isPlaying2}
          />
        )}
        {slides[(currentSlide + 1) % slides.length]?.type === 'video' ||
        slides[(currentSlide + 1) % slides.length]?.type === 'hls' ? (
          <View style={styles.controls}>
            <Button
              title={isPlaying2 ? 'Pause' : 'Play'}
              onPress={togglePlayPause2}
            />
            <Button title="Reset" onPress={resetVideo2} />
            <Button title="Seek 8s" onPress={() => playAtPosition2(8)} />
            <Button
              title={isLooping2 ? 'Loop On' : 'Loop Off'}
              color={isLooping2 ? 'green' : 'gray'}
              onPress={toggleLoop2}
            />
          </View>
        ) : (
          <></>
        )}
      </View>

      <Text style={styles.text}>
        Slide {currentSlide + 1} of {slides.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  mediaContainer: {
    width: windowWidth,
    height: windowHeight / 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  text: {
    position: 'absolute',
    bottom: 20,
    color: '#fff',
    fontSize: 20,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
  },
});
