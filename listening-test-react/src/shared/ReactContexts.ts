import { createContext } from 'react';

import { UserModel } from './models/UserModel';

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
