import React, { useCallback, useEffect, useRef, useState } from "react";
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
  
  const onCreateAnswer = async (answer: string, selectedFile: string | undefined) => {
    console.log("onCreateAnswer", answer);
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

   
    setAnswerCreateLoading(true);
    let result
    setAnswer("");
    
    let answerData: { id?: string | number, text: string, creationTime: string, votes: number, picture: string | undefined, questionId: string, author: string, authorName : string} = {
      text: answer,
      creationTime: new Date().toISOString(),
      votes: 0,
      picture: selectedFile,
      questionId: selectedQuestion.id,
      author: user.id,
      authorName: user.email!.split("@")[0], 
    };
    console.log("answerNAME", answerData.authorName)
    try {
      // const batch = writeBatch(firestore);
      console.log("answer stuff",answerData);
      console.log("selfile ass", selectedFile)
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
      /**
       * this.id = id;
        this.text = text;
        this.creationTime = creationTime;
        this.picture = picture;
        this.votes = votes;
        this.question_id = question_id;
       */
      
      result = await fetch("http://localhost:8080/answers/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(answerData),
          });

      const data = await result.json();
      if (data.status === "ok") {
        console.log("answer created successfully", data);
      } else {
        console.log("error creating answer", data);
      }

      
      const { id: questionId, title } = selectedQuestion;
      setAnswers((prev) => [
        {
          // id: answerDocRef.id,
          creatorId: user.id,
          creatorDisplayText: answerData.authorName,//user.email!.split("@")[0],
          //creatorPhotoURL: user.photoURL,
          questionId,
          questionTitle: title,
          text: answer,
          picture: selectedFile,
          
          createdAt: { 
            seconds: Date.now() / 1000,
            nanoseconds: 0, // adjust this if needed
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
    selectedFile = undefined;
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
    setAnswerFetchLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/answers/getByQuestion/${selectedQuestion.id}`);
      const data = await response.json();

      // Assuming your backend returns the answers in a property named 'data'
      setAnswers(data as Answer[]);
    } catch (error: any) {
      console.log("getQuestionAnswers error", error.message);
    }
    setAnswerFetchLoading(false);
};



useEffect(() => {
  console.log("HERE IS SELECTED QUESTION", selectedQuestion.id);
  getQuestionAnswers();
}, [selectedQuestion]);

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
