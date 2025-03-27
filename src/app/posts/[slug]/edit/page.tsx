import * as postService from "@/api/service/post.service";
import EditPostForm from "@/ui/components/EditPostForm/EditPostForm";
import { notFound } from "next/navigation";


export default async function PostEdit( {params} : {params: {slug: string}}) {
  const { slug } = await params;
  const post = await postService.obterPorSlug(slug);

  if(!post) {
    notFound();
  };

  return (
    <EditPostForm post={post}/>
  )
}