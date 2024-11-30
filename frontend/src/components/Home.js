import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${scrollPosition * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home-container">
      <div className="background-animation"></div>
      <header className="header">
        <div className="logo">LearningHub</div>
        <nav>
          <Link to="/login" className="nav-link">Login</Link>
        </nav>
      </header>
      
      <main className="main-content">
        <div className="hero-section" ref={heroRef}>
          <h1 className="animate-text">Empower Your Workforce</h1>
          <p className="animate-text">Streamline training management and boost employee development</p>
          <Link to="/register" className="cta-button animate-button">Register</Link>
        </div>
        
        <div className="features-section">
          <div className="feature-card">
            <i className="fas fa-tasks"></i>
            <h3>Request Training</h3>
            <p>Account managers can easily submit training requests</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-chalkboard-teacher"></i>
            <h3>Manage Courses</h3>
            <p>LCD team can create, assign, and track courses efficiently</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-user-graduate"></i>
            <h3>Learn & Grow</h3>
            <p>Employees access courses and provide valuable feedback</p>
          </div>
        </div>
      </main>
      
      <footer className="footer">
        <p>&copy; 2024 LearningHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
