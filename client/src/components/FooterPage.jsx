/* eslint-disable react/no-unescaped-entities */
import { Footer } from "flowbite-react";
import {
  MdLocationPin,
  MdMail,
  MdOutlineLockClock,
  MdPhone,
} from "react-icons/md";
import {
  FaXTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa6";
import { GiMedicalPack } from "react-icons/gi";

const FooterPage = () => {
  return (
    <footer className="bg-blue-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-4xl font-bold mb-4 flex items-center">
              <span className="mr-2">
                <GiMedicalPack className="h-5 w-5" />
              </span>
              Medi<span className="text-red-500 mr-2">Clinic</span>
            </h3>
            <p className="text-gray-200 mb-4">
              Providing world-class healthcare services to our community with
              compassion and excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="uppercase tracking-wider font-semibold text-gray-800 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="opacity-75 hover:opacity-100">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="opacity-75 hover:opacity-100">
                  About Us
                </a>
              </li>
              <li>
                <a href="/departments" className="opacity-75 hover:opacity-100">
                  Departments
                </a>
              </li>
              <li>
                <a href="/contact" className="opacity-75 hover:opacity-100">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h5 className="uppercase tracking-wider font-semibold text-gray-800 mb-4">
              We're Social
            </h5>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaFacebookF />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaXTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="uppercase tracking-wider font-bold text-gray-800">
              Contact Details
            </h5>
            <ul className="mt-4">
              <li className="mb-2">
                <a
                  href="#"
                  className="flex items-center opacity-75 hover:opacity-100"
                >
                  <MdLocationPin className="h-5 w-5" />
                  <span className="ml-3">Embakasi, Nairobi, Kenya</span>
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="flex items-center opacity-75 hover:opacity-100"
                >
                  <MdPhone className="h-5 w-5" />
                  <span className="ml-3">+254 111 111 111</span>
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="flex items-center opacity-75 hover:opacity-100"
                >
                  <MdMail className="h-5 w-5" />
                  <span className="ml-3">mediclinic@outlook.com</span>
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="flex items-center opacity-75 hover:opacity-100"
                >
                  <MdOutlineLockClock className="h-5 w-5" />
                  <span className="ml-3">
                    Mon - Fri: 9:00 - 17:00 hrs <br />
                    Closed on Weekends
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-300 mt-8 pt-8">
          <Footer.Copyright
            by="FrodenZ Labs. All rights reserved."
            href="#"
            year={new Date().getFullYear()}
          />
        </div>
      </div>
    </footer>
  );
};

export default FooterPage;
