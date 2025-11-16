import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom"; 
import "./AuthForms.css";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login({ username, password });
    
        setLoading(false);

        if (result.success) {
            // ROLE-BASED REDIRECTION
            const userRole = result.data?.role;
            console.log('🔄 Redirecting user with role:', userRole);
        
            if (userRole === 'ADMIN') {
                navigate("/admin/dashboard");
            } else {
                navigate("/dashboard");
            }
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Welcome</h2>
            
            {error && (
                <div className="auth-error"> 
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form"> 
                <div className="form-group"> 
                    <label className="form-label">Username</label> 
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="form-input" 
                    />
                </div>

                <div className="form-group"> 
                    <label className="form-label">Password</label> 
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input" 
                    />
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="submit-btn" 
                >
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>
            </form>

            <p className="auth-link"> 
                Don't have an account? <a href="/register">Create one here</a>
            </p>
        </div>
    );
}

export default Login;