import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
//import { User } from "firebase/auth";
// import {
//   collection,
//   doc,
//   getDocs,
//   increment,
//   orderBy,
//   query,
//   serverTimestamp,
//   where,
//   writeBatch,
// } from "firebase/firestore";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/AuthModalAtom";
import { Question, questionState } from "../../../atoms/questionsAtom";
import { firestore } from "../../../firebase/clientApp";
import AnswerItem, { Answer } from "./AnswerItem";
import AnswerInput from "./input";
import { User } from "@/pages/userContext";

type AnswersProps = {
  user: User | null;
  selectedQuestion: Question;
};

const Answers: React.FC<AnswersProps> = ({ user, selectedQuestion }) => {
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [answerFetchLoading, setAnswerFetchLoading] = useState(false);
  const [answerCreateLoading, setAnswerCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState("");
  const setAuthModalState = useSetRecoilState(authModalState);
  const setQuestionState = useSetRecoilState(questionState);

  const onCreateAnswer = async (answer: string) => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    setAnswerCreateLoading(true);
    try {
      // const batch = writeBatch(firestore);

      // // Create answer document
      // const answerDocRef = doc(collection(firestore, "answers"));
      // batch.set(answerDocRef, {
      //   questionId: selectedQuestion.id,
      //   creatorId: user.uid,
      //   creatorDisplayText: user.email!.split("@")[0],
      //   creatorPhotoURL: user.photoURL,
      //   text: answer,
      //   questionTitle: selectedQuestion.title,
      //   createdAt: serverTimestamp(),
      // } as unknown as Answer);

      // // Update question numberOfAnswers
      // batch.update(doc(firestore, "questions", selectedQuestion.id), {
      //   numberOfAnswers: increment(1),
      // });
      // await batch.commit();

      setAnswer("");
      const { id: questionId, title } = selectedQuestion;
      setAnswers((prev) => [
        {
          // id: answerDocRef.id,
          creatorId: user.id,
          creatorDisplayText: user.email!.split("@")[0],
          //creatorPhotoURL: user.photoURL,
          questionId,
          questionTitle: title,
          text: answer,
          createdAt: {
            seconds: Date.now() / 1000,
          },
        } as unknown as Answer,
        ...prev,
      ]);

      // Fetch questions again to update number of answers
      setQuestionState((prev) => ({
        ...prev,
        selectedQuestion: {
          ...prev.selectedQuestion,
          numberOfAnswers: prev.selectedQuestion?.numberOfAnswers! + 1,
        } as Question,
        questionUpdateRequired: true,
      }));
    } catch (error: any) {
      console.log("onCreateAnswer error", error.message);
    }
    setAnswerCreateLoading(false);
  };

  const onDeleteAnswer = useCallback(
    async (answer: Answer) => {
      setDeleteLoading(answer.id as string);
      try {
        if (!answer.id) throw "Answer has no ID";
        // const batch = writeBatch(firestore);
        // const answerDocRef = doc(firestore, "answers", answer.id);
        // batch.delete(answerDocRef);

        // batch.update(doc(firestore, "questions", answer.questionId), {
        //   numberOfAnswers: increment(-1),
        // });

        // await batch.commit();

        setQuestionState((prev) => ({
          ...prev,
          selectedQuestion: {
            ...prev.selectedQuestion,
            numberOfAnswers: prev.selectedQuestion?.numberOfAnswers! - 1,
          } as Question,
          questionUpdateRequired: true,
        }));

        setAnswers((prev) => prev.filter((item) => item.id !== answer.id));
        // return true;
      } catch (error: any) {
        console.log("Error deletig answer", error.message);
        // return false;
      }
      setDeleteLoading("");
    },
    [setAnswers, setQuestionState]
  );

  const getQuestionAnswers = async () => {
    try {
      // const answersQuery = query(
      //   collection(firestore, "answers"),
      //   where("questionId", "==", selectedQuestion.id),
      //   orderBy("createdAt", "desc")
      // );
      // const answerDocs = await getDocs(answersQuery);
      // const answers = answerDocs.docs.map((doc) => ({
      //   id: doc.id,
      //   ...doc.data(),
      // }));
      setAnswers(answers as Answer[]);
    } catch (error: any) {
      console.log("getQuestionAnswers error", error.message);
    }
    setAnswerFetchLoading(false);
  };

  useEffect(() => {
    console.log("HERE IS SELECTED QUESTION", selectedQuestion.id);

    getQuestionAnswers();
  }, []);

  return (
    <Box
      bg="brand.200"
      border="2px"
      borderColor="brand.400"
      p={2}
      borderRadius="0px 0px 4px 4px"
    >
      <Flex
        direction="column"
        pl={10}
        pr={4}
        mb={6}
        fontSize="10pt"
        width="100%"
      >
        <AnswerInput
          answer={answer}
          setAnswer={setAnswer}
          loading={answerCreateLoading}
          user={user}
          onCreateAnswer={onCreateAnswer}
        />
      </Flex>
      <Stack spacing={6} p={2}>
        {answerFetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {!!answers.length ? (
              <>
                {answers.map((item: Answer) => (
                  <AnswerItem
                    key={item.id}
                    answer={item}
                    onDeleteAnswer={onDeleteAnswer}
                    isLoading={deleteLoading === (item.id as string)}
                    userId={user?.id}
                  />
                ))}
              </>
            ) : (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3} color="gray.100">
                  No Answers Yet
                </Text>
              </Flex>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};
export default Answers;
