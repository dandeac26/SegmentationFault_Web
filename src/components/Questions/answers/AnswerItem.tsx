import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  Icon,
  Skeleton,
  Spinner,
  Stack,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
//import { Timestamp } from "firebase/co";
import moment from "moment";
import { HiOutlineCode } from "react-icons/hi";
import {
  IoArrowDownCircleOutline,
  IoArrowUpCircleOutline,
} from "react-icons/io5";
import { Timestamp } from "firebase/firestore";
import { UserContext, UserContextType } from "@/pages/userContext";
import axios from "axios";

export type Answer = {
  authorName: string;
  id?: string;
  creatorId: string;
  creatorDisplayText: string;
  picture: string;
  questionId: string;
  questionTitle: string;
  text: string;
  createdAt?: Timestamp;
  votes: number;
};

type AnswerItemProps = {
  answer: Answer;
  onDeleteAnswer: (answer: Answer) => void;
  onUpdateAnswer: (answer: Answer) => void;
  isLoading: boolean;
  userId?: string;
  selectedFile?: string;
  userEmail?: string;
  onEditClick: () => void;
  userRole?: string;
};

const AnswerItem: React.FC<AnswerItemProps> = ({
  answer,
  onDeleteAnswer,
  onUpdateAnswer,
  isLoading,
  userId,
  selectedFile,
  userEmail,
  onEditClick,
  userRole,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loadingImage, setLoadingImage] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pageTopRef = useRef<HTMLDivElement>(null);
  const [voteCount, setVoteCount] = useState(0);
  const userContext = useContext(UserContext) as UserContextType;
  const [answerData, setAnswerData] = useState<Answer>({} as Answer);
  const [userIsCreator, setUserIsCreator] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    console.log("wut", userRole)
    if(userContext.currentUser == null) {
      setUserIsCreator(false);
      return;
    }
    if (!userContext.currentUser || !answerData.creatorId) {
      return; // Skip execution if currentUser or creatorId is not available
    }
  
    setUserIsCreator(String(answer.creatorId) === String(userContext.currentUser.id) || String(userContext.currentUser.role) === "ADMIN");
    console.log("userIsCreator666", String(answer.creatorId) === String(userContext.currentUser.id) || String(userContext.currentUser.role) === "ADMIN")
  }, [answerData, userContext.currentUser, isLoggedIn]); // Include isLoggedIn as a dependency
  
  useEffect(() => {
    if (userContext.currentUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [userContext.currentUser]);
  
  const handleImageLoad = () => {
    setLoadingImage(false);
  };

  //console.log("look userEmail4", userEmail)
 
  // useEffect(() => {
  //   async function getInitialVoteCount() {
  //     console.log("interes", answer.id, userContext?.currentUser?.id)
  //     try {
  //       const response = await axios.post('http://localhost:8080/answers/vote', {
  //         answerId: answer.id,
  //         userId: userContext?.currentUser?.id,
  //         voteType: "getCount",
  //       });
  
  //       if (!response) throw new Error('Response is not OK');
  
  //       const initialVoteCount = response.data.voteCount;
  //       setVoteCount(initialVoteCount);
  
  //     } catch (error) {
  //      // console.error('Failed to get initial vote count:', error);
  //     }
  //   }
  
  //   getInitialVoteCount();
  // }, []);
  
  
  useEffect(() => {
    console.log("usrRoleis", userRole)
    if(answer.picture) {
      setImageUrl(answer.picture);
    }
  }, [answer]);
  const handleEditAnswer = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page
    //onEditClick(); // Call the onEditClick function
    onUpdateAnswer(answer); // Call the onUpdateAnswer function with the answer parameter
  };


  // async function handleVote(voteType: string) {
  //   try {
  //     // Check if the user is not the creator of the question.
  //     if (userIsCreator) {
  //       console.error("User cannot vote their own answers");
  //       return;
  //     }
  
  //     const response = await axios.post('http://localhost:8080/answers/vote', {
  //       answerId: answer.id,
  //       userId: Number(userContext?.currentUser?.id), // assuming this is the user's id
  //       voteType,
  //     });
  //     console.log("responsexy: ", response)
  //     if (!response) throw new Error('Response is not OK');
      
  //     const updatedVoteCount = response.data.voteCount;
  //     setVoteCount(updatedVoteCount) ;
  //     setAnswerData((prevData) => ({
  //       ...prevData,
  //       voteStatus: updatedVoteCount,
  //     }));
  
  //   } catch (error) {
  //     console.error('Failed to cast vote:', error);
  //   }
  // }


  return (
    <Flex>
      <Box mr={2}>
        <Icon as={HiOutlineCode} fontSize={24} color="gray.300" />
      </Box>
      <Stack spacing={1}>
        <Stack direction="row" align="center" spacing={2} fontSize="8pt">
          <Text
            color="brand.400"
            fontWeight={700}
            _hover={{ textDecoration: "underline", cursor: "pointer" }}
          >
            {answer.authorName}
          </Text>
          {answer.createdAt?.seconds && (
            <Text color="brand.400">
              {moment(new Date(answer.createdAt?.seconds * 1000)).fromNow()}
            </Text>
          )}
          {isLoading && <Spinner size="sm" />}

        </Stack>
        <Stack>
        <Text fontSize="10pt" color="white">
          {answer.text}
        </Text>
        
        {imageUrl && (
            <Flex justify="center" align="center" p={2} >
              {loadingImage && (
                <Skeleton height="200px" width="100%" borderRadius={4} />
              )}
              <Image
                src={imageUrl}
                alt="Question Image"
                borderRadius="lg"
                onLoad={handleImageLoad}
                ref={imageRef}
                onClick={(event) => {
                  event.stopPropagation();
                  onOpen();
                }}
                //onClick={onOpen}
                style={{
                  cursor: "zoom-in",
                  objectFit: "cover",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                }}
              />
            </Flex>
          )}
        </Stack>
        <Stack
          direction="row"
          align="center"
          cursor="pointer"
          fontWeight={600}
          color="gray.500"
        >
          <Icon as={IoArrowUpCircleOutline} 
          onClick={(event) => {
            //event.stopPropagation(); handleVote('upvote')
          }}/>
          <Icon as={IoArrowDownCircleOutline} 
            onClick={(event) => {
              //event.stopPropagation();
              //handleVote('downvote')
            }}
          />
          {(String(userEmail?.split("@")[0])===String(answer.authorName) || (userRole === "ADMIN")) && (
            <>
              <Text fontSize="9pt" _hover={{ color: "brand.300" }}
                onClick={handleEditAnswer}
              >
                Edit
              </Text>
              <Text
                fontSize="9pt"
                _hover={{ color: "brand.300" }}
                onClick={() => onDeleteAnswer(answer)}
              >
                Delete
              </Text>
            </>
          )}
        </Stack>
      </Stack>
    </Flex>
  );
};
export default AnswerItem;
