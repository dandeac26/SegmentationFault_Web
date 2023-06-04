import { Button, Flex } from "@chakra-ui/react";
import React from "react";
import AuthButtons from "./AuthButtons";
import AuthModal from "@/components/modal/auth/AuthModal";
//import { User, signOut } from "firebase/auth";
import { User, UserProvider } from "@/pages/userContext";
import { auth } from "@/firebase/clientApp";
import Icons from "./icons";
import UserMenu from "./UserMenu";

type RightContentProps = {
  user?: User | null;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  console.log("this hsould be null",user);
  return (
    <>

    
      <AuthModal />
      <Flex justify="center" align="center">
        {user ? <Icons user={user} /> : <AuthButtons />}
        <UserMenu user={user} />
      </Flex>

    </>
  );
};
export default RightContent;
