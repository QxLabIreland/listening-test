import {createContext} from "react";
import {UserModel} from "./models/UserModel";
import {BasicTaskItemModel} from "./models/BasicTaskModel";

/** This context can set the title of the app bar drawer*/
interface IAppBarTitleContext {
  title: string;
  setTitle: (_: string) => void;
}
export const AppBarTitle = createContext<IAppBarTitleContext>({} as IAppBarTitleContext);

// Global Contexts
/** For detecting if user signed in */
interface IUserContext {
  currentUser: UserModel;
  setCurrentUser: (u: UserModel) => void;
}
export const CurrentUser = createContext<IUserContext>({} as IUserContext);

/** Global Dialog component context */
type DialogCallback = (description: string, title?: string, onDismiss?: () => void, onConfirm?: () => void) => void;
export const GlobalDialog = createContext<DialogCallback>(null);

/** Global Snackbar component context */
type SnackbarCallback = (message: string, time?: number, severity?: 'success' | 'error' | 'warning' | 'info') => void;
export const GlobalSnackbar = createContext<SnackbarCallback>(null);

// Data contexts
/** Task items for cross components use, only read only purpose */
export const TaskItems = createContext<BasicTaskItemModel[]>(null);
