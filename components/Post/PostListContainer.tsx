import Link from 'next/link';
import Filter from './Filter';
import PostList from './PostList';

export default function PostListContainer() {
  return (
    <div className=" flex flex-col mt-12 w-[70%]">
      <div className=" flex justify-between items-center">
        <p className=" mb-12 text-2xl font-bold">양도 회원권</p>
        <Link href={'/community/editpost'}>
          <button className=" p-1 pl-4 pr-4 rounded-lg bg-blue-300 text-2xl text-white hover:bg-blue-500 transition-all">
            글쓰기
          </button>
        </Link>
      </div>
      <div className=" mb-12">
        <Filter />
      </div>
      <PostList />
    </div>
  );
}
