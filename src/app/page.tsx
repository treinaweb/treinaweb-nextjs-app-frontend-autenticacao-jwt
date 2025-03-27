import PostList from "../ui/components/PostList/PostList";
import * as postService from '@/api/service/post.service';

export default async function Home() {
  const posts = await postService.obterTodos();
  return (
    <main>
      <PostList posts={posts}/>
    </main>
  )
}
