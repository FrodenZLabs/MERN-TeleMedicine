import stripePackage from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = stripePackage(process.env.STRIPE_PRIVATE_KEY);

export default stripe;
