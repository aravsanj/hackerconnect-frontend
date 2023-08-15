import PostComponent from "./Post";
import useFeed from "../feed/hooks/useFeed";

type Props = {};

const Posts = (props: Props) => {
  const { posts } = useFeed();

  if (posts) {
    return (
      <div className="mt-6">
        {posts.map((post, index) => (
          <PostComponent post={post} key={index} />
        ))}
      </div>
    );
  }
};

export default Posts;
