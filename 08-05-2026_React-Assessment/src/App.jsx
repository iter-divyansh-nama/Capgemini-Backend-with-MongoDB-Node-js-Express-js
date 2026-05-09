import React from 'react';
import { Menu, Share2, Heart, Mail, Star } from 'lucide-react';
import './index.css';
import shopperImage from './assets/shopper.png';

function App() {
  const handleRedirect = (url) => {
    window.location.href = url;
  };

  return (
    <div className="app-container">
      {/* Background Decorative Elements */}
      <Star className="bg-element star star-1" fill="white" />
      <Star className="bg-element star star-2" fill="white" />
      <div className="bg-element circle-outline circle-1"></div>
      <div className="bg-element circle-outline circle-2"></div>
      <div className="bg-element circle-outline circle-3"></div>
      <div className="bg-element solid-circle solid-1"></div>
      <div className="bg-element solid-circle solid-2"></div>
      <div className="bg-element line line-1"></div>
      <div className="bg-element line line-2"></div>
      <div className="bg-element line line-3"></div>
      <div className="bg-element line line-4"></div>

      {/* Header */}
      <header className="header">
        <div className="logo">COMPANYNAME</div>
        <nav className="nav-links">
          <a href="#" className="nav-link" onClick={() => handleRedirect('https://www.google.com')}>HOME</a>
          <a href="#" className="nav-link" onClick={() => handleRedirect('https://www.google.com')}>ABOUT US</a>
          <a href="#" className="nav-link" onClick={() => handleRedirect('https://www.myntra.com')}>SHOP</a>
          <a href="#" className="nav-link">LOGIN</a>
        </nav>
        <button className="menu-icon">
          <Menu size={28} />
        </button>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        {/* Left Side: Image */}
        <div className="image-container">
          <div className="circle-bg">
            <img src={shopperImage} alt="Happy Shopper" className="hero-image" />
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="content-area">
          <h2 className="special-offer">SPECIAL OFFER</h2>
          <h1 className="main-title">
            <span className="mega">MEGA</span>
            <span className="sale">SALE</span>
          </h1>
          <p className="description">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
          </p>
          <button
            className="shop-btn"
            onClick={() => handleRedirect('https://www.myntra.com')}
          >
            SHOP NOW
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="social-icons">
          <a href="#" className="social-icon"><Share2 size={18} /></a>
          <a href="#" className="social-icon"><Heart size={18} /></a>
          <a href="#" className="social-icon"><Mail size={18} /></a>
        </div>
        <div className="website-link">
          www.sampletext.com
        </div>
      </footer>
    </div>
  );
}

export default App;
