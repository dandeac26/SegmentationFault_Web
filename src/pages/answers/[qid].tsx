import React, { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { Question } from "@/atoms/questionsAtom";
import PageContentLayout from "@/components/layout/PageContent";
import Answers from "@/components/Questions/answers";
import QuestionLoader from "@/components/Questions/Loader";
import QuestionItem from "@/components/Questions/QuestionItem";
import { auth } from "@/firebase/clientApp";
import useQuestions from "@/hooks/useQuestions";

type QuestionPageProps = {};

const QuestionPage: React.FC<QuestionPageProps> = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  // Need to pass community data here to see if current question [pid] has been voted on
  const {
    questionStateValue,
    setQuestionStateValue,
    onDeleteQuestion,
    loading,
    setLoading,
    onVote,
  } = useQuestions();

  const fetchQuestion = async (qid: string) => {
    console.log("FETCHING POST");

    setLoading(true);
    try {
      //const questionDocRef = doc(firestore, "questions", qid);
      //const questionDoc = await getDoc(questionDocRef);
      // setQuestionStateValue((prev) => ({
      //   ...prev,
      //   selectedQuestion: {
      //     id: questionDoc.id,
      //     ...questionDoc.data(),
      //   } as Question,
      // }));


      // setQuestionStateValue((prev) => ({
      //   ...prev,
      //   selectedQuestion: {} as Question,
      // }));
    } catch (error: any) {
      console.log("fetchQuestion error", error.message);
    }
    setLoading(false);
  };

  // Fetch question if not in already in state
  useEffect(() => {
    const { qid = "" } = router.query;

    if (qid && !questionStateValue.selectedQuestion) {
      fetchQuestion(qid as string);
    }
  }, [router.query, questionStateValue.selectedQuestion]);

  return (
    <PageContentLayout>
      {/* Left Content */}
      <>
        {loading ? (
          <QuestionLoader />
        ) : (
          <>
            {questionStateValue.selectedQuestion && (
              <>
                <QuestionItem
                  question={questionStateValue.selectedQuestion}
                  // questionIdx={questionStateValue.selectedQuestion.questionIdx}
                  onVote={onVote}
                  onDeleteQuestion={onDeleteQuestion}
                  userVoteValue={
                    questionStateValue.questionVotes.find(
                      (item) =>
                        item.questionId ===
                        questionStateValue.selectedQuestion!.id
                    )?.voteValue
                  }
                  userIsCreator={
                    user?.uid === questionStateValue.selectedQuestion.creatorId
                  }
                  router={router}
                />
                <Answers
                  user={user}
                  selectedQuestion={questionStateValue.selectedQuestion}
                />
              </>
            )}
          </>
        )}
      </>
      {/* Right Content */}
      <></>
    </PageContentLayout>
  );
};
export default QuestionPage;
