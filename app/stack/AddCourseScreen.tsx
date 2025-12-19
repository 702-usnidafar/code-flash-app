import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const AddCourseScreen = () => {
  const [courseName, setCourseName] = useState('');
  const router = useRouter();

  const saveCourse = async () => {
    if (!courseName.trim()) {
      Alert.alert('Error', 'Nama course tidak boleh kosong');
      return;
    }

    try {
      const data = await AsyncStorage.getItem('courses');
      const courses = data ? JSON.parse(data) : [];
      if (courses.includes(courseName.trim())) {
        Alert.alert('Error', 'Course sudah ada');
        return;
      }
      courses.push(courseName.trim());
      await AsyncStorage.setItem('courses', JSON.stringify(courses));
      router.push('/stack/CourseListScreen'); // kembali ke daftar course
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nama Course"
        value={courseName}
        onChangeText={setCourseName}
        style={styles.input}
      />
      <Button title="Simpan Course" onPress={saveCourse} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
});
