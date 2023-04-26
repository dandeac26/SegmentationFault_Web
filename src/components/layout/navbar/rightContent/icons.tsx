import { Box, Flex, Icon, color } from "@chakra-ui/react";
import React from "react";
import { BsArrowUpRightCircle, BsChatDots } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import {
  IoFilterCircleOutline,
  IoNotificationsOutline,
  IoVideocamOutline,
} from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import router, { useRouter } from "next/router";
import { authModalState } from "@/atoms/AuthModalAtom";
import { useSetRecoilState } from "recoil";
import { User } from "firebase/auth";
//import useDirectory from "@/hooks/useDirectory";
type iconsProps = {
  user?: User | null;
};

const icons: React.FC<iconsProps> = ({ user }) => {
  //const { toggleMenuOpen } = useDirectory();
  const setAuthModalState = useSetRecoilState(authModalState);

  const router = useRouter();
  const createQuestion = () => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    router.push(`/submit`);
  };
  return (
    <Flex alignItems="center" flexGrow={1}>
      <Box
        display={{ base: "none", md: "flex" }}
        alignItems="center"
        borderRight="1px solid"
        borderColor="brand.300"
      >
        <Flex
          mr={1.5}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={4}
          color="brand.300"
          _hover={{ bg: "brand.500", color: "brand.400" }}
        >
          <Icon as={BsArrowUpRightCircle} fontSize={20} />
        </Flex>
        <Flex
          mr={1.5}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={4}
          color="brand.300"
          borderColor="brand.300"
          _hover={{ bg: "brand.500", color: "brand.400" }}
        >
          <Icon as={IoFilterCircleOutline} fontSize={22} />
        </Flex>
      </Box>
      <>
        <Flex
          mr={1.5}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={4}
          color="brand.300"
          _hover={{ bg: "brand.500", color: "brand.400" }}
        >
          <Icon as={BsChatDots} fontSize={20} />
        </Flex>
        <Flex
          mr={1.5}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={4}
          color="brand.300"
          _hover={{ bg: "brand.500", color: "brand.400" }}
        >
          <Icon as={IoNotificationsOutline} fontSize={20} />
        </Flex>
        <Flex
          display={{ base: "none", md: "flex" }}
          mr={3}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={4}
          color="brand.300"
          borderColor="brand.300"
          _hover={{ bg: "brand.500", color: "brand.400" }}
          // onClick={toggleMenuOpen}
          onClick={() => createQuestion()}
        >
          <Icon as={AiOutlinePlus} fontSize={26} />
        </Flex>
      </>
    </Flex>
  );
};
export default icons;
