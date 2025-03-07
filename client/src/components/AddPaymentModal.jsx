/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const AddPaymentModalWrapper = ({
  appointmentId,
  patientId,
  onPaymentSuccess,
}) => {
  return (
    <Elements stripe={stripePromise}>
      <AddPaymentModal
        appointmentId={appointmentId}
        patientId={patientId}
        onPaymentSuccess={onPaymentSuccess}
      />
    </Elements>
  );
};

const AddPaymentModal = ({ appointmentId, patientId, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [paymentAmount] = useState("200");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }
    // Create a payment intent on the backend
    const response = await fetch("/mediclinic/payment/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_id: patientId,
        appointment_id: appointmentId,
        payment_amount: paymentAmount,
      }),
    });

    const { clientSecret } = await response.json();

    const cardElement = elements.getElement(CardElement);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: name,
        },
      },
    });

    if (payload.error) {
      toast.error(payload.error.message);
      setLoading(false);
    } else {
      setLoading(false);
      toast.success("Payment successful!");
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Add Payment for Appointment
        </h2>
        <form onSubmit={handlePaymentSubmit}>
          <div className="flex flex-col mb-4">
            <Label htmlFor="name" className="text-gray-700">
              Card Holder Name:
            </Label>
            <TextInput
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleNameChange}
              className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col mb-4">
            <Label htmlFor="card-element" className="text-gray-700">
              Card Details:
            </Label>
            <div className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500">
              <CardElement id="card-element" />
            </div>
          </div>
          <div className="flex flex-col mb-4">
            <Label htmlFor="payment-amount" className="text-gray-700">
              Amount: Kshs.
            </Label>
            <TextInput
              disabled
              type="text"
              id="payment-amount"
              name="payment-amount"
              value={paymentAmount}
              className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            type="submit"
            disabled={loading || !stripe}
          >
            {loading ? "Processing..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentModalWrapper;
