import { Button } from "flowbite-react";
import { MdHome, MdVerifiedUser } from "react-icons/md";
import NavbarPage from "../components/layout/NavbarPage";
import { Link } from "react-router-dom";
import FooterPage from "../components/layout/FooterPage";
import {
  FaStethoscope,
  FaUserMd,
  FaXRay,
  FaAmbulance,
  FaSyringe,
  FaTeethOpen,
} from "react-icons/fa";

const HomePage = () => {
  const departments = [
    {
      name: "Cardiology",
      description: "Specialized in heart and cardiovascular system.",
      icon: FaStethoscope,
    },
    {
      name: "Dermatology",
      description: "Focused on skin-related issues.",
      icon: FaUserMd,
    },
    {
      name: "Radiology",
      description: "Imaging for accurate diagnosis.",
      icon: FaXRay,
    },
    {
      name: "Emergency Medicine",
      description: "Immediate care for urgent conditions.",
      icon: FaAmbulance,
    },
    {
      name: "Anesthesiology",
      description: "Pain management and anesthesia.",
      icon: FaSyringe,
    },
    {
      name: "Dentistry",
      description: "Dental care and oral health.",
      icon: FaTeethOpen,
    },
  ];
  return (
    <div className="bg-gray-100 w-full">
      <NavbarPage />
      {/* Start hero */}
      <section
        className="cover relative bg-linear-to-r from-blue-300 via-blue-500 to-blue-700 px-4 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 overflow-hidden py-48 flex
      items-center min-h-screen"
      >
        <div className="h-full absolute">
          <img
            src="https://marketplace.canva.com/EAEoiwyZqL8/4/0/1600w/canva-blue-and-white-medical-outline-illustrated-designing-vaccines-education-presentation-fAD-TvwS1-Y.jpg"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative h-100 z-10 lg:mt-16 lg:w-3/4 xl:w-2/4">
          <div className="flex items-center md:items-start flex-col gap-4">
            <h1 className="text-white text-center md:text-start text-4xl md:text-5xl xl:text-6xl font-semibold leading-tight">
              Revolutionize Your Healthcare Experience
            </h1>
            <p className="text-blue-100 text-center md:text-start text-xl md:text-2xl leading-snug">
              Find the best doctors and book instant appointments
            </p>
            <Link to={"/login"}>
              <Button className="bg-gradient-to-r from-teal-200 to-lime-200 text-gray-900 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-lime-200">
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* End hero */}

      {/* Start about */}
      <section className="relative px-4 py-16 sm:px-8 lg:px-16 lg:py:32 xl:px-40">
        <div className="flex flex-col lg:flex-row lg:-mx-8 items-center">
          <div className="w-full lg:w-1/2 lg:px-8">
            <h2 className="text-3xl leading-tight font-bold mt-4">
              Welcome to MediClinic consultants
            </h2>
            <p className="text-lg font-semibold mt-4">
              Excellence in service providence at the Heart of Nairobi
            </p>
            <p className="mt-2 leading-relaxed">
              At MediClinic, we are dedicated to providing top-notch healthcare
              services with a focus on patient satisfaction. Our
              state-of-the-art facilities and experienced medical professionals
              ensure you receive the best care possible. Whether it's routine
              check-ups or specialized treatments, we are here to meet all your
              healthcare needs.
            </p>
          </div>
          <div className="w-full lg:w-1/2 lg:px-8 mt-12 lg:mt-0">
            <div className="md:flex">
              <div>
                <MdHome className="w-16 h-16 bg-blue-600 rounded-full text-white p-3" />
              </div>
              <div className="mt-4 md:ml-8 md:mt-0">
                <h4 className="text-xl font-bold leading-tight">
                  Everything You Need Under One Roof
                </h4>
                <p className="leading-relaxed mt-2">
                  From diagnostics to treatment, MediClinic offers a
                  comprehensive range of medical services in one convenient
                  location. Our multi-disciplinary team works together to
                  provide seamless and integrated care tailored to each
                  patient's unique needs.
                </p>
              </div>
            </div>
            <div className="md:flex mt-8">
              <div>
                <MdVerifiedUser className="w-16 h-16 bg-blue-600 rounded-full text-white p-3" />
              </div>
              <div className="md:ml-8 mt-4 md:mt-0">
                <h4 className="text-xl font-bold leading-tight">
                  Our Patient-Focused Approach
                </h4>
                <p className="mt-2 leading-relaxed">
                  We prioritize your health and comfort with a compassionate and
                  patient-centered approach. Our dedicated staff ensures that
                  you are informed and comfortable throughout your medical
                  journey, offering personalized care and attention to detail in
                  every aspect of our service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End about */}

      <section className="bg-white dark:bg-gray-900 px-4 sm:px-8 lg:px-16 xl:px-40 py-16 lg:py-16">
        <div className="py-8 px-4 mx-auto max-w-(--breakpoint-xl) sm:py-16 lg:px-6">
          <div className="max-w-(--breakpoint-md) mb-8 lg:mb-16">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
              Our Medical Departments
            </h2>
            <p className="text-gray-500 sm:text-xl dark:text-gray-400">
              Our clinic offers a variety of specialized departments to cater to
              your health needs.
            </p>
          </div>
          <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
            {departments.map((department) => (
              <div key={department.name}>
                <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
                  <department.icon className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">
                  {department.name}
                </h3>
                <p className="text-gray-500">
                  {department.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Start testimonials */}
      <section className="relative bg-gray-100 px-4 sm:px-8 lg:px-16 xl:px-40 py-16 lg:py-32">
        <div className="flex flex-col lg:flex-row lg:-mx-8">
          <div className="w-full lg:w-1/2 lg:px-8">
            <h2 className="text-3xl leading-tight font-bold mt-4">
              Why choose the MediClinic Center?
            </h2>
            <h4 className="m-2 leading-relaxed">
              At MediClinic Center, we prioritize your health and well-being
              with:
            </h4>
            <ul className="list-disc list-inside">
              <li>
                <span className="font-semibold">Expert Medical Staff:</span> Our
                team comprises highly qualified and experienced healthcare
                professionals dedicated to providing the best care.
              </li>
              <li>
                <span className="font-semibold">Comprehensive Services:</span>{" "}
                From routine check-ups to specialized treatments, we offer a
                wide range of medical services under one roof.
              </li>
              <li>
                <span className="font-semibold">
                  State-of-the-Art Facilities:
                </span>{" "}
                Our advanced medical equipment and modern facilities ensure you
                receive the highest standard of care.
              </li>
              <li>
                <span className="font-semibold">
                  Patient-Centered Approach:
                </span>{" "}
                We focus on personalized care tailored to meet your individual
                health needs and preferences.
              </li>
              <li>
                <span className="font-semibold">Convenient Location:</span>{" "}
                Easily accessible location with ample parking and a comfortable
                environment designed for your convenience and comfort.
              </li>
              <li>
                <span className="font-semibold">Commitment to Excellence:</span>{" "}
                We strive for continuous improvement and excellence in all
                aspects of healthcare delivery.
              </li>
            </ul>
            <p className="mt-2 leading-relaxed">
              Choose MediClinic Center for quality healthcare you can trust.
            </p>
          </div>

          <div className="w-full flex flex-col items-center justify-center md:max-w-md md:mx-auto lg:w-1/2 lg:px-8 mt-12 mt:md-0">
            <div id="gallery" className="relative w-full" data-carousel="slide">
              <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                <div
                  className="hidden duration-700 ease-in-out"
                  data-carousel-item
                >
                  <img
                    src="https://t4.ftcdn.net/jpg/07/14/61/65/360_F_714616599_Tx0VNp4FOxcn7r7wq93DTxUPlBBGzeqz.jpg"
                    className="absolute block w-full h-full object-cover"
                    alt="MediClinic Equipment 1"
                  />
                </div>
                <div
                  className="duration-700 ease-in-out"
                  data-carousel-item="active"
                >
                  <img
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?fm=jpg&w=3000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVkaWNhbCUyMGVxdWlwbWVudHxlbnwwfHwwfHx8MA=="
                    className="absolute block w-full h-full object-cover"
                    alt="MediClinic Equipment 2"
                  />
                </div>
                <div
                  className="hidden duration-700 ease-in-out"
                  data-carousel-item
                >
                  <img
                    src="https://images.unsplash.com/photo-1518152006812-edab29b069ac?fm=jpg&w=3000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVkaWNhbCUyMGVxdWlwbWVudHxlbnwwfHwwfHx8MA=="
                    className="absolute block w-full h-full object-cover"
                    alt="MediClinic Equipment 3"
                  />
                </div>
                <div
                  className="hidden duration-700 ease-in-out"
                  data-carousel-item
                >
                  <img
                    src="https://media.gettyimages.com/id/913784822/photo/surgeon-picking-up-surgical-tool-from-tray.jpg?s=612x612&w=0&k=20&c=YGHZLnzywJaAB4BvXKDZIpdId1ImdN8JaIupyHXcuOA="
                    className="absolute block w-full h-full object-cover"
                    alt="MediClinic Equipment 4"
                  />
                </div>
                <div
                  className="hidden duration-700 ease-in-out"
                  data-carousel-item
                >
                  <img
                    src="https://media.gettyimages.com/id/1318505406/photo/mri-scanner-in-hospital.jpg?s=612x612&w=0&k=20&c=UHUDvI-6jqF9Vg4iRoTzaYcNuwymRpsuzvB1FF9E8IM="
                    className="absolute block w-full h-full object-cover"
                    alt="MediClinic Equipment 5"
                  />
                </div>
              </div>

              <button
                type="button"
                className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-hidden"
                data-carousel-prev
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 focus:ring-4 focus:ring-white focus:outline-hidden">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    ></path>
                  </svg>
                  <span className="sr-only">Previous</span>
                </span>
              </button>
              <button
                type="button"
                className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-hidden"
                data-carousel-next
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 focus:ring-4 focus:ring-white focus:outline-hidden">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                  <span className="sr-only">Next</span>
                </span>
              </button>
            </div>

            <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
              Modern MediClinic Equipments.
            </figcaption>
          </div>
        </div>
      </section>
      {/* End testimonials */}

      <FooterPage />
    </div>
  );
};

export default HomePage;
