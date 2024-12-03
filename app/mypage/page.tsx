import ChangeProfile from '@/components/MyProfile/Profile';
import GympayBox from '@/components/MyProfile/GympayBox';

export default function MyPage() {
  return (
    <div className=" flex justify-center">
      <div className=" flex flex-col w-[75%] gap-12">
        <ChangeProfile />
        <GympayBox />
      </div>
    </div>
  );
}
