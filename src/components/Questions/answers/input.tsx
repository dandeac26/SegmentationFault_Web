import React, { MouseEventHandler, useEffect, useRef, useState } from "react";
import { Flex, Textarea, Button, Text } from "@chakra-ui/react";
import { User } from "@/pages/userContext";
import AuthButtons from "@/components/layout/navbar/rightContent/AuthButtons";

type AnswerInputProps = {
  answer: string;
  setAnswer: (value: string) => void;
  loading: boolean;
  user: User | null;
  onCreateAnswer: (answer: string, selectedFile: string | undefined) => void;
};




const AnswerInput: React.FC<AnswerInputProps> = ({
  answer,
  setAnswer,
  loading,
  user,
  onCreateAnswer,
}) => {


  const [selectedFile, setSelectedFile] = useState<string>();
  const selectFileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
      const base64data = reader.result as string;
      setSelectedFile(base64data);
    }
    console.log("selfile", selectedFile)
  };


  return (
    <Flex direction="column" position="relative">
      {user ? (
        <>
          <Text mb={1} color="gray.300">
            Answer as{" "}
            <span
              style={{
                color: "#59c4c9",
              }}
            >
              {user?.email?.split("@")[0]}
            </span>
          </Text>
          
          <Textarea
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Have an answer?"
            fontSize="10pt"
            borderRadius={4}
            bg="#2e4f4f"
            minHeight="160px"
            textColor="white"
            pb={10}
            _placeholder={{ color: "gray.500" }}
            _focus={{
              outline: "none",
              bg: "#335555",
              border: "1px solid black",
            }}
          />
          <Flex
            position="absolute"
            left="1px"
            right={0.1}
            bottom="1px"
            justify="flex-end"
            bg="#446767"
            p="6px 8px"
            borderRadius="0px 0px 4px 4px"
          >
            <input
              type="file"
              ref={selectFileRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <Button onClick={() => selectFileRef.current!.click()}
              height="26px"
              mr="8px"
            >Upload Picture</Button>

            <Button
              height="26px"
              disabled={!answer.length}
              isLoading={loading}
              onClick={() =>{
                onCreateAnswer(answer, selectedFile);
                setSelectedFile(undefined);
              
              }}
            >
              Answer
            </Button>
          </Flex>
        </>
      ) : (
        <Flex
          align="center"
          justify="space-between"
          borderRadius={2}
          border="1px solid"
          borderColor="gray.100"
          p={4}
        >
          <Text fontWeight={600} fontSize="10pt" color="white"
            >Log in or sign up to leave a answer</Text>
          <AuthButtons />
        </Flex>
      )}
    </Flex>
  );
};
export default AnswerInput;
