'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PostItem from './PostItem';

interface PostType {
  amount: number;
  authorNickName: string;
  created_at: string;
  gymName: string;
  id: string;
  imageUrl1: string;
  postStatus: string;
  title: string;
  wishCount: number;
}

export default function PostList() {
  const { data } = useQuery({
    queryKey: ['post'],
    queryFn: async () => (await axios.get('http://localhost:4000/posts')).data,
    staleTime: 1000 * 10,
  });

  return (
    <div className=" flex flex-wrap justify-center gap-8 mb-12 w-full ">
      {data &&
        data.map((post: PostType) => <PostItem key={post.id} {...post} />)}
    </div>
  );
}
