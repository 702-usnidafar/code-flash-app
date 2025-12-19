import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const Dashboard = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.push('/stack/CreateCourseScreen')}
      >
        <Text style={styles.menuText}>Buat Flashcard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.push('/stack/LibraryScreen')}
      >
        <Text style={styles.menuText}>Perpustakaan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE580',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  menuButton: {
    backgroundColor: '#FFBC42',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 18,
    color: '#fff',
  },
});
