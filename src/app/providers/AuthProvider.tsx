"use client";

import { useState } from "react";
import AuthContext from "../contexts/AuthContext";

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isRedirectedFromLogin, setIsRedirectedFromLogin] = useState(false);
  const [isRedirectedFromRegister, setIsRedirectedFromRegister] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [isPhoneVerified, setIsPhoneVerified] = useState(true); 

  return (
    <AuthContext.Provider
      value={{
        email,
        phone,
        setEmail,
        setPhone,
        setIsRedirectedFromLogin,
        isRedirectedFromLogin,
        setIsEmailVerified,
        setIsPhoneVerified,
        isPhoneVerified,
        isEmailVerified,
        isRedirectedFromRegister,
        setIsRedirectedFromRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
