import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Flex,
  Icon,
  Image,
  Skeleton,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import moment from "moment";
import axios from "axios";
import { NextRouter } from "next/router";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";
import { Question, QuestionObj } from "@/atoms/questionsAtom";
import Link from "next/link";
import { UserContext, UserContextType } from "@/pages/userContext";
import useQuestions from "@/hooks/useQuestions";
import { serverTimestamp } from "firebase/firestore";

export type QuestionItemContentProps = {

  
  question: Question;
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    question: Question,
    vote: number,
    questionIdx?: number
  ) => void;
  onDeleteQuestion: (question: Question) => Promise<boolean>;
  userIsCreator: boolean;
  onSelectQuestion?: (value: Question, questionIdx: number) => void;
  router?: NextRouter;
  questionIdx?: number;
  userVoteValue?: number;
  homePage?: boolean;
};


const QuestionItem: React.FC<QuestionItemContentProps> = ({
  question,
  questionIdx,
  onVote,
  onSelectQuestion,
  router,
  onDeleteQuestion,
  userVoteValue,
  homePage,
}) => {
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const singleQuestionView = !onSelectQuestion; // function not passed to [pid]
  const [imageUrl, setImageUrl] = useState("");
  const [questionData, setQuestionData] = useState<Question>({} as Question);
  const [questionObj, setQuestionObj] = useState<QuestionObj>({} as QuestionObj);
  const { isOpen, onOpen, onClose } = useDisclosure(); // State and functions for controlling the modal

  const imageRef = useRef<HTMLImageElement>(null);
  const userContext = useContext(UserContext) as UserContextType;

  const handleImageLoad = () => {
    setLoadingImage(false);
  };


  //const { fetchQuestions } = useQuestions();
  const resizeImage = () => {
    if (imageRef.current) {
      const modalContent = document.querySelector(".chakra-modal__content") as HTMLElement;
      if (modalContent) {
        const modalWidth = imageRef.current.offsetWidth;
        const modalHeight = imageRef.current.offsetHeight;
  
        modalContent.style.width = `${modalWidth}px`;
        modalContent.style.height = `${modalHeight}px`;
        modalContent.style.display = "flex";
        modalContent.style.justifyContent = "center";
        modalContent.style.alignItems = "center";
      }
    }
  };
  
 
  async function onUpdateQuestion(updatedQuestion: { id?: any; }) {
    try {
      const response = await fetch(`http://localhost:8080/questions/updateId=${updatedQuestion.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedQuestion),
      });
      
      if (!response.ok) throw new Error('Response is not OK');
      return response.json();
    } catch (error) {
      console.error('Failed to update question:', error);
    }
  }

  const onEditButtonClick = () => {
    if (router) router.push(`/submit?id=${questionData.id}`);
  };

  function handleUpdate() {
    const updatedQuestion = {
      id: questionData.id, // the id of the question you want to update
      title: questionData.title,
      body: 'This is the updated question body',
      tags: ['tag1', 'tag2'],
      picture: questionObj.picture,
      votes: questionObj.votes,
      creation_time: serverTimestamp(),
      author_id: questionObj.author_id,
      author: questionObj.author,
    };

    console.log('creationdateAt: ', updatedQuestion.creation_time);

    onUpdateQuestion(updatedQuestion)
      .then(response => {
        console.log('Question updated successfully:', response);
        // Route to '/submit'
      })
      .catch(error => console.error('Failed to update question:', error));
  }
//sth

  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setLoadingDelete(true);
    try {
  
      // use axios to delete question with endpoint : /questions/deleteId={id}
      const response = await axios.delete(`http://localhost:8080/questions/deleteId=${question.id}`);
  
      if (response.status !== 200) {
        throw new Error("Failed to delete question");
      }
  
      const success = await onDeleteQuestion(question);
      if (!success) throw new Error("Failed to delete question");
      
      console.log("Question successfully deleted");
      //await fetchQuestions();
      // Could probably move this logic to onDeleteQuestion function
      if (router) router.push("/")
      if (router) router.back()
    } catch (error: any) {
      console.log("Error deleting question", error.message);
      setLoadingDelete(false);if (router) router.push("/")
    }
  };
  

  useEffect(() => {
    const fetchImagePath = async () => {
      try {
        //console.log("question.id : ", question.id);
        const response = await axios.get(
          `http://localhost:8080/questions/getById/${question.id}`
        );
        setImageUrl(response.data.picture);
        setQuestionData(response.data);
        setQuestionObj(response.data);
        // if(userContext.currentUser != null){
        //   setUserIsCreator(String(question.author_id)=== String(userContext.currentUser.id));
          
        // }
          
        
      } catch (error) {
        console.error("Error fetching image path", error);
      }
    };

    fetchImagePath();
  }, [question.id]);
  useEffect(() => {
    console.log("Question Data creator Id(outside in useeffect): ", questionData.creatorId);
  }, [questionData]);

  useEffect(() => {
    window.addEventListener("resize", resizeImage);

    return () => {
      window.removeEventListener("resize", resizeImage);
    };
  }, []);


  const [userIsCreator, setUserIsCreator] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  if (userContext.currentUser) {
    setIsLoggedIn(true);
  } else {
    setIsLoggedIn(false);
  }
}, [userContext.currentUser]);

useEffect(() => {
  if(userContext.currentUser == null) {
    setUserIsCreator(false);
    return;
  }
  if (!userContext.currentUser || !questionData.author_id) {
    return; // Skip execution if currentUser or creatorId is not available
  }

  setUserIsCreator(String(question.author_id) === String(userContext.currentUser.id));
}, [questionData, userContext.currentUser, isLoggedIn]); // Include isLoggedIn as a dependency

 useEffect(() => {
    console.log("userIsCreator (outside useEffect): ", userIsCreator);
  }, [userIsCreator]);


  return (
    <Flex
      border="1px solid"
      bg="white"
      width="100%"
      borderColor={singleQuestionView ? "white" : "brand.400"}
      borderRadius={singleQuestionView ? "4px 4px 0px 0px" : 4}
      cursor={singleQuestionView ? "unset" : "pointer"}
      _hover={{ borderColor: singleQuestionView ? "none" : "gray.500" }}
      onClick={() =>
        onSelectQuestion && question && onSelectQuestion(question, questionIdx!)
      }
    >
      <Flex
        direction="column"
        align="center"
        bg={singleQuestionView ? "none" : "#b0d3cb"}
        p={2}
        width="30px"
        borderRadius={singleQuestionView ? "0" : "3px 0px 0px 3px"}
      >
        <Icon
          as={
            userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
          }
          color={userVoteValue === 1 ? "#2bcc8c" : "gray.500"}
          fontSize={22}
          cursor="pointer"
          onClick={(event) => onVote(event, question, 1)}
        />
        <Text fontSize="9pt" fontWeight={600}>
          {question.voteStatus}
        </Text>
        <Icon
          as={
            userVoteValue === -1
              ? IoArrowDownCircleSharp
              : IoArrowDownCircleOutline
          }
          color={userVoteValue === -1 ? "brand.600" : "gray.500"}
          fontSize={22}
          cursor="pointer"
          onClick={(event) => onVote(event, question, -1)}
        />
      </Flex>
      <Flex direction="column" width="100%" bg="brand.400" maxHeight="500" overflow="auto">
        <Stack spacing={1} p="10px 10px">
          {question.createdAt && (
            <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
              <Text color="gray.500">
                Questioned by u/{question.userDisplayText}{" "}
                {moment(new Date(question.createdAt.seconds * 1000)).fromNow()}
              </Text>
            </Stack>
          )}
          <Text fontSize="12pt" fontWeight={600}>
            {question.title}
          </Text>
          <Text fontSize="10pt">{question.body}</Text>
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
        { questionData.tags && questionData.tags.length > 0 && <Flex ml={1} mb={0.5} color="gray.500" fontWeight={600}>
          {(questionData.tags).map((tag: any, index: React.Key | null | undefined) => (
            <Tag key={index} size="sm" mr={1}>
              <TagLabel>{tag}</TagLabel>
            </Tag>
          ))}
        </Flex>}
        <Flex ml={1} mb={0.5} color="gray.500" fontWeight={600}>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "#b3d4cc" }}
            cursor="pointer"
          >
            <Icon as={BsChat} mr={2} />
            <Text fontSize="9pt">{question.numberOfAnswers}</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "#b3d4cc" }}
            cursor="pointer"
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize="9pt">Share</Text>
          </Flex>
          {userIsCreator && (
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "#b3d4cc" }}
            cursor="pointer"
            // onClick={handleUpdate}
            onClick={onEditButtonClick}
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize="9pt">Edit</Text>
          </Flex>
          )}
          {userIsCreator && (
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: "#b3d4cc" }}
              cursor="pointer"
              onClick={handleDelete}
            >
              {loadingDelete ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />
                  <Text fontSize="9pt">Delete</Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent
            maxW="none"
            maxH="none"
            w="auto"
            h="auto"
            overflow="hidden"
          >

          <ModalCloseButton />
          <ModalBody>
            <Flex justify="center" align="center" h="80vh" >
            <Image
              src={imageUrl}
              alt="Question Image"
              borderRadius="lg"
              ref={imageRef}
              onLoad={resizeImage}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />

            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default QuestionItem;
