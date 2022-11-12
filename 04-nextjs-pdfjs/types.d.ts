import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      customWhite: string;
      customBlack: string;
    };
  }
}