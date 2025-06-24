import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiShare2, FiInfo, FiCheckCircle, FiTwitter, FiLinkedin, FiSun, FiMoon, FiChevronUp } from 'react-icons/fi';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Edu = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [expandedEdu, setExpandedEdu] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const modalRef = useRef(null);

  const education = [
    {
      id: 1,
      degree: 'B.E. Computer Science and Design',
      institution: 'Kongu Engineering College, Perundurai',
      duration: '2022-2026 (3rd Year)',
      description: 'CGPA: 8.22 (Up to 3rd Semester)',
      category: 'college',
      details: 'Pursuing a specialized program in Computer Science and Design, focusing on full-stack development, UI/UX design, and innovative tech solutions through coursework and projects.',
    },
  ];

  const certificates = [
    {
      id: 1,
      name: 'UI/UX Design Essentials',
      issuer: 'Figma',
      description: 'Mastered UI/UX design principles, prototyping, and user testing using Figma.',
      link: 'https://www.figma.com',
      logo: 'https://www.figma.com/favicon.ico',
      images: ['https://images.unsplash.com/photo-1611162617210-7d673bf0f2a1'],
      verified: true,
      date: '2024-06-10',
    },
    {
      id: 2,
      name: 'Full Stack Web Development',
      issuer: 'Udemy',
      description: 'Completed a comprehensive course on React, Node.js, and MongoDB for full-stack development.',
      link: 'https://www.udemy.com',
      logo: 'https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg',
      images: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3'],
      verified: true,
      date: '2024-04-15',
    },
  ];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const filteredEducation = education.filter((item) => {
    const matchesFilter = filter === 'all' || item.category === filter;
    const matchesSearch =
      !searchQuery ||
      item.degree.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      item.institution.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesFilter && matchesSearch;
  });

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      !searchQuery ||
      cert.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.95 },
  };

  const handleCertDetails = (cert) => {
    setSelectedCert(cert);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCert(null);
  };

  const handleEscapeKey = useCallback(
    (e) => {
      if (e.key === 'Escape' && showModal) closeModal();
    },
    [showModal]
  );

  const shareCert = async (cert, platform = 'clipboard') => {
    const url = cert.link;
    const text = `Check out my ${cert.name} certification from ${cert.issuer}! ${url}`;
    try {
      if (platform === 'clipboard') {
        await navigator.clipboard.writeText(url);
        alert('Certificate link copied to clipboard!');
      } else if (platform === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
      } else if (platform === 'linkedin') {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
      }
    } catch (err) {
      console.error('Failed to share:', err);
      alert('Failed to share. Please try again.');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscapeKey);
      modalRef.current?.focus();
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
      <button className="slick-prev slick-arrow p-2 bg-pink-500/50 rounded-full text-white hover:bg-pink-600">
        <FiChevronUp className="rotate-90" />
      </button>
    ),
    nextArrow: (
      <button className="slick-next slick-arrow p-2 bg-pink-500/50 rounded-full text-white hover:bg-pink-600">
        <FiChevronUp className="-rotate-90" />
      </button>
    ),
  };

  return (
    <section
      id="education"
      className={`py-20 min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 ${theme === 'dark' ? 'dark' : ''}`}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-400 dark:to-purple-400"
          >
            Education & Certifications
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto mt-3">
            My academic journey and professional credentials.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-10 justify-center items-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-full sm:w-60">
            <input
              type="text"
              placeholder="Search education/certifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-cream-50 border border-pink-200 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-gray-800 dark:border-pink-500/30 dark:text-gray-200"
              aria-label="Search education and certifications"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600 dark:hover:text-white"
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'All', value: 'all' },
              { label: 'College', value: 'college' },
            ].map((btn) => (
              <motion.button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  filter === btn.value
                    ? 'bg-pink-500 text-white'
                    : 'bg-cream-100 text-gray-700 hover:bg-pink-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-pink-500/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-pressed={filter === btn.value}
              >
                {btn.label}
              </motion.button>
            ))}
          </div>
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-cream-100 text-gray-700 hover:bg-pink-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-pink-500/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
          </motion.button>
        </motion.div>

        {loading && (
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-cream-100/50 rounded-2xl h-32 animate-pulse dark:bg-gray-800/30"></div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!loading && (
            <motion.div
              key={filter + searchQuery}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-16"
            >
              <h3 className="text-2xl font-semibold mb-8 text-center text-pink-600 dark:text-pink-400">Education</h3>
              {filteredEducation.length > 0 ? (
                <div className="space-y-6">
                  {filteredEducation.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      className="bg-cream-50/80 p-6 rounded-2xl border border-pink-200/50 dark:bg-gray-800/30 dark:border-pink-500/20"
                    >
                      <div className="flex items-start gap-4">
                        <FiCheckCircle className="text-pink-500 text-xl mt-1 dark:text-pink-400" />
                        <div className="flex-grow">
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{item.degree}</h4>
                          <h5 className="text-sm text-pink-500 dark:text-pink-400">{item.institution}</h5>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.duration}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>
                          <button
                            onClick={() => setExpandedEdu(expandedEdu === item.id ? null : item.id)}
                            className="mt-2 text-pink-600 hover:text-pink-700 text-sm dark:text-pink-400 dark:hover:text-pink-300"
                            aria-label={
                              expandedEdu === item.id
                                ? `Collapse details for ${item.degree}`
                                : `Expand details for ${item.degree}`
                            }
                          >
                            {expandedEdu === item.id ? 'Hide Details' : 'Show Details'}
                          </button>
                          <AnimatePresence>
                            {expandedEdu === item.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 bg-white p-4 rounded-xl text-sm text-gray-600 dark:bg-gray-900/50 dark:text-gray-300"
                              >
                                {item.details}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="text-center py-10"
                  variants={itemVariants}
                >
                  <p className="text-gray-600 dark:text-gray-300">No education entries found.</p>
                  <button
                    onClick={() => {
                      setFilter('all');
                      setSearchQuery('');
                    }}
                    className="mt-4 px-6 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 dark:bg-pink-400 dark:hover:bg-pink-500"
                  >
                    Show All
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl h-64 animate-pulse bg-cream-100/30 dark:bg-gray-800/30"
                ></div>
              ))}
            </div>
          )}

          {!loading && (
            <motion.div
              key={searchQuery}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-8 text-center text-pink-600 dark:text-pink-400">Certifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCertificates.length > 0 ? (
                  filteredCertificates.map((cert) => (
                    <motion.div
                      key={cert.id}
                      variants={itemVariants}
                      className="bg-cream-50/80 p-6 rounded-2xl border border-pink-200/50 min-h-[300px] flex flex-col justify-between dark:bg-gray-800/30 dark:border-pink-500/20"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={cert.logo}
                            alt={`${cert.issuer} logo`}
                            className="w-10 h-10 rounded-full object-contain bg-white p-1"
                            loading="lazy"
                          />
                          <div>
                            <h4 className="text-base font-semibold text-gray-800 dark:text-white">{cert.name}</h4>
                            <h5 className="text-sm text-gray-500 dark:text-gray-400">{cert.issuer}</h5>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{cert.description}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-4">
                        <button
                          onClick={() => handleCertDetails(cert)}
                          className="px-4 py-2 rounded-full text-sm bg-cream-200 text-pink-600 hover:bg-pink-100 dark:bg-gray-700 dark:text-pink-400 dark:hover:bg-pink-500/20"
                          aria-label={`View details for ${cert.name}`}
                        >
                          <FiInfo className="inline mr-1" /> Details
                        </button>
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-full text-sm text-white bg-pink-500 hover:bg-pink-600 dark:bg-pink-400 dark:hover:bg-pink-500"
                          aria-label={`View ${cert.name} certificate`}
                        >
                          View
                        </a>
                      </div>
                      {cert.verified && (
                        <div className="absolute top-3 right-3 text-xs font-semibold py-1 px-2 rounded-full bg-pink-500 text-white dark:bg-pink-400">
                          Verified
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="col-span-full text-center py-10"
                    variants={itemVariants}
                  >
                    <p className="text-gray-600 dark:text-gray-300">No certifications found.</p>
                    <button
                      onClick={() => {
                        setFilter('all');
                        setSearchQuery('');
                      }}
                      className="mt-4 px-6 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 dark:bg-pink-400 dark:hover:bg-pink-500"
                    >
                      Show All
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showModal && selectedCert && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                ref={modalRef}
                className="bg-cream-50/90 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-pink-200/50 dark:bg-gray-800/30 dark:border-pink-500/20"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby="modal-title"
                tabIndex="-1"
              >
                <div className="p-8">
                  <motion.div
                    className="flex justify-between items-center mb-6"
                    variants={itemVariants}
                  >
                    <h3
                      id="modal-title"
                      className="text-xl font-bold text-pink-600 dark:text-pink-400"
                    >
                      {selectedCert.name}
                    </h3>
                    <button
                      onClick={closeModal}
                      className="p-2 rounded-full text-gray-600 hover:text-pink-600 hover:bg-pink-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700/30"
                      aria-label="Close modal"
                    >
                      <FiX className="text-lg" />
                    </button>
                  </motion.div>
                  <motion.div
                    className="mb-6 rounded-xl overflow-hidden"
                    variants={itemVariants}
                  >
                    <Slider {...sliderSettings}>
                      {selectedCert.images.map((image, index) => (
                        <div key={index}>
                          <motion.img
                            src={image}
                            alt={`${selectedCert.name} screenshot ${index + 1}`}
                            className="w-full h-48 sm:h-64 object-cover"
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
                    className="flex items-center gap-3 mb-6"
                    variants={itemVariants}
                  >
                    <img
                      src={selectedCert.logo}
                      alt={`${selectedCert.issuer} logo`}
                      className="w-10 h-10 rounded-full object-contain bg-white p-1"
                    />
                    <div>
                      <h4 className="text-base font-semibold text-pink-600 dark:text-pink-400">
                        {selectedCert.issuer}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedCert.verified ? 'Verified Credential' : 'Unverified'} | Issued: {new Date(selectedCert.date).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="mb-6"
                    variants={itemVariants}
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedCert.description}
                    </p>
                  </motion.div>
                  <motion.div
                    className="flex flex-wrap gap-3"
                    variants={itemVariants}
                  >
                    <a
                      href={selectedCert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 rounded-full text-sm text-white bg-pink-500 hover:bg-pink-600 dark:bg-pink-400 dark:hover:bg-pink-500"
                      aria-label={`View ${selectedCert.name} certificate`}
                    >
                      View Certificate
                    </a>
                    <button
                      onClick={() => shareCert(selectedCert, 'clipboard')}
                      className="px-4 py-2 rounded-full text-sm text-pink-600 bg-cream-200 hover:bg-pink-100 dark:bg-gray-700 dark:text-pink-400 dark:hover:bg-pink-500/20"
                      aria-label={`Copy ${selectedCert.name} certificate link`}
                    >
                      <FiShare2 className="inline mr-1" /> Share
                    </button>
                    <button
                      onClick={() => shareCert(selectedCert, 'twitter')}
                      className="px-4 py-2 rounded-full text-sm text-pink-600 bg-cream-200 hover:bg-pink-100 dark:bg-gray-700 dark:text-pink-400 dark:hover:bg-pink-500/20"
                      aria-label={`Share ${selectedCert.name} on Twitter`}
                    >
                      <FiTwitter className="inline mr-1" /> Twitter
                    </button>
                    <button
                      onClick={() => shareCert(selectedCert, 'linkedin')}
                      className="px-4 py-2 rounded-full text-sm text-pink-600 bg-cream-200 hover:bg-pink-100 dark:bg-gray-700 dark:text-pink-400 dark:hover:bg-pink-500/20"
                      aria-label={`Share ${selectedCert.name} on LinkedIn`}
                    >
                      <FiLinkedin className="inline mr-1" /> LinkedIn
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Edu;