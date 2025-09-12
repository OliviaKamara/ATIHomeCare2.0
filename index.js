// index.js — cleaned & consolidated

document.addEventListener('DOMContentLoaded', () => {
    /* =======================
       Header menu (CSS-only <details>)
    ======================= */
    const menu = document.querySelector('.menu');      // <details>
    const navbar = document.querySelector('.navbar');  // nav links container
    const BP = 901;

    function syncMenuToViewport() {
        if (!menu) return;
        menu.open = window.innerWidth >= BP;
    }

    if (navbar && menu) {
        navbar.addEventListener('click', (e) => {
            if (window.innerWidth < BP && e.target.closest('a')) menu.open = false;
        });
        document.addEventListener('click', (e) => {
            if (window.innerWidth < BP && !menu.contains(e.target)) menu.open = false;
        });
    }

    syncMenuToViewport();
    window.addEventListener('resize', syncMenuToViewport);

    /* =======================
       Scroll reveal helpers
    ======================= */
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setupReveals(root, selectors) {
        if (!root) return;
        const targets = root.querySelectorAll(selectors.join(', '));
        targets.forEach((el, i) => {
            el.classList.add('reveal');
            el.style.setProperty('--stagger', i);
        });
        if (prefersReduced) {
            targets.forEach((el) => el.classList.add('in'));
            return;
        }
        const io = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in');
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.14, rootMargin: '0px 0px -10% 0px' }
        );
        targets.forEach((el) => io.observe(el));
    }

    setupReveals(document.querySelector('.services'), [
        '.services__heading',
        '.services__card',
        '.services__media',
        '.services__cta-item'
    ]);

    setupReveals(document.querySelector('.about'), [
        '.about__eyebrow',
        '.about__title',
        '.about__body p',
        '.about__pills li',
        '.about__hero',
        '.about__mosaic img',
        '.about__caption'
    ]);

    setupReveals(document.querySelector('.contact'), [
        '.contact__eyebrow',
        '.contact__title',
        '.contact__intro',
        '.contact__card',
        '.contact__map'
    ]);

    /* =======================
       About mosaic: randomize
    ======================= */
    (function shuffleMosaic() {
        const mosaic = document.querySelector('.about__mosaic');
        if (!mosaic) return;
        const imgs = Array.from(mosaic.querySelectorAll('img'));
        for (let i = imgs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
        }
        imgs.forEach((img) => mosaic.appendChild(img));
    })();

    /* =======================
       Maps: topbar + contact overlay
    ======================= */
    function mapURLForDevice(addr) {
        const ua = navigator.userAgent || navigator.vendor || '';
        const isAndroid = /Android/i.test(ua);
        const isIOS = /iPhone|iPad|iPod/i.test(ua) || (/(Macintosh)/.test(ua) && 'ontouchend' in document);
        if (isAndroid) return `geo:0,0?q=${encodeURIComponent(addr)}`;
        if (isIOS) return `https://maps.apple.com/?q=${encodeURIComponent(addr)}`;
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
    }
    window.mapURLForDevice = window.mapURLForDevice || mapURLForDevice;

    // Contact map overlay click
    (function wireContactMap() {
        const mapFigure = document.querySelector('.contact__map');
        if (!mapFigure) return;
        const addr = mapFigure.getAttribute('data-map-address')?.trim() || '711 Bayliss St, Midland, MI 48640';
        const button = mapFigure.querySelector('.contact__map-link');
        button?.addEventListener('click', (e) => {
            e.preventDefault();
            const url = window.mapURLForDevice(addr);
            if (url.startsWith('http')) window.open(url, '_blank', 'noopener');
            else window.location.href = url;
        });
    })();

    // Topbar address click
    (function wireTopbarMap() {
        const topbarLink = document.querySelector('.topbar .map-jump');
        if (!topbarLink) return;
        const addr = topbarLink.getAttribute('data-map-address') || topbarLink.textContent.replace('📍', '').trim();
        topbarLink.addEventListener('click', (e) => {
            e.preventDefault();
            const url = window.mapURLForDevice(addr);
            window.open(url, '_blank', 'noopener');
        });
    })();

    /* =======================
       Services content (copy deck)
    ======================= */
    const SERVICES_DATA = {
        cls: {
            title: 'Community Living Supports (CLS)',
            paragraph:
                'CLS helps people of all ages with disabilities and seniors gain confidence and independence at home and in the community. We support ADLs, transportation, money-management coaching, and social engagement—tailored goals that increase self-sufficiency, well-being, and inclusion.',
            bullets: ['ADLs', 'Budgeting support', 'Transportation', 'Social skills', 'Community outings', 'Special Needs']
        },
        respite: {
            title: 'Respite Care',
            paragraph:
                'Respite gives family caregivers time to recharge. Our trained staff step in short-term—hourly, overnight, or planned days—to provide personal care, meal prep, medication reminders, companionship, and safety supervision at home.',
            bullets: ['Hourly/overnight', 'In-home care', 'ADL support', 'Medication reminders', 'Companionship', 'Emergency coverage']
        },
        senior: {
            title: 'Senior Care',
            paragraph:
                'We help older adults remain safe, comfortable, and connected at home: personal care, mobility & fall-prevention, medication reminders, meals, transportation, light housekeeping, and daily check-ins—customized and scalable.',
            bullets: ['Personal care', 'Mobility support', 'Meals', 'Housekeeping', 'Transportation', 'Wellness check-ins']
        },
        injury: {
            title: 'Accident & Injury Care',
            paragraph:
                'Post-hospital recovery made easier: assistance with bathing and dressing, safe transfers and mobility, wound-care reminders per your clinician’s plan, medication reminders, healing-focused meals, and rides to follow-ups or therapy.',
            bullets: ['Post-op support', 'Transfers & mobility', 'Medication reminders', 'Nutrition & hydration', 'Appointment transport', 'Care coordination']
        },
        employment: {
            title: 'Supported Employment Services',
            paragraph:
                'Supported employment services help individuals with disabilities or significant barriers to employment find and maintain competitive jobs in integrated work settings alongside non-disabled peers. These services offer individualized support, including job development, training, resume assistance, coaching, and ongoing job coaching to ensure success and reduce the need for support over time.',
            bullets: ['Job development', 'Resume assistance', 'Skills training', 'Job placement', 'Ongoing job coaching']
        }
    };

    /* =======================
       Services modal
    ======================= */
    const servicesList = document.getElementById('servicesList');
    const modal = document.getElementById('serviceModal');
    const titleEl = modal?.querySelector('.modal__title');
    const paraEl = modal?.querySelector('.modal__paragraph');
    const listEl = modal?.querySelector('.modal__bullets');
    let lastFocus = null;

    function openService(key) {
        if (!modal) return;
        const svc = SERVICES_DATA[key];
        if (!svc) return;
        titleEl.textContent = svc.title;
        paraEl.textContent = svc.paragraph;
        listEl.innerHTML = svc.bullets.map((b) => `<li>${b}</li>`).join('');
        lastFocus = document.activeElement;
        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        modal.querySelector('.modal__close').focus();
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    // Open from cards
    servicesList?.addEventListener('click', (e) => {
        const btn = e.target.closest('.services__card');
        if (!btn) return;
        openService(btn.getAttribute('data-service'));
    });

    // Close actions
    modal?.addEventListener('click', (e) => {
        if (e.target.matches('[data-close-modal]')) closeModal();

        // Contact inside modal: close first, then smooth scroll
        const link = e.target.closest('a[href^="#contact"]');
        if (link) {
            e.preventDefault();
            closeModal();
            const target = document.getElementById('contact');
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, '', '#contact'); // optional: keep hash synced
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
    });

    /* =======================
       Quiet "click to read more" hint
    ======================= */
    document.querySelectorAll('#servicesList .services__card').forEach((btn) => {
        if (!btn.querySelector('.services__hint')) {
            const hint = document.createElement('span');
            hint.className = 'services__hint';
            hint.textContent = 'Click to read more';
            btn.appendChild(hint);
        }
    });
});
