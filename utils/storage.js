import AsyncStorage from '@react-native-async-storage/async-storage';

const FLASHCARDS_KEY_PREFIX = 'flashcards_';

// Ambil semua flashcard untuk course tertentu
export const getFlashcardsForCourse = async (courseName) => {
  try {
    const key = FLASHCARDS_KEY_PREFIX + courseName;
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Gagal mengambil flashcards:', e);
    return [];
  }
};

// Simpan flashcard baru ke course yang sudah ada
export const saveFlashcardToCourse = async (courseName, flashcard) => {
  try {
    const key = FLASHCARDS_KEY_PREFIX + courseName;
    const existingCardsJson = await AsyncStorage.getItem(key);
    const existingCards = existingCardsJson != null ? JSON.parse(existingCardsJson) : [];

    // Tambah flashcard baru
    const updatedCards = [...existingCards, flashcard];
    await AsyncStorage.setItem(key, JSON.stringify(updatedCards));
  } catch (e) {
    console.error('Gagal menyimpan flashcard:', e);
  }
};
