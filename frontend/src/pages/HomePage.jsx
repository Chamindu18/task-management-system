import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./HomePage.css";

function HomePage() {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    // Smooth scroll animation on section enter
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -100px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate-in");
                }
            });
        }, observerOptions);

        const sections = document.querySelectorAll(".animate-on-scroll");
        sections.forEach(section => observer.observe(section));

        return () => sections.forEach(section => observer.unobserve(section));
    }, []);

    const handleGetStarted = () => {
        navigate("/register");
    };

    const handleLogin = () => {
        navigate("/login");
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="homepage">
            {/* Top Navigation Bar */}
            <nav className="top-navbar">
                <div className="navbar-content">
                    <div className="navbar-logo">
                        <span className="logo-icon">✅</span>
                        DreamDoo
                    </div>
                    <div className="navbar-links">
                        <button className="nav-link" onClick={() => scrollToSection("home")}>Home</button>
                        <button className="nav-link" onClick={() => scrollToSection("why-dreamdoo")}>Why DreamDoo</button>
                        <button className="nav-link" onClick={() => scrollToSection("how-it-works")}>How It Works</button>
                        <button className="nav-link" onClick={() => scrollToSection("features")}>Features</button>
                        <button className="nav-login-btn" onClick={handleLogin}>Login</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section - No animation on initial load */}
            <section id="home" className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Organize Your Work, <span className="accent">Achieve More</span>
                    </h1>
                    
                    <p className="hero-description">
                        DreamDoo helps you manage tasks, track progress, and collaborate with your team. 
                        Simple, powerful, and free to get started.
                    </p>

                    <div className="hero-buttons">
                        <button className="get-started-btn" onClick={handleGetStarted}>
                            Get Started Free
                        </button>
                        <button className="secondary-btn" onClick={handleLogin}>
                            Sign In
                        </button>
                    </div>
                </div>
            </section>

            {/* Why DreamDoo Section */}
            <section id="why-dreamdoo" className="why-section animate-on-scroll">
                <h2 className="section-title">Why Choose DreamDoo?</h2>
                <div className="value-cards">
                    <div className="value-card">
                        <div className="card-icon">🎯</div>
                        <h3>Stay Focused</h3>
                        <p>Organize tasks by priority and never miss what matters most</p>
                    </div>
                    <div className="value-card">
                        <div className="card-icon">📊</div>
                        <h3>Track Progress</h3>
                        <p>Visualize your productivity with analytics and insights</p>
                    </div>
                    <div className="value-card">
                        <div className="card-icon">🤝</div>
                        <h3>Collaborate Better</h3>
                        <p>Assign tasks, share updates, and work together seamlessly</p>
                    </div>
                    <div className="value-card">
                        <div className="card-icon">⚡</div>
                        <h3>Lightning Fast</h3>
                        <p>Built for speed with a clean, intuitive interface</p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="how-section animate-on-scroll">
                <h2 className="section-title">How It Works</h2>
                <div className="steps-container">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h3>Create Your Account</h3>
                        <p>Sign up in seconds and start your free trial immediately</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h3>Add Your Tasks</h3>
                        <p>Create tasks, set priorities, deadlines, and assign team members</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h3>Get Things Done</h3>
                        <p>Track progress, collaborate, and achieve your goals efficiently</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section animate-on-scroll">
                <h2 className="section-title">Powerful Features</h2>
                <div className="features-grid">
                    <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <div>
                            <h4>Task Management</h4>
                            <p>Create, edit, and organize tasks with ease</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <div>
                            <h4>Priority Levels</h4>
                            <p>Mark tasks as High, Medium, or Low priority</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <div>
                            <h4>Team Collaboration</h4>
                            <p>Assign tasks and work together with your team</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <div>
                            <h4>Real-time Updates</h4>
                            <p>See changes instantly across all devices</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <div>
                            <h4>Analytics Dashboard</h4>
                            <p>Track productivity with detailed insights</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">✓</span>
                        <div>
                            <h4>Secure & Reliable</h4>
                            <p>Your data is encrypted and safely stored</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="cta-section animate-on-scroll">
                <div className="cta-content">
                    <h2>Ready to Get Started?</h2>
                    <p>Join thousands of teams already using DreamDoo to stay organized and productive</p>
                    <button className="get-started-btn large" onClick={handleGetStarted}>
                        Start Free Today
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <span className="logo-icon">✅</span>
                        DreamDoo
                    </div>
                    <p>© {currentYear} DreamDoo. Made with ❤️ for productive teams.</p>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;