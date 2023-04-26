import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/AuthModalAtom";

import { Question, questionState, QuestionVote } from "@/atoms/questionsAtom";
import { auth, storage } from "@/firebase/clientApp";
import { useRouter } from "next/router";

const useQuestions = () => {
  const [user, loadingUser] = useAuthState(auth);
  const [questionStateValue, setQuestionStateValue] =
    useRecoilState(questionState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSelectQuestion = (question: Question, questionIdx: number) => {
    console.log("HERE IS STUFF", question, questionIdx);

    setQuestionStateValue((prev) => ({
      ...prev,
      selectedQuestion: { ...question, questionIdx },
    }));
    router.push(`/answers/${question.id}`);
  };

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    question: Question,
    vote: number
    // questionIdx?: number
  ) => {
    event.stopPropagation();
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    const { voteStatus } = question;

    const existingVote = questionStateValue.questionVotes.find(
      (vote) => vote.questionId === question.id
    );

    try {
      let voteChange = vote;
      //const batch = writeBatch(firestore);

      const updatedQuestion = { ...question };
      const updatedQuestions = [...questionStateValue.questions];
      let updatedQuestionVotes = [...questionStateValue.questionVotes];

      // New vote
      if (!existingVote) {
        // const questionVoteRef = doc(
        //   collection(firestore, "users", `${user.uid}/questionVotes`)
        // );

        const newVote: QuestionVote = {
          // id: questionVoteRef.id,
          questionId: question.id,
          voteValue: vote,
        };

        console.log("NEW VOTE!!!", newVote);

        //batch.set(questionVoteRef, newVote);

        updatedQuestion.voteStatus = voteStatus + vote;
        updatedQuestionVotes = [...updatedQuestionVotes, newVote];
      }
      // Removing existing vote
      else {
        // Used for both possible cases of batch writes
        // const questionVoteRef = doc(
        //   firestore,
        //   "users",
        //   `${user.uid}/questionVotes/${existingVote.id}`
        // );

        // Removing vote
        if (existingVote.voteValue === vote) {
          voteChange *= -1;
          updatedQuestion.voteStatus = voteStatus - vote;
          updatedQuestionVotes = updatedQuestionVotes.filter(
            (vote) => vote.id !== existingVote.id
          );
          //batch.delete(questionVoteRef);
        }
        // Changing vote
        else {
          voteChange = 2 * vote;
          updatedQuestion.voteStatus = voteStatus + 2 * vote;
          const voteIdx = questionStateValue.questionVotes.findIndex(
            (vote) => vote.id === existingVote.id
          );
          // console.log("HERE IS VOTE INDEX", voteIdx);

          // Vote was found - findIndex returns -1 if not found
          if (voteIdx !== -1) {
            updatedQuestionVotes[voteIdx] = {
              ...existingVote,
              voteValue: vote,
            };
          }
          // batch.update(questionVoteRef, {
          //   voteValue: vote,
          // });
        }
      }

      let updatedState = {
        ...questionStateValue,
        questionVotes: updatedQuestionVotes,
      };

      const questionIdx = questionStateValue.questions.findIndex(
        (item) => item.id === question.id
      );

      // if (questionIdx !== undefined) {
      updatedQuestions[questionIdx!] = updatedQuestion;
      updatedState = {
        ...updatedState,
        questions: updatedQuestions,
        questionsCache: {
          ...updatedState.questionsCache,
        },
      };

      // Optimistically update the UI
      // Used for single page view [pid]
      // since no real-time listener there

      if (updatedState.selectedQuestion) {
        updatedState = {
          ...updatedState,
          selectedQuestion: updatedQuestion,
        };
      }

      // Optimistically update the UI
      setQuestionStateValue(updatedState);

      // Update database
      //const questionRef = doc(firestore, "questions", question.id);
      //batch.update(questionRef, { voteStatus: voteStatus + voteChange });
      //await batch.commit();
    } catch (error) {
      console.log("onVote error", error);
    }
  };

  const onDeleteQuestion = async (question: Question): Promise<boolean> => {
    console.log("DELETING POST: ", question.id);

    try {
      // if question has an image url, delete it from storage
      if (question.imageURL) {
        const imageRef = ref(storage, `questions/${question.id}/image`);
        await deleteObject(imageRef);
      }

      // delete question from questions collection
      //const questionDocRef = doc(firestore, "questions", question.id);
     // await deleteDoc(questionDocRef);

      // Update question state
      setQuestionStateValue((prev) => ({
        ...prev,
        questions: prev.questions.filter((item) => item.id !== question.id),
        questionsCache: {
          ...prev.questionsCache,
        },
      }));

      //Cloud Function will trigger on question delete
      //to delete all comments with questionId === question.id

      return true;
    } catch (error) {
      console.log("THERE WAS AN ERROR", error);
      return false;
    }
  };

  useEffect(() => {
    // Logout or no authenticated user
    if (!user?.uid && !loadingUser) {
      setQuestionStateValue((prev) => ({
        ...prev,
        questionVotes: [],
      }));
      return;
    }
  }, [user, loadingUser]);

  return {
    questionStateValue,
    setQuestionStateValue,
    onSelectQuestion,
    onDeleteQuestion,
    loading,
    setLoading,
    onVote,
    error,
  };
};

export default useQuestions;
