import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { theme } from "@/chakra/theme";
import Layout from "@/components/layout/Layout";
import { RecoilRoot } from "recoil";
//import { UserContext, UserContextType } from "./userContext"; // Change this path to your actual UserContext.tsx path
import { useState } from 'react';

import { UserContext, User } from "@/pages/userContext";

export default function App({ Component, pageProps }: AppProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </RecoilRoot>
    </UserContext.Provider>
  );
}
