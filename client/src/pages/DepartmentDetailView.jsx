/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import {
  HiHome,
  HiOutlineExclamationCircle,
  HiPlus,
  HiTrash,
} from "react-icons/hi";
import {
  Breadcrumb,
  Button,
  Label,
  Modal,
  Pagination,
  Spinner,
  Table,
  TextInput,
  Textarea,
} from "flowbite-react";
import NavbarSidebar from "../components/NavbarSideBar";
import { useEffect, useState } from "react";
import { PropagateLoader, ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";

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
  const departmentsPerPage = 5;
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
      const searchQuery = searchTerm ? `searchTerm=${searchTerm}` : "";
      const response = await fetch(
        `/mediclinic/department/getDepartments?${searchQuery}&page=${page}&limit=${departmentsPerPage}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(
          errorData.message || "Failed to fetch departments data."
        );
        toast.error(errorData.message || "Failed to fetch departments data.");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setDepartment(data.departments);
      setTotalDepartments(data.totalDepartments);
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

      const response = await fetch(
        `/mediclinic/department/getDepartments/${departmentID}`
      );
      if (!response.ok) {
        setErrorMessage("Failed to fetch selected department data.");
        toast.error(errorMessage);
        setLoadingDepartment(false);
      }
      const data = await response.json();
      setDepartmentName(data.department_name || "N/A");
      setDepartmentDescription(data.department_description || "N/A");
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
      const response = await fetch(
        `/mediclinic/department/getDepartments/${departmentIdToDelete}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        setErrorMessage("Failed to delete department");
        toast.error(errorMessage);
        setLoading(false);
        return;
      }
      // Filter out the deleted department from the local state
      setDepartment(
        department.filter((dep) => dep._id !== departmentIdToDelete)
      );
      // Fetch the updated list of department after deletion
      await fetchDepartments(1);
      setLoading(false);
      toast.success("Department deleted successfully");
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        `/mediclinic/department/getDepartments/${departmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            department_name: departmentName,
            department_description: departmentDescription,
          }),
        }
      );
      if (!response.ok) {
        toast.error("Failed to update department");
      }
      const data = await response.json();
      await fetchDepartments(1);
      // Combine data info with the success message and add line breaks
      const successMessage = `
      Department updated successfully:
      <br> <b>Department Name</b>: <i>${data.department_name}</i>
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
              <Breadcrumb.Item href="/departments-list">
                Departments
              </Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All Departments
            </h1>
          </div>
          <div className="sm:flex">
            <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
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
                  <Table.HeadCell>Department Name</Table.HeadCell>
                  <Table.HeadCell>Department Description</Table.HeadCell>
                  <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                {errorMessage ? (
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell
                        colSpan="5"
                        className="whitespace-nowrap text-center p-4 text-lg font-semibold bg-red-200 text-red-500"
                      >
                        {errorMessage}
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ) : department.length > 0 ? (
                  department.map((dep) => (
                    <Table.Body
                      key={dep._id}
                      className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
                    >
                      <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {dep?.department_name ? dep.department_name : "N/A"}
                        </Table.Cell>
                        <Table.Cell
                          className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white"
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
                        </Table.Cell>
                        <Table.Cell>
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
                              color="failure"
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
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))
                ) : (
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell
                        colSpan="3"
                        className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white text-center"
                      >
                        No departments found
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
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
        <Modal.Header className="px-6 pb-0 pt-6">
          <span className="sr-only">Delete Department</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to delete this department?
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

      <Modal
        onClose={() => setDepartmentModalView(false)}
        show={departmentModalView}
        size="2xl"
      >
        <Modal.Header className="px-6 pb-6 pt-6 text-2xl font-extrabold text-gray-900 dark:text-white text-center uppercase bg-gray-200">
          View <span className="text-yellow-500 font-bold">Department</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0 bg-gray-200">
          {loadingDepartment ? (
            <div className="flex flex-col items-center gap-y-6 text-center">
              <Spinner size="lg" />
              <span className="pl-3">Loading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-y-6 text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
                Department Name: {departmentName}
              </h2>
              <p className="text-base text-gray-700 dark:text-gray-300">
                {departmentDescription}
              </p>
              <div className="flex items-center gap-x-6 mt-4">
                <Button
                  outline
                  gradientDuoTone="pinkToOrange"
                  onClick={() => {
                    setDepartmentModalView(false);
                  }}
                >
                  Exit
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal
        onClose={() => setDepartmentModal(false)}
        show={departmentModal}
        size="md"
      >
        <Modal.Header className="px-6 pb-0 pt-6">
          <span className="sr-only">Update Department</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
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
        </Modal.Body>
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
  const departmentsPerPage = 5;
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

  const totalPages = Math.ceil(totalDepartments / departmentsPerPage);

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
      const response = await fetch("/mediclinic/department/createDepartment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success === false) {
        setErrorMessage(data.message);
        toast.error(data.message);
        setLoading(false);
      }
      setLoading(false);
      setOpen(false);
      toast.success("Department created successfully");
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
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add New Department</strong>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
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
