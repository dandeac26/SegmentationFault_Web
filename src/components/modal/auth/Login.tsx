import { ModalView, authModalState } from "@/atoms/AuthModalAtom";
import { auth } from "@/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/firebase/error";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";

type LoginProps = {
  toggleView: (view: ModalView) => void;
};

const Login: React.FC<LoginProps> = ({ toggleView }) => {
  
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
  

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Hash the password
    //const hashedPassword = bcrypt.hashSync(loginFrom.password, 10);

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
      //console.log(hashedPassword);
      const data = await response.json();
      console.log(data);
      if(data.status === 'ok'){
        // set the user in the auth state
        setAuthModalState({
          open: false,
          view: "login",
        });
      }
    } catch (error) {
      console.log("error logging in.", error);
    }
    
    try {
      await signInWithEmailAndPassword(loginFrom.email, loginFrom.password);
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
        {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
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
