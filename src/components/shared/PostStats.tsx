import {
  useDeleteSavedPostMutation,
  useLikePostMutation,
  useSavePostMutation,
} from "@/lib/react-query/mutation";
import { useGetCuurentUser } from "@/lib/react-query/query";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { useEffect, useState } from "react";
import Loader from "./Loader";

type PostStatsProps = {
  post?: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList = post?.likes.map((user: Models.Document) => user.$id);
  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutateAsync: likePost } = useLikePostMutation();
  const { mutateAsync: savePost, isPending } = useSavePostMutation();
  const { mutateAsync: deleteSavedPost, isPending: isDeleting } =
    useDeleteSavedPostMutation();
  const { data: currentUser } = useGetCuurentUser();

  const savePostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post?.$id
  );

  useEffect(() => {
    setIsSaved(!!savePostRecord);
  }, [currentUser]);

  const handleLikePost = async (e: React.MouseEvent) => {
    e.stopPropagation();
    let newLikes = [...likes];
    const hasLiked = newLikes.includes(userId);
    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }
    setLikes(newLikes);
    await likePost({ postId: post?.$id || '', likesList: newLikes });
  };

  const handleSavePost = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (savePostRecord) {
      setIsSaved(false);
      await deleteSavedPost({ savedId: savePostRecord.$id });
    } else {
      await savePost({ postId: post?.$id || '', userId: userId });
      setIsSaved(true);
    }
  };

  return (
    <div className='flex justify-between items-center z-20'>
      <div className='flex gap-2 mr-5'>
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt='like'
          width={20}
          height={20}
          onClick={handleLikePost}
          className='cursor-pointer'
        />
        <p className='small-medium lg:base-medium'>{likes.length}</p>
      </div>
      <div className='flex gap-2'>
        {isPending || isDeleting ? (
          <Loader />
        ) : (
          <img
            src={`${
              isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"
            }`}
            alt='save'
            width={20}
            height={20}
            onClick={handleSavePost}
            className='cursor-pointer'
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
