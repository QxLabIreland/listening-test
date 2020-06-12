import React from "react";

interface IAppBarTitleContext {
  title: string;
  setTitle: (_: string) => void;
}

export const AppBarTitleContext = React.createContext({} as IAppBarTitleContext);

interface IUserContext {
  user: any;
  setUser: (_: any) => void;
}

export const CurrentUserContext = React.createContext({setUser: (_)=>{}} as IUserContext);
