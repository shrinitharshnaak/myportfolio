export function initSmoothScroll() {
  const scrollHandler = (e) => {
    e.preventDefault();
    const target = e.target.closest('a[href^="#"]');
    if (target) {
      const id = target.getAttribute('href').slice(1);
      scrollToElement(id);
    }
  };

  document.addEventListener('click', scrollHandler);

  return {
    destroy: () => {
      document.removeEventListener('click', scrollHandler);
    },
  };
}

export function scrollToElement(id) {
  const element = document.getElementById(id);
  if (element) {
    const offset = 80; // Adjust for fixed navbar height
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth',
    });
  }
}