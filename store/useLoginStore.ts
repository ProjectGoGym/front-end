import { create } from 'zustand';

interface LoginState {}

const useWebSocketStore = create<LoginState>((set) => ({
  loginState: false,
}));

export default useWebSocketStore;
