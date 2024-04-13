import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import CheckoutForm from "@/components/CheckoutForm";
import Loader from "@/components/Loader";
import ProductCard from "@/components/ProductCard";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_KEY);

const Products = [
    {
        id: 1,
        img: "https://fullyfilmy.in/cdn/shop/products/New-Mockups---no-hanger---TShirt-Yellow.jpg?v=1639657077",
        title: "Basic Tee",
        price: 600.0,
    },
    {
        id: 2,
        img: "https://5.imimg.com/data5/WZ/AX/PV/SELLER-3300497/plain-t-shirt.jpeg",
        title: "Bright Red",
        price: 800.0,
    },
    {
        id: 3,
        img: "https://superbikestore.in/cdn/shop/products/Realistic-Tshirt-Mockup_1024x1024_aa65700b-8f0d-4525-b6b5-7d0613464978.png?v=1574760933",
        title: "Be Yourself",
        price: 900.0,
    },
    {
        id: 4,
        img: "https://image.made-in-china.com/202f0j00tmOiFIHlkcrw/Black-Quick-Drying-160g-Sport-Tshirt-Polyester-Printing-T-Shirt-Custom-Clothing-Customized-Work-Wear.webp",
        title: "Cool Black",
        price: 650.0,
    },
    {
        id: 5,
        img: "https://contents.mediadecathlon.com/p1962600/294de5e4093cf3fc92fafdb60f7c1bf4/p1962600.jpg?format=auto&quality=70&f=650x0",
        title: "Red Grass",
        price: 1250.0,
    },
];

const Home = () => {
    const [clientSecret, setClientSecret] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number>();
    const createPaymentIntent = async () => {
        const selectedProduct = Products.find(
            (product) => product.id === selectedProductId
        );
        if (!selectedProduct) {
            return;
        }
        setIsLoading(true);
        // Create PaymentIntent as soon as the page loads
        const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;
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
                {selectedProduct && !clientSecret && (
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
                                noList
                            />

                            <Button
                                onClick={createPaymentIntent}
                                className="w-full mt-2 "
                            >
                                {isLoading ? "Loading..." : "Buy Now"}
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

            {!clientSecret && (
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
                        noList
                    />
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm />
                    </Elements>
                </div>
            )}
        </div>
    );
};

export default Home;
