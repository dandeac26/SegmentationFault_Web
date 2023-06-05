import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  List,
  ListIcon,
  ListItem,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PageContentLayout from "@/components/layout/PageContent";
import NewQuestionForm from "@/components/Questions/NewQuestionForm";
import { auth } from "@/firebase/clientApp";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import { IoHome } from "react-icons/io5";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { User, UserContext } from "@/pages/userContext";

const CreateQuestion: NextPage = () => {
  //const [ loadingUser, error] = useAuthState(auth);
  
  const { currentUser } = useContext(UserContext) as { currentUser: User | null };
  const router = useRouter();
  const questionId = router.query.id;  // Get question id from the URL

  // Check if the page is in edit mode
  const isEditMode = Boolean(questionId);
  /**
   * Not sure why not working
   * Attempting to redirect user if not authenticated
   */
  useEffect(() => {
    console.log("this is in submit", currentUser);
    if (!currentUser) {
      router.push(`/`);
    }
  }, [currentUser]);

 // console.log("HERE IS USER", user, loadingUser);

 const [questionData, setQuestionData] = useState(null);


 async function fetchQuestionData(id: string | string[] | undefined) {
  const response = await fetch(`http://localhost:8080/questions/getById/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const questionData = await response.json();
  return questionData;
}

useEffect(() => {
  if (isEditMode) {
    fetchQuestionData(questionId)
      .then(data => {
        setQuestionData(data);
      })
      .catch(error => console.error('There was an error!', error));
  }
}, [isEditMode, questionId]);


  return (
    <>
      <PageContentLayout maxWidth="1060px">
        
          <>
            <Box p="14px 0px" key="user" borderBottom="1px solid" borderColor="brand.400">
              <Text fontWeight={600} fontSize={26} color="brand.400">
                Create a question
              </Text>
            </Box>
            {currentUser && <NewQuestionForm user={currentUser} question={questionData} isEditMode={isEditMode} />}
          </>,
          <>
          </>
         
      </PageContentLayout>
    </>
  );
};

export default CreateQuestion;
