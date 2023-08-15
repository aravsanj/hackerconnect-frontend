"use client"

import { Dispatch, SetStateAction, createContext } from "react";

export type profile = {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    dateOfBirth: string,
    about: string,
    title: string,
    username: string,
    profile: string,
    cover: string
  }

type ProfileContext = {
    profile: profile | undefined,
    setProfile: Dispatch<SetStateAction<profile | undefined>>
    refetch: () => void,
    posts: any[] | undefined,
}

const ProfileContext = createContext<ProfileContext>({} as ProfileContext);

export default ProfileContext;