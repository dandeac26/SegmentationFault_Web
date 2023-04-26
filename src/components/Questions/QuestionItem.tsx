import React, { useState } from "react";
import {
  Flex,
  Icon,
  Image,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
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
  userIsCreator,
  homePage,
}) => {
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const singleQuestionView = !onSelectQuestion; // function not passed to [pid]

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
      /**
       * Don't need to setLoading false if no error
       * as item will be removed from DOM
       */
      setLoadingDelete(false);
      // setError
    }
  };

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
        width="40px"
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
      <Flex direction="column" width="100%" bg="brand.400">
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
          {question.imageURL && (
            <Flex justify="center" align="center" p={2}>
              {loadingImage && (
                <Skeleton height="200px" width="100%" borderRadius={4} />
              )}
              <Image
                // width="80%"
                // maxWidth="500px"
                maxHeight="460px"
                src={question.imageURL}
                display={loadingImage ? "none" : "unset"}
                onLoad={() => setLoadingImage(false)}
                alt="Question Image"
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
    </Flex>
  );
};

export default QuestionItem;
