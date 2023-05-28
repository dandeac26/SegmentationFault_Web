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
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PageContentLayout from "@/components/layout/PageContent";
import NewQuestionForm from "@/components/Questions/NewQuestionForm";
import { auth } from "@/firebase/clientApp";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import { IoHome } from "react-icons/io5";
import { BsFillQuestionCircleFill } from "react-icons/bs";

const CreateQuestion: NextPage = () => {
  const [user, loadingUser, error] = useAuthState(auth);
  const router = useRouter();

  /**
   * Not sure why not working
   * Attempting to redirect user if not authenticated
   */
  useEffect(() => {
    if (!user && !loadingUser) {
      router.push(`/`);
    }
  }, [user, loadingUser]);

 // console.log("HERE IS USER", user, loadingUser);

  return (
    <>
      <PageContentLayout maxWidth="1060px">
        
          <>
            <Box p="14px 0px" key="user" borderBottom="1px solid" borderColor="brand.400">
              <Text fontWeight={600} fontSize={26} color="brand.400">
                Create a question
              </Text>
            </Box>
            {user && <NewQuestionForm user={user} />}
          </>,
          <>
          </>
         
      </PageContentLayout>
    </>
  );
};

export default CreateQuestion;
