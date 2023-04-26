import { ComponentStyleConfig } from "@chakra-ui/theme";

export const Button: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: "60px",
    fontSize: "10pt",
    fontWeight: 700,
    _focus: {
      boxShadow: "none",
    },
  },
  sizes: {
    sm: {
      fontSize: "8pt",
    },
    md: {
      fontSize: "10pt",
      // height: "28px",
    },
  },
  variants: {
    solid: {
      color: "white",
      bg: "brand.300",

      _hover: {
        bg: "brand.500",
      },
    },
    outline: {
      color: "brand.400",
      border: "1px solid",
      borderColor: "brand.400",
      _hover: {
        bg: "brand.600",
      },
    },
    oauth: {
      height: "34px",
      border: "1px solid",
      borderColor: "brand.300",
      _hover: {
        bg: "bg.50",
      },
    },
  },
};
