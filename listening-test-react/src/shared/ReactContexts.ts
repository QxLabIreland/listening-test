import { createContext } from 'react';

import { BasicTaskModel } from './models/BasicTaskModel';
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

// Data contexts
/** Task model for cross components use, only read only purpose */
export const DetailTaskModel = createContext<BasicTaskModel>(null);
