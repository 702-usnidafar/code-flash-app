import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const CourseListScreen = () => {
  const [courses, setCourses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await AsyncStorage.getItem('courses');
        setCourses(data ? JSON.parse(data) : []);
      } catch (e) {
        console.error(e);
      }
    };
    loadCourses();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Course</Text>

      {courses.length === 0 ? (
        <Button
          title="Buat Course Baru"
          onPress={() => router.push('/stack/CreateCourseScreen')}
        />
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.courseItem}
              onPress={() => router.push(`/stack/CourseDetailScreen?courseName=${encodeURIComponent(item)}`)}
            >
              <Text style={styles.courseText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  courseItem: {
    padding: 16,
    backgroundColor: '#cce5ff',
    marginBottom: 10,
    borderRadius: 8,
  },
  courseText: { fontSize: 18 },
});

export default CourseListScreen;
