import { useContext } from "react";
import FeedContext, { FeedContextType } from "../contexts/feedContext";


function useFeed() {
  return useContext<FeedContextType>(FeedContext);
}

export default useFeed;
