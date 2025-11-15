import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom"; 

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
        <div style={{ 
            maxWidth: '400px', 
            margin: '100px auto', 
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px'
        }}>
            <h2>Login</h2>
            
            {error && (
                <div style={{ 
                    color: 'red', 
                    marginBottom: '10px',
                    padding: '10px',
                    backgroundColor: '#ffe6e6',
                    borderRadius: '4px'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Username:</label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ 
                            width: '100%', 
                            padding: '8px', 
                            marginTop: '5px',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ 
                            width: '100%', 
                            padding: '8px', 
                            marginTop: '5px',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}
                    />
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    style={{ 
                        width: '100%', 
                        padding: '10px',
                        backgroundColor: loading ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                Don't have an account? <a href="/register">Register here</a>
            </p>
        </div>
    );
}

export default Login;