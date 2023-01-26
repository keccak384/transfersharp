import { blue, gray, green, red } from "@radix-ui/colors";
import { createStitches, globalCss } from "@stitches/react";

export const { styled, getCssText } = createStitches({
  theme: {
    fonts: {
      system: "system-ui",
    },
    colors: {
      ...gray,
      ...blue,
      ...red,
      ...green,
    },
    space: {
      1: "4px",
      2: "8px",
      3: "12px",
      4: "16px",
    },
    fontSizes: {
      1: "14px",
      2: "16px",
      3: "18px",
    },
  },
});

const GlobalStyles = globalCss({
  "*": { margin: 0, padding: 0 },
  input: {
    appearance: "textfield",
  },
  body: {
    //we can call the color token values with the
    //$ prefix in a string
    background: "$background",
    color: "$gray11",
    fontSize: "$2",
    fontFamily: "$system",
  },
});

GlobalStyles();
