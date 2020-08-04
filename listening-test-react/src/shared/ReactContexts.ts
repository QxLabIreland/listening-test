import {createContext} from "react";
import {UserModel} from "./models/UserModel";

// This context can set the title of the app bar drawer
interface IAppBarTitleContext {
  title: string;
  setTitle: (_: string) => void;
}
export const AppBarTitle = createContext<IAppBarTitleContext>({} as IAppBarTitleContext);

/** Global Contexts*/
// For detecting if user signed in
interface IUserContext {
  currentUser: UserModel;
  setCurrentUser: (u: UserModel) => void;
}
export const CurrentUser = createContext<IUserContext>({} as IUserContext);

// Components Contexts
type DialogCallback = (description: string, title?: string, onDismiss?: () => void, onConfirm?: () => void) => void;
export const GlobalDialog = createContext<DialogCallback>(null);

type SnackbarCallback = (message: string, time?: number) => void;
export const GlobalSnackbar = createContext<SnackbarCallback>(null);
