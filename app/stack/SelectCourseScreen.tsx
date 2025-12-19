import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function SelectCourseScreen() {
  const router = useRouter();
  const [courses, setCourses] = useState<string[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const courseKeys = keys
        .filter((key) => key.startsWith('flashcards_'))
        .map((key) => key.replace('flashcards_', ''));
      setCourses(courseKeys);
    };
    fetchCourses();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pilih Course</Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: '/stack/CourseDetailScreen', params: { courseName: item } })}
          >
            <Text style={styles.cardText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.newCourseButton}
        onPress={() => router.push('/stack/CreateCourseScreen')}
      >
        <Text style={styles.newCourseText}>+ Buat Course Baru</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: {
    fontSize: 24,
    color: '#95093F',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FEEDFA',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardText: {
    color: '#95093F',
    fontSize: 16,
  },
  newCourseButton: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#10B981',
    borderRadius: 10,
    alignItems: 'center',
  },
  newCourseText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
