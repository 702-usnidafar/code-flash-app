import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';

const AddFlashcardScreen = () => {
  const router = useRouter();
  const { courseName } = useLocalSearchParams();
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const saveFlashcard = async () => {
    if (!front.trim() || !back.trim()) {
      Alert.alert('Error', 'Isi depan dan belakang flashcard harus lengkap');
      return;
    }

    try {
      const data = await AsyncStorage.getItem(`flashcards_${courseName}`);
      const flashcards = data ? JSON.parse(data) : [];
      flashcards.push({ front: front.trim(), back: back.trim() });
      await AsyncStorage.setItem(`flashcards_${courseName}`, JSON.stringify(flashcards));

      // Reset input setelah simpan
      setFront('');
      setBack('');

      // Navigasi ke halaman CourseDetailScreen
      router.replace({
        pathname: `/stack/CourseDetailScreen`,
        params: { courseName },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tambah Flashcard</Text>

      <TextInput
        placeholder="Judul Flashcard (depan)"
        placeholderTextColor="#95093F"
        value={front}
        onChangeText={setFront}
        style={styles.input}
      />

      <TextInput
        placeholder="Keterangan (belakang)"
        placeholderTextColor="#95093F"
        value={back}
        onChangeText={setBack}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={saveFlashcard}>
        <Text style={styles.buttonText}>Simpan Flashcard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // putih
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#95093F',
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FEEDFA',
    color: '#95093F',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#10B981', // hijau
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddFlashcardScreen;
