/**
 * CampusConnect AI - Logout Component
 * Author: SPA
 */

import { useNavigate } from "react-router-dom";

export default function Logout({ setIsLoggedIn }) {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-lg">
            Logout
        </button>
    );
}

