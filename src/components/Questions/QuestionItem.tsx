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
import { Question } from "@/atoms/questionsAtom";
import Link from "next/link";
import { UserContext, UserContextType } from "@/pages/userContext";


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
  const { isOpen, onOpen, onClose } = useDisclosure(); // State and functions for controlling the modal

  const imageRef = useRef<HTMLImageElement>(null);
  const userContext = useContext(UserContext) as UserContextType;

  const handleImageLoad = () => {
    setLoadingImage(false);
  };


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
  
  
  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setLoadingDelete(true);
    try {
      const success = await onDeleteQuestion(question);
      if (!success) throw new Error("Failed to delete question");

      console.log("Question successfully deleted");

      // Could proably move this logic to onDeleteQuestion function
      if (router) router.back();
    } catch (error: any) {
      console.log("Error deleting question", error.message);
      setLoadingDelete(false);
    }
  };

  useEffect(() => {
    const fetchImagePath = async () => {
      try {
        console.log("question.id : ", question.id);
        const response = await axios.get(
          `http://localhost:8080/questions/getById/${question.id}`
        );
        setImageUrl(response.data.picture);
        setQuestionData(response.data);
        console.log("Question Data: ", questionData.creatorId);
        console.log("Server Response: ", response); // Print the response
      } catch (error) {
        console.error("Error fetching image path", error);
      }
    };

    fetchImagePath();
  }, [question.id]);

  useEffect(() => {
    window.addEventListener("resize", resizeImage);

    return () => {
      window.removeEventListener("resize", resizeImage);
    };
  }, []);


  const [userIsCreator, setUserIsCreator] = useState(false);


  useEffect(() => {
    //console.log("userContext.currentUser: ", userContext.currentUser.id + ' ' +  question.creatorId);
    if(userContext.currentUser) console.log("userContext.currentUser.id: ", userContext.currentUser.id);
    //console.log("question.creatorId : ", question.creatorId);
    //console.log("here is quest", question)
    if (question && userContext.currentUser) {
      setUserIsCreator(question.author_id === userContext.currentUser.id);
      
    } else {
      setUserIsCreator(false);
    }
  }, [question, userContext.currentUser]);
  
  

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
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "#b3d4cc" }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize="9pt">Save</Text>
          </Flex>
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
