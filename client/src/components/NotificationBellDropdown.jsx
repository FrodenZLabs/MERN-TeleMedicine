import { Button, Dropdown, Modal, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiBell, HiEye } from "react-icons/hi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";

const NotificationBellDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [notificationData, setNotificationData] = useState([]);
  const [notificationModal, setNotificationModal] = useState(false);
  const [notificationId, setNotificationId] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { currentUser } = useSelector((state) => state.authentication);
  const userID = currentUser._id;
  const [loadingNotification, setLoadingNotification] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationsPerPage = 5;

  const fetchNotifications = async () => {
    try {
      setErrorMessage(null);
      const response = await fetch(
        `/mediclinic/notification/getNotifications/user/${userID}?limit=${notificationsPerPage}`
      );
      if (!response.ok) {
        setErrorMessage("Failed to fetch notifications data.");
        toast.error(errorMessage);
      }
      const data = await response.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const fetchNotificationById = async (notificationId) => {
    try {
      setLoadingNotification(true);
      setErrorMessage(null);
      const response = await fetch(
        `/mediclinic/notification/getNotifications/${notificationId}`
      );
      if (!response.ok) {
        const errorText = await response.text();
        setErrorMessage(`Failed to fetch notification: ${errorText}`);
        toast.error(errorMessage);
        setLoadingNotification(false);
        return;
      }
      const data = await response.json();
      setNotificationData(data);
      setLoadingNotification(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
      setLoadingNotification(false);
    }
  };

  const handleMarkRead = async () => {
    try {
      setErrorMessage(null);
      const response = await fetch(
        `/mediclinic/notification/getNotifications/${notificationId}`,
        { method: "PUT" }
      );
      if (!response.ok) {
        const errorText = await response.text();
        setErrorMessage(`Failed to mark notification as read: ${errorText}`);
        toast.error(errorMessage);
        return;
      }
      const updatedNotification = await response.json();
      setNotifications(
        notifications.map((notification) =>
          notification._id === updatedNotification._id
            ? updatedNotification
            : notification
        )
      );
      fetchNotifications();
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications(userID);
    }, 5000); // Fetch notifications every 5 seconds

    // Initial fetch on component mount
    fetchNotifications(userID);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID]); // Re-run effect when userID changes

  return (
    <>
      <Dropdown
        arrowIcon={false}
        inline
        label={
          <span className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="sr-only">Notifications</span>
            <HiBell className="text-2xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white " />
            {unreadCount > 0 && (
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -end-1 dark:border-gray-900">
                {unreadCount > 9 ? "9+" : unreadCount}
              </div>
            )}
          </span>
        }
      >
        <div className="max-w-[24rem]">
          <div className="block rounded-t-xl bg-gray-50 py-2 px-4 text-center text-base font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            Notifications
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-600">
            {notifications.map((notification) => (
              <div
                onClick={() => {
                  setNotificationId(notification._id);
                  fetchNotificationById(notification._id);
                  setNotificationModal(true);
                }}
                key={notification._id}
                className={`flex border-y py-3 px-4 hover:bg-green-200 dark:border-gray-600 dark:hover:bg-gray-600 ${
                  notification?.viewed
                    ? "bg-white dark:bg-gray-800"
                    : "bg-green-100 dark:bg-green-400"
                }`}
              >
                <div className="w-full pl-3">
                  <div className="flex justify-center mb-1.5 text-sm font-medium text-blue-700">
                    {notification?.title}
                  </div>
                  <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {notification?.message.length > 30 ? (
                      <>
                        {notification.message.slice(0, 30)}
                        ...
                        <span className="text-blue-500 cursor-pointer">
                          Read more
                        </span>
                      </>
                    ) : (
                      notification?.message
                    )}
                  </div>
                  <div className="flex justify-center text-xs font-medium text-blue-500">
                    {moment(notification?.createdAt).fromNow()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link to={"/notification-list"}>
            <Button
              color="gray"
              className="w-full py-2 flex items-center justify-center text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              <HiEye className="h-6 w-6 mr-4" />
              <span>View all</span>
            </Button>
          </Link>
        </div>
      </Dropdown>
      <Modal
        onClick={() => {
          setNotificationModal(false);
          handleMarkRead();
        }}
        show={notificationModal}
        size="lg"
      >
        <Modal.Header className="px-6 pb-6 pt-6 text-2xl font-semibold text-gray-900 dark:text-white text-center uppercase bg-gray-200">
          View <span className="text-yellow-500">Notification</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0 bg-gray-200">
          {loadingNotification ? (
            <div className="flex flex-col items-center gap-y-6 text-center">
              <Spinner size="lg" />
              <span className="pl-3">Loading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-y-6 text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {notificationData.title}
              </h2>
              <p className="text-base text-gray-700 dark:text-gray-300">
                {notificationData.message}
              </p>
              <div className="flex items-center gap-x-6 mt-4">
                <Button
                  color="gray"
                  onClick={() => {
                    setNotificationModal(false);
                    handleMarkRead();
                  }}
                >
                  Exit
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NotificationBellDropdown;
