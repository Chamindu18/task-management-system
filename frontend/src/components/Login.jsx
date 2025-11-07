import { useAuth} from "../hooks/useAuth";
import { useNavigate } from "react-router-dom"; 

function Login(){
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        login();
        navigate("/dashboard"); // redirect to dashboard after login
    };

    return(
        <div>
            <h2>Login Page</h2> 
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}
console.log("Backend URL:", import.meta.env.VITE_API_BASE_URL);

export default Login;