import { useEffect, useState } from "react";
import {
  Center,
  Flex,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Image,
  Text,
} from "@chakra-ui/react";
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import axios from "axios"
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

import { Question, QuestionVote } from "@/atoms/questionsAtom";
import PageContentLayout from "@/components/layout/PageContent";
import QuestionLoader from "@/components/Questions/Loader";
import QuestionItem from "@/components/Questions/QuestionItem";
import { auth, firestore } from "../firebase/clientApp";
import useQuestions from "@/hooks/useQuestions";

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth);
  const {
    questionStateValue,
    setQuestionStateValue,
    onVote,
    onSelectQuestion,
    onDeleteQuestion,
    loading,
    setLoading,
  } = useQuestions();

  const getUserHomeQuestions = async () => {
    console.log("GETTING USER FEED");
    setLoading(true);
    try {
      const feedQuestions: Question[] = [];

      const questionQuery = query(
        collection(firestore, "questions"),
        orderBy("voteStatus", "desc"),
        limit(10)
      );
      const questionDocs = await getDocs(questionQuery);
      const questions = questionDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Question[];
      feedQuestions.push(...questions);
      //}

      console.log("HERE ARE FEED QUESTIONS", feedQuestions);

      setQuestionStateValue((prev) => ({
        ...prev,
        questions: feedQuestions,
      }));

      // if not in any, get 5 communities ordered by number of members
      // for each one, get 2 questions ordered by voteStatus and set these to questionState questions
    } catch (error: any) {
      console.log("getUserHomeQuestions error", error.message);
    }
    setLoading(false);
  };

  const getNoUserHomeQuestions = async () => {
    console.log("GETTING NO USER FEED");
    setLoading(true);
    try {
      const questionQuery = query(
        collection(firestore, "questions"),
        orderBy("voteStatus", "desc"),
        limit(10)
      );
      const questionDocs = await getDocs(questionQuery);
      const questions = questionDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("NO USER FEED", questions);

      setQuestionStateValue((prev) => ({
        ...prev,
        questions: questions as Question[],
      }));
    } catch (error: any) {
      console.log("getNoUserHomeQuestions error", error.message);
    }
    setLoading(false);
  };

  const getUserQuestionVotes = async () => {
    const questionIds = questionStateValue.questions.map(
      (question) => question.id
    );
    const questionVotesQuery = query(
      collection(firestore, `users/${user?.uid}/questionVotes`),
      where("questionId", "in", questionIds)
    );
    const unsubscribe = onSnapshot(questionVotesQuery, (querySnapshot) => {
      const questionVotes = querySnapshot.docs.map((questionVote) => ({
        id: questionVote.id,
        ...questionVote.data(),
      }));

      setQuestionStateValue((prev) => ({
        ...prev,
        questionVotes: questionVotes as QuestionVote[],
      }));
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    if (user) {
      getUserHomeQuestions();
    }
  }, [user]);

  useEffect(() => {
    if (!user && !loadingUser) {
      getNoUserHomeQuestions();
    }
  }, [user, loadingUser]);

  useEffect(() => {
    if (!user?.uid || !questionStateValue.questions.length) return;
    getUserQuestionVotes();

    // Clear questionVotes on dismount
    return () => {
      setQuestionStateValue((prev) => ({
        ...prev,
        questionVotes: [],
      }));
    };
  }, [questionStateValue.questions, user?.uid]);

  const [users, setUsers] = useState<any[]>([]);

  // useEffect(() => {
  //   axios.get('http://localhost:8080/users/getAll')
  //     .then(response => {
  //       setUsers(response.data);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // }, []);

  return (
    <>
      <Image src="https://i.imgur.com/vaHaOhq.png" borderRadius="lg" />
      {/* <>
        {users.length > 0 ? (
          console.log(users)
        ) : (
          <Text color="brand.100" width="50%" textAlign="center" align="center">
            No users found
          </Text>
        )}
        </> */}
      
      <Center>
        <Text color="brand.100" width="50%" textAlign="center" align="center">
          This is currently just the front end and there is no backend. I made
          it so on the front page you should see top questions ( maybe of the
          day). in order to create a question press the plus in the navbar.
        </Text>
      </Center>
      <Flex width="100%">
        <Center width="100%">
          <Tabs size="md" variant="enclosed" width="100%">
            <TabList>
              <Tab
                fontSize={12}
                bg="brand.700"
                color="white"
                _focus={{
                  borderBottomColor: "#2e4f4f",
                  bg: "#2e4f4f",
                }}
              >
                Most Upvoted
              </Tab>
              <Tab
                fontSize={12}
                bg="brand.700"
                color="white"
                _focus={{
                  borderBottomColor: "#2e4f4f",
                  bg: "#2e4f4f",
                }}
              >
                Recent
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel bg="#2e4f4f">
                <PageContentLayout>
                  <>
                    {/* <CreateQuestionLink /> */}
                    {loading ? (
                      <QuestionLoader />
                    ) : (
                      <Stack>
                        {questionStateValue.questions.map(
                          (question: Question, index) => (
                            <QuestionItem
                              key={question.id}
                              question={question}
                              questionIdx={index}
                              onVote={onVote}
                              onDeleteQuestion={onDeleteQuestion}
                              userVoteValue={
                                questionStateValue.questionVotes.find(
                                  (item) => item.questionId === question.id
                                )?.voteValue
                              }
                              userIsCreator={user?.uid === question.creatorId}
                              onSelectQuestion={onSelectQuestion}
                              homePage
                            />
                          )
                        )}
                      </Stack>
                    )}
                  </>
                  <Stack spacing={3} position="sticky" top="14px"></Stack>
                </PageContentLayout>
              </TabPanel>
              <TabPanel bg="#2e4f4f"></TabPanel>
            </TabPanels>
          </Tabs>
        </Center>
      </Flex>
    </>
  );
};

export default Home;
function setUser(data: any) {
  throw new Error("Function not implemented.");
}

