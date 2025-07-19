import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
function AppRouter() {
return (
    <Router>
        <Routes>
            {/* Add routes here */}
            <Route path="/" element={<HomePage/>} />
        </Routes>
    </Router>
);
}

export default AppRouter;
