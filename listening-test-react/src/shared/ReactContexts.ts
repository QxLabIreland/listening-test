import {createContext} from "react";

// This context can set the title of the app bar drawer
interface IAppBarTitleContext {
  title: string;
  setTitle: (_: string) => void;
}
export const AppBarTitle = createContext({} as IAppBarTitleContext);

/** Global Contexts*/
// For detecting if user signed in
interface IUserContext {
  user: any;
  setUser: (_: any) => void;
}
export const CurrentUser = createContext({setUser: (_)=>{}} as IUserContext);

// Components Contexts
export const GlobalDialog = createContext<(
  description: string, title?: string, onDismiss?: () => void, onConfirm?: () => void
) => void>(null);
