"use client";

import Image from "next/image";
import logo from "../../public/logo_transparent.png";
import Link from "next/link";
import useLoginStore from "@/store/useLoginStore";
import { FaBell } from "react-icons/fa";
import DefaultProfile from "./DefaultProfile";
import AdminNav from "./AdminNav";
import Notice from "../Notification/Notice";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState } from "react";
import MobileMenu from "./MoblieMenu";
import useUserStore from "@/store/useUserStore";

export default function Nav() {
  const { loginState, adminLoginState, logout } = useLoginStore();
  const { LogoutUser } = useUserStore();
  const [modal, setModal] = useState(false);
  const [menuModal, setMenuModal] = useState(false);

  const toggleModal = () => {
    setModal((prev) => !prev);
  };
  const handleToggleMenuModal = () => {
    setMenuModal((prev) => !prev);
  };

  if (adminLoginState) {
    return <AdminNav />;
  }

  return (
    <div className="h-18 relative z-40 flex justify-center border-b border-[#ccc] shadow-md">
      <div className="flex w-[100%] items-center justify-between pl-2 pr-2 sm:w-[80%]">
        <div className="flex items-center">
          <button className="sm:hidden" onClick={handleToggleMenuModal}>
            <RxHamburgerMenu size={24} />
          </button>
          {menuModal && (
            <MobileMenu onToggleMenuModal={handleToggleMenuModal} />
          )}
          <Link href={"/"}>
            <Image
              src={logo}
              alt="Go GYM Logo"
              width={120}
              className="m-2 ml-8 cursor-pointer"
              priority
            />
          </Link>
        </div>
        <div className="mr-8 flex items-center gap-4">
          <Link
            href={"/community"}
            className="hidden font-semibold transition-all hover:text-blue-500 sm:block"
          >
            양도 게시판
          </Link>
          <Link
            href={"/chat"}
            className="hidden font-semibold transition-all hover:text-blue-500 sm:block"
          >
            채팅방
          </Link>

          <button>
            <FaBell className="h-6 w-10 text-blue-400" onClick={toggleModal} />
          </button>
          {modal && <Notice />}

          {loginState ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="avatar btn btn-circle btn-ghost"
              >
                <DefaultProfile width="10" />
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content menu-sm relative z-50 mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
              >
                <li>
                  <Link href={"/mypage"} className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </Link>
                </li>
                <li>
                  <p
                    onClick={() => {
                      logout();
                      LogoutUser();
                    }}
                  >
                    Logout
                  </p>
                </li>
              </ul>
            </div>
          ) : (
            <Link
              href={"/login"}
              className="font-semibold transition-all hover:text-blue-500"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
