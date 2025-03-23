// HomePageLayout.jsx (formerly Navbar.jsx)
import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ashokstambha from "../assets/dark.png";
import chatbotImage from '../assets/chatbot.png';
import summarizer from '../assets/summary.png';
import dashboard from '../assets/dashboard.png';
import ServiceSection from './leftservice';
import ServiceSection1 from './rightservice';
import ServiceSection2 from './leftservice1';
import ServiceSection3 from './rightservice1';
import Footer from './footer';
import HomePage from'./HomePage'
import Home from './HomePage'
import logout from '../assets/logout.png'
const Navbar = () => {
  const serviceSectionRef = useRef(null);
  const footerRef = useRef(null);
  const navigate = useNavigate();

  const scrollToServiceSection = () => {
    if (serviceSectionRef.current) {
      serviceSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFooter = () => {
    if (footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
      {/* Top Navigation */}
      <nav className="bg-gradient-to-r from-orange-400 to-green-400 p-4 shadow-lg sticky top-0 z-50 box-border">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/home" className="flex items-center text-white text-3xl font-extrabold tracking-wide">
            <img src={ashokstambha} alt="Ashok Stambha" className="h-12 mr-2" />
            Judicare
          </Link>
          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8">
            <li>
              <Link to="/home" className="text-white text-lg hover:text-purple-800 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="#" onClick={scrollToServiceSection} className="text-white text-lg hover:text-purple-800 transition">
                Judiciary Services
              </Link>
            </li>
            <li>
              <Link to="/legalbot" className="text-white text-lg hover:text-purple-800 transition">
                Law Chatbot
              </Link>
            </li>
            <li>
              <Link to="#" onClick={scrollToFooter} className="text-white text-lg hover:text-purple-800 transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/profile" className="text-white text-lg hover:text-purple-800 transition">
                <img src={ashokstambha} alt="Profile" className="h-8 w-8 rounded-full inline-block" />
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="text-white text-lg hover:text-purple-800 transition">
                <img src={logout} alt="logout" className="h-7 w-6 cursor-pointer" />
              </button>
            </li>
          </ul>
          {/* Mobile Menu Button */}
          <button className="md:hidden text-white focus:outline-none">
            ☰
          </button>
          
        </div>
      </nav>

      <Home />
      
      {/* Service Sections */}
      <ServiceSection 
        ref={serviceSectionRef}
        img={chatbotImage}
        title1="Chatbot"
        name="Judiciary Services"
        desc1="Experience seamless access to various judicial services through our platform..."
        desc2="From case tracking to document management..."
      />

      <ServiceSection1 
        img={summarizer}
        title1="Summarizer"
        name="Case Summarizer"
        desc1="Transform complex legal documents into clear, concise summaries..."
        desc2="Stay ahead with instant access to case insights..."
      />

      <ServiceSection2 
        img={dashboard}
        title1=" Track"
        name="Case Tracking"
        desc1="Unlock the full potential of your legal journey with our intuitive Cases Dashboard..."
        desc2="Effortlessly track your cases, manage documents..."
      />

      <ServiceSection3 
        img={dashboard}
        title1="Dashboard"
        name="Cases Dashboard"
        desc1="Unlock the full potential of your legal journey..."
        desc2="Effortlessly track your cases, manage documents..."
      />

      <Footer ref={footerRef} />
      {/* Home Page Component */}
     
    </>
  );
};

export default Navbar;
