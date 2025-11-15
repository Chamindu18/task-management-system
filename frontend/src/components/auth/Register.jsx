import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear errors when user starts typing
        if (fieldErrors[e.target.name]) {
            setFieldErrors({
                ...fieldErrors,
                [e.target.name]: ''
            });
        }
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const result = await register({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            
            if (result.success) {
                alert('Registration successful! Please login.');
                navigate("/login");
            } else {
                // Check if backend returned field-specific errors
                if (result.error && typeof result.error === 'object') {
                    setFieldErrors(result.error);
                } else {
                    setError(result.error || 'Registration failed');
                }
            }
        } catch (err) {
            console.log('Registration error:', err);
            setError('Registration failed - please check your connection');
        } finally {
            setLoading(false);
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
            <h2>Register</h2>
            
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
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{ 
                            width: '100%', 
                            padding: '8px', 
                            marginTop: '5px',
                            borderRadius: '4px',
                            border: fieldErrors.username ? '1px solid red' : '1px solid #ccc'
                        }}
                    />
                    {fieldErrors.username && (
                        <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                            {fieldErrors.username}
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ 
                            width: '100%', 
                            padding: '8px', 
                            marginTop: '5px',
                            borderRadius: '4px',
                            border: fieldErrors.email ? '1px solid red' : '1px solid #ccc'
                        }}
                    />
                    {fieldErrors.email && (
                        <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                            {fieldErrors.email}
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ 
                            width: '100%', 
                            padding: '8px', 
                            marginTop: '5px',
                            borderRadius: '4px',
                            border: fieldErrors.password ? '1px solid red' : '1px solid #ccc'
                        }}
                    />
                    {fieldErrors.password && (
                        <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                            {fieldErrors.password}
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Confirm Password:</label>
                    <input 
                        type="password" 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
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
                        backgroundColor: loading ? '#ccc' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>

            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                Already have an account? <a href="/login">Login here</a>
            </p>
        </div>
    );
}

export default Register;