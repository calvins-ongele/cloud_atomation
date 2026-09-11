"use client";
import Image from "next/image";
import { useState } from "react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

// Reusable Feature Card Component
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

export default function Home() {
  
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const features: FeatureCardProps[] = [
    { icon: "⚡", title: "Blazing Fast", description: "Optimized for maximum speed and performance across all modern browsers." },
    { icon: "🛡️", title: "Secure by Default", description: "Enterprise-grade encryption protecting your data and users at all times." },
    { icon: "⚙️", title: "Highly Modifiable", description: "Modular code blocks engineered to adapt perfectly to your specific requirements." }
  ];

  async function sampleApiCall() {
    try {
      const response = await fetch("/api/automate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: "sampleProjectId",
          emails: "johndoe@gmail.com,janedoe@gmail.com",
          chromium_profile: "sampleProfile",
          endpoint: "http://localhost:3000/api/duke-feedback",
          timeout: 30000,
          debug: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
    } catch (error) {
      console.error("Error during API call:", error);
    }
  }

  return (
    <div className="homepage-container">
      {/* Navigation Header */}
      <header className="navbar">
        <div className="nav-logo">CloutAuto</div>
        <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle Navigation">
          ☰
        </button>
        <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <a href="#features">Features</a>
          <a href="#solutions">Solutions</a>
          <a href="#pricing">Pricing</a>
          <button className="btn-secondary">Sign In</button>
          <button className="btn-primary">Get Started</button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <h1>Build Smarter. Scale Faster.</h1>
          <p>
            An intuitive UI engine designed for modern web developers. Craft ultra-responsive, 
            accessible, and highly customized digital interfaces effortlessly.
          </p>
          <div className="hero-actions">
            <button className="btn-primary size-lg"
            onClick={sampleApiCall}>
              Start Free Trial
            </button>
            <button className="btn-outline size-lg">Book Demo</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="mockup-dashboard">
            <div className="mockup-header"><span className="dot"></span><span className="dot"></span><span className="dot"></span></div>
            <div className="mockup-body">
              <div className="mockup-sidebar"></div>
              <div className="mockup-main"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Engineered for Modern Teams</h2>
          <p>Everything you need to deliver high-quality components at scale.</p>
        </div>
        <div className="features-grid">
          {features.map((item, index) => (
            <FeatureCard 
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
