// app/_layout.tsx
import { Stack } from 'expo-router';
import { SafeAreaView, StyleSheet, Platform, StatusBar } from 'react-native';
import { CourseProvider } from '../context/CourseContext';

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <CourseProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </CourseProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#FFFDF5', // Ganti warna sesuai selera
  },
});
