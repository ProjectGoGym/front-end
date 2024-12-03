import { create } from "zustand";
interface SignupState {
  name: string;
  email: string;
  nickname: string;
  phone: string;
  password: string;
  area: string;
  area2: string;
  profileImageUrl: string;
  isEmailAvailable: boolean;
  isNicknameAvailable: boolean;

  // 상태 변경 메소드
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setNickname: (nickname: string) => void;
  setPhone: (phone: string) => void;
  setPassword: (password: string) => void;
  setArea: (area: string) => void;
  setArea2: (area2: string) => void;
  setProfileImageUrl: (profileImageUrl: string) => void;
  setEmailAvailability: (isAvailable: boolean) => void;
  setNicknameAvailability: (isAvailable: boolean) => void;
}
const useSignupStore = create<SignupState>((set) => ({
  name: "",
  email: "",
  nickname: "",
  phone: "",
  password: "",
  area: "",
  area2: "",
  profileImageUrl: "",
  isEmailAvailable: false,
  isNicknameAvailable: false,

  // 상태 변경 메소드들
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setNickname: (nickname) => set({ nickname }),
  setPhone: (phone) => set({ phone }),
  setPassword: (password) => set({ password }),
  setArea: (area) => set({ area }),
  setArea2: (area2) => set({ area2 }),
  setProfileImageUrl: (profileImageUrl) => set({ profileImageUrl }),
  setEmailAvailability: (isAvailable) => set({ isEmailAvailable: isAvailable }),
  setNicknameAvailability: (isAvailable) =>
    set({ isNicknameAvailable: isAvailable }),
}));

export default useSignupStore;
