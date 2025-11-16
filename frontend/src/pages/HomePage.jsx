import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
    const navigate = useNavigate();

     //  Get current year automatically
    const currentYear = new Date().getFullYear();

    const handleGetStarted = () => {
        navigate("/login");
    };

    return (
        <div className="homepage">
            <div className="hero-section">
                {/* Header */}
                <header className="home-header">
                    <div className="logo">
                        <span className="logo-icon">✅</span>
                        DreamDoo
                    </div>
                </header>

                {/* Main Content */}
                <main className="main-content">
                    <div className="content-wrapper">
                        <h1 className="main-title">
                            Organize Your Work, <span className="accent">Achieve More</span>
                        </h1>
                        
                        <p className="main-description">
                            DreamDoo helps you manage tasks, track progress, and collaborate with your team. 
                            Simple, powerful, and free to get started.
                        </p>

                        <div className="features">
                            <div className="feature">
                                <span className="feature-icon">✓</span>
                                Create and organize tasks
                            </div>
                            <div className="feature">
                                <span className="feature-icon">✓</span>
                                Track your progress
                            </div>
                            <div className="feature">
                                <span className="feature-icon">✓</span>
                                Collaborate with your team
                            </div>
                            <div className="feature">
                                <span className="feature-icon">✓</span>
                                Access from anywhere
                            </div>
                        </div>

                        <button 
                            className="get-started-btn"
                            onClick={handleGetStarted}
                        >
                            Get Started
                        </button>

                        <p className="login-hint">
                            Already have an account? <a href="/login">Sign in</a>
                        </p>
                    </div>
                </main>

                <br></br>

                {/* Footer */}
                <footer className="home-footer">
                    <p>© {currentYear} DreamDoo. Made with ❤️ for productive teams.</p>
                </footer>
            </div>
        </div>
    );
}

export default HomePage;