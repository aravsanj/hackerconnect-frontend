import { useContext } from "react";
import FeedContext from "../contexts/feedContext";

function useFeed() {
  return useContext(FeedContext);
}

export default useFeed;
