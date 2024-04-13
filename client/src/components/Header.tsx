import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className="flex justify-between px-10 py-3 text-2xl text-white border-b shadow bg-indigo-950">
            <Link to={"/"}>Payment App</Link>
            <div className="flex flex-row items-center gap-6">
                <Link to={"/"} className="mr-2 text-sm">
                    Home
                </Link>
            </div>
        </div>
    );
};

export default Header;
