import { useEffect, useRef } from 'react';

export function useScrollSpy() {
  const activeId = useRef(null);

  useEffect(() => {
    const navbar = document.querySelector('.navbar');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeId.current = entry.target.getAttribute('id');
            document.querySelectorAll('.nav-links a').forEach((link) => {
              const href = link.getAttribute('href');
              if (href === '#' + activeId.current) {
                link.setAttribute('aria-current', 'true');
              } else {
                link.removeAttribute('aria-current');
              }
            });
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );

    const targets = document.querySelectorAll(
      'section[id], .timeline-item[id]'
    );
    targets.forEach((target) => observer.observe(target));

    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navbar.classList.remove('scrolled');
          } else {
            navbar.classList.add('scrolled');
          }
        });
      },
      { threshold: 0 }
    );

    const hero = document.querySelector('#hero');
    if (hero) scrollObserver.observe(hero);

    return () => {
      observer.disconnect();
      scrollObserver.disconnect();
    };
  }, []);

  return activeId.current;
}
