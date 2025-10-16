import FooterPage from "../../components/layout/FooterPage";
import NavbarPage from "../../components/layout/NavbarPage";
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
                <div className="flex items-center bg-blue-500 rounded-lg px-4 py-2 gap-x-3">
                  <span className="text-xs md:text-lg uppercase text-white font-semibold">
                    Patient
                  </span>
                  <img
                    src={patientIcon}
                    alt="Patient"
                    className="mr-2 h-12 w-12 md:h-20 md:w-20"
                  />
                </div>
              </Link>
              <Link to={"/doctor-login"}>
                <div className="flex items-center bg-blue-500 rounded-lg font-semibold px-4 py-2 gap-x-3">
                  <img
                    src={doctorIcon}
                    alt="Doctor"
                    className="mr-2 h-12 w-12 md:h-20 md:w-20"
                  />
                  <span className="text-xs md:text-lg uppercase text-white font-semibold">
                    Doctor
                  </span>
                </div>
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
