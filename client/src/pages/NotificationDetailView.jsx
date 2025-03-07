/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Breadcrumb,
  Button,
  Modal,
  Pagination,
  Spinner,
  Table,
} from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiEye,
  HiHome,
  HiOutlineExclamationCircle,
  HiTrash,
} from "react-icons/hi";
import { PropagateLoader, ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import NavbarSidebar from "../components/NavbarSideBar";
import { useSelector } from "react-redux";
import { RiDeleteBin6Fill } from "react-icons/ri";
import moment from "moment";
import { FaCheckDouble } from "react-icons/fa";

const NotificationDetailView = () => {
  const [notifications, setNotifications] = useState([]);
  const [notificationData, setNotificationData] = useState([]);
  const [notificationId, setNotificationId] = useState("");
  const [notificationIdToDelete, setNotificationIdToDelete] = useState("");
  const [notificationModal, setNotificationModal] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [isOpenModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingNotification, setLoadingNotification] = useState(false);
  const { currentUser } = useSelector((state) => state.authentication);
  const userID = currentUser._id;
  const notificationsPerPage = 10;
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchNotificationByUserID = async (page) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const response = await fetch(
        `/mediclinic/notification/getNotifications/user/${userID}?page=${page}&limit=${notificationsPerPage}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(
          errorData.message || "Failed to fetch notification for user data."
        );
        toast.error(
          errorData.message || "Failed to fetch notification for user data."
        );
        setLoading(false);
        return;
      }
      const data = await response.json();
      setNotifications(data.notifications);
      setTotalNotifications(data.totalNotifications);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
      setLoading(false);
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

  const handleDelete = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch(
        `/mediclinic/notification/deleteNotification/${notificationIdToDelete}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        setErrorMessage("Failed to delete notification");
        toast.error(errorMessage);
        setLoading(false);
        return;
      }
      setNotifications(
        notifications.filter(
          (notification) => notification._id !== notificationIdToDelete
        )
      );
      await fetchNotificationByUserID(1);
      setLoading(false);
      setOpen(false);
      toast.success("Notification deleted successfully");
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const handleDeleteAll = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const response = await fetch(
        `/mediclinic/notification/deleteAllNotifications/${userID}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        setErrorMessage("Failed to delete notifications");
        toast.error(errorMessage);
        setLoading(false);
        return;
      }

      setNotifications([]); // Clear notifications locally
      await fetchNotificationByUserID(1);
      setLoading(false);
      setOpenModal(false);
      toast.success("All notifications deleted successfully");
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  const handleMarkRead = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch(
        `/mediclinic/notification/getNotifications/${notificationId}`,
        { method: "PUT" }
      );
      if (!response.ok) {
        const errorText = await response.text();
        setErrorMessage(`Failed to mark notification as read: ${errorText}`);
        toast.error(errorMessage);
        setLoading(false);
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
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const handleAllMarkRead = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch(
        `/mediclinic/notification/markAllAsViewed/${userID}`,
        { method: "PUT" }
      );
      if (!response.ok) {
        const errorText = await response.text();
        setErrorMessage(`Failed to mark notification as read: ${errorText}`);
        toast.error(errorMessage);
        setLoading(false);
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
      toast.success("Marked all messages as read successfully!");
      await fetchNotificationByUserID(1);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchNotificationByUserID(currentPage);
  }, [currentPage]);

  return (
    <NavbarSidebar isFooter={false}>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item href="#">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="dark:text-white">Home</span>
                </div>
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/notifications">
                Notifications
              </Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="sm:flex">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All Notifications
            </h1>
            <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
              <Button color="gray" onClick={handleAllMarkRead}>
                <div className="flex items-center gap-x-3">
                  <FaCheckDouble className="text-xl" />
                  <span>Mark All As Read</span>
                </div>
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                <div className="flex items-center gap-x-3">
                  <RiDeleteBin6Fill className="text-xl" />
                  <span>Delete All</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <ScaleLoader color="#36d7b7" />
        </div>
      )}
      <div className="flex flex-col m-4">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <Table.Head className="bg-gray-100 dark:bg-gray-700 text-center">
                  <Table.HeadCell>Title</Table.HeadCell>
                  <Table.HeadCell>Message</Table.HeadCell>
                  <Table.HeadCell>Date</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                </Table.Head>
                {errorMessage ? (
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell
                        colSpan="8"
                        className="whitespace-nowrap text-center p-4 text-lg font-semibold bg-red-200 text-red-500"
                      >
                        {errorMessage}
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <Table.Body
                      key={notification._id}
                      className={`divide-y divide-gray-200 ${
                        notification.viewed
                          ? "bg-white dark:bg-gray-800"
                          : "bg-green-100 dark:bg-green-400"
                      }`}
                    >
                      <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                        <Table.Cell
                          className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white"
                          onClick={() => {
                            setNotificationId(notification._id);
                            fetchNotificationById(notification._id);
                            setNotificationModal(true);
                          }}
                        >
                          {notification?.message.length > 30 ? (
                            <>
                              {notification.title.slice(0, 30)}
                              ...
                              <span className="text-blue-500 cursor-pointer">
                                Read more
                              </span>
                            </>
                          ) : (
                            notification?.title
                          )}
                        </Table.Cell>
                        <Table.Cell
                          className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white"
                          onClick={() => {
                            setNotificationId(notification._id);
                            fetchNotificationById(notification._id);
                            setNotificationModal(true);
                          }}
                        >
                          {notification?.message.length > 50 ? (
                            <>
                              {notification.message.slice(0, 50)}...
                              <span className="text-blue-500 cursor-pointer">
                                Read more
                              </span>
                            </>
                          ) : (
                            notification?.message
                          )}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          {moment(notification?.createdAt).fromNow()}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex items-center gap-x-4 whitespace-nowrap">
                            <Button
                              color="blue"
                              onClick={() => {
                                setNotificationId(notification._id);
                                fetchNotificationById(notification._id);
                                setNotificationModal(true);
                              }}
                            >
                              <div className="flex items-center gap-x-2">
                                <HiEye className="text-lg" />
                                View
                              </div>
                            </Button>
                            <Button
                              color="failure"
                              onClick={() => {
                                setOpen(true);
                                setNotificationIdToDelete(notification._id);
                              }}
                            >
                              <div className="flex items-center gap-x-2">
                                <HiTrash className="text-lg" />
                                Delete
                              </div>
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))
                ) : (
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell
                        colSpan="4"
                        className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white text-center"
                      >
                        No notifications found
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                )}
              </Table>
            </div>
          </div>
        </div>
      </div>
      {notifications.length > 0 && (
        <PaginationButton
          fetchNotificationByUserID={fetchNotificationByUserID}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalNotifications={totalNotifications}
          loading={loading}
        />
      )}

      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-6 pb-0 pt-6">
          <span className="sr-only">Delete Notification</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to delete this notification?
            </p>
            <div className="flex items-center gap-x-6">
              <Button
                color="failure"
                onClick={() => {
                  setOpen(false);
                  handleDelete();
                }}
              >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal onClose={() => setOpenModal(false)} show={isOpenModal} size="md">
        <Modal.Header className="px-6 pb-0 pt-6">
          <span className="sr-only">Delete Notification</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to delete all notifications?
            </p>
            <div className="flex items-center gap-x-6">
              <Button
                color="failure"
                onClick={() => {
                  setOpenModal(false);
                  handleDeleteAll();
                }}
              >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

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
    </NavbarSidebar>
  );
};

const PaginationButton = ({
  fetchNotificationByUserID,
  currentPage,
  totalNotifications,
  setCurrentPage,
  loading,
}) => {
  const notificationsPerPage = 10;
  const [firstNotificationIndex, setFirstNotificationIndex] = useState(0);
  const [lastNotificationIndex, setLastNotificationIndex] = useState(0);

  useEffect(() => {
    const calculateUserIndexes = () => {
      const firstIndex = (currentPage - 1) * notificationsPerPage + 1;
      const lastIndex = Math.min(
        currentPage * notificationsPerPage,
        totalNotifications
      );
      setFirstNotificationIndex(firstIndex);
      setLastNotificationIndex(lastIndex);
    };

    calculateUserIndexes();
  }, [currentPage, totalNotifications]);

  const totalPages = Math.ceil(totalNotifications / notificationsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchNotificationByUserID(page);
  };

  return (
    <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between mt-6 mb-8 p-4">
      {loading ? (
        <div className="flex flex-col items-center gap-y-6 text-center">
          <PropagateLoader size={5} color="#000000" />
        </div>
      ) : (
        <>
          <div>
            <p className="flex gap-x-1 text-md text-gray-700">
              Showing
              <span className="font-semibold text-black">
                {firstNotificationIndex}
              </span>
              to
              <span className="font-semibold text-black">
                {lastNotificationIndex}
              </span>
              of
              <span className="font-semibold text-black">
                {totalNotifications}
              </span>
              notifications
            </p>
          </div>
          <div className="flex justify-center">
            <Pagination
              layout="navigation"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showIcons
            />
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDetailView;
