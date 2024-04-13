import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Success from "./pages/Success";

function App() {
    return (
        <div className="">
            <Router>
                <div className="flex flex-col h-screen">
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/success" element={<Success />} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </div>
    );
}

export default App;
