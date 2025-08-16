import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  deeplinkUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadIds, setUnreadIds] = useState<number[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const router = useRouter();

  const fetchNotifications = async (pageNum: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/notifications?page=${pageNum}&limit=10`
      );
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const responseData = await response.json();
      const data: NotificationsResponse = responseData.data;

      if (pageNum === 1) {
        setNotifications(data.notifications);
      } else {
        setNotifications((prev) => [...prev, ...data.notifications]);
      }
      console.log({ data });
      setHasMore(data.pagination.page < data.pagination.totalPages);
      setPage(data.pagination.page);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications(1);
    }
  }, [isOpen]);

  useEffect(() => {
    // Setup intersection observer for infinite scroll
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isLoading) {
        fetchNotifications(page + 1);
      }
    }, options);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, page]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // Mark notifications as read when closing the menu
        if (unreadIds.length > 0) {
          fetch("/api/notifications/mark-read", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notificationIds: unreadIds }),
          });
          setUnreadIds([]);
        }
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [unreadIds]);

  const handleNotificationClick = (notification: Notification) => {
    if (notification.deeplinkUrl) {
      router.push(notification.deeplinkUrl);
    }
    setIsOpen(false);
  };

  const handleNotificationVisible = (notification: Notification) => {
    if (!notification.isRead && !unreadIds.includes(notification.id)) {
      setUnreadIds((prev) => [...prev, notification.id]);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="max-h-96 overflow-y-auto p-2">
            {isLoading && notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              <>
                {notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    ref={
                      index === notifications.length - 1
                        ? (el) => {
                            if (el && observerRef.current) {
                              observerRef.current.observe(el);
                            }
                          }
                        : undefined
                    }
                    onMouseEnter={() => handleNotificationVisible(notification)}
                    onClick={() => handleNotificationClick(notification)}
                    className={`cursor-pointer rounded-md p-3 hover:bg-gray-50 ${
                      !notification.isRead ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {notification.message}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="p-2 text-center text-gray-500">
                    Loading more...
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
