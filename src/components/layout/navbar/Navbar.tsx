import React, { useContext } from "react";
import { Flex, Image } from "@chakra-ui/react";
import SearchInput from "./SearchInput";
import RightContent from "./rightContent/RightContent";
import { useRouter } from "next/router";
import { User, UserContext, UserProvider } from "@/pages/userContext";

const Navbar: React.FC = () => {
  const router = useRouter();
  const user = null; // Update with the appropriate user value from your UserContext
  const { currentUser } = useContext(UserContext) as { currentUser: User | null };
  console.log("this should be the user", currentUser)
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
      <RightContent user={currentUser} />
    </Flex>

  );
};

export default Navbar;
