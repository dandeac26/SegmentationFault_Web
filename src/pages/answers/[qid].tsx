import React, { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { Question } from "@/atoms/questionsAtom";
import PageContentLayout from "@/components/layout/PageContent";
import Answers from "@/components/Questions/answers";
import QuestionLoader from "@/components/Questions/Loader";
import QuestionItem from "@/components/Questions/QuestionItem";
import useQuestions from "@/hooks/useQuestions";
import { UserContext } from "../userContext"; // adjust the path as needed

type QuestionPageProps = {};

const QuestionPage: React.FC<QuestionPageProps> = () => {
  const userContext = useContext(UserContext);
  const currentUser = userContext ? userContext.currentUser : null;
  const setCurrentUser = userContext ? userContext.setCurrentUser : null;
  
  const router = useRouter();

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
    // Fetch your question data here using your custom function or API
    setLoading(false);
  };

  useEffect(() => {
    const { qid = "" } = router.query;
    console.log("nslookp", currentUser)
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
                    currentUser?.id === questionStateValue.selectedQuestion.creatorId
                  }
                  router={router}
                />
                <Answers
                  user={currentUser}
                  selectedQuestion={questionStateValue.selectedQuestion}
                />
              </>
            )}
          </>
        )}
      </>
      {/* Right Content */}
      <>
      </>
    </PageContentLayout>
  );
};
export default QuestionPage;
