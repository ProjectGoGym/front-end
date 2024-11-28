export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 팀 정보 */}
          <div>
            <h2 className="text-lg font-bold">Go GYM</h2>
            <p className="text-sm mt-2">
              믿을 수 있는 헬스장 회원권 거래 플랫폼.
            </p>
          </div>

          {/* 링크 섹션 */}
          <div>
            <h3 className="font-bold">Links</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <a
                  href="https://www.notion.so/GO-GYM-14234167454980229db4fbfb9cdd998a?pvs=4"
                  className="text-sm hover:text-gray-400"
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* SNS / 연락처 */}
          <div>
            <h3 className="font-bold">Follow Us</h3>
            <ul className="mt-2 flex space-x-4">
              <li>
                <a
                  href="https://github.com/ProjectGoGym"
                  className="hover:text-gray-400"
                >
                  github
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 영역 */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
          <p>Designed and built by GO GYM</p>
          <p className="text-sm mt-2">© 2024 zerobase.</p>
        </div>
      </div>
    </footer>
  );
}
