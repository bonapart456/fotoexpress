const revealElements = document.querySelectorAll('.reveal');
const filterButtons = document.querySelectorAll('.filter-button');
const portfolioCards = document.querySelectorAll('.portfolio-card');
const counters = document.querySelectorAll('[data-counter]');
const staggerGroups = document.querySelectorAll('.studio-grid, .portfolio-grid, .services-grid');
const parallaxMedia = document.querySelectorAll('.intro-image img, .portfolio-card img');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

staggerGroups.forEach((group) => {
    const items = group.querySelectorAll('.reveal');

    items.forEach((item, index) => {
        item.style.setProperty('--reveal-delay', `${Math.min(index * 70, 420)}ms`);
        item.style.setProperty('--reveal-x', index % 2 === 0 ? '-12px' : '12px');
    });
});

if (prefersReducedMotion) {
    revealElements.forEach((element) => {
        element.classList.add('is-visible');
    });
}

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        });
    },
    {
        threshold: 0.14,
        rootMargin: '0px 0px -8% 0px',
    }
);

if (!prefersReducedMotion) {
    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}

const counterObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const element = entry.target;
            const target = Number(element.dataset.counter);
            const duration = 1200;
            const startedAt = performance.now();

            const updateCounter = (now) => {
                const elapsed = now - startedAt;
                const progress = Math.min(elapsed / duration, 1);
                element.textContent = String(Math.floor(target * progress));

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                    return;
                }

                element.textContent = String(target);
            };

            requestAnimationFrame(updateCounter);
            counterObserver.unobserve(element);
        });
    },
    {
        threshold: 0.6,
    }
);

counters.forEach((counter) => {
    counterObserver.observe(counter);
});

if (!prefersReducedMotion && parallaxMedia.length > 0) {
    let isTicking = false;

    const updateParallax = () => {
        const viewportHeight = window.innerHeight;

        parallaxMedia.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const relativeCenter = rect.top + rect.height / 2 - viewportHeight / 2;
            const shift = Math.max(Math.min(relativeCenter * -0.035, 20), -20);

            element.style.setProperty('--media-shift', `${shift}px`);
        });

        isTicking = false;
    };

    const requestParallaxUpdate = () => {
        if (isTicking) {
            return;
        }

        isTicking = true;
        window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    window.addEventListener('resize', requestParallaxUpdate);
}

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const selectedFilter = button.dataset.filter;

        filterButtons.forEach((item) => {
            item.classList.toggle('is-active', item === button);
        });

        portfolioCards.forEach((card) => {
            const matches = selectedFilter === 'all' || card.dataset.category === selectedFilter;
            card.classList.toggle('is-hidden', !matches);
        });
    });
});