import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function EditCourseScreen() {
  const router = useRouter();
  const { courseName } = useLocalSearchParams<{ courseName: string }>();
  const [newCourseName, setNewCourseName] = useState('');

  useEffect(() => {
    if (typeof courseName === 'string') {
      setNewCourseName(courseName);
    }
  }, [courseName]);

  const handleSave = async () => {
    if (!newCourseName.trim()) {
      Alert.alert('Nama course tidak boleh kosong');
      return;
    }

    try {
      const coursesJson = await AsyncStorage.getItem('courses');
      const courses: string[] = coursesJson ? JSON.parse(coursesJson) : [];

      if (typeof courseName !== 'string') return;

      if (newCourseName !== courseName && courses.includes(newCourseName)) {
        Alert.alert('Nama course sudah digunakan');
        return;
      }

      const updatedCourses = courses.map((c) =>
        c === courseName ? newCourseName : c
      );
      await AsyncStorage.setItem('courses', JSON.stringify(updatedCourses));

      if (newCourseName !== courseName) {
        const oldFlashcards = await AsyncStorage.getItem(`flashcards_${courseName}`);
        if (oldFlashcards) {
          await AsyncStorage.setItem(`flashcards_${newCourseName}`, oldFlashcards);
          await AsyncStorage.removeItem(`flashcards_${courseName}`);
        }
      }

      Alert.alert('Berhasil mengubah nama course');
      router.back();
    } catch (error) {
      console.error('Error updating course name:', error);
      Alert.alert('Terjadi kesalahan saat menyimpan');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Course</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan nama course baru"
        value={newCourseName}
        onChangeText={setNewCourseName}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF5',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFBC42',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#FFBC42',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
