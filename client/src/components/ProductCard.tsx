interface Props {
    img: string;
    title: string;
    price: number;
    onClick?: () => void;
    noList?: boolean;
}

const ProductCard = ({ img, title, price, onClick, noList }: Props) => {
    const card = (
        <a
            href={"#buy"}
            className="block overflow-hidden cursor-pointer group "
        >
            <img
                src={img}
                alt="title"
                className="h-[250px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[250px]"
            />

            <div className="relative pt-3 bg-white">
                <h3 className="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4">
                    {title}
                </h3>

                <p className="mt-2">
                    <span className="sr-only"> Regular Price </span>

                    <span className="tracking-wider text-gray-900">
                        ₹ {price}
                    </span>
                </p>
            </div>
        </a>
    );

    if (noList) return card;

    return <li onClick={onClick}>{card}</li>;
};

export default ProductCard;
