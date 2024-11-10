import { createTheme, MantineColorsTuple } from "@mantine/core";

const paleIndigo: MantineColorsTuple = [
  '#eff2ff',
  '#dfe2f2',
  '#bdc2de',
  '#99a0ca',
  '#7a84b9',
  '#6672af',
  '#5c69ac',
  '#4c5897',
  '#424e88',
  '#36437a'
];

export const theme = createTheme({
  /* Put your mantine theme override here */
  colors: {
    paleIndigo,
  }
});
