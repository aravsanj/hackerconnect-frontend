"use client";

import { createContext } from "react";

type FeedContext = {
    posts: any[] | undefined
    refetch: () => void
}

const FeedContext = createContext({} as FeedContext);

export default FeedContext;
