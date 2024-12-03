import { create } from "zustand";

interface LoginState {
  loginState: boolean;
  token: string | null;
  expirationTime: number;
  login: (token: string) => void;
  logout: () => void;
  checkTokenExpiration: () => void;
}

const useLoginStore = create<LoginState>((set) => ({
  loginState: false,
  token: null,
  expirationTime: 0,

  login: (token: string) => {
    // 1시간 후 만료
    const expirationTime = Date.now() + 3600000;
    set({
      loginState: true,
      token,
      expirationTime,
    });

    setTimeout(() => {
      set({ loginState: false, token: null });
    }, 1000);
  },

  logout: () => {
    set({
      loginState: false,
      token: null,
      expirationTime: 0,
    });
  },

  checkTokenExpiration: () => {
    const { expirationTime } = useLoginStore.getState();
    const currentTime = Date.now();
    if (currentTime > expirationTime) {
      set({ loginState: false, token: null });
      console.log("토큰이 만료되어 자동 로그아웃되었습니다.");
    }
  },
}));

export default useLoginStore;
