import { Button } from "flowbite-react";
import { HiChevronLeft } from "react-icons/hi";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-16">
      <div className="outline-2 outline-red-600 bg-red-200 rounded-2xl px-6 py-10 flex flex-col items-center">
        <img alt="" src="/" className="lg:max-w-md" />
        <h1 className="mb-6 text-2xl font-bold  md:text-5xl">Page not found</h1>
        <p className="mb-6 w-4/5 max-w-xl text-center text-lg text-gray-700">
          Oops! Looks like you followed a bad link. If you think this is a
          problem with us, please tell us.
        </p>
        <Button href="/">
          <div className="mr-1 flex items-center gap-x-2">
            <HiChevronLeft className="text-xl" /> Go back home
          </div>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
