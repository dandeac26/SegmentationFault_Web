// import { ModalView, authModalState } from "@/atoms/AuthModalAtom";
// import { Button, Flex, Input, Text } from "@chakra-ui/react";
// import React, { useState, useContext } from "react";
// import { useSetRecoilState } from "recoil";
// import { UserContext, UserContextType } from "@/pages/userContext";

import { ModalView, authModalState } from "@/atoms/AuthModalAtom";
import { auth } from "@/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/firebase/error";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { UserContext, UserContextType } from "@/pages/userContext";


type LoginProps = {
  toggleView: (view: ModalView) => void;
};

const Login: React.FC<LoginProps> = ({ toggleView }) => {

  const userContext = useContext(UserContext) as UserContextType;

  //const { setCurrentUser } = useContext(UserContext);
  const setAuthModalState = useSetRecoilState(authModalState);
  
  const [loginFrom, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);

  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try{
      // send login data to the backend API
      const response = await fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: loginFrom.email,
          password: loginFrom.password
        })
      });

      const data = await response.json();
       // Check if JWT exists in response
       console.log("data.token", data.token);
       if (data.token) {
        // Store JWT in local storage
        localStorage.setItem('token', data.token);
      } else {
        console.log("No JWT found in response.");
      }
      console.log(data);
      console.log(data.id);
      if(data.status === 'ok'){
        // set the user in the auth state
        setAuthModalState({
          open: false,
          view: "login",
        });
        userContext.setCurrentUser({
          id: data.id,
          email: data.email,
        });
        
        
      }else if(data.status === 'error'){
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.log("error logging in.", error);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }))
  }

  return  (
    <form onSubmit={onSubmit}>
      <Input
        required
        name="email"
        placeholder="email"
        type="email"
        mb={2}
        onChange={onChange}
        fontSize='10pt'
        _placeholder={{
          color:"gray.500"
        }}
        _hover={{
          bg:"white",
          border:"1px solid",
          borderColor: "brand.300",
        }}
        _focus={{
          outline: "none",
          bg:"white",
          border:"1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
      />
      <Input
        required
        name = "password"
        placeholder="password"
        type="password"
        onChange={onChange}
        fontSize='10pt'
        mb={2}
        _placeholder={{
          color:"gray.500"
        }}
        _hover={{
          bg:"white",
          border:"1px solid",
          borderColor: "brand.300",
        }}
        _focus={{
          outline: "none",
          bg:"white",
          border:"1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
      />
      <Text textAlign="center" color="red" fontSize="10pt">
        {errorMessage}
      </Text>
      <Button
        type="submit"
        width="100%"
        height="36px"
        isLoading={loading}
        mt={2}
        mb={1}
      >Log In
      </Button>
      <Flex justifyContent="center" mb={2}>
        <Text fontSize="9pt" mr={1}>
          Forgot your password?
        </Text>
        <Text
          fontSize="9pt"
          color="brand.300"
          cursor="pointer"
          onClick={() => toggleView("resetPassword")}
        >
          Reset
        </Text>
      </Flex>
      <Flex fontSize='9pt' justifyContent='center' mt={3}>
        <Text mr={1}>New here?</Text>
        <Text
          color="brand.300"
          fontWeight={700}
          cursor="pointer"
          onClick={() => toggleView("signup")}
        >
          SIGN UP
        </Text>

      </Flex>
    </form>
  )
};
export default Login;
