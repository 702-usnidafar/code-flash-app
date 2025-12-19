import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Flashcard = {
  front: string;
  back: string;
  timestamp: number;
  courseName: string;
};

export default function LibraryScreen() {
  const [courses, setCourses] = useState<string[]>([]);
  const [allFlashcards, setAllFlashcards] = useState<Flashcard[]>([]);
  const router = useRouter();

  const loadData = async () => {
    try {
      const coursesJson = await AsyncStorage.getItem('courses');
      const coursesList: string[] = coursesJson ? JSON.parse(coursesJson) : [];
      setCourses(coursesList);

      let flashcardsAll: Flashcard[] = [];
      for (const courseName of coursesList) {
        const flashcardsJson = await AsyncStorage.getItem(`flashcards_${courseName}`);
        const flashcards: Omit<Flashcard, 'courseName'>[] = flashcardsJson ? JSON.parse(flashcardsJson) : [];
        flashcardsAll = flashcardsAll.concat(
          flashcards.map((f) => ({ ...f, courseName }))
        );
      }

      flashcardsAll.sort((a, b) => b.timestamp - a.timestamp);
      setAllFlashcards(flashcardsAll);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleDeleteCourse = async (courseName: string) => {
    Alert.alert(
      'Hapus Course',
      `Apakah kamu yakin ingin menghapus course "${courseName}"? Semua flashcard akan ikut terhapus.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              const newCourses = courses.filter((c) => c !== courseName);
              await AsyncStorage.setItem('courses', JSON.stringify(newCourses));
              await AsyncStorage.removeItem(`flashcards_${courseName}`);
              loadData();
            } catch (error) {
              console.error('Error deleting course:', error);
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perpustakaan</Text>

      <Text style={styles.sectionTitle}>Course</Text>
      {courses.length === 0 ? (
        <Text style={styles.emptyText}>Belum ada course</Text>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.courseItem}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() =>
                  router.push({
                    pathname: '/stack/LibraryCourseDetail',
                    params: { courseName: item },
                  })
                }
              >
                <Text style={styles.courseText}>{item}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/stack/EditCourseScreen',
                    params: { courseName: item },
                  })
                }
              >
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteCourse(item)}>
                <Text style={styles.deleteButton}>Hapus</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <Text style={styles.sectionTitle}>Semua Flashcard</Text>
      {allFlashcards.length === 0 ? (
        <Text style={styles.emptyText}>Belum ada flashcard</Text>
      ) : (
        <FlatList
          data={allFlashcards}
          keyExtractor={(item, index) => `${item.courseName}_${index}`}
          renderItem={({ item }) => (
            <View style={styles.flashcardItem}>
              <Text style={styles.flashcardFront}>{item.front}</Text>
              <Text style={styles.flashcardBack}>{item.back}</Text>
              <Text style={styles.flashcardCourse}>Course: {item.courseName}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF5',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFBC42',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  courseText: {
    color: '#fff',
    fontSize: 18,
  },
  editButton: {
    color: '#004AAD',
    marginLeft: 10,
    fontWeight: '600',
  },
  deleteButton: {
    color: '#C70039',
    marginLeft: 10,
    fontWeight: '600',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 12,
  },
  flashcardItem: {
    backgroundColor: '#FFE580',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  flashcardFront: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  flashcardBack: {
    fontSize: 14,
    marginBottom: 6,
  },
  flashcardCourse: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#333',
  },
});
