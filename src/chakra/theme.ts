import { extendTheme } from "@chakra-ui/react";
import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import { Button } from "./buttons";
// 2. Call `extendTheme` and pass your custom values
export const theme = extendTheme({
  colors: {
    brand: {
      100: "#2C3333",
      200: "#2E4F4F",
      300: "#0E8388",
      400: "#CBE4DE",
      450: "#71998f",
      500: "#13979C",
      600: "#3D4545",
      700: "#528377",
      800: "#354141",
      900: "#1b1d1d",
    },
    barnd_plus: {
      100: "#5F9EA0",
      200: "#A9A9A9",
      300: "#D3D3D3",
      400: "#F5F5F5",
      500: "#FFA07A",
      600: "#FFD700",
      700: "#B8860B",
      800: "#BC8F8F",
      900: "#DDA0DD",
    },
  },
  fonts: {
    body: "Open Sans, sans-serif",
  },
  styles: {
    global: () => ({
      body: {
        bg: "#CBE4DE",
      },
    }),
  },
  components: {
    Button,
  },
});
