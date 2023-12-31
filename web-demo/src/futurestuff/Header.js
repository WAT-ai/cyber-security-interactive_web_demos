// src/components/Header.js
import React, {useEffect, useState} from 'react';
import './Header.css'; // Import the stylesheet
import { Link } from 'react-router-dom';

const Header = () => {
   const [isScrolled, setIsScrolled] = useState(false);

   useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);

    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <h1>Wat AI Cybersecurity: Interactive Web Demo</h1>
      <button className="contact-button">Contact</button>
    </div>
  );
};

export default Header;