import {Button, createTheme, rem} from "@mantine/core";

const Theme = createTheme({
  white: "#f8f9fa",
  black: "#242424",
  /** Object of colors, key is color name, value is an array of at least 10 strings (colors) */
  colors: {},
  primaryShade: { light: 6, dark: 8 },
  primaryColor: "violet",
  fontFamily: "Open Sans, sans-serif",
  headings: {
    fontFamily: "Roboto, sans-serif",
    sizes: {
      h1: { fontSize: rem(36) },
    },
  },
  defaultRadius: 5,
  defaultGradient: {
    from: "violet.4",
    to: "violet.9",
    deg: 45,
  },
  components: {
    Button: Button.extend({
      defaultProps: {
        variant: "gradient",
      },
    }),
  },
});
// To access elements in this object:
// const theme = useMantineTheme();
// or
// import { DEFAULT_THEME } from '@mantine/core';

export default Theme;
