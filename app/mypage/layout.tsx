import MyPageNav from "@/components/MyProfile/MyPageNav";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex justify-center">
      <div className="flex w-[90%] justify-center gap-12">
        <MyPageNav />
        {children}
      </div>
    </div>
  );
}
