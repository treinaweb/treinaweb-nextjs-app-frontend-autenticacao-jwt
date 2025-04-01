/* eslint-disable @next/next/no-img-element */
import { Post } from '@/api/model/post';
import styles from './PostList.module.css';
import Link from "next/link";
import DeletePost from '../DeletePost/DeletePost';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/api/auth/utils';

export default async function PostList({ posts }: { posts: Post[] }) {
  const token  = (await cookies()).get('auth-token')?.value;
  const user = await getUserFromToken(token as string);

  console.log('old token: -->: ', token);

  return (
    <>
      <ul className={styles.postList}>
      {posts.map((post) => {
        return <PostListItem key={post.id} post={post} />;
      })}
      </ul>
      { (user?.role === 'admin' || user?.role === 'editor') && (
        <div style={{ textAlign: 'center' }}>
        <Link href={'/posts/publish'}>
          <button>Novo Post</button>
        </Link>
      </div>
      )}
    </>
  )
}

export async function PostListItem({ post }: { post: Post }) {
  const token  = (await cookies()).get('auth-token')?.value;
  const user = await getUserFromToken(token as string);

  return (
    <li className={styles.postListItem}>
      <Link href={`posts/${post.slug}`}>
        <img className={styles.postPicture} src={post.picture} alt={post.title} />
        <h2 className={styles.postTitle}>{post.title}</h2>
        <p>{post.description}</p>
      </Link>
      
      {(user?.role === 'admin' || user?.role === 'editor') && (
        <div className={styles.postActions}>
          {(user.role === 'admin') && <DeletePost slug={post.slug} />}
            <Link href={`posts/${post.slug}/edit`}>
              <FontAwesomeIcon icon={faPenToSquare} style={{width: "15px", color: "#000"}}/>
            </Link>
           </div>
      )}
 
    </li>
  )
}