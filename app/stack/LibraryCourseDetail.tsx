import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';

type Flashcard = {
  front: string;
  back: string;
};

const LibraryCourseDetailScreen = () => {
  const { courseName } = useLocalSearchParams();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const loadFlashcards = async () => {
    try {
      const flashcardsJson = await AsyncStorage.getItem(`flashcards_${courseName}`);
      const data: Flashcard[] = flashcardsJson ? JSON.parse(flashcardsJson) : [];
      setFlashcards(data);
    } catch (error) {
      console.error('Error loading flashcards:', error);
    }
  };

  useEffect(() => {
    loadFlashcards();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flashcard Course: {courseName}</Text>

      {flashcards.length === 0 ? (
        <Text style={styles.emptyText}>Belum ada flashcard</Text>
      ) : (
        <FlatList
          data={flashcards}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.flashcardItem}>
              <Text style={styles.flashcardFront}>{item.front}</Text>
              <Text style={styles.flashcardBack}>{item.back}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF5',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
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
  },
});

export default LibraryCourseDetailScreen;
