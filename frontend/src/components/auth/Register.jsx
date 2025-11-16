import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./AuthForms.css";

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
        <div className="auth-container">
            <h2 className="auth-title">Create Account</h2>
            
            {error && (
                <div className="auth-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label className="form-label">Username:</label>
                    <input 
                        type="text" 
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className={`form-input ${fieldErrors.username ? 'error' : ''}`}
                    />
                    {fieldErrors.username && (
                        <span className="field-error">{fieldErrors.username}</span>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">Email:</label>
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                    />
                    {fieldErrors.email && (
                        <span className="field-error">{fieldErrors.email}</span>
                    )} 
                </div>

                <div className="form-group">
                    <label className="form-label">Password:</label>
                    <input 
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                    />
                    {fieldErrors.password && (
                        <span className="field-error">{fieldErrors.password}</span>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">Confirm Password:</label>
                    <input 
                        type="password" 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="submit-btn"
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>

            <p className="auth-link">
                Already have an account? <a href="/login">Login here</a>
            </p>
        </div>
    );
}

export default Register;