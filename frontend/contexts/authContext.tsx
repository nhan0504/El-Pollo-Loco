'use client';
import React, { useState, useEffect } from 'react';

interface IGlobalContextProps {
  isAuth: boolean;
  setAuth: (auth: boolean) => any;
}

export const AuthContext = React.createContext<IGlobalContextProps>({
  isAuth: false,
  setAuth: () => undefined,
});

export default function AuthProvider(props: any) {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    fetch(`${process.env.BACKEND_URL}/auth/is_authenticated`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) {
          setAuth(true);
        } else {
          //This branch is probably redundant.
          setAuth(false);
        }
      })
      .catch();
  }, []);

  //useEffect(()=>console.log("AUTH: " + auth ), [auth]); //Debugging.

  return (
    <AuthContext.Provider
      value={{
        isAuth: auth,
        setAuth: setAuth,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
