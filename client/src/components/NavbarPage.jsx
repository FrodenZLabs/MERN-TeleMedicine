import { Button } from "flowbite-react";
import { BsFacebook, BsGithub, BsInstagram, BsTwitterX } from "react-icons/bs";
import { MdLocationPin, MdMenu, MdPhone } from "react-icons/md";
import { Link } from "react-router-dom";

const NavbarPage = () => {
  return (
    <header className="absolute top-0 left-0 w-full z-50 px-4 sm:px-8 lg:px-16 xl:px-40">
      <div className="hidden md:flex justify-between items-center py-2 border-b border-gray-200 text-sm">
        <div className="">
          <ul className="flex text-white">
            <li>
              <div className="flex items-center">
                <MdLocationPin className="h-5 w-5" />
                <span className="ml-2">Embakasi, Nairobi, Kenya</span>
              </div>
            </li>
            <li className="ml-6">
              <div className="flex items-center">
                <MdPhone className="h-5 w-5" />
                <span className="ml-2">+254 111 111 111</span>
              </div>
            </li>
          </ul>
        </div>
        <div className="">
          <ul className="flex text-white justify-end gap-4">
            <li>
              <a href="">
                <BsFacebook className="h-5 w-5" />
              </a>
            </li>
            <li>
              <a href="">
                <BsTwitterX className="h-5 w-5" />
              </a>
            </li>
            <li>
              <a href="">
                <BsInstagram className="h-5 w-5" />
              </a>
            </li>
            <li>
              <a href="">
                <BsGithub className="h-5 w-5" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between py-6">
        <div className="w-1/2 md:w-auto">
          <a href="" className="text-white font-bold italic text-2xl">
            MediClinic Center
          </a>
        </div>

        <label htmlFor="menu-toggle" className="pointer-cursor md:hidden block">
          <MdMenu className="text-white h-10 w-10" />
        </label>

        <input className="hidden" type="checkbox" id="menu-toggle" />

        <div className="hidden md:block w-full md:w-auto" id="menu">
          <nav className="w-full bg-gray-200 md:bg-transparent rounded-lg shadow-lg px-6 py-4 mt-4 text-center md:p-0 md:mt-0 md:shadow-none">
            <ul className="md:flex items-center">
              <li>
                <a
                  className="py-2 inline-block md:text-white md:hidden lg:block font-semibold"
                  href="#"
                >
                  About Us
                </a>
              </li>
              <li className="md:ml-4">
                <a
                  className="py-2 inline-block md:text-white md:px-2 font-semibold"
                  href="#"
                >
                  Treatments
                </a>
              </li>
              <li className="md:ml-4">
                <a
                  className="py-2 inline-block md:text-white md:px-2 font-semibold"
                  href="#"
                >
                  Testimonials
                </a>
              </li>
              <li className="md:ml-4 md:hidden lg:block">
                <a
                  className="py-2 inline-block md:text-white md:px-2 font-semibold"
                  href="#"
                >
                  Blog
                </a>
              </li>
              <li className="md:ml-4">
                <a
                  className="py-2 inline-block md:text-white md:px-2 font-semibold"
                  href="#"
                >
                  Contact Us
                </a>
              </li>
              <Link to={"/login"} className="md:ml-6 mt-3 md:mt-0">
                <Button className="inline-block font-semibold px-4 py-2 text-white bg-blue-600 md:bg-transparent md:text-white border border-white rounded-lg hover:opacity-80">
                  Book Appointment
                </Button>
              </Link>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default NavbarPage;
