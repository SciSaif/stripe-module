import { FormEvent, useEffect, useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { Layout } from "@stripe/stripe-js";
import { Button } from "./ui/button";
import Loader from "./Loader";
import { CopyIcon } from "lucide-react";

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            if (!paymentIntent) {
                setMessage("Something went wrong.");
                return;
            }
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage(
                        "Your payment was not successful, please try again."
                    );
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: "http://localhost:5173/success",
            },
        });
        console.log(error);
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (
            error.type === "invalid_request_error" ||
            error.type === "validation_error"
        ) {
            setMessage(
                "We are unable to process your payment. Please try again with a different card or try again after some time."
            );
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs" as Layout,
    };

    return (
        <form
            id="payment-form "
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-5"
        >
            <PaymentElement
                id="payment-element"
                options={paymentElementOptions}
            />

            <div className="text-sm text-slate-600">
                <p>Indian Test Card:</p>
                <div className="flex justify-center gap-4">
                    4000 0035 6000 0008
                    <button
                        type="button"
                        className={
                            "text-slate-600 relative active:scale-105 active:text-blue-800 hover:text-slate-800 active:text-primary"
                        }
                        onClick={() =>
                            navigator.clipboard
                                .writeText("4000 0035 6000 0008")
                                .then(() => setCopied(true))
                                .then(() =>
                                    setTimeout(() => setCopied(false), 2000)
                                )
                        }
                    >
                        <CopyIcon size={16} />
                        {copied && (
                            <span className="absolute top-0 translate-x-full text-slate-600 -right-2 ">
                                Copied!
                            </span>
                        )}
                    </button>
                </div>
            </div>
            {message && (
                <div
                    id="payment-message"
                    className="max-w-[350px] text-red-500 text-center"
                >
                    {message}
                </div>
            )}

            <Button disabled={isLoading || !stripe || !elements} type="submit">
                {isLoading ? (
                    <Loader
                        size={6}
                        fillParent={true}
                        className="border-white"
                    />
                ) : (
                    "Pay now"
                )}
            </Button>
            {/* Show any error or success messages */}
        </form>
    );
}
