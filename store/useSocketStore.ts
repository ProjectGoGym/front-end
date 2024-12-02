import { create } from 'zustand';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface WebSocketState {
  stompClient: Client | null;
  messages: string[];
  connect: (
    url: string,
    chatroomId: string,
    onMessage?: (message: Message) => void
  ) => void;
  sendMessage: (destination: string, body: string) => void;
  disconnect: () => void;
}

const useWebSocketStore = create<WebSocketState>((set) => ({
  stompClient: null,
  messages: [],

  connect: (url, chatroomId, onMessage) => {
    const client = new Client({
      brokerURL: url,
      webSocketFactory: () => new SockJS(url),
      onConnect: () => {
        console.log('웹소켓 연결 성공');
        if (onMessage) {
          client.subscribe(`/topic/chatroom/${chatroomId}`, (message) => {
            set((state) => ({
              messages: [...state.messages, message.body],
            }));
            onMessage(message);
          });
        }
      },
      onDisconnect: () => {
        console.log('웹소켓 연결 끊기');
      },
      onStompError: (error) => {
        console.error('Stomp error:', error);
      },
    });

    client.activate();
    set({ stompClient: client });
  },

  sendMessage: (destination, body) => {
    set((state) => {
      if (state.stompClient && state.stompClient.connected) {
        state.stompClient.publish({ destination, body });
      }
      return state;
    });
  },

  disconnect: () => {
    set((state) => {
      if (state.stompClient) {
        state.stompClient.deactivate();
      }
      return { stompClient: null };
    });
  },
}));

export default useWebSocketStore;
