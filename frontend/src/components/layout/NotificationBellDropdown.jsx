import {
  Button,
  Dropdown,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiBell, HiEye } from "react-icons/hi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  getNotificationsByID,
  getNotificationsByUserID,
  markNotification,
} from "../../services/notificationService";

const NotificationBellDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [notificationData, setNotificationData] = useState([]);
  const [notificationModal, setNotificationModal] = useState(false);
  const [notificationId, setNotificationId] = useState("");
  const { currentUser } = useSelector((state) => state.authentication);
  const userID = currentUser._id;
  const [loadingNotification, setLoadingNotification] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationsPerPage = 5;

  const fetchNotifications = async () => {
    try {
      const response = await getNotificationsByUserID(
        userID,
        {},
        notificationsPerPage
      );

      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchNotificationById = async (notificationId) => {
    try {
      setLoadingNotification(true);
      const response = await getNotificationsByID(notificationId);

      setNotificationData(response);
      setLoadingNotification(false);
    } catch (error) {
      toast.error(error.message);
      setLoadingNotification(false);
    }
  };

  const handleMarkRead = async () => {
    try {
      const response = await markNotification(notificationId);

      setNotifications(
        notifications.map((notification) =>
          notification._id === response._id ? response : notification
        )
      );
      fetchNotifications();
    } catch (error) {
      toast.error(error.message);
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
          <span className="relative rounded-lg p-2 hover:bg-gray-100">
            <span className="sr-only">Notifications</span>
            <HiBell className="text-2xl text-gray-500 hover:text-gray-900" />
            {unreadCount > 0 && (
              <div className="absolute inline-flex items-center justify-center w-6 h-6 p-2 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -end-1">
                {unreadCount > 9 ? "9+" : unreadCount}
              </div>
            )}
          </span>
        }
      >
        <div className="max-w-[24rem]">
          <div className="block rounded-t-xl bg-gray-50 py-2 px-4 text-center text-base font-medium text-gray-700">
            Notifications
          </div>
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                onClick={() => {
                  setNotificationId(notification._id);
                  fetchNotificationById(notification._id);
                  setNotificationModal(true);
                }}
                key={notification._id}
                className={`flex border-y py-3 px-4 hover:bg-green-200 ${
                  notification?.viewed ? "bg-white" : "bg-green-100"
                }`}
              >
                <div className="w-full pl-3">
                  <div className="flex justify-center mb-1.5 text-sm font-medium text-blue-700">
                    {notification?.title}
                  </div>
                  <div className="text-sm font-normal text-gray-500">
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
            <Button className="w-full py-2 flex items-center justify-center text-sm text-blue-600 hover:underline bg-gray-400 hover:bg-gray-300">
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
        <ModalHeader className="px-6 pb-6 pt-6 text-2xl font-semibold text-gray-900 text-center uppercase bg-gray-200">
          View <span className="text-yellow-500">Notification</span>
        </ModalHeader>
        <ModalBody className="px-6 pb-6 pt-0 bg-gray-200">
          {loadingNotification ? (
            <div className="flex flex-col items-center gap-y-6 text-center">
              <Spinner size="lg" />
              <span className="pl-3">Loading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-y-6 text-center">
              <h2 className="text-xl font-bold text-gray-900">
                {notificationData.title}
              </h2>
              <p className="text-base text-gray-700">
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
        </ModalBody>
      </Modal>
    </>
  );
};

export default NotificationBellDropdown;
