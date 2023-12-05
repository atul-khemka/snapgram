import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { postFormSchema } from "@/lib/validation";
import { Models } from "appwrite";
import {
  useCreatePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
} from "@/lib/react-query/mutation";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";

type PostFormProp = {
  post?: Models.Document;
  action: "create" | "update";
};

const PostForm = ({ post, action }: PostFormProp) => {
  const { user } = useUserContext();
  const { mutateAsync: createPost, isPending } = useCreatePostMutation();
  const { mutateAsync: updatePost, isPending: isUpdating } =
    useUpdatePostMutation();
  const { mutateAsync: deletePost } = useDeletePostMutation();
  const { toast } = useToast();
  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post.tags.join(", ") : "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof postFormSchema>) {
    if (post && action === "update") {
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl,
      });
      if (!updatedPost) toast({ title: "Please try again" });
      return navigate(`/post/${post.$id}`);
    }
    const newPost = await createPost({
      ...values,
      userId: user.id,
    });
    if (!newPost) toast({ title: "Please try again" });
    navigate("/");
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-9 w-full max-w-5xl'
      >
        <FormField
          control={form.control}
          name='caption'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Caption</FormLabel>
              <FormControl>
                <Textarea
                  className='shad-textarea custom-scrollbar'
                  {...field}
                />
              </FormControl>
              <FormMessage className='shad-form_message' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='file'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className='shad-form_message' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='location'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Add Location</FormLabel>
              <FormControl>
                <Input type='text' className='shad-input' {...field} />
              </FormControl>
              <FormMessage className='shad-form_message' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='tags'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>
                Add tags (comma separated)
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='shad-input'
                  {...field}
                  placeholder='Art, Easy, Exp'
                />
              </FormControl>
              <FormMessage className='shad-form_message' />
            </FormItem>
          )}
        />
        <div className='flex gap-4 items-center justify-end'>
          <Button type='button' className='shad-button_dark_4'>
            Cancel
          </Button>
          <Button
            type='submit'
            className='shad-button_primary whitespace-nowrap'
            disabled={isPending || isUpdating}
          >
            {isPending || isUpdating ? "Loading..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
