document.addEventListener('DOMContentLoaded', () => {
    const menu   = document.querySelector('.menu');      // <details>
    const navbar = document.querySelector('.navbar');    // nav links container
    const BP = 901;                                      // desktop breakpoint

    function syncMenuToViewport(){
        if (window.innerWidth >= BP) {
            menu.open = true;   // always open on desktop
        } else {
            menu.open = false;  // closed by default on mobile
        }
    }

    // Close when clicking a nav link (mobile only)
    navbar.addEventListener('click', (e) => {
        if (window.innerWidth < BP && e.target.closest('a')) {
            menu.open = false;
        }
    });

    // Click outside to close (mobile only)
    document.addEventListener('click', (e) => {
        if (window.innerWidth < BP && !menu.contains(e.target)) {
            menu.open = false;
        }
    });

    // Init + keep in sync on resize
    syncMenuToViewport();
    window.addEventListener('resize', syncMenuToViewport);
});
// Services section: on-scroll reveals with stagger
document.addEventListener('DOMContentLoaded', () => {
    const servicesRoot = document.querySelector('.services');
    if (!servicesRoot) return;

    // Pick targets inside Services
    const targets = servicesRoot.querySelectorAll(
        '.services__heading, .services__item, .services__media, .services__cta-item'
    );

    // Add base class + stagger index
    targets.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.setProperty('--stagger', i);
    });

    // Respect reduced motion: instantly show
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        targets.forEach(el => el.classList.add('in'));
        return;
    }

    // Observe and reveal once
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14, rootMargin: '0px 0px -10% 0px' });

    targets.forEach(el => io.observe(el));
});
// About section: on-scroll reveals with stagger
document.addEventListener('DOMContentLoaded', () => {
    const aboutRoot = document.querySelector('.about');
    if (!aboutRoot) return;

    // Pick targets inside About (order here controls the stagger)
    const targets = [
        ...aboutRoot.querySelectorAll('.about__eyebrow, .about__title'),
        ...aboutRoot.querySelectorAll('.about__body p'),
        ...aboutRoot.querySelectorAll('.about__pills li'),
        // images: hero + mosaic tiles
        ...aboutRoot.querySelectorAll('.about__hero, .about__mosaic img'),
        // optional caption last
        ...aboutRoot.querySelectorAll('.about__caption'),
    ];

    targets.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.setProperty('--stagger', i);
    });

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        targets.forEach(el => el.classList.add('in'));
        return;
    }

    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14, rootMargin: '0px 0px -10% 0px' });

    targets.forEach(el => io.observe(el));
});
// Contact section: on-scroll reveal (staggered)
document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('.contact');
    if (!root) return;

    const targets = [
        ...root.querySelectorAll('.contact__eyebrow'),
        ...root.querySelectorAll('.contact__title'),
        ...root.querySelectorAll('.contact__intro'),
        ...root.querySelectorAll('.contact__card'),
        ...root.querySelectorAll('.contact__map')
    ];

    targets.forEach((el, i) => {
        // use same class names your CSS expects for reveal
        el.classList.add('reveal');
        el.style.setProperty('--stagger', i);
    });

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { targets.forEach(el => el.classList.add('in')); return; }

    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14, rootMargin: '0px 0px -10% 0px' });

    targets.forEach(el => io.observe(el));
});
document.addEventListener('DOMContentLoaded', () => {
    const mosaic = document.querySelector('.about__mosaic');
    if (!mosaic) return;

    // grab all img elements inside
    const imgs = Array.from(mosaic.querySelectorAll('img'));

    // shuffle them (Fisher–Yates)
    for (let i = imgs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
    }

    // clear and re-append in shuffled order
    imgs.forEach(img => mosaic.appendChild(img));
});
