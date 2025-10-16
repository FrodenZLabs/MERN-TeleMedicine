import cloudinary from "./cloudinary.js";
import { errorHandler } from "./error.js";

export const uploadSingle = async (request, response, next) => {
  try {
    const image = request.file; // Extract the uploaded file

    if (!image) {
      return next(errorHandler(400, "No image found."));
    }
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(image.path, {
      folder: "Telemedicine",
      resource_type: "auto",
    });

    // Attach the image URL to the request object
    request.imageUrl = result.secure_url;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
