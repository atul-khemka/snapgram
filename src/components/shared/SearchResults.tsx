import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

type SearchResultsProps = {
  isFetching: boolean;
  posts: Models.Document[];
};
const SearchResults = ({ isFetching, posts }: SearchResultsProps) => {
  if (isFetching) return <Loader />;

  if (posts && posts.documents.length > 0)
    return <GridPostList posts={posts.documents} />;
  return (
    <p className='text-light-4 text-center mt-10 w-full'>No results found</p>
  );
};

export default SearchResults;
