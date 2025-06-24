import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import * as THREE from 'three';
import {
  DiReact,
  DiNodejsSmall,
  DiMongodb,
  DiJavascript1,
  DiCss3,
  DiHtml5,
  DiSqllite,
} from 'react-icons/di';
import { SiTailwindcss, SiVite, SiFigma } from 'react-icons/si';
import { FaSearch, FaTimes, FaDownload, FaSun, FaMoon, FaChevronDown } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';

const Skills = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalSkill, setModalSkill] = useState(null);
  const cursorRef = useRef(null);
  const threeContainerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const spheresRef = useRef([]);
  const animationIdRef = useRef(null);
  const cardRef = useRef(null);

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
        cursorRef.current.classList.add('visible');
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

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && modalSkill) {
      setModalSkill(null);
    }
  };

  const skillCategories = [
    {
      name: 'Design Tools',
      skills: [
        { name: 'Figma', icon: <SiFigma />, color: '#F24E1E', description: 'Crafting intuitive UI/UX designs and prototypes.', projects: ['Student Portal UI', 'Weather Website'] },
      ],
    },
    {
      name: 'Frontend Development',
      skills: [
        { name: 'React', icon: <DiReact />, color: '#61DAFB', description: 'Building dynamic and responsive UIs with React and Vite.', projects: ['Employee Payroll', 'Weather Website'] },
        { name: 'Vite', icon: <SiVite />, color: '#646CFF', description: 'Fast and modern build tool for web applications.', projects: ['Student Portal UI'] },
        { name: 'HTML5', icon: <DiHtml5 />, color: '#E34F26', description: 'Creating semantic and accessible web structures.', projects: ['Weather Website'] },
        { name: 'CSS3', icon: <DiCss3 />, color: '#1572B6', description: 'Advanced styling for visually appealing interfaces.', projects: ['Weather Website'] },
        { name: 'Tailwind CSS', icon: <SiTailwindcss />, color: '#38B2AC', description: 'Utility-first CSS for rapid and consistent styling.', projects: ['Employee Payroll'] },
      ],
    },
    {
      name: 'Backend Development',
      skills: [
        { name: 'Node.js', icon: <DiNodejsSmall />, color: '#539E43', description: 'Developing scalable backend APIs with Node.js.', projects: ['Employee Payroll', 'SOS Helmet'] },
        { name: 'MongoDB', icon: <DiMongodb />, color: '#47A248', description: 'Managing NoSQL databases for flexible data storage.', projects: ['Employee Payroll'] },
        { name: 'SQL', icon: <DiSqllite />, color: '#003B57', description: 'Querying relational databases for structured data.', projects: ['Employee Payroll'] },
      ],
    },
  ];

  const allCategories = ['All', ...skillCategories.map((category) => category.name)];

  const getFilteredSkills = useMemo(() => {
    return () => {
      const query = searchQuery.toLowerCase().trim();
      let filtered = skillCategories;

      if (selectedCategory !== 'All') {
        filtered = skillCategories.filter((category) => category.name === selectedCategory);
      }

      if (query) {
        filtered = filtered.map((category) => ({
          ...category,
          skills: category.skills.filter((skill) => skill.name.toLowerCase().includes(query)),
        }));
      }

      return filtered.filter((category) => category.skills.length > 0);
    };
  }, [searchQuery, selectedCategory]);

  const filteredSkills = getFilteredSkills();

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

  const SkillCard = ({ skill }) => (
    <motion.div
      variants={skillVariants}
      initial="initial"
      whileHover="hover"
      className="relative w-24 h-24 rounded-full bg-cream-50/90 backdrop-blur-lg border border-pink-200/50 dark:bg-gray-800/40 dark:border-pink-500/30 shadow-md group cursor-pointer"
      onClick={() => setModalSkill(skill)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setModalSkill(skill);
        }
      }}
      aria-label={`View details for ${skill.name}`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div style={{ color: skill.color }} className="text-3xl">{skill.icon}</div>
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{skill.name}</p>
      </div>
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 hidden group-hover:block bg-pink-500/90 text-white text-xs sm:text-sm rounded-lg py-2 px-4 shadow-md whitespace-nowrap z-10">
        {skill.description}
      </div>
    </motion.div>
  );

  const SkillModal = ({ skill, onClose }) => (
    <motion.div
      ref={modalRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="p-8 rounded-2xl bg-cream-50/90 backdrop-blur-lg border border-pink-200/50 max-w-md w-full mx-4 shadow-xl dark:bg-gray-800/50 dark:border-pink-500/30"
        onClick={(e) => e.stopPropagation()}
        style={{ rotateX, rotateY }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div style={{ color: skill.color }} className="text-3xl">{skill.icon}</div>
          <h3 className="text-xl font-semibold text-pink-600 dark:text-pink-400">{skill.name}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{skill.description}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          <strong>Projects:</strong> {skill.projects.join(', ')}
        </p>
        <motion.button
          onClick={onClose}
          className="w-full py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors dark:bg-pink-400 dark:hover:bg-pink-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Close skill details modal"
        >
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.section
      id="skills"
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
            Technical Skills
          </motion.h2>
          <TypeAnimation
            sequence={['Design Expertise', 1000, 'Development Skills', 1000, 'Creative Tools', 1000]}
            wrapper="p"
            cursor={true}
            repeat={Infinity}
            className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-300"
          />
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mb-12"
          ref={cardRef}
          style={{ rotateX, rotateY }}
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-3 justify-center mb-6"
          >
            {allCategories.map((category) => (
              <motion.button
                key={category}
                className={`px-4 py-2 text-sm font-medium rounded-full border border-pink-200/50 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]'
                    : 'bg-cream-50/80 text-pink-500 hover:bg-pink-100/50 dark:bg-gray-800/40 dark:text-pink-400 dark:hover:bg-gray-800/50 dark:border-pink-500/30'
                } transition-colors`}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedCategory(category);
                  }
                }}
                aria-label={`Filter by ${category}`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
          <motion.div variants={itemVariants} className="relative w-full max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-cream-50/90 backdrop-blur-lg border border-pink-200/50 rounded-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-gray-800/50 dark:border-pink-500/30 dark:text-gray-300"
              aria-label="Search skills"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400 text-lg" />
            {searchQuery && (
              <motion.button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600 dark:hover:text-pink-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Clear search"
              >
                <FaTimes className="text-lg" />
              </motion.button>
            )}
          </motion.div>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-16"
        >
          {filteredSkills.length > 0 ? (
            filteredSkills.map((category, catIndex) => (
              <motion.div key={catIndex} variants={itemVariants}>
                <motion.h3
                  variants={itemVariants}
                  className="text-2xl md:text-3xl font-semibold text-center text-pink-600 dark:text-pink-400"
                >
                  {category.name}
                </motion.h3>
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center mt-8"
                >
                  {category.skills.map((skill, index) => (
                    <SkillCard key={index} skill={skill} />
                  ))}
                </motion.div>
              </motion.div>
            ))
          ) : (
            <motion.div
              variants={itemVariants}
              className="text-center py-12"
            >
              <p className="text-lg text-gray-600 dark:text-gray-300">No skills found matching your criteria.</p>
              <motion.button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-4 px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full hover:from-pink-600 hover:to-purple-600 dark:from-pink-400 dark:to-purple-400"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Reset skill filters"
              >
                Reset Filters
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-16 p-8 rounded-2xl bg-cream-50/90 backdrop-blur-lg border border-pink-200/50 dark:bg-gray-800/50 dark:border-pink-500/30 shadow-xl"
          ref={cardRef}
          style={{ rotateX, rotateY }}
        >
          <motion.h3
            variants={itemVariants}
            className="text-2xl md:text-3xl font-semibold text-center text-pink-600 dark:text-pink-400 mb-3"
          >
            Explore My Work
          </motion.h3>
          <motion.p
            variants={itemVariants}
            className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto text-center"
          >
            Passionate about creating beautiful and functional web experiences. Let’s build something amazing together!
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 justify-center mt-4"
          >
            <motion.a
              href="#contact"
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full hover:from-pink-600 hover:to-purple-600 dark:from-pink-400 dark:to-purple-400"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Contact for collaboration"
            >
              Collaborate
            </motion.a>
            <motion.a
              href="/assets/Skills_Summary.pdf"
              download="Skills_Summary.pdf"
              className="px-6 py-2 text-sm font-medium text-pink-500 border border-pink-300 rounded-full hover:bg-pink-100/50 dark:text-pink-400 dark:border-pink-500/30 dark:hover:bg-gray-800/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Download skills summary"
              onClick={(e) => {
                if (!window.location.pathname.includes('/assets/Skills_Summary.pdf')) {
                  e.preventDefault();
                  alert('Skills summary PDF not found. Please ensure the file is in the public/assets folder.');
                }
              }}
            >
              <FaDownload className="inline mr-2" /> Skills PDF
            </motion.a>
            <motion.button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
        >
          <a
            href="#contact"
            className="text-pink-500 hover:text-purple-500 dark:text-pink-400 dark:hover:text-purple-400"
            aria-label="Scroll to contact section"
          >
            <FaChevronDown className="text-2xl animate-bounce" />
          </a>
        </motion.div>

        {/* Modal */}
        <AnimatePresence>{modalSkill && <SkillModal skill={modalSkill} onClose={() => setModalSkill(null)} />}</AnimatePresence>

        {/* Custom Styles */}
        <style>{`
          .custom-cursor {
            transition: width 0.2s ease, height 0.2s ease, background-color 0.3s ease;
          }
          .custom-cursor.visible {
            opacity: 1;
          }
          .custom-cursor.expanded {
            width: 2.5rem;
            height: 2.5rem;
            background-color: rgba(168, 85, 247, 0.5);
          }
        `}</style>
      </div>
    </motion.section>
  );
};

export default Skills;