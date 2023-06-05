import { useContext, useEffect, useState } from "react";
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
import { useQuestionsSearch } from "@/pages/questionContext";
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
import { UserContext, UserContextType } from "./userContext";

type HomeProps = {
  showUsersQuestions?: boolean;
};


const Home: NextPage = ( showUsersQuestions ) => {

  const router = useRouter();
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
  
  const [users, setUsers] = useState<any[]>([]);
  const userContext = useContext(UserContext) as UserContextType;
  const { questions: searchQuestions } = useQuestionsSearch();
  
  const [questions, setQuestions] = useState<Question[]>([]);  // maintain a local state for the list of questions

  useEffect(() => {
    setQuestions(searchQuestions);  // update the local state whenever the list of questions from useQuestionsSearch() changes
  }, [searchQuestions]);

  const imagePath = "/images/applogo1.png"; 

  return (
    <>
      <Image src="https://i.imgur.com/vaHaOhq.png" borderRadius="lg" />
      
      
      <Center>
        
      </Center>
      <Flex width="100%">
        <Center width="100%">
        
          <Tabs size="md" variant="enclosed" width="100%">
          {/* <Image src={imagePath} alt="My Image" borderRadius="lg" /> */}
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
                Recent
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
                Most Upvoted
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
                        {questions.map( //questionStateValue.questions.map(
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


