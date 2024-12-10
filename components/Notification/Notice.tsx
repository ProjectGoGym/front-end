//components/notice.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import useLoginStore from "@/store/useLoginStore";

interface Notification {
  id: number;
  message: string;
  name: string;
  data: number;
  read: boolean;
  type: "ADD_WISHLIST_MY_POST" | "CHANGE_MEMBER_STATUS";
  timestamp: string;
}

export default function Notice() {
  const [msg, setMsg] = useState<Notification[]>([]);
  const [sseUrl, setSseUrl] = useState<string | null>(null);
  const [isViewingAll, setIsViewingAll] = useState(false);
  const [dummyReceived, setDummyReceived] = useState(false);
  const [lastEvent, setLastEvent] = useState(Date.now());
  const [error, setError] = useState(false);
  const { loginState } = useLoginStore();

  // 알림 오면 내려주는 데이터 -> 알림창
  // 알림 실시간 -> 화면에 5초 띄우고 사라지기
  // 알림 읽음 상태 변경
  const handleMarkAsRead = async (notificationId: number) => {
    try {
      setMsg((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      const response = await axios.put(
        `/backend/api/notification/${notificationId}/read`
      );
      console.log("알림 읽음 처리", response.data);
      setMsg((prev: Notification[]) =>
        prev.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.error("Error updating read status:", error);
    }
  };

  // 전체 알림 목록 조회 -> 종 아이콘 눌러서 조회 -> 읽지 않은 알림만 저장
  const handleAllNotifications = async () => {
    // if(isLogin) {}
    try {
      const response = await axios.get(
        "/backend/api/notifications?page={page}&size={size}"
      );
      const noreadNotifications = response.data.notifications.filter(
        (notification: Notification) => !notification.read
      );
      setMsg(noreadNotifications);
      setIsViewingAll(true);
    } catch (error) {
      console.error("Error fetching all notifications:", error);
    }
  };

  // SSE 구독 요청
  // 구독 요청 일치하는지 확인 if문
  // 구독이 됐는지 확인하기 어려움 -> 데이터 쏴주기
  // 더미로 받음. 연결 요청 -> 한번만 console.log
  // heartbeat -> 30초 이벤트 안오면 다시 재연결, 확인 로직 필요
  // 알수없는 데이터 -> error

  useEffect(() => {
    if (loginState) {
      const fetchSseUrl = async () => {
        try {
          const response = await axios.get(
            "/backend/api/notification/subscribe"
          );
          setSseUrl(response.data.sseUrl);
        } catch (error) {
          console.error("Failed to fetch SSE URL:", error);
        }
      };
      fetchSseUrl();
    } else {
      setSseUrl(null);
    }
  }, [loginState]);

  // 구독 시작
  useEffect(() => {
    let eventSource: EventSource | null = null;

    if (sseUrl && loginState) {
      eventSource = new EventSource(sseUrl);
      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          const formatTimestamp = new Date(data.timestamp).toLocaleString(
            "ko-KR",
            {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }
          );

          const formatMessage = `${data.message} <br/> ${formatTimestamp}`;

          if (data.event === "dummy") {
            if (!dummyReceived) {
              setDummyReceived(true);
              console.log("Dummy data:", e.data);
            } // 알림 띄우는거
          } else if (data.event === "notification") {
            console.log("Notification:", e.data);
            setMsg((prev) =>
              [{ ...data, message: formatMessage }, ...prev].slice(0, 50)
            );
            setLastEvent(Date.now());
            setError(false);
            setTimeout(() => {
              setMsg((prev) =>
                prev.filter((notification) => notification.id !== data.id)
              );
            }, 5000);
            // 연결유지되고 있는지 30초 확인 (내말 들리니..)
          } else if (data.event === "heartbeat") {
            console.log("Heartbeat:", e.data);
          }
        } catch (error) {
          console.error("Failed to parse notification data:", error);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE connection error:", error);
        setError(true);
        eventSource?.close();
        if (sseUrl && loginState) {
          eventSource = new EventSource(sseUrl);
        }
      };

      const heartbeatInterval = setInterval(() => {
        const timeElapsed = Date.now() - lastEvent;

        if (timeElapsed >= 30000) {
          console.log("No events for 30 seconds, attempting to reconnect...");
        }

        if (timeElapsed >= 60000) {
          console.error("No events for 1 minute, connection error.");
          setError(true);
          clearInterval(heartbeatInterval);
          eventSource?.close();
          setTimeout(() => {
            eventSource = new EventSource(sseUrl);
          }, 5000);
        }
      }, 10000);

      return () => {
        clearInterval(heartbeatInterval);
        eventSource?.close();
      };
    }
  }, [sseUrl, loginState, dummyReceived, lastEvent]);

  return (
    <div
      className="absolute end-0 z-10 w-80 h-72 rounded-md border border-gray-300 bg-white shadow-lg"
      role="menu"
    >
      <div className="p-2 flex justify-between items-center">
        <strong className="text-md font-medium uppercase text-gray-700">
          알림📢
        </strong>
        {!isViewingAll && (
          <button
            className="text-sm text-gray-700 mr-1"
            onClick={handleAllNotifications}
          >
            목록
          </button>
        )}
      </div>
      <hr />
      {msg.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-sm text-gray-700 mb-10">새로운 알림이 없습니다.</p>
        </div>
      ) : (
        <div className="h-48 overflow-y-auto">
          {msg.map((notification) => (
            <a
              key={notification.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleMarkAsRead(notification.id);
              }}
              className={`block rounded-lg px-4 py-2 text-sm ${
                notification.read
                  ? "text-gray-400"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-700"
              }`}
              role="menuitem"
            >
              {notification.message}
            </a>
          ))}
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm mt-2 ml-2">
          서버 연결에 문제가 발생했습니다.
        </div>
      )}
    </div>
  );
}
