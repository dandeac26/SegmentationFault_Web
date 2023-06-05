import { authModalState } from "@/atoms/AuthModalAtom";
import { auth } from "@/firebase/clientApp";
import { Input, Button, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { FIREBASE_ERRORS } from "@/firebase/error";
import bcrypt from "bcryptjs";
import axios, { AxiosError } from "axios";

const SignUp: React.FC = () => {
  const setAuthModalState = useSetRecoilState(authModalState);

  const [signUpFrom, setSignUpForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorr, setError] = useState("");
  const [createUserWithEmailAndPassword, user, loading, userError] =
    useCreateUserWithEmailAndPassword(auth); /// this is from the firebase clientapp

  /// Here needs to be added prob firebase logic
  // const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   if (error) setError("");
  //   if (signUpFrom.password !== signUpFrom.confirmPassword) {
  //     setError("Passwords do not match");
  //     return;
  //   }
  //   // passwd match
  //   createUserWithEmailAndPassword(signUpFrom.email, signUpFrom.password);
  // };
  const [errorMessage, setErrorMessage] = useState("");
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (errorr) setError("");
    if (signUpFrom.password !== signUpFrom.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("Can not use that email");
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(signUpFrom.password, 10);
      
      console.log(hashedPassword);
      // Send user registration data to the backend
      const response = await axios.post("http://localhost:8080/users/register", {
        email: signUpFrom.email,
        password: hashedPassword,
      });

      setError("");
      if (response.status !== 200) {
        // Set the error state to the error message returned by the backend
        setError(response.data);
        return;
    }
    setAuthModalState((prev) => ({
      ...prev,
      view: "login",
    }));
    // If the status code is 200, the registration was successful
    console.log("User registration successful:", response.data);
    createUserWithEmailAndPassword(signUpFrom.email, signUpFrom.password);
    } catch (error) {
        if (axios.isAxiosError(error)) {
          const serverMessage = error.response?.data;
          setError(serverMessage || "An error occurred while processing your request.");
        } else {
          setError("User registration failed. Please try again.");
        }
    }
      
    
    

    // change modal to login
    
    
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <form onSubmit={onSubmit}>
      <Input
        required
        name="email"
        placeholder="email"
        type="email"
        mb={2}
        onChange={onChange}
        fontSize="10pt"
        _placeholder={{
          color: "gray.500",
        }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "brand.300",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "brand.300",
        }}
        bg="gray.50"
      />
      <Input
        required
        name="password"
        placeholder="password"
        type="password"
        onChange={onChange}
        fontSize="10pt"
        mb={2}
        _placeholder={{
          color: "gray.500",
        }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "brand.300",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "brand.300",
        }}
        bg="gray.50"
      />
      <Input
        required
        name="confirmPassword"
        placeholder="confirm password"
        type="password"
        onChange={onChange}
        fontSize="10pt"
        mb={2}
        _placeholder={{
          color: "gray.500",
        }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "brand.300",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "brand.300",
        }}
        bg="gray.50"
      />

      

      <Button
        type="submit"
        width="100%"
        height="36px"
        mt={2}
        isLoading={loading}
      >
        Sign Up
      </Button>
      <Text textAlign="center" color="red" fontSize="10pt">
        {errorr}
      </Text>
      <Flex fontSize="9pt" justifyContent="center" mt={3}>
        <Text mr={1}>Already have an account?</Text>
        <Text
          color="brand.300"
          fontWeight={700}
          cursor="pointer"
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: "login",
            }))
          }
        >
          LOG IN
        </Text>
      </Flex>
    </form>
  );
};
export default SignUp;
