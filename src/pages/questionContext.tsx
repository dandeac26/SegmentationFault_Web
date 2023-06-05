// questionsContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";

interface QuestionsContextType {
  questions: any[];
  setQuestions: (questions: any[]) => void;
}

export const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

interface QuestionsProviderProps {
  children: ReactNode; 
}

export const QuestionsProvider: React.FC<QuestionsProviderProps> = ({ children }) => {
  const [questions, setQuestions] = useState<any[]>([]);

  return (
    <QuestionsContext.Provider value={{ questions, setQuestions }}>
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
