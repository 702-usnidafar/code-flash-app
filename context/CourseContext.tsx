import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1️⃣ Definisikan tipe context yang jelas
type CourseContextType = {
  courses: string[];
  setCourses: React.Dispatch<React.SetStateAction<string[]>>;
};

// 2️⃣ Inisialisasi context dengan tipe yang sesuai
const CourseContext = createContext<CourseContextType | undefined>(undefined);

// 3️⃣ Buat provider yang membungkus komponen children
export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<string[]>([]);

  return (
    <CourseContext.Provider value={{ courses, setCourses }}>
      {children}
    </CourseContext.Provider>
  );
};

// 4️⃣ Custom hook yang aman dan jelas tipenya
export const useCourseContext = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourseContext must be used within a CourseProvider');
  }
  return context;
};
