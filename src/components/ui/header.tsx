/* eslint-disable max-lines-per-function */

import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { useAuth } from '@/lib';
import { getCredits, getName, setCredits } from '@/lib/auth/utils';
import { useSocket } from '@/lib/socket/socket';

const Header = React.memo(() => {
  const { width } = useWindowDimensions();
  const responsiveWidth = (percentage: number) => (percentage / 100) * width;

  const { data, disconnect } = useSocket();

  const router = useRouter();
  const name = getName();
  const signOut = useAuth.use.signOut();

  // Fetch initial credits from storage (for offline mode)
  useEffect(() => {
    const fetchInitialCredits = async () => {
      try {
        const storedCredits = getCredits();
        if (storedCredits) {
          setCredits(storedCredits);
        }
      } catch (error) {
        console.error('Failed to load initial credits:', error);
      }
    };

    fetchInitialCredits();
  }, []);

  const handleLogout = () => {
    disconnect();
    signOut();
    router.replace('/login');
  };

  return (
    <ImageBackground
      source={require('../../../assets/header-bg.png')}
      style={[styles.container, { height: responsiveWidth(7) }]}
      resizeMode="cover"
    >
      {/* User Info */}
      <View style={styles.userInfo}>
        <Image
          source={require('../../../assets/profile.png')}
          style={{
            width: responsiveWidth(5),
            height: responsiveWidth(5),
            borderRadius: responsiveWidth(5),
            marginRight: responsiveWidth(1),
            marginLeft: responsiveWidth(2),
          }}
        />
        <View>
          <Text style={[styles.userName, { fontSize: responsiveWidth(1.5) }]}>
            {name}
          </Text>
          <Text style={[styles.coin, { fontSize: responsiveWidth(1.5) }]}>
            {data?.payload !== undefined
              ? data.payload?.credits.toFixed(2)
              : 'Loading...'}
          </Text>
        </View>
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/logo.gif')}
          style={{
            width: responsiveWidth(22),
            height: responsiveWidth(20),
            marginTop: responsiveWidth(3),
            zIndex: 99,
            resizeMode: 'contain',
          }}
        />
      </View>

      {/* Icons */}
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={handleLogout}>
          <Image
            source={require('../../../assets/h-icon1.webp')}
            style={{
              width: responsiveWidth(3.5),
              height: responsiveWidth(4),
              marginHorizontal: responsiveWidth(1.1),
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(app)/settings')}>
          {/* ⬆️ Navigate directly to the Settings tab */}

          <Image
            source={require('../../../assets/h-icon3.png')}
            style={{
              width: responsiveWidth(3.5),
              height: responsiveWidth(4),
              marginHorizontal: responsiveWidth(1.1),
              marginRight: responsiveWidth(2),
            }}
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  coin: {
    color: '#FFE650',
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  logoContainer: {
    paddingTop: 10,
  },
});

export default Header;
