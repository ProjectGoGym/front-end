"use client";

import PostItem from "./PostItem";

interface PostType {
  amount: number;
  authorNickname: string;
  createdAt: string;
  gymName: string;
  postId: string;
  imageUrl1: string;
  status: string;
  title: string;
  wishCount: number;
}

export default function PostList({ data }: { data?: PostType[] }) {
  // const { data: defaultData, isPending } = useQuery({
  //   queryKey: ["default"],
  //   queryFn: async () => (await axios.get("http://localhost:4000/posts")).data,
  //   staleTime: 10000,
  // });

  // console.log(defaultData);

  // if (!data && isPending) {
  //   return <p>데이터 로딩중...</p>;
  // }

  return (
    data &&
    data.map((post: PostType) => <PostItem key={post.postId} {...post} />)
  );
}
