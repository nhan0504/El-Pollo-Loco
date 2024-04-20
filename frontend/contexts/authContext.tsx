import React, { useState, useEffect } from 'react';

interface IGlobalContextProps {
  isAuth: boolean;
  setAuth: (auth: boolean) => any;

}

export const authContext = React.createContext<IGlobalContextProps>({
  isAuth: false,
  setAuth: () => undefined
});

export default function AuthProvider(props: any){
  const [auth, setAuth] = useState(false);
  useEffect(()=>{}, []); //check for pollCookie

  return (
    <authContext.Provider
      value={{
        isAuth: auth,
        setAuth: setAuth,
      }}
    >
      {props.children}
    </authContext.Provider>
  );
};