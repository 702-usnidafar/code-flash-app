import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        router.replace('/(tabs)/Home'); // arahkan ke tab Home
      } else {
        router.replace('/stack/LoginScreen'); // arahkan ke LoginScreen
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim, router]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/logo.png')}
        style={[styles.logo, { opacity: fadeAnim }]}
      />
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        Code Flash
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEEDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#95093F',
  },
});
