import { useEffect } from 'react';

export function useRevealAnimations() {
  useEffect(() => {
    const items = document.querySelectorAll('.timeline-item');
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((item, index) => {
      item.style.transitionDelay = index * 100 + 'ms';
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);
}
