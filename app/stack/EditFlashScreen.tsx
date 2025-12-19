import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditFlashScreen() {
  const { courseName, index, front, back } = useLocalSearchParams<{
    courseName: string;
    index: string;
    front: string;
    back: string;
  }>();

  const [newFront, setNewFront] = useState(front);
  const [newBack, setNewBack] = useState(back);
  const router = useRouter();

  const handleSave = async () => {
    try {
      const data = await AsyncStorage.getItem(`flashcards_${courseName}`);
      if (!data) return;

      const flashcards = JSON.parse(data);
      flashcards[parseInt(index)] = { front: newFront, back: newBack };
      await AsyncStorage.setItem(`flashcards_${courseName}`, JSON.stringify(flashcards));
      router.back();
    } catch (err) {
      Alert.alert('Gagal menyimpan perubahan');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Edit Flashcard</Text>

      <TextInput
        style={styles.input}
        value={newFront}
        onChangeText={setNewFront}
        placeholder="Isi depan"
      />
      <TextInput
        style={styles.input}
        value={newBack}
        onChangeText={setNewBack}
        placeholder="Isi belakang"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Simpan Perubahan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#FFFDF5' },
  label: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16,
  },
  button: {
    backgroundColor: '#10B981', padding: 16, borderRadius: 10, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
