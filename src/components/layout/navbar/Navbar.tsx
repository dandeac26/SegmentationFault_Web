import React from "react";
import { Flex, Image } from "@chakra-ui/react";
import SearchInput from "./SearchInput";
import RightContent from "./rightContent/RightContent";
import { auth } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  return (
    <Flex
      bg="brand.900"
      height="45px"
      padding="6px 12px"
      border="1px"
      borderColor="brand.900"
      borderBottomColor="black"
    >
      <Flex align="center">
        <Image
          src="/images/applogo.png"
          height="36px"
          marginRight="5px"
          _hover={{
            cursor: "pointer",
          }}
          onClick={() => router.push(`/`)}
        />
        <Image
          src="/images/title_app.svg"
          height="45px"
          marginRight="5px"
          display={{ base: "none", md: "unset" }}
          _hover={{
            cursor: "pointer",
          }}
          onClick={() => router.push(`/`)}
        />
      </Flex>
      <SearchInput />
      <RightContent user={user} />
    </Flex>
  );
}; // this is a comment
export default Navbar;
