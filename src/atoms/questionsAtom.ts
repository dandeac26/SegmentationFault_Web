import { atom } from "recoil";
//import { Timestamp } from "firebase/firestore";

export type Question = {
  id: string;
  userDisplayText: string; // change to authorDisplayText
  creatorId: string;
  title: string;
  body: string;
  numberOfAnswers: number;
  voteStatus: number;
  currentUserVoteStatus?: {
    id: string;
    voteValue: number;
  };
  imageURL?: string;
  questionIdx?: number;
  // createdAt?: Timestamp;
  // editedAt?: Timestamp;
};

export type QuestionVote = {
  id?: string;
  questionId: string;
  voteValue: number;
};

interface QuestionState {
  selectedQuestion: Question | null;
  questions: Question[];
  questionVotes: QuestionVote[];
  questionsCache: {
    [key: string]: Question[];
  };
  questionUpdateRequired: boolean;
}

export const defaultQuestionState: QuestionState = {
  selectedQuestion: null,
  questions: [],
  questionVotes: [],
  questionsCache: {},
  questionUpdateRequired: true,
};

export const questionState = atom({
  key: "questionState",
  default: defaultQuestionState,
});
