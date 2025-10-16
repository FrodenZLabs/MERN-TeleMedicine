import {
  HiHome,
  HiOutlineExclamationCircle,
  HiPlus,
  HiTrash,
} from "react-icons/hi";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Label,
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
  TextInput,
  Textarea,
} from "flowbite-react";
import NavbarSidebar from "../../components/layout/NavbarSideBar";
import { useEffect, useState } from "react";
import { PropagateLoader, ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import {
  addDepartment,
  deleteDepartment,
  getDepartments,
  getDepartmentsByID,
  updateDepartment,
} from "../../services/departmentService";

const DepartmentDetailView = () => {
  const [department, setDepartment] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [departmentIdToDelete, setDepartmentIdToDelete] = useState("");
  const [departmentModal, setDepartmentModal] = useState(false);
  const [departmentModalView, setDepartmentModalView] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDepartment, setLoadingDepartment] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  const departmentsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "departmentName") {
      setDepartmentName(value);
    } else if (name === "departmentDescription") {
      setDepartmentDescription(value);
    }
  };

  const fetchDepartments = async (page) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await getDepartments({
        searchTerm,
        page,
        departmentsPerPage,
      });

      setDepartment(response.departments);
      setTotalDepartments(response.totalDepartments);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const fetchDepartmentByID = async (departmentID) => {
    try {
      setLoadingDepartment(true);
      setErrorMessage(null);

      const response = await getDepartmentsByID(departmentID);

      setDepartmentName(response.department_name || "N/A");
      setDepartmentDescription(response.department_description || "N/A");
      setLoadingDepartment(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
      setLoadingDepartment(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await deleteDepartment(departmentIdToDelete);
      // Filter out the deleted department from the local state
      setDepartment(
        department.filter((dep) => dep._id !== departmentIdToDelete)
      );
      // Fetch the updated list of department after deletion
      await fetchDepartments(1);
      setLoading(false);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Prepare data for update
      const formData = {
        department_name: departmentName,
        department_description: departmentDescription,
      };
      const response = await updateDepartment(departmentId, formData);
      await fetchDepartments(1);
      // Combine data info with the success message and add line breaks
      const successMessage = `
      Department updated successfully:
      <br> <b>Department Name</b>: <i>${response.department_name}</i>
    `;

      // Show the success message as HTML
      toast.success(
        <div dangerouslySetInnerHTML={{ __html: successMessage }} />
      );
      setDepartmentModal(false);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchDepartments(1);
  };

  useEffect(() => {
    fetchDepartments(currentPage);
  }, [currentPage, searchTerm]);

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
              <BreadcrumbItem href="/departments-list">
                Departments
              </BreadcrumbItem>
              <BreadcrumbItem>List</BreadcrumbItem>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              All Departments
            </h1>
          </div>
          <div className="sm:flex">
            <div className="mb-3 hidden items-center sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              <form className="lg:pr-3" onSubmit={handleSearchSubmit}>
                <Label htmlFor="users-search" className="sr-only">
                  Search
                </Label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <TextInput
                    id="users-search"
                    name="users-search"
                    placeholder="Search for departments"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
            </div>
            <div className="ml-auto flex items-center space-x-2 sm:space-x-3 bg-green-200 hover:bg-green-300 cursor-pointer rounded-lg">
              <AddDepartmentModal onDepartmentAdded={fetchDepartments} />
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
                    <TableHeadCell>Department Name</TableHeadCell>
                    <TableHeadCell>Department Description</TableHeadCell>
                    <TableHeadCell>Actions</TableHeadCell>
                  </TableRow>
                </TableHead>
                {errorMessage ? (
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan="5"
                        className="whitespace-nowrap text-center p-4 text-lg font-semibold bg-red-200 text-red-500"
                      >
                        {errorMessage}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : department.length > 0 ? (
                  department.map((dep) => (
                    <TableBody
                      key={dep._id}
                      className="divide-y divide-gray-200 bg-white"
                    >
                      <TableRow className="hover:bg-gray-100 text-center">
                        <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                          {dep?.department_name ? dep.department_name : "N/A"}
                        </TableCell>
                        <TableCell
                          className="whitespace-nowrap  p-4 text-base font-medium text-gray-900"
                          onClick={() => {
                            setDepartmentModalView(true);
                            setDepartmentId(dep._id);
                            fetchDepartmentByID(dep._id);
                          }}
                        >
                          {dep?.department_description.length > 50 ? (
                            <>
                              {dep.department_description.slice(0, 50)}
                              ...
                              <span className="text-blue-500 cursor-pointer">
                                Read more
                              </span>
                            </>
                          ) : (
                            dep?.department_description
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-x-4 whitespace-nowrap">
                            <Button
                              color="blue"
                              onClick={() => {
                                setDepartmentModal(true);
                                setDepartmentId(dep._id);
                                fetchDepartmentByID(dep._id);
                              }}
                            >
                              <div className="flex items-center gap-x-2">
                                <FaEdit className="text-lg" />
                                Edit
                              </div>
                            </Button>
                            <Button
                              color="red"
                              onClick={() => {
                                setOpen(true);
                                setDepartmentIdToDelete(dep._id);
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
                        colSpan="3"
                        className="whitespace-nowrap p-4 text-base font-medium text-gray-900 text-center"
                      >
                        No departments found
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </div>
          </div>
        </div>
      </div>
      <PaginationButton
        fetchDepartments={fetchDepartments}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalDepartments={totalDepartments}
        loading={loading}
      />

      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <ModalHeader className="px-6 pb-0 pt-6">
          <span className="sr-only">Delete Department</span>
        </ModalHeader>
        <ModalBody className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to delete this department?
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

      <Modal
        onClose={() => setDepartmentModalView(false)}
        show={departmentModalView}
        size="2xl"
      >
        <ModalHeader className="px-6 pb-6 pt-6 text-2xl font-extrabold text-gray-900 text-center uppercase bg-gray-200">
          View <span className="text-yellow-500 font-bold">Department</span>
        </ModalHeader>
        <ModalBody className="px-6 pb-6 pt-0 bg-gray-200">
          {loadingDepartment ? (
            <div className="flex flex-col items-center gap-y-6 text-center">
              <Spinner size="lg" />
              <span className="pl-3">Loading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-y-6 text-center">
              <h2 className="text-xl font-bold text-gray-900 mt-4">
                Department Name: {departmentName}
              </h2>
              <p className="text-base text-gray-700">{departmentDescription}</p>
              <div className="flex items-center gap-x-6 mt-4">
                <Button
                  color="red"
                  onClick={() => {
                    setDepartmentModalView(false);
                  }}
                >
                  Exit
                </Button>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>

      <Modal
        onClose={() => setDepartmentModal(false)}
        show={departmentModal}
        size="md"
      >
        <ModalHeader className="px-6 pb-0 pt-6">
          <span className="sr-only">Update Department</span>
        </ModalHeader>
        <ModalBody className="px-6 pb-6 pt-0">
          {loadingDepartment && (
            <>
              <Spinner size="lg" />
              <span className="pl-3">Loading...</span>
            </>
          )}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-y-6 text-center"
          >
            <div className="mb-4">
              <Label
                htmlFor="departmentName"
                className="mb-2 block text-gray-700"
              >
                Department Name
              </Label>
              <TextInput
                id="departmentName"
                name="departmentName"
                type="text"
                value={departmentName}
                onChange={handleChange}
                placeholder="Enter Department Name"
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="departmentDescription" className="mb-2">
                Department Description
              </Label>
              <Textarea
                id="departmentDescription"
                name="departmentDescription"
                value={departmentDescription}
                onChange={handleChange}
                placeholder="Enter Department Description"
                required
              ></Textarea>
            </div>

            <div className="flex items-center gap-x-6">
              <Button color="blue" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
              <Button color="gray" onClick={() => setDepartmentModal(false)}>
                No, cancel
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </NavbarSidebar>
  );
};

const PaginationButton = ({
  fetchDepartments,
  currentPage,
  setCurrentPage,
  totalDepartments,
  loading,
}) => {
  const departmentsPerPage = 10;
  const [firstDepartmentIndex, setFirstDepartmentIndex] = useState(0);
  const [lastDepartmentIndex, setLastDepartmentIndex] = useState(0);

  useEffect(() => {
    const calculateUserIndexes = () => {
      const firstIndex = (currentPage - 1) * departmentsPerPage + 1;
      const lastIndex = Math.min(
        currentPage * departmentsPerPage,
        totalDepartments
      );
      setFirstDepartmentIndex(firstIndex);
      setLastDepartmentIndex(lastIndex);
    };

    calculateUserIndexes();
  }, [currentPage, totalDepartments]);

  const totalPages = Math.max(
    1,
    Math.ceil(totalDepartments / departmentsPerPage)
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchDepartments(page);
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
                {firstDepartmentIndex}
              </span>
              to
              <span className="font-semibold text-black">
                {lastDepartmentIndex}
              </span>
              of
              <span className="font-semibold text-black">
                {totalDepartments}
              </span>
              departments
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

const AddDepartmentModal = ({ onDepartmentAdded }) => {
  const [isOpen, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value.trim(),
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.department_name) {
      errors.department_name = "Department Name is required.";
    }
    if (!formData.department_description) {
      errors.department_description = "Department Description is required.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrorMessage(errors);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await addDepartment(formData);

      setLoading(false);
      setOpen(false);
      toast.success(response.message);
      if (onDepartmentAdded) {
        onDepartmentAdded();
      }
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Add Department
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <ModalHeader className="border-b border-gray-200 p-6!">
          <strong>Add New Department</strong>
        </ModalHeader>
        <ModalBody>
          <form className="grid grid-cols-1">
            <div className="mb-4">
              <Label htmlFor="departmentName" className="mb-2">
                Department Name
              </Label>
              <TextInput
                type="text"
                id="department_name"
                name="departmentName"
                placeholder="Department's Name"
                onChange={handleChange}
                required
              />
              {errorMessage?.department_name && (
                <p className="text-red-500">{errorMessage.department_name}</p>
              )}
            </div>
            <div className="mb-4">
              <Label htmlFor="departmentName" className="mb-2">
                Department Description
              </Label>
              <Textarea
                type="text"
                rows={2}
                id="department_description"
                name="departmentDescription"
                placeholder="Department's Description"
                onChange={handleChange}
                required
              ></Textarea>
              {errorMessage?.department_description && (
                <p className="text-red-500">
                  {errorMessage.department_description}
                </p>
              )}
            </div>
          </form>
        </ModalBody>
        <Modal.Footer className="justify-center">
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DepartmentDetailView;
