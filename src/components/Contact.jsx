import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiMail, FiPhone, FiLinkedin, FiGithub, FiInstagram } from 'react-icons/fi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = 'Name is required';
      isValid = false;
    }
    if (!formData.email) {
      tempErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Invalid email address';
      isValid = false;
    }
    if (!formData.subject.trim()) {
      tempErrors.subject = 'Subject is required';
      isValid = false;
    }
    if (!formData.message.trim()) {
      tempErrors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = 'Message must be at least 10 characters';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate form submission (replace with actual API call if needed)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 4000);
    }
  };

  const contactInfo = [
    { icon: <FiMapPin className="text-xl" />, title: 'Location', details: 'Erode, Tamil Nadu, India' },
    { icon: <FiMail className="text-xl" />, title: 'Email', details: 'shrinitharshnaa@gmail.com' },
    { icon: <FiPhone className="text-xl" />, title: 'Phone', details: '+91 9789140874' },
  ];

  const socialLinks = [
    { icon: <FiLinkedin className="text-xl" />, url: 'https://www.linkedin.com/in/shrinitharshnaa-kuppusamy', label: 'LinkedIn' },
    { icon: <FiGithub className="text-xl" />, url: 'https://github.com/shrinitharshnaak', label: 'GitHub' },
    { icon: <FiInstagram className="text-xl" />, url: 'https://www.instagram.com/shrinitharshnaa', label: 'Instagram' },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
    }),
  };

  return (
    <section
      id="contact"
      className="py-16 bg-gradient-to-b from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-purple-100/20 to-cream-100/20" />
      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-400 dark:to-purple-400">
            Get In Touch
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mt-3" />
          <p className="text-gray-600 dark:text-gray-300 mt-3 text-sm md:text-base max-w-xl mx-auto">
            Let's collaborate on something amazing! Drop me a message.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-cream-50/80 backdrop-blur-sm p-6 rounded-2xl border border-pink-200/50 shadow-lg dark:bg-gray-800/30 dark:border-pink-500/20">
              <h3 className="text-xl font-bold mb-5 text-pink-600 dark:text-pink-400 flex items-center">
                <FiMail className="mr-2 text-lg" /> Send a Message
              </h3>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/10 border border-green-500/50 text-green-400 px-3 py-2 rounded-md mb-5 text-sm flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Message sent! I'll get back to you soon.
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/50 text-red-400 px-3 py-2 rounded-md mb-5 text-sm flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Oops, something went wrong. Please try again.
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { id: 'name', type: 'text', label: 'Name', placeholder: 'Your Name' },
                  { id: 'email', type: 'email', label: 'Email', placeholder: 'Your Email' },
                  { id: 'subject', type: 'text', label: 'Subject', placeholder: 'Subject' },
                ].map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-gray-600 dark:text-gray-300 text-sm mb-1.5">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      value={formData[field.id]}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-cream-50 border ${
                        errors[field.id] ? 'border-red-500' : 'border-pink-200'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:border-pink-500/30 text-sm transition-colors`}
                      placeholder={field.placeholder}
                      aria-invalid={!!errors[field.id]}
                      aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
                    />
                    {errors[field.id] && (
                      <p id={`${field.id}-error`} className="text-red-400 text-xs mt-1">
                        {errors[field.id]}
                      </p>
                    )}
                  </div>
                ))}

                <div>
                  <label htmlFor="message" className="block text-gray-600 dark:text-gray-300 text-sm mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full px-3 py-2 bg-cream-50 border ${
                      errors.message ? 'border-red-500' : 'border-pink-200'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:border-pink-500/30 text-sm transition-colors resize-none`}
                    placeholder="Your Message"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="text-red-400 text-xs mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2.5 text-sm flex items-center justify-center rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors dark:bg-pink-400 dark:hover:bg-pink-500 ${
                    isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover-lift'
                  }`}
                  aria-label={isSubmitting ? 'Sending message' : 'Send message'}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-6 text-pink-600 dark:text-pink-400">Contact Information</h3>
                <div className="space-y-5">
                  {contactInfo.map((item, index) => (
                    <motion.div
                      custom={index}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={itemVariants}
                      key={index}
                      className="flex items-start group"
                    >
                      <div className="p-2 bg-cream-100 rounded-md text-pink-500 dark:bg-gray-800 dark:text-pink-400 mr-3 group-hover:bg-pink-500 group-hover:text-white transition-all duration-200">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-base font-medium text-gray-800 dark:text-white mb-0.5">{item.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors">
                          {item.details}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-6 text-pink-600 dark:text-pink-400">Follow Me</h3>
                <div className="flex space-x-3">
                  {socialLinks.map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit my ${link.label} profile`}
                      className="p-2 bg-cream-100 rounded-full text-gray-700 hover:bg-pink-500 hover:text-white transition-all duration-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-pink-500 dark:hover:text-white"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {link.icon}
                    </motion.a>
                  ))}
                </div>
              </div>

              <motion.div
                className="p-5 bg-cream-50/80 backdrop-blur-sm rounded-2xl border border-pink-200/50 hover-lift dark:bg-gray-800/30 dark:border-pink-500/20"
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <div className="absolute -top-2 -right-2 bg-pink-500 rounded-full p-1.5 shadow-md dark:bg-pink-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                </div>
                <h4 className="text-base font-bold text-gray-800 dark:text-white mb-2">Let's Collaborate!</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  I'm excited about freelance projects or innovative ideas. Let's create something beautiful!
                </p>
                <a
                  href="mailto:shrinitharshnaa@gmail.com"
                  className="inline-flex items-center text-pink-600 hover:text-pink-700 text-sm font-medium group dark:text-pink-400 dark:hover:text-pink-300"
                  aria-label="Email Shrinitharshnaa"
                >
                  shrinitharshnaa@gmail.com
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;