import { SearchIcon } from "@chakra-ui/icons";
import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useQuestionsSearch } from "@/pages/questionContext";
import router from "next/router";

const SearchInput: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { setQuestions, setSearchString } = useQuestionsSearch();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    //console.log("arrived here ", e.target.value)
    if(e.target.value !== '') {
      const response = await axios.get('http://localhost:8080/questions/search', {
        params: {
          title: e.target.value,
          author: e.target.value,
          tagName: e.target.value
        }
      });
      //console.log("arrived here 2")
      if (response.status === 200) {
        setQuestions(response.data);
        setSearchString(e.target.value)
        //console.log("arrived here 3", response.data)
      } else {
        throw new Error('Failed to fetch search results');
      }
    } else {
      // Fetch all questions when search input is cleared
      const response = await axios.get('http://localhost:8080/questions/getAll');
      if (response.status === 200) {
        setQuestions(response.data);
        setSearchString("");
        router.push('/')
        //console.log("arrived here 4", response.data)
      } else {
        throw new Error('Failed to fetch questions');
      }
    }
  };

  return (
    <Flex flexGrow={1} mr={2} align="center">
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.300" mb={3} />}
        />
        <Input
          placeholder="search question"
          fontSize="10pt"
          _placeholder={{ color: "grey.500" }}
          _hover={{
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          _focus={{
            outline: "none",
            border: "1px solid",
            borderColor: "lightblue",
          }}
          height="30px"
          bg="gray.50"
          value={searchTerm}
          onChange={handleSearch}
        />
      </InputGroup>
    </Flex>
  );
};
export default SearchInput;
