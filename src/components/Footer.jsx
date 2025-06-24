import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiArrowUp, FiHeart, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const year = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <FiLinkedin className="text-lg" />,
      url: 'https://linkedin.com/in/shrinitharshnaa-kuppusamy',
      label: 'LinkedIn',
      color: 'hover:bg-pink-600',
    },
    {
      icon: <FiGithub className="text-lg" />,
      url: 'https://github.com/shrinitharshnaak',
      label: 'GitHub',
      color: 'hover:bg-purple-600',
    },
  ];

  const navLinks = [
    { name: 'Home', to: '#home' },
    { name: 'About', to: '#about' },
    { name: 'Skills', to: '#skills' },
    { name: 'Projects', to: '#projects' },
    { name: 'Education', to: '#education' },
    { name: 'Contact', to: '#contact' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-cream-50 pt-16 pb-8 relative dark:bg-gray-900">
      <div className="absolute top-0 left-0 w-full h-8 overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-8 w-full"
          fill="#FFF7ED"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0v27.35a600.21,600.21,0,0,0,321.39,29.09Z"></path>
        </svg>
      </div>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-4">Shrinitharshnaa K</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Full Stack Developer & UI Designer</p>
            <div className="flex justify-center md:justify-start gap-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full bg-cream-200 text-gray-700 ${link.color} transition-colors dark:bg-gray-800 dark:text-gray-200 dark:hover:text-white`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={link.label}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-pink-600 dark:text-pink-400 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <motion.a
                    href={link.to}
                    className="text-sm text-gray-600 hover:text-pink-500 transition-colors dark:text-gray-300 dark:hover:text-pink-400"
                    whileHover={{ x: 5 }}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="text-center md:text-right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h4 className="text-lg font-semibold text-pink-600 dark:text-pink-400 mb-4">Contact</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-center justify-center md:justify-end gap-2">
              <FiPhone className="text-pink-500 dark:text-pink-400" /> +91 9789140874
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center justify-center md:justify-end gap-2">
              <FiMapPin className="text-pink-500 dark:text-pink-400" /> Erode, Tamil Nadu
            </p>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 text-center border-t border-pink-200/50 pt-6 dark:border-pink-500/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Made with <FiHeart className="inline text-pink-500 dark:text-pink-400" /> by Shrinitharshnaa K &copy; {year}
          </p>
        </motion.div>

        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600 dark:bg-pink-400 dark:hover:bg-pink-500"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll to top"
        >
          <FiArrowUp className="text-lg" />
        </motion.button>
      </div>
    </footer>
  );
};

export default Footer;