import React, { useCallback, useEffect, useRef, useState } from "react";
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

export type Answer = {
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
  isLoading: boolean;
  userId?: string;
  selectedFile?: string;
};

const AnswerItem: React.FC<AnswerItemProps> = ({
  answer,
  onDeleteAnswer,
  isLoading,
  userId,
  selectedFile
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loadingImage, setLoadingImage] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleImageLoad = () => {
    setLoadingImage(false);
  };
  const imagePath = "/images/applogo1.png"; 
  useEffect(() => {
    console.log("useeffectanswer", answer.picture)
    if(answer.picture) {
      setImageUrl(answer.picture);
    }
  }, [answer]);
  
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
            {answer.creatorDisplayText}
          </Text>
          {/* {answer.createdAt?.seconds && (
            <Text color="brand.400">
              {moment(new Date(answer.createdAt?.seconds * 1000)).fromNow()}
            </Text>
          )} */}
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
          <Icon as={IoArrowUpCircleOutline} />
          <Icon as={IoArrowDownCircleOutline} />
          {userId === answer.creatorId && (
            <>
              <Text fontSize="9pt" _hover={{ color: "brand.300" }}>
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
