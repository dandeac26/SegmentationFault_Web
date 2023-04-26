import React from "react";
import { Stack, Input, Textarea, Flex, Button } from "@chakra-ui/react";

type TextInputsProps = {
  textInputs: {
    title: string;
    body: string;
    tags: string;
  };
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCreateQuestion: () => void;
  loading: boolean;
};

const TextInputs: React.FC<TextInputsProps> = ({
  textInputs,
  onChange,
  handleCreateQuestion,
  loading,
}) => {
  return (
    <Stack spacing={3} width="100%">
      <Input
        name="title"
        value={textInputs.title}
        onChange={onChange}
        color="white"
        focusBorderColor="brand.300"
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "#282e2e",
        }}
        fontSize="10pt"
        borderRadius={4}
        placeholder="Title"
      />
      <Textarea
        name="body"
        color="white"
        value={textInputs.body}
        onChange={onChange}
        fontSize="10pt"
        focusBorderColor="brand.300"
        placeholder="Text (optional)"
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "#282e2e",
        }}
        height="100px"
      />
      <Input
        name="tags"
        value={textInputs.tags}
        onChange={onChange}
        color="white"
        focusBorderColor="brand.300"
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "#282e2e",
        }}
        fontSize="10pt"
        borderRadius={4}
        placeholder="tag1,tag2"
      />
      <Flex justify="flex-end">
        <Button
          height="34px"
          padding="0px 30px"
          disabled={!textInputs.title}
          isLoading={loading}
          onClick={handleCreateQuestion}
        >
          Ask Question
        </Button>
      </Flex>
    </Stack>
  );
};
export default TextInputs;
