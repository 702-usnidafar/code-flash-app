import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Flashcard = {
  front: string;
  back: string;
};

const { width, height } = Dimensions.get('window');

export default function StudyModeScreen() {
  const { courseName } = useLocalSearchParams<{ courseName: string }>();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [learnedCards, setLearnedCards] = useState<Flashcard[]>([]);
  const router = useRouter();

  const animatedValue = useRef(new Animated.Value(0)).current;
  const [value, setValue] = useState(0);

  animatedValue.addListener(({ value }) => {
    setValue(value);
  });

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const flipToFront = () => {
    Animated.spring(animatedValue, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
      tension: 10,
    }).start(() => setShowBack(false));
  };

  const flipToBack = () => {
    Animated.spring(animatedValue, {
      toValue: 180,
      useNativeDriver: true,
      friction: 8,
      tension: 10,
    }).start(() => setShowBack(true));
  };

  const handleFlip = () => {
    if (value >= 90) {
      flipToFront();
    } else {
      flipToBack();
    }
  };

  useEffect(() => {
    const loadFlashcards = async () => {
      try {
        const data = await AsyncStorage.getItem(`flashcards_${courseName}`);
        if (data) {
          setFlashcards(JSON.parse(data));
          setCurrentIndex(0);
          setShowBack(false);
          flipToFront();
        }

        const learnedData = await AsyncStorage.getItem(`learned_${courseName}`);
        if (learnedData) {
          setLearnedCards(JSON.parse(learnedData));
        }
      } catch (e) {
        console.error('Gagal mengambil flashcards:', e);
      }
    };
    loadFlashcards();
  }, [courseName]);

  const isCurrentCardLearned = () => {
    const currentCard = flashcards[currentIndex];
    return learnedCards.some(c => c.front === currentCard.front && c.back === currentCard.back);
  };

  const toggleLearned = async () => {
    const currentCard = flashcards[currentIndex];
    if (!currentCard) return;

    const isLearned = isCurrentCardLearned();

    let updatedLearned;
    if (isLearned) {
      updatedLearned = learnedCards.filter(
        c => !(c.front === currentCard.front && c.back === currentCard.back)
      );
    } else {
      updatedLearned = [...learnedCards, currentCard];
    }

    setLearnedCards(updatedLearned);
    await AsyncStorage.setItem(`learned_${courseName}`, JSON.stringify(updatedLearned));
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowBack(false);
      flipToFront();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowBack(false);
      flipToFront();
    }
  };

  const currentCard = flashcards[currentIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{courseName} - Mode Belajar</Text>

      {currentCard ? (
        <>
          <TouchableOpacity onPress={handleFlip} activeOpacity={0.9}>
            <View style={styles.cardContainer}>
              <Animated.View
                style={[
                  styles.card,
                  {
                    transform: [{ rotateY: frontInterpolate }],
                    zIndex: showBack ? 0 : 1,
                    position: showBack ? 'absolute' : 'relative',
                  },
                ]}
              >
                <Text style={styles.cardText}>{currentCard.front}</Text>
              </Animated.View>

              <Animated.View
                style={[
                  styles.card,
                  styles.cardBack,
                  {
                    transform: [{ rotateY: backInterpolate }],
                    zIndex: showBack ? 1 : 0,
                    position: showBack ? 'relative' : 'absolute',
                  },
                ]}
              >
                <Text style={styles.cardText}>{currentCard.back}</Text>
              </Animated.View>
            </View>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Switch
              value={isCurrentCardLearned()}
              onValueChange={toggleLearned}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isCurrentCardLearned() ? '#f5dd4b' : '#f4f3f4'}
            />
            <Text style={{ marginLeft: 8 }}>Sudah dihafal</Text>
          </View>

          <View style={styles.navigation}>
            <TouchableOpacity
              onPress={handlePrev}
              style={[styles.navButton, currentIndex === 0 && styles.disabled]}
              disabled={currentIndex === 0}
            >
              <Text style={styles.navText}>← Sebelumnya</Text>
            </TouchableOpacity>

            <Text style={styles.counter}>
              {currentIndex + 1} / {flashcards.length}
            </Text>

            <TouchableOpacity
              onPress={handleNext}
              style={[styles.navButton, currentIndex === flashcards.length - 1 && styles.disabled]}
              disabled={currentIndex === flashcards.length - 1}
            >
              <Text style={styles.navText}>Berikutnya →</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.emptyText}>Tidak ada flashcard untuk course ini.</Text>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Kembali</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#95093F',
    marginBottom: 20,
  },
  cardContainer: {
    width: width * 0.85,
    height: height * 0.5,
    marginBottom: 30,
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FEEDFA',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backfaceVisibility: 'hidden',
    elevation: 4,
    shadowColor: '#95093F',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  cardBack: {
    backgroundColor: '#FAD4FA',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cardText: {
    fontSize: 24,
    color: '#95093F',
    textAlign: 'center',
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '85%',
    marginBottom: 20,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
  },
  disabled: {
    backgroundColor: '#a5b4fc',
  },
  navText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  counter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#95093F',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: '#95093F',
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#95093F',
    marginVertical: 40,
  },
});
