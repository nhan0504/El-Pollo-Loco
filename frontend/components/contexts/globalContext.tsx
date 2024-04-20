import React, { useState } from 'react';

interface IGlobalContextProps {
  user_id: any;
  isAuth: boolean;
  setUser: (user_id: any) => void;
  setAuth: (auth: boolean) => void;
}

export const GlobalContext = React.createContext<IGlobalContextProps>({
  user_id: {},
  isAuth: false,
  setUser: () => {},
  setAuth: () => {},
});

export const GlobalContextProvider = (props) => {
  const [currentUser, setCurrentUser] = useState({});
  const [Auth, setIsAuth] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        user_id: currentUser,
        isAuth: Auth,
        setUser: setCurrentUser,
        setAuth: setIsAuth,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};