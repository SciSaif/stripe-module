import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import CheckoutForm from "@/components/CheckoutForm";
import Loader from "@/components/Loader";
import ProductCard from "@/components/ProductCard";
import Products from "@/lib/products";
import { useNavigate } from "react-router-dom";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_KEY);
const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

const Home = () => {
    const [clientSecret, setClientSecret] = useState("");
    const navigate = useNavigate();
    const [payingThroughPaypal, setPayingThroughPaypal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number>();
    const payWithStripe = async () => {
        const selectedProduct = Products.find(
            (product) => product.id === selectedProductId
        );
        if (!selectedProduct) {
            return;
        }
        setIsLoading(true);
        // Create PaymentIntent as soon as the page loads
        fetch(`${baseURL}/stripe/payment-intent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: selectedProduct.price,
                currency: "inr",
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setClientSecret(data.clientSecret);
                setIsLoading(false);
            });
    };

    const payWithPaypal = async () => {
        const selectedProduct = Products.find(
            (product) => product.id === selectedProductId
        );
        if (!selectedProduct) {
            return;
        }
        setPayingThroughPaypal(true);
        // @ts-ignore
        window.paypal
            .Buttons({
                async createOrder() {
                    try {
                        const response = await fetch(
                            `${baseURL}/paypal/payment-intent`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                // use the "body" param to optionally pass additional order information
                                // like product ids and quantities
                                body: JSON.stringify({
                                    amount: selectedProduct.priceUSD,
                                    currency: "USD",
                                }),
                            }
                        );

                        let orderData = await response.json();
                        console.log(orderData);
                        orderData = orderData.jsonResponse;

                        if (orderData.id) {
                            return orderData.id;
                        } else {
                            const errorDetail = orderData?.details?.[0];
                            const errorMessage = errorDetail
                                ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                                : JSON.stringify(orderData);

                            throw new Error(errorMessage);
                        }
                    } catch (error) {
                        console.error(error);
                        // resultMessage(`Could not initiate PayPal Checkout...<br><br>${error}`);
                    }
                },
                async onApprove(data: any, actions: any) {
                    try {
                        const response = await fetch(
                            `${baseURL}/paypal/capture`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    orderID: data.orderID,
                                }),
                            }
                        );

                        let orderData = await response.json();
                        console.log(orderData);
                        orderData = orderData.jsonResponse;
                        const errorDetail = orderData?.details?.[0];

                        if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                            return actions.restart();
                        } else if (errorDetail) {
                            throw new Error(
                                `${errorDetail.description} (${orderData.debug_id})`
                            );
                        } else if (!orderData.purchase_units) {
                            throw new Error(JSON.stringify(orderData));
                        } else {
                            // (3) Successful transaction -> Show confirmation or thank you message
                            // Or go to another URL:  actions.redirect('thank_you.html');
                            // const transaction =
                            //     orderData?.purchase_units?.[0]?.payments
                            //         ?.captures?.[0] ||
                            //     orderData?.purchase_units?.[0]?.payments
                            //         ?.authorizations?.[0];

                            console.log(
                                "Capture result",
                                orderData,
                                JSON.stringify(orderData, null, 2)
                            );

                            navigate("/success");
                        }
                    } catch (error) {
                        console.error(error);
                        // resultMessage(
                        //   \`Sorry, your transaction could not be processed...<br><br>\${error}\`,
                        // );
                    }
                },
            })
            .render("#paypal-button-container");
    };

    const appearance = {
        theme: "stripe" as "stripe" | "night" | "flat",
    };
    const options = {
        clientSecret,
        appearance,
    };

    const selectedProduct = Products.find(
        (product) => product.id === selectedProductId
    );

    return (
        <div className="flex flex-col items-center justify-center flex-grow gap-4 mb-10">
            <div id="buy">
                {selectedProduct && !clientSecret && !payingThroughPaypal && (
                    <div className="flex items-center max-w-screen-xl min-h-screen px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                                Product Details
                            </h2>
                            <ProductCard
                                key={selectedProductId}
                                img={selectedProduct.img}
                                title={selectedProduct.title}
                                price={selectedProduct.price}
                                priceUSD={selectedProduct.priceUSD}
                                noList
                            />

                            <Button
                                onClick={payWithStripe}
                                className="w-full mt-2 "
                            >
                                {isLoading ? "Loading..." : "Pay with Stripe"}
                                {isLoading && (
                                    <Loader
                                        size={6}
                                        className="ml-2 border-white"
                                    />
                                )}
                            </Button>
                            <Button
                                onClick={payWithPaypal}
                                className="w-full mt-2 "
                            >
                                {isLoading ? "Loading..." : "Pay with Paypal"}
                                {isLoading && (
                                    <Loader
                                        size={6}
                                        className="ml-2 border-white"
                                    />
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {!clientSecret && !payingThroughPaypal && (
                <section>
                    <div className="max-w-screen-xl px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
                        <header>
                            <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                                Product Collection
                            </h2>

                            <p className="max-w-md mt-4 text-gray-500">
                                Checkout our latest collection of products.
                            </p>
                        </header>

                        <ul className="grid gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-4">
                            {Products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    img={product.img}
                                    title={product.title}
                                    price={product.price}
                                    priceUSD={product.priceUSD}
                                    onClick={() =>
                                        setSelectedProductId(product.id)
                                    }
                                />
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {clientSecret && selectedProduct && (
                <div className="flex flex-col gap-10 sm:gap-5 sm:flex-row md:gap-20 ">
                    <ProductCard
                        img={selectedProduct?.img}
                        title={selectedProduct?.title}
                        price={selectedProduct?.price}
                        priceUSD={selectedProduct?.priceUSD}
                        noList
                    />
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm />
                    </Elements>
                </div>
            )}
            <div className="flex flex-col gap-10 sm:gap-5 sm:flex-row md:gap-20 ">
                {payingThroughPaypal && selectedProduct && (
                    <ProductCard
                        img={selectedProduct?.img}
                        title={selectedProduct?.title}
                        price={selectedProduct?.price}
                        priceUSD={selectedProduct?.priceUSD}
                        noList
                    />
                )}
                <div id="paypal-button-container"></div>
            </div>
        </div>
    );
};

export default Home;
