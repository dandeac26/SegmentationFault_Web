import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { theme } from "@/chakra/theme";
import Layout from "@/components/layout/Layout";
import { RecoilRoot } from "recoil";
import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode'; // Don't forget to install jwt-decode

import { UserContext, User } from "@/pages/userContext";
import { IoCodeSlashOutline } from "react-icons/io5";
import { QuestionsProvider } from "./questionContext";

export default function App({ Component, pageProps }: AppProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // On mount, check if a token exists in local storage
  console.log("this is app running")
  useEffect(() => {
    // Get JWT from localStorage
    const jwt = localStorage.getItem('token');
    console.log("this is jwt", jwt)
    if (jwt) {
      // Decode the JWT
      const decodedToken: any = jwt_decode(jwt);
      console.log("this is decodedToken", decodedToken)
      // Check if the JWT is expired
      const currentTime = Date.now().valueOf() / 1000;
      // if (decodedToken.exp > currentTime) {
        setCurrentUser({
          id: decodedToken.sub,
          email: decodedToken.email
        });
        console.log("this is decodedToken", decodedToken)
      // }
      //  else {
      //   // JWT is expired, remove it from localStorage
      //   localStorage.removeItem('token');
      //   setCurrentUser(null);
      // }
    }
  }, []);
  

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <QuestionsProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </QuestionsProvider>
        </ChakraProvider>
      </RecoilRoot>
    </UserContext.Provider>
  );
}
