import React from "react";
import { Flex, Icon, Text } from "@chakra-ui/react";

export type TabItem = {
  title: string;
  icon: typeof Icon.arguments;
};
type TabItemProps = {
  item: TabItem;
  selected: boolean;
  setSelectedTab: (value: string) => void;
};

const TabItem: React.FC<TabItemProps> = ({
  item,
  selected,
  setSelectedTab,
}) => {
  return (
    <Flex
      justify="center"
      align="center"
      flexGrow={1}
      p="14px 0px"
      cursor="pointer"
      fontWeight={700}
      color={selected ? "brand.400" : "brand.400"}
      borderWidth={selected ? "0px 1px 2px 0px" : "0px 1px 1px 0px"}
      borderBottomColor={selected ? "brand.500" : "brand.300"}
      borderRightColor="brand.300"
      _hover={{ bg: "brand.300" }}
      onClick={() => setSelectedTab(item.title)}
    >
      <Flex align="center" height="20px" mr={2}>
        <Icon height="100%" as={item.icon} fontSize={18} />
      </Flex>
      <Text fontSize="10pt">{item.title}</Text>
    </Flex>
  );
};
export default TabItem;
