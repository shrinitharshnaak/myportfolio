import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import * as THREE from 'three';
import { FaEnvelope, FaGithub, FaLinkedin, FaPhone, FaSun, FaMoon, FaChevronDown, FaLaptopCode, FaPaintBrush, FaDatabase, FaDownload, FaShareAlt } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';

const About = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const cursorRef = useRef(null);
  const threeContainerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const spheresRef = useRef([]);
  const animationIdRef = useRef(null);
  const cardRef = useRef(null);

  // Social links data with proper attributes
  const socialLinks = [
    { 
      url: 'https://github.com/shrinitharshnaak', 
      icon: <FaGithub />, 
      label: 'GitHub',
      target: '_blank',
      rel: 'noopener noreferrer'
    },
    { 
      url: 'https://www.linkedin.com/in/shrinitharshnaa-kuppusamy-4a61a8360/', 
      icon: <FaLinkedin />, 
      label: 'LinkedIn',
      target: '_blank',
      rel: 'noopener noreferrer'
    },
    { 
      url: 'tel:+919789140874', 
      icon: <FaPhone />, 
      label: 'Phone',
      target: '_self'
    },
  ];

  // Smooth cursor animation
  const springConfig = { damping: 25, stiffness: 100 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  // Card tilt effect
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-3, 3]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const handleMouseOverLink = () => cursorRef.current?.classList.add('expanded');
    const handleMouseOutLink = () => cursorRef.current?.classList.remove('expanded');

    if (window.innerWidth >= 768) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      const links = document.querySelectorAll('a, button');
      links.forEach((link) => {
        link.addEventListener('mouseenter', handleMouseOverLink, { passive: true });
        link.addEventListener('mouseleave', handleMouseOutLink, { passive: true });
      });

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        links.forEach((link) => {
          link.removeEventListener('mouseenter', handleMouseOverLink);
          link.removeEventListener('mouseleave', handleMouseOutLink);
        });
      };
    }
  }, [mouseX, mouseY]);

  useEffect(() => {
    const initThreeJS = () => {
      if (!threeContainerRef.current) return;

      const container = threeContainerRef.current;
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 50);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      rendererRef.current = renderer;
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Create floating spheres
      const sphereGeometry = new THREE.SphereGeometry(2, 16, 16);
      const colors = ['#EC4899', '#9333EA', '#FBCFE8', '#DDD6FE'];
      for (let i = 0; i < 20; i++) {
        const material = new THREE.MeshBasicMaterial({
          color: colors[Math.floor(Math.random() * colors.length)],
          transparent: true,
          opacity: 0.5,
        });
        const sphere = new THREE.Mesh(sphereGeometry, material);
        sphere.position.set(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 50
        );
        sphere.userData = {
          basePosition: sphere.position.clone(),
          speed: Math.random() * 0.02 + 0.01,
        };
        scene.add(sphere);
        spheresRef.current.push(sphere);
      }

      const cursor = { x: 0, y: 0 };
      const updateCursor = (e) => {
        const rect = container.getBoundingClientRect();
        cursor.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        cursor.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      };

      if (window.innerWidth >= 768) {
        container.addEventListener('mousemove', updateCursor, { passive: true });
        container.addEventListener(
          'touchmove',
          (e) => {
            e.preventDefault();
            updateCursor(e.touches[0]);
          },
          { passive: false }
        );
      }

      const clock = new THREE.Clock();
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();
        spheresRef.current.forEach((sphere) => {
          const { basePosition, speed } = sphere.userData;
          sphere.position.x = basePosition.x + Math.sin(elapsed * speed) * 10;
          sphere.position.y = basePosition.y + Math.cos(elapsed * speed) * 10;
          const dx = cursor.x * 50 - sphere.position.x;
          const dy = cursor.y * 50 - sphere.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 20) {
            sphere.position.x += dx * 0.05;
            sphere.position.y += dy * 0.05;
          }
        });
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        if (!threeContainerRef.current || !rendererRef.current || !cameraRef.current) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize, { passive: true });
      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
        container.removeEventListener('mousemove', updateCursor);
        container.removeEventListener('touchmove', updateCursor);
        if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
        if (rendererRef.current) {
          rendererRef.current.dispose();
          container.removeChild(rendererRef.current.domElement);
        }
        spheresRef.current.forEach((sphere) => {
          sphere.geometry.dispose();
          sphere.material.dispose();
        });
      };
    };

    if (window.innerWidth >= 768) {
      initThreeJS();
    }
  }, []);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const sharePortfolio = async () => {
    const url = window.location.origin;
    try {
      await navigator.clipboard.writeText(url);
      alert('Portfolio link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy. Please try again.');
    }
  };

  const handleResumeDownload = () => {
    const resumeUrl = '/assets/Shrinitharshnaa_Resume.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Shrinitharshnaa_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const skillVariants = {
    initial: { scale: 1, y: 0 },
    hover: { scale: 1.2, y: -5, transition: { type: 'spring', stiffness: 300, damping: 15 } },
  };

  const timelineItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const skills = [
    { name: 'Figma', icon: <FaPaintBrush />, description: 'Designing intuitive UI/UX with Figma.' },
    { name: 'React', icon: <FaLaptopCode />, description: 'Building dynamic UIs with React and Vite.' },
    { name: 'Node.js', icon: <FaLaptopCode />, description: 'Creating scalable APIs with Node.js.' },
    { name: 'MongoDB', icon: <FaDatabase />, description: 'Managing NoSQL databases.' },
    { name: 'SQL', icon: <FaDatabase />, description: 'Working with relational databases.' },
    { name: 'Tailwind CSS', icon: <FaPaintBrush />, description: 'Styling with utility-first CSS.' },
  ];

  const timeline = [
    {
      year: '2023',
      title: 'Developed Employee Payroll System',
      description: 'Created a full-stack application for efficient payroll management.',
      icon: <FaLaptopCode className="text-2xl text-pink-500 dark:text-pink-400" />,
    },
    {
      year: '2023',
      title: 'SOS System in Helmet',
      description: 'Designed an innovative safety system integrated into helmets.',
      icon: <FaLaptopCode className="text-2xl text-pink-500 dark:text-pink-400" />,
    },
    {
      year: '2024',
      title: 'UI for Student Portal',
      description: 'Crafted an intuitive user interface for a student management portal.',
      icon: <FaPaintBrush className="text-2xl text-pink-500 dark:text-pink-400" />,
    },
    {
      year: '2024',
      title: 'Weather Website',
      description: 'Built a responsive weather forecasting website using React and APIs.',
      icon: <FaLaptopCode className="text-2xl text-pink-500 dark:text-pink-400" />,
    },
  ];

  return (
    <motion.section
      id="about"
      className="relative py-24 min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cream-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Three.js Canvas */}
      <div ref={threeContainerRef} className="absolute inset-0 z-0" style={{ cursor: 'none' }} />

      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="hidden md:block fixed w-6 h-6 rounded-full bg-pink-400/40 shadow-[0_0_15px_3px_rgba(236,72,153,0.3)] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-all duration-150"
      />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-400 dark:to-purple-400"
          >
            About Me
          </motion.h2>
          <TypeAnimation
            sequence={['Designer', 1000, 'Developer', 1000, 'Innovator', 1000]}
            wrapper="p"
            cursor={true}
            repeat={Infinity}
            className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-300"
          />
        </motion.div>

        {/* Profile and Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Profile Card */}
          <motion.div
            ref={cardRef}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-2 p-6 rounded-2xl bg-cream-50/90 backdrop-blur-lg border border-pink-200/50 dark:bg-gray-800/40 dark:border-pink-500/30 shadow-xl"
            style={{ rotateX, rotateY }}
          >
            <motion.img
              src="public\image.png"
              alt="Shrinitharshnaa K, Full Stack Developer and UI Designer"
              className="w-full h-72 object-cover rounded-xl mb-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              loading="lazy"
            />
            <div className="text-center">
              <h3 className="text-xl font-semibold text-pink-600 dark:text-pink-400">Shrinitharshnaa K</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Full Stack Developer & UI Designer</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Erode, Tamil Nadu</p>
              <div className="flex gap-4 justify-center mt-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.url}
                    target={social.target}
                    rel={social.rel}
                    className="p-2 text-pink-500 dark:text-pink-400 hover:text-purple-500 dark:hover:text-purple-400"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Contact via ${social.label}`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
              <div className="flex gap-4 justify-center mt-4 flex-wrap">
                <motion.button
                  onClick={handleResumeDownload}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full hover:from-pink-600 hover:to-purple-600 dark:from-pink-400 dark:to-purple-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Download resume"
                >
                  <FaDownload className="inline mr-2" /> Resume
                </motion.button>
                <motion.a
                  href="mailto:shrinitharshnaakuppusamy@gmail.com"
                  className="px-4 py-2 text-sm font-medium text-pink-500 border border-pink-300 rounded-full hover:bg-pink-100/50 dark:text-pink-400 dark:border-pink-500/30 dark:hover:bg-gray-800/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Contact Shrinitharshnaa"
                >
                  <FaEnvelope className="inline mr-2" /> Contact
                </motion.a>
                <motion.button
                  onClick={sharePortfolio}
                  className="px-4 py-2 text-sm font-medium text-purple-500 border border-purple-300 rounded-full hover:bg-purple-100/50 dark:text-purple-400 dark:border-purple-500/30 dark:hover:bg-gray-800/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Share portfolio"
                >
                  <FaShareAlt className="inline mr-2" /> Share
                </motion.button>
                <motion.button
                  onClick={toggleTheme}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {theme === 'dark' ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Bio and Intro */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-3 space-y-6 mt-8 lg:mt-0"
          >
            <motion.h3
              variants={itemVariants}
              className="text-2xl md:text-3xl font-semibold text-pink-600 dark:text-pink-400"
            >
              Crafting Digital Dreams
            </motion.h3>
            <motion.div
              variants={itemVariants}
              className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              <p>
                I'm Shrinitharshnaa K, a 3rd-year B.E. Computer Science and Design student at Kongu Engineering College, Perundurai. My passion is weaving creativity and code to build web applications that are both beautiful and functional.
              </p>
              <p className="mt-4">
                Whether it's designing sleek interfaces in Figma or building robust full-stack apps with React, Node.js, and MongoDB, I'm driven by the joy of creating seamless user experiences. Let's collaborate to turn your vision into reality!
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Skills Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-16"
        >
          <motion.h3
            variants={itemVariants}
            className="text-2xl md:text-3xl font-semibold text-center text-pink-600 dark:text-pink-400"
          >
            My Creative Toolkit
          </motion.h3>
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-6 justify-center mt-8"
          >
            {skills.map((skill) => (
              <motion.div
                key={skill.name}
                variants={skillVariants}
                initial="initial"
                whileHover="hover"
                className="relative w-24 h-24 rounded-full bg-cream-50/90 backdrop-blur-lg border border-pink-200/50 dark:bg-gray-800/40 dark:border-pink-500/30 shadow-md group"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl text-pink-500/80 dark:text-pink-400/80">{skill.icon}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{skill.name}</p>
                </div>
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 hidden group-hover:block bg-pink-500/90 text-white text-xs sm:text-sm rounded-lg py-2 px-4 shadow-md whitespace-nowrap z-10">
                  {skill.description}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Timeline Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-16"
        >
          <motion.h3
            variants={itemVariants}
            className="text-2xl md:text-3xl font-semibold text-center text-pink-600 dark:text-pink-400"
            initial="initial"
            whileHover={{
              scale: 1.05,
              textShadow: '0 0 10px rgba(236, 72, 153, 0.5)',
              transition: { duration: 0.3 },
            }}
          >
            My Journey
          </motion.h3>
          <div className="relative mt-12 max-w-3xl mx-auto">
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-1.5 bg-gradient-to-b from-pink-400 to-purple-400 dark:from-pink-300 dark:to-purple-300 shadow-[0_0_15px_rgba(236,72,153,0.3)]" />
            {timeline.map((event, index) => (
              <motion.div
                key={index}
                variants={timelineItemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`flex items-start mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} relative group`}
              >
                <div className="w-1/2 flex justify-center">
                  <motion.div
                    className="w-5 h-5 rounded-full bg-pink-500 dark:bg-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.6)]"
                    whileHover={{ scale: 1.6, boxShadow: '0 0 20px rgba(236, 72, 153, 0.8)' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />
                </div>
                <div className="w-1/2 px-4">
                  <motion.div
                    className="p-5 rounded-xl bg-cream-50/90 backdrop-blur-lg border border-pink-200/50 dark:bg-gray-800/40 dark:border-pink-500/30 shadow-lg group-hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all duration-300"
                    whileHover={{ scale: 1.03, y: -3 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {event.icon}
                      <h4 className="text-lg font-semibold text-pink-600 dark:text-pink-400">{event.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{event.description}</p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">{event.year}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
        >
          <a
            href="#projects"
            className="text-pink-500 hover:text-purple-500 dark:text-pink-400 dark:hover:text-purple-400"
            aria-label="Scroll to projects section"
          >
            <FaChevronDown className="text-2xl animate-bounce" />
          </a>
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .custom-cursor {
          transition: width 0.2s ease, height 0.2s ease, background-color 0.3s ease;
        }
        .custom-cursor.expanded {
          width: 2.5rem;
          height: 2.5rem;
          background-color: rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </motion.section>
  );
};

export default About;