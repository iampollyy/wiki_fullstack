import { ReactElement } from "react";


export interface IRoute {
  path: string;
  element: ReactElement;
  isPrivate?: boolean;
}