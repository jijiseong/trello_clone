import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    backgroundColor: string;
    cardColor: string;
    boardColor: string;
    accentColor: string;
  }
}
