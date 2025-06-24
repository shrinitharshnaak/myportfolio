import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import * as THREE from 'three';
import { FiGithub, FiExternalLink, FiInfo, FiChevronUp, FiX, FiSearch, FiSun, FiMoon, FiDownload, FiChevronDown } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { TypeAnimation } from 'react-type-animation';

const Projects = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const modalRef = useRef(null);
  const cursorRef = useRef(null);
  const threeContainerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const spheresRef = useRef([]);
  const animationIdRef = useRef(null);
  const cardRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Smooth cursor animation
  const springConfig = { damping: 25, stiffness: 100 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  // Card tilt effect
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-3, 3]);

  const projects = [
    {
      id: 1,
      title: 'Employee Payroll System',
      description: 'A full-stack application to manage employee salaries and attendance.',
      longDescription: 'Developed a MERN stack application with secure authentication, automated payroll calculations, and a user-friendly dashboard for HR management.',
      whatIDid: [
        'Designed intuitive UI with React and Tailwind CSS.',
        'Built RESTful APIs using Node.js and MongoDB.',
        'Implemented JWT-based authentication.',
      ],
      images: ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40'],
      tags: ['react', 'node', 'mongodb', 'api'],
      github: 'https://github.com/shrinitharshnaak/employee-payroll-system',
      demo: '#',
      featured: true,
      category: 'web',
      date: '2023-08-10',
      timeline: [
        { date: '2023-06-01', milestone: 'Project Start' },
        { date: '2023-08-10', milestone: 'Project Completed' },
      ],
    },
    {
      id: 2,
      title: 'SOS System in Helmet',
      description: 'A safety system integrated into helmets for emergency alerts.',
      longDescription: 'Designed a web interface to monitor SOS alerts from smart helmets, with real-time notifications and location tracking using Node.js and MongoDB.',
      whatIDid: [
        'Created responsive UI with Figma and React.',
        'Developed backend with Node.js for real-time data processing.',
        'Integrated Google Maps API for location tracking.',
      ],
      images: ['https://images.unsplash.com/photo-1581093458791-9b989e6b1f0f'],
      tags: ['react', 'node', 'mongodb', 'figma'],
      github: 'https://github.com/shrinitharshnaak/sos-helmet',
      demo: '#',
      featured: true,
      category: 'web',
      date: '2023-05-15',
      timeline: [
        { date: '2023-03-01', milestone: 'Project Start' },
        { date: '2023-05-15', milestone: 'Project Completed' },
      ],
    },
    {
      id: 3,
      title: 'UI for Student Portal',
      description: 'A modern UI design for a student management portal.',
      longDescription: 'Crafted a visually appealing and responsive UI using Figma and React with Vite, focusing on usability and accessibility for students.',
      whatIDid: [
        'Designed prototypes in Figma.',
        'Implemented UI with React, Vite, and Tailwind CSS.',
        'Ensured accessibility compliance.',
      ],
      images: ['https://images.unsplash.com/photo-1516321497487-e288fb19713f'],
      tags: ['figma', 'react', 'vite', 'tailwind'],
      github: 'https://github.com/shrinitharshnaak/student-portal-ui',
      demo: '#',
      featured: true,
      category: 'ui',
      date: '2023-03-20',
      timeline: [
        { date: '2023-01-10', milestone: 'Project Start' },
        { date: '2023-03-20', milestone: 'Project Completed' },
      ],
    },
    {
      id: 4,
      title: 'Weather Website',
      description: 'A dynamic weather forecasting app with real-time data.',
      longDescription: 'Built a responsive web app using React and OpenWeatherMap API, with a sleek UI designed in Figma for a seamless user experience.',
      whatIDid: [
        'Designed UI with Figma and Tailwind CSS.',
        'Developed frontend with React and Vite.',
        'Integrated OpenWeatherMap API for real-time data.',
      ],
      images: ['https://images.unsplash.com/photo-1561484930-2b2b5e5e6b1f'],
      tags: ['react', 'vite', 'api', 'figma'],
      github: 'https://github.com/shrinitharshnaak/weather-website',
      demo: '#',
      featured: false,
      category: 'web',
      date: '2023-12-05',
      timeline: [
        { date: '2023-10-01', milestone: 'Project Start' },
        { date: '2023-12-05', milestone: 'Project Completed' },
      ],
    },
  ];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cursorRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
      cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      cursorRef.current.classList.add('visible');
    };

    const handleMouseOverLink = () => {
      if (cursorRef.current) cursorRef.current.classList.add('expanded');
    };
    const handleMouseOutLink = () => {
      if (cursorRef.current) cursorRef.current.classList.remove('expanded');
    };

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
    let isMounted = true;

    const initThreeJS = () => {
      if (!threeContainerRef.current || !isMounted) return;

      try {
        const container = threeContainerRef.current;
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
          75,
          container.clientWidth / container.clientHeight || 1,
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
          if (!container.getBoundingClientRect()) return;
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
              if (e.touches[0]) updateCursor(e.touches[0]);
            },
            { passive: false }
          );
        }

        const clock = new THREE.Clock();
        const animate = () => {
          if (!isMounted) return;
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
          if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
          }
        };

        animate();

        const handleResize = () => {
          if (!threeContainerRef.current || !rendererRef.current || !cameraRef.current) return;
          const width = container.clientWidth;
          const height = container.clientHeight;
          if (width > 0 && height > 0) {
            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(width, height);
          }
        };

        window.addEventListener('resize', handleResize, { passive: true });
        handleResize();

        return () => {
          isMounted = false;
          window.removeEventListener('resize', handleResize);
          container.removeEventListener('mousemove', updateCursor);
          container.removeEventListener('touchmove', updateCursor);
          if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
          }
          if (rendererRef.current && rendererRef.current.domElement && container.contains(rendererRef.current.domElement)) {
            container.removeChild(rendererRef.current.domElement);
            rendererRef.current.dispose();
          }
          spheresRef.current.forEach((sphere) => {
            sphere.geometry.dispose();
            sphere.material.dispose();
          });
          spheresRef.current = [];
          if (sceneRef.current) {
            sceneRef.current.children = [];
          }
        };
      } catch (error) {
        console.error('Three.js initialization failed:', error);
      }
    };

    if (window.innerWidth >= 768) {
      initThreeJS();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSearchParams({ filter: newFilter });
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'featured' && project.featured) ||
        project.category === filter ||
        project.tags.includes(filter);
      const matchesSearch =
        !searchQuery ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase().trim()));
      return matchesFilter && matchesSearch;
    });
  }, [projects, filter, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: { scale: 1.05, y: -5, transition: { type: 'spring', stiffness: 300, damping: 15 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.9 },
  };

  const handleProjectDetails = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const handleEscapeKey = useCallback(
    (e) => {
      if (e.key === 'Escape' && showModal) closeModal();
    },
    [showModal]
  );

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscapeKey);
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscapeKey);
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showModal, handleEscapeKey]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    prevArrow: (
      <button className="slick-prev slick-arrow p-2 bg-pink-500/80 rounded-full text-white hover:bg-pink-600 dark:bg-pink-400/80 dark:hover:bg-pink-500">
        <FiChevronUp className="rotate-90" />
      </button>
    ),
    nextArrow: (
      <button className="slick-next slick-arrow p-2 bg-pink-500/80 rounded-full text-white hover:bg-pink-600 dark:bg-pink-400/80 dark:hover:bg-pink-500">
        <FiChevronUp className="-rotate-90" />
      </button>
    ),
  };

  const handleDownloadPDF = (e, project) => {
    try {
      fetch('/assets/Project_Summary.pdf', { method: 'HEAD' })
        .then((res) => {
          if (!res.ok) {
            e.preventDefault();
            alert('Project summary PDF not found. Please ensure the file is in the public/assets folder.');
          }
        })
        .catch(() => {
          e.preventDefault();
          alert('Project summary PDF not found. Please ensure the file is in the public/assets folder.');
        });
    } catch (error) {
      e.preventDefault();
      console.error('PDF download check failed:', error);
      alert('An error occurred while checking the PDF file. Please try again later.');
    }
  };

  return (
    <motion.section
      id="projects"
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
            My Projects
          </motion.h2>
          <TypeAnimation
            sequence={['Creative Designs', 1000, 'Innovative Solutions', 1000, 'Tech Artistry', 1000]}
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
          className="mb-12 flex flex-col items-center gap-6"
          ref={cardRef}
          style={{ rotateX, rotateY }}
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-3 justify-center"
          >
            {[
              { label: `All (${projects.length})`, value: 'all' },
              { label: `Featured (${projects.filter((p) => p.featured).length})`, value: 'featured' },
              { label: `Web (${projects.filter((p) => p.category === 'web').length})`, value: 'web' },
              { label: `UI (${projects.filter((p) => p.category === 'ui').length})`, value: 'ui' },
            ].map((btn) => (
              <motion.button
                key={btn.value}
                onClick={() => handleFilterChange(btn.value)}
                className={`px-4 py-2 text-sm font-medium rounded-full border border-pink-200/50 ${
                  filter === btn.value
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]'
                    : 'bg-cream-50/80 text-pink-500 hover:bg-pink-100/50 dark:bg-gray-800/40 dark:text-pink-400 dark:hover:bg-gray-800/50 dark:border-pink-500/30'
                } transition-colors`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-pressed={filter === btn.value}
              >
                {btn.label}
              </motion.button>
            ))}
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="relative w-full max-w-md"
          >
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-cream-50/90 backdrop-blur-lg border border-pink-200/50 rounded-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-gray-800/50 dark:border-pink-500/30 dark:text-gray-300"
              aria-label="Search projects"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400 text-lg" />
            {searchQuery && (
              <motion.button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600 dark:hover:text-pink-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Clear search"
              >
                <FiX className="text-lg" />
              </motion.button>
            )}
          </motion.div>
        </motion.div>

        {/* Projects Grid */}
        {loading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
          >
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="w-full max-w-sm rounded-2xl h-96 bg-cream-50/90 dark:bg-gray-800/40 animate-pulse"
              />
            ))}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {!loading && (
            <motion.div
              key={filter + searchQuery}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
            >
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    variants={cardVariants}
                    initial="initial"
                    whileHover="hover"
                    className="w-full max-w-sm group"
                    style={{ rotateX, rotateY }}
                  >
                    <div className="bg-cream-50/90 backdrop-blur-lg rounded-2xl overflow-hidden border border-pink-200/50 h-96 flex flex-col dark:bg-gray-800/40 dark:border-pink-500/30 shadow-xl">
                      <div className="relative h-48 overflow-hidden">
                        <motion.img
                          src={project.images[0]}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-pink-500/80 rounded-full text-white hover:bg-pink-600 dark:bg-pink-400/80 dark:hover:bg-pink-500 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`View ${project.title} source code`}
                          >
                            <FiGithub className="text-lg" />
                          </motion.a>
                          <motion.button
                            onClick={() => handleProjectDetails(project)}
                            className="p-3 bg-purple-500/80 rounded-full text-white hover:bg-purple-600 dark:bg-purple-400/80 dark:hover:bg-purple-500 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`View ${project.title} details`}
                          >
                            <FiInfo className="text-lg" />
                          </motion.button>
                        </div>
                        <div className="absolute top-3 left-3">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              project.category === 'web'
                                ? 'bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400'
                                : 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400'
                            }`}
                          >
                            {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                          </span>
                        </div>
                        {project.featured && (
                          <motion.div
                            className="absolute top-3 right-3 text-xs font-medium py-1 px-3 rounded-full bg-pink-500 text-white dark:bg-pink-400"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                          >
                            Featured
                          </motion.div>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-lg font-semibold text-pink-600 group-hover:text-pink-700 transition-colors dark:text-pink-400 dark:group-hover:text-pink-300">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600 flex-grow dark:text-gray-300">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {project.tags.map((tag, index) => (
                            <motion.span
                              key={index}
                              className="px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-600 cursor-pointer hover:bg-pink-200 dark:bg-gray-700/30 dark:text-gray-300 dark:hover:bg-pink-500/20"
                              onClick={() => handleFilterChange(tag)}
                              whileHover={{ scale: 1.05 }}
                            >
                              {tag}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="col-span-full text-center py-12"
                >
                  <p className="text-lg text-gray-600 dark:text-gray-300">No projects found matching your criteria.</p>
                  <motion.button
                    onClick={() => {
                      setFilter('all');
                      setSearchQuery('');
                      setSearchParams({ filter: 'all' });
                    }}
                    className="mt-4 px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full hover:from-pink-600 hover:to-purple-600 dark:from-pink-400 dark:to-purple-400"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Reset project filters"
                  >
                    Show All
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-16 p-8 rounded-2xl bg-cream-50/90 backdrop-blur-lg border border-pink-200/50 dark:bg-gray-800/40 dark:border-pink-500/30 shadow-xl"
          ref={cardRef}
          style={{ rotateX, rotateY }}
        >
          <motion.h3
            variants={itemVariants}
            className="text-2xl md:text-3xl font-semibold text-center text-pink-600 dark:text-pink-400 mb-3"
          >
            Explore More
          </motion.h3>
          <motion.p
            variants={itemVariants}
            className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto text-center"
          >
            Discover additional projects and contributions on my GitHub profile.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 justify-center mt-4"
          >
            <motion.a
              href="https://github.com/shrinitharshnaak"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full hover:from-pink-600 hover:to-purple-600 dark:from-pink-400 dark:to-purple-400"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Explore GitHub profile"
            >
              <FiGithub className="inline mr-2" /> Explore GitHub
            </motion.a>
            <motion.button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              className="fixed bottom-8 right-8 p-3 rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600 dark:bg-pink-400 dark:hover:bg-pink-500"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Scroll to top"
            >
              <FiChevronUp className="text-lg" />
            </motion.button>
          )}
        </AnimatePresence>

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
            <FiChevronDown className="text-2xl animate-bounce" />
          </a>
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && selectedProject && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                ref={modalRef}
                className="bg-cream-50/90 backdrop-blur-lg rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-pink-200/50 dark:bg-gray-800/40 dark:border-pink-500/30 shadow-2xl"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby="modal-title"
                tabIndex="-1"
                style={{ rotateX, rotateY }}
              >
                <div className="p-8">
                  <motion.div
                    className="flex justify-between items-center mb-6"
                    variants={itemVariants}
                  >
                    <h3
                      id="modal-title"
                      className="text-2xl font-semibold text-pink-600 dark:text-pink-400"
                    >
                      {selectedProject.title}
                    </h3>
                    <motion.button
                      onClick={closeModal}
                      className="p-2 rounded-full text-gray-600 hover:text-pink-600 hover:bg-pink-100/50 dark:text-gray-300 dark:hover:text-pink-400 dark:hover:bg-gray-800/50"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Close modal"
                    >
                      <FiX className="text-xl" />
                    </motion.button>
                  </motion.div>
                  <motion.div
                    className="mb-6 rounded-xl overflow-hidden"
                    variants={itemVariants}
                  >
                    <Slider {...sliderSettings}>
                      {selectedProject.images.map((image, index) => (
                        <div key={index}>
                          <motion.img
                            src={image}
                            alt={`${selectedProject.title} screenshot ${index + 1}`}
                            className="w-full h-64 object-cover rounded-xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </Slider>
                  </motion.div>
                  <motion.div
                    className="mb-6"
                    variants={itemVariants}
                  >
                    <h4 className="text-lg font-semibold text-pink-600 dark:text-pink-400 mb-2">Overview</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedProject.longDescription}</p>
                  </motion.div>
                  <motion.div
                    className="mb-6"
                    variants={itemVariants}
                  >
                    <h4 className="text-lg font-semibold text-pink-600 dark:text-pink-400 mb-2">What I Did</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                      {selectedProject.whatIDid.map((task, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-1 text-pink-500">•</span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                  <motion.div
                    className="mb-6"
                    variants={itemVariants}
                  >
                    <h4 className="text-lg font-semibold text-pink-600 dark:text-pink-400 mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-600 dark:bg-gray-700/30 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                  <motion.div
                    className="mb-6"
                    variants={itemVariants}
                  >
                    <h4 className="text-lg font-semibold text-pink-600 dark:text-pink-400 mb-2">Project Timeline</h4>
                    <div className="relative pl-5">
                      <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-pink-200 dark:bg-pink-500/30" />
                      {selectedProject.timeline.map((event, index) => (
                        <div key={index} className="mb-4 flex items-center">
                          <div className="w-3 h-3 rounded-full bg-pink-500 dark:bg-pink-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{event.milestone}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(event.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex flex-wrap gap-4"
                    variants={itemVariants}
                  >
                    <motion.a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full hover:from-pink-600 hover:to-purple-600 dark:from-pink-400 dark:to-purple-400"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`View ${selectedProject.title} source code`}
                    >
                      <FiGithub className="inline mr-2" /> Source Code
                    </motion.a>
                    {selectedProject.demo !== '#' && (
                      <motion.a
                        href={selectedProject.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-600 hover:to-pink-600 dark:from-purple-400 dark:to-pink-400"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`View ${selectedProject.title} live demo`}
                      >
                        <FiExternalLink className="inline mr-2" /> Live Demo
                      </motion.a>
                    )}
                    <motion.a
                      href="/assets/Project_Summary.pdf"
                      download={`Project_Summary_${selectedProject.title.replace(/\s+/g, '_')}.pdf`}
                      className="px-6 py-2 text-sm font-medium text-pink-500 border border-pink-300 rounded-full hover:bg-pink-100/50 dark:text-pink-400 dark:border-pink-500/30 dark:hover:bg-gray-800/50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Download ${selectedProject.title} summary`}
                      onClick={(e) => handleDownloadPDF(e, selectedProject)}
                    >
                      <FiDownload className="inline mr-2" /> Download PDF
                    </motion.a>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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

export default Projects;