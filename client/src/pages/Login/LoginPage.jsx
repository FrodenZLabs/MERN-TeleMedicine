import { Button } from "flowbite-react";
import FooterPage from "../../components/FooterPage";
import NavbarPage from "../../components/NavbarPage";
import backgroundImage from "/images/homepage.jpg";
import doctorIcon from "/images/doctorIcon.png";
import patientIcon from "/images/patientIcon.png";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <>
      <div
        className="min-h-screen flex items-center opacity-90 justify-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
        }}
      >
        <NavbarPage />
        <div className="md:mx-auto mx-4 p-8 md:p-12 bg-white rounded-lg shadow-lg max-w-2xl">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <div className="flex justify-center mb-4 gap-2">
              <Link to={"/patient-login"}>
                <Button className="flex flex-col">
                  <span className="text-xs md:text-lg uppercase">Patient</span>
                  <img
                    src={patientIcon}
                    alt="Patient"
                    className="mr-2 h-12 w-12 md:h-24 md:w-24"
                  />
                </Button>
              </Link>
              <Link to={"/doctor-login"}>
                <Button className="flex items-center">
                  <img
                    src={doctorIcon}
                    alt="Doctor"
                    className="mr-2 h-12 w-12 md:h-24 md:w-24"
                  />
                  <span className="text-xs md:text-lg uppercase">Doctor</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <FooterPage />
    </>
  );
};

export default LoginPage;
