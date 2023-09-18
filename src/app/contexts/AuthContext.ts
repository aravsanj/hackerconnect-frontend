"use client";

import { Dispatch, SetStateAction, createContext } from "react";

export type AuthContextType = {
  email: string;
  phone: string;
  setEmail: Dispatch<SetStateAction<string>>;
  setPhone: Dispatch<SetStateAction<string>>;
  setIsRedirectedFromLogin: Dispatch<SetStateAction<boolean>>
  setIsPhoneVerified: Dispatch<SetStateAction<boolean>>
  setIsEmailVerified: Dispatch<SetStateAction<boolean>>
  isRedirectedFromLogin: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isRedirectedFromRegister: boolean;
  setIsRedirectedFromRegister: Dispatch<SetStateAction<boolean>>
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default AuthContext;
