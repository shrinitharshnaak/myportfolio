import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { FaGithub, FaLinkedin, FaPhone, FaChevronDown } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';

const Hero = () => {
  const threeContainerRef = useRef(null);
  const cursorRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const waveMeshRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
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
  }, []);

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

      // Create wave geometry
      const geometry = new THREE.PlaneGeometry(100, 100, 32, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          mouse: { value: new THREE.Vector2(0, 0) },
          colorA: { value: new THREE.Color('#EC4899') }, // Pink-500
          colorB: { value: new THREE.Color('#9333EA') }, // Purple-500
        },
        vertexShader: `
          uniform float time;
          uniform vec2 mouse;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec3 pos = position;
            float wave = sin(pos.x * 0.1 + time) * cos(pos.y * 0.1 + time) * 5.0;
            float mouseEffect = exp(-length(pos.xy - mouse * 50.0) * 0.05) * 10.0;
            pos.z += wave + mouseEffect;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 colorA;
          uniform vec3 colorB;
          varying vec2 vUv;
          void main() {
            vec3 color = mix(colorA, colorB, sin(time + vUv.x + vUv.y) * 0.5 + 0.5);
            gl_FragColor = vec4(color, 0.7);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 4;
      mesh.rotation.y = Math.PI / 4;
      scene.add(mesh);
      waveMeshRef.current = mesh;

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
        material.uniforms.time.value = elapsed;
        material.uniforms.mouse.value.set(cursor.x, cursor.y);
        mesh.rotation.z += 0.005;
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
        if (waveMeshRef.current) {
          waveMeshRef.current.geometry.dispose();
          waveMeshRef.current.material.dispose();
        }
      };
    };

    if (window.innerWidth >= 768) {
      initThreeJS();
    }
  }, []);

  const socialIconVariants = {
    initial: { scale: 1, y: 0 },
    hover: { scale: 1.2, y: -5, transition: { type: 'spring', stiffness: 300, damping: 10 } },
  };

  return (
    <motion.section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-cream-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden"
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

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 z-20 relative">
        <motion.div
          className="p-6 sm:p-8 rounded-2xl bg-cream-50/80 backdrop-blur-md border border-pink-200/50 dark:bg-gray-800/30 dark:border-pink-500/20 shadow-lg max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-400 dark:to-purple-400 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Hey, I'm Shrinitharshnaa
          </motion.h1>
          <TypeAnimation
            sequence={['Full Stack Developer', 1000, 'UI/UX Designer', 1000, 'Creative Coder', 1000]}
            wrapper="h2"
            cursor={true}
            repeat={Infinity}
            className="text-xl sm:text-2xl md:text-3xl text-gray-600 dark:text-gray-300 font-semibold mb-6"
          />
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
            Crafting beautiful, functional web experiences with a passion for design and code.
          </p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <a
              href="#projects"
              className="px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
              aria-label="View my projects"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="px-6 py-3 text-base font-medium text-pink-500 border border-pink-300 rounded-full hover:bg-pink-100/50 dark:text-pink-400 dark:border-pink-500/30 dark:hover:bg-gray-800/50 transition-all"
              aria-label="Get in touch"
            >
              Get in Touch
            </a>
          </motion.div>
          <motion.div
            className="flex gap-6 justify-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {[
              {
                url: 'https://github.com/shrinitharshnaak',
                icon: <FaGithub className="text-2xl text-pink-500 dark:text-pink-400" />,
                label: 'GitHub',
              },
              {
                url: 'https://linkedin.com/in/shrinitharshnaa-kuppusamy',
                icon: <FaLinkedin className="text-2xl text-pink-500 dark:text-pink-400" />,
                label: 'LinkedIn',
              },
              {
                url: 'tel:+919789140874',
                icon: <FaPhone className="text-2xl text-pink-500 dark:text-pink-400" />,
                label: 'Phone',
              },
            ].map((social) => (
              <motion.a
                key={social.label}
                href={social.url}
                target={social.label === 'Phone' ? '_self' : '_blank'}
                rel={social.label === 'Phone' ? undefined : 'noopener noreferrer'}
                className="relative group p-2 rounded-full hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
                variants={socialIconVariants}
                initial="initial"
                whileHover="hover"
                whileTap={{ scale: 0.9 }}
                aria-label={`Contact via ${social.label}`}
              >
                {social.icon}
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block text-xs bg-pink-500 text-white rounded py-1 px-2 dark:bg-pink-400">
                  {social.label}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
      >
        <a
          href="#about"
          className="text-pink-500 hover:text-purple-500 dark:text-pink-400 dark:hover:text-purple-400"
          aria-label="Scroll to about section"
        >
          <FaChevronDown className="text-2xl animate-bounce" />
        </a>
      </motion.div>

      {/* Custom Styles */}
      <style>{`
        .custom-cursor {
          transition: width 0.2s ease, height 0.2s ease, background-color 0.2s ease;
        }
        .custom-cursor.expanded {
          width: 2.5rem;
          height: 2.5rem;
          background-color: rgba(168, 85, 247, 0.5); /* purple-400 */
        }
      `}</style>
    </motion.section>
  );
};

export default Hero;