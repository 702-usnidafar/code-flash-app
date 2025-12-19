import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function CreateCourseScreen() {
  const [courseName, setCourseName] = useState('');
  const router = useRouter();

  const handleAddCourse = async () => {
    const trimmedName = courseName.trim();
    if (!trimmedName) {
      Alert.alert('Nama course tidak boleh kosong');
      return;
    }

    try {
      const json = await AsyncStorage.getItem('courses');
      const courses = json ? JSON.parse(json) : [];

      if (courses.includes(trimmedName)) {
        Alert.alert('Course dengan nama ini sudah ada');
        return;
      }

      const newCourses = [...courses, trimmedName];
      await AsyncStorage.setItem('courses', JSON.stringify(newCourses));
      Alert.alert('Berhasil menambahkan course');
      router.back();
    } catch (e) {
      Alert.alert('Gagal menyimpan course');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text style={styles.header}>Tambah Course Baru</Text>
      <TextInput
        placeholder="Nama course"
        value={courseName}
        onChangeText={setCourseName}
        style={styles.input}
        autoFocus
      />
      <TouchableOpacity style={styles.button} onPress={handleAddCourse}>
        <Text style={styles.buttonText}>Simpan</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={() => router.back()}
      >
        <Text style={[styles.buttonText, { color: '#555' }]}>Batal</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', justifyContent: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
