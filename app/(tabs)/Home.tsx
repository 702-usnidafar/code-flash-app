import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Flashcard = {
  front: string;
  back: string;
};

type FlashcardWithCourse = {
  front: string;
  back: string;
  courseName: string;
};

export default function Home() {
  const router = useRouter();
  const [flashcards, setFlashcards] = useState<FlashcardWithCourse[]>([]);
  const [learnedFlashcards, setLearnedFlashcards] = useState<FlashcardWithCourse[]>([]);

  const loadFlashcards = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const flashcardKeys = keys.filter(key => key.startsWith('flashcards_'));
      let allFlashcards: FlashcardWithCourse[] = [];

      for (const key of flashcardKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          const parsed: Flashcard[] = JSON.parse(data);
          const courseName = key.replace('flashcards_', '');
          const flashcardsWithCourse = parsed.map(f => ({ ...f, courseName }));
          allFlashcards = allFlashcards.concat(flashcardsWithCourse);
        }
      }

      setFlashcards(allFlashcards);

      // Load learned flashcards
      const learnedKeys = keys.filter(key => key.startsWith('learned_'));
      let allLearned: FlashcardWithCourse[] = [];
      for (const key of learnedKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          const parsed: Flashcard[] = JSON.parse(data);
          const courseName = key.replace('learned_', '');
          const learnedWithCourse = parsed.map(f => ({ ...f, courseName }));
          allLearned = allLearned.concat(learnedWithCourse);
        }
      }
      setLearnedFlashcards(allLearned);
    } catch (error) {
      console.error('Error loading flashcards:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFlashcards();
    }, [])
  );

  const progress = flashcards.length > 0
    ? Math.floor((learnedFlashcards.length / flashcards.length) * 100)
    : 0;

  const recentFlashcards = flashcards.slice(-3).reverse();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Code Flash</Text>

      {/* Flashcards Available */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Flashcards Available</Text>
        <Text style={styles.cardNumber}>{flashcards.length}</Text>
      </View>

      {/* Your Progress */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Progress</Text>
        <Text style={styles.cardNumber}>{progress}%</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/stack/SelectCourseScreen')}
      >
        <Text style={styles.buttonText}>Add New Flashcard</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { marginTop: 32 }]}>Recent Flashcards</Text>
      <View style={styles.flashcardList}>
        {recentFlashcards.length === 0 ? (
          <Text style={{ color: '#666', fontStyle: 'italic', marginTop: 10 }}>No flashcards yet</Text>
        ) : (
          recentFlashcards.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.flashcard}
              onPress={() =>
                router.push({
                  pathname: '../stack/CourseDetailScreen',
                  params: {
                    courseName: item.courseName,
                    singleFlashcard: JSON.stringify({
                      front: item.front,
                      back: item.back,
                    }),
                  },
                })
              }
            >
              <Text style={styles.flashcardText}>{item.front}</Text>
              <Text style={{ fontSize: 12, color: '#555' }}>({item.courseName})</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  title: { color: '#95093F', fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: '#95093F', borderRadius: 15, padding: 20, marginBottom: 16 },
  cardTitle: { color: 'white', fontSize: 16 },
  cardNumber: { color: 'white', fontSize: 32, fontWeight: 'bold', marginTop: 8 },
  button: { backgroundColor: '#10B981', paddingVertical: 14, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  flashcardList: { marginTop: 10 },
  flashcard: { backgroundColor: '#FEEDFA', padding: 15, borderRadius: 8, marginBottom: 10 },
  flashcardText: { fontSize: 16, color: '#95093F' },
});
