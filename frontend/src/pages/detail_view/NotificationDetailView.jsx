import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
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
import { useSelector } from "react-redux";
import { RiDeleteBin6Fill } from "react-icons/ri";
import moment from "moment";
import { FaCheckDouble } from "react-icons/fa";
import NavbarSidebar from "../../components/layout/NavbarSideBar";
import {
  deleteAllNotifications,
  deleteNotification,
  getNotificationsByID,
  getNotificationsByUserID,
  markAllNotifications,
  markNotification,
} from "../../services/notificationService";

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

      const response = await getNotificationsByUserID(
        userID,
        page,
        notificationsPerPage
      );

      setNotifications(response.notifications);
      setTotalNotifications(response.totalNotifications);
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
      const response = await getNotificationsByID(notificationId);
      setNotificationData(response);
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
      const response = await deleteNotification(notificationIdToDelete);
      setNotifications(
        notifications.filter(
          (notification) => notification._id !== notificationIdToDelete
        )
      );
      await fetchNotificationByUserID(1);
      setLoading(false);
      setOpen(false);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const handleDeleteAll = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const response = await deleteAllNotifications(userID);

      setNotifications([]); // Clear notifications locally
      await fetchNotificationByUserID(1);
      setLoading(false);
      setOpenModal(false);
      toast.success(response.message);
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
      const response = await markNotification(notificationId);
      setNotifications(
        notifications.map((notification) =>
          notification._id === response._id ? response : notification
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
      const response = await markAllNotifications(userID);
      setNotifications(
        notifications.map((notification) =>
          notification._id === response._id ? response : notification
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
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4">
              <BreadcrumbItem href="#">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="">Home</span>
                </div>
              </BreadcrumbItem>
              <BreadcrumbItem href="/notifications">
                Notifications
              </BreadcrumbItem>
              <BreadcrumbItem>List</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div className="sm:flex">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              All Notifications
            </h1>
            <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
              <Button color="green" onClick={handleAllMarkRead}>
                <div className="flex items-center gap-x-3">
                  <FaCheckDouble className="text-xl" />
                  <span>Mark All As Read</span>
                </div>
              </Button>
              <Button
                color="red"
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
        <div className="fixed inset-0 bg-gray-800/20 flex items-center justify-center z-50">
          <ScaleLoader color="#36d7b7" />
        </div>
      )}
      <div className="flex flex-col m-4">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-sm">
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHead className="bg-gray-100 text-center">
                  <TableRow>
                    <TableHeadCell>Title</TableHeadCell>
                    <TableHeadCell>Message</TableHeadCell>
                    <TableHeadCell>Date</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                  </TableRow>
                </TableHead>
                {errorMessage ? (
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan="8"
                        className="whitespace-nowrap text-center p-4 text-lg font-semibold bg-red-200 text-red-500"
                      >
                        {errorMessage}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <TableBody
                      key={notification._id}
                      className={`divide-y divide-gray-200 ${
                        notification.viewed ? "bg-white" : "bg-green-100"
                      }`}
                    >
                      <TableRow className="hover:bg-gray-100 text-center">
                        <TableCell
                          className="whitespace-nowrap p-4 text-base font-medium text-gray-900"
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
                        </TableCell>
                        <TableCell
                          className="whitespace-nowrap p-4 text-base font-medium text-gray-900"
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
                        </TableCell>
                        <TableCell className="whitespace-nowrap p-4 text-base font-medium text-gray-900">
                          {moment(notification?.createdAt).fromNow()}
                        </TableCell>
                        <TableCell>
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
                              color="red"
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
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ))
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan="4"
                        className="whitespace-nowrap p-4 text-base font-medium text-gray-900 text-center"
                      >
                        No notifications found
                      </TableCell>
                    </TableRow>
                  </TableBody>
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
        <ModalHeader className="px-6 pb-0 pt-6">
          <span className="sr-only">Delete Notification</span>
        </ModalHeader>
        <ModalBody className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to delete this notification?
            </p>
            <div className="flex items-center gap-x-6">
              <Button
                color="red"
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
        </ModalBody>
      </Modal>

      <Modal onClose={() => setOpenModal(false)} show={isOpenModal} size="md">
        <ModalHeader className="px-6 pb-0 pt-6">
          <span className="sr-only">Delete Notification</span>
        </ModalHeader>
        <ModalBody className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to delete all notifications?
            </p>
            <div className="flex items-center gap-x-6">
              <Button
                color="red"
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
        </ModalBody>
      </Modal>

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

  const totalPages = Math.max(
    1,
    Math.ceil(totalNotifications / notificationsPerPage)
  );

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
