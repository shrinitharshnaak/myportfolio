import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router } from 'react-router-dom'; // Add this import
import { initSmoothScroll } from './utils/smoothScroll';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Edu from './components/Edu';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const smoothScrollInstance = initSmoothScroll();
    const pageTransition = () => {
      const overlay = document.createElement('div');
      overlay.classList.add('page-transition');
      document.body.appendChild(overlay);
      setTimeout(() => {
        overlay.classList.add('fade-out');
        setTimeout(() => {
          overlay.remove();
          setIsLoading(false);
        }, 400);
      }, 600);
    };
    const preloadResources = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      pageTransition();
    };
    preloadResources();
    return () => {
      smoothScrollInstance.destroy();
    };
  }, []);

  return (
    <Router>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 ${isLoading ? 'loading' : ''}`}
      >
        <Navbar />
        <main className="smooth-scroll-container">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Edu />
          <Contact />
        </main>
        <Footer />
      </motion.div>
    </Router>
  );
}

export default App;