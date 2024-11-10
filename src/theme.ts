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

// #265e39
const myGreen: MantineColorsTuple = [
  "#f0f9f3",
  "#e2f0e6",
  "#bfe0ca",
  "#9ad1ac",
  "#7ac392",
  "#67bb81",
  "#5bb778",
  "#4ba066",
  "#418f5a",
  "#327b4b"
];

export const theme = createTheme({
  /* Put your mantine theme override here */
  colors: {
    paleIndigo,
    myGreen
  }
});
