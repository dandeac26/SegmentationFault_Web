// questionsContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";

interface QuestionsContextType {
  questions: any[];
  setQuestions: (questions: any[]) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
}

export const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

interface QuestionsProviderProps {
  children: ReactNode; 
}

export const QuestionsProvider: React.FC<QuestionsProviderProps> = ({ children }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [searchString, setSearchString] = useState("");

  const sortedSetQuestions = (questions: any[]) => {
    const sortedQuestions = questions.sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(b.date).getTime() - new Date(a.date).getTime());//sort((a, b) =>  new Date(b.createdAt) - new Date(a.createdAt));
    setQuestions(sortedQuestions);
  };

  return (
    <QuestionsContext.Provider value={{ questions, setQuestions: sortedSetQuestions, searchString, setSearchString }}>
    {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestionsSearch = () => {
    const context = useContext(QuestionsContext);
    if (context === undefined) {
      throw new Error("useQuestionsSearch must be used within a QuestionsProvider");
    }
    return context;
};
