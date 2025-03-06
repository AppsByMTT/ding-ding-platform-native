import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRecoilValue } from 'recoil';
import { selectedGameAtom, userAtom } from '../utils/Atoms';
import { config } from '../utils/config';
import Loader from './Loader';
import GameLoader from './GameLoader';

const GameScreen = () => {
  const gameWebViewRef = useRef(null);
  const loaderWebViewRef = useRef(null);
  const userState = useRecoilValue(userAtom);
  const authToken = userState?.user?.token;

  const socketURL = config.server;


  // Loader is visible initially
  const [isGameReady, setIsGameReady] = useState(false);
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const selectedUrl = useRecoilValue(selectedGameAtom)

  useEffect(() => {
    const backAction = () => {
      return true;
    };

    // Add back button listener
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Cleanup the listener when component unmounts
    return () => backHandler.remove();
  }, []);

  return (
    <View style={[styles.container, { width, height }]}>
      {/* Loader WebView - Visible until the game is ready */}
      {!isGameReady && (
        <GameLoader />
      )}

      <WebView
        ref={gameWebViewRef}
        source={{ uri: selectedUrl }}
        injectedJavaScriptObject={{
          socketURL,
          token: authToken,
        }}
        javaScriptEnabled={true}
        onMessage={(event) => {
          console.log('Message from Unity:', event.nativeEvent.data);
          if (event.nativeEvent.data === 'onExit') {
            router.replace("/home");
          } else if (event.nativeEvent.data === 'OnEnter') {
            setIsGameReady(true);
          }
        }}
        style={[
          styles.game,
          !isGameReady
            ? { width: 0, height: 0, opacity: 0, position: 'absolute' } // Load in background
            : { width, height } // Show full screen when ready
        ]}
      />
    </View>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 20,
  },
  game: {
    flex: 1,
    zIndex: 1,
  }
});
