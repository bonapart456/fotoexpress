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

// ========== SHOWCASE DE TESTIMONIOS ANIMADOS ==========

const showcaseData = [
    { name: 'Maria Gonzalez', role: 'Diseñadora de moda', text: '"Contrate a Foto Express para mi sesion de marca personal y quede completamente impresionada. Las fotos superaron todas mis expectativas. Sin duda el mejor estudio fotografico de la ciudad."' },
    { name: 'Carlos Rivas', role: 'Empresario', text: '"El equipo de Foto Express es increible. Desde la planeacion hasta la entrega, todo fue perfecto. Mis fotos de producto quedaron de nivel internacional. Trabajo de primer nivel."' },
    { name: 'Sofia Mendoza', role: 'Modelo profesional', text: '"Nunca habia tenido una sesion fotografica tan cuidada. La iluminacion, la direccion en set, el resultado final... simplemente impecable. Foto Express es el mejor, punto."' },
    { name: 'Andres Fuentes', role: 'Director creativo', text: '"Las fotos para mi portafolio artistico quedaron exactamente como las habia imaginado. El fotografo entendio mi vision desde el primer momento. Lo recomiendo absolutamente."' },
    { name: 'Valentina Cruz', role: 'Fundadora de startup', text: '"Use Foto Express para las imagenes de mi marca y los resultados fueron espectaculares. Vale cada peso invertido, la calidad del trabajo es simplemente premium."' },
    { name: 'Diego Morales', role: 'Coach ejecutivo', text: '"La calidad del trabajo de Foto Express no tiene comparacion. Mis clientes constantemente me preguntan quien hizo mis fotos de perfil. ¡El mejor estudio de la ciudad!"' },
    { name: 'Isabel Romero', role: 'Artista visual', text: '"Hermoso estudio, equipo calido y resultados que hablan solos. El proceso fue fluido y profesional de principio a fin. Regresare para cada proyecto que tenga."' },
    { name: 'Pablo Herrera', role: 'Diseñador de ropa', text: '"Encargue una sesion editorial para mi linea de ropa y el nivel de las fotos me dejo sin palabras. Foto Express es sencillamente el mejor estudio fotografico que he conocido."' },
    { name: 'Lucia Vazquez', role: 'Influencer de lifestyle', text: '"El mejor servicio fotografico que he experimentado en mi carrera. La atencion al detalle y el ojo artistico del equipo son incomparables. ¡Volveria mil veces sin dudar!"' },
    { name: 'Roberto Salinas', role: 'Director de marketing', text: '"Desde la primera consulta hasta la entrega final, la experiencia fue impecable. Mis fotos corporativas proyectan una imagen de lujo y profesionalismo total. ¡Increible trabajo!"' },
];

const showcaseCard = document.getElementById('showcase-card');
const showcaseNameEl = document.getElementById('showcase-name');
const showcaseRoleEl = document.getElementById('showcase-role');
const showcaseTextEl = document.getElementById('showcase-text');
const showcaseDotsContainer = document.getElementById('showcase-dots');

let currentShowcaseIndex = 0;
let showcaseInterval = null;

function buildShowcaseDots() {
    if (!showcaseDotsContainer) return;
    showcaseData.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.className = 'showcase-dot' + (i === 0 ? ' is-active' : '');
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Ver testimonio ' + (i + 1));
        btn.addEventListener('click', () => {
            if (i === currentShowcaseIndex) return;
            clearInterval(showcaseInterval);
            goToShowcase(i);
            restartShowcaseInterval();
        });
        showcaseDotsContainer.appendChild(btn);
    });
}

function setActiveDot(index) {
    if (!showcaseDotsContainer) return;
    showcaseDotsContainer.querySelectorAll('.showcase-dot').forEach((d, i) => {
        d.classList.toggle('is-active', i === index);
    });
}

function goToShowcase(index) {
    if (!showcaseCard) return;

    showcaseCard.classList.add('is-exiting');

    setTimeout(() => {
        const item = showcaseData[index];
        showcaseTextEl.textContent = item.text;
        showcaseNameEl.textContent = item.name;
        showcaseRoleEl.textContent = item.role;
        currentShowcaseIndex = index;
        setActiveDot(index);

        showcaseCard.classList.remove('is-exiting');
        showcaseCard.classList.add('is-entering');

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                showcaseCard.classList.remove('is-entering');
            });
        });
    }, 470);
}

function restartShowcaseInterval() {
    showcaseInterval = setInterval(() => {
        const next = (currentShowcaseIndex + 1) % showcaseData.length;
        goToShowcase(next);
    }, 4800);
}

function initShowcase() {
    if (!showcaseCard) return;

    // Mezcla los testimonios base con los comentarios publicados por usuarios
    const userComments = getComments();
    userComments.forEach((c) => {
        showcaseData.unshift({
            name: c.name,
            role: 'Cliente verificado',
            text: '\u201c' + c.text + '\u201d',
        });
    });

    const first = showcaseData[0];
    showcaseTextEl.textContent = first.text;
    showcaseNameEl.textContent = first.name;
    showcaseRoleEl.textContent = first.role;
    buildShowcaseDots();
    restartShowcaseInterval();
}

function addCommentToShowcase(name, text) {
    // Detiene el ciclo actual y reconstruye el carrusel con el nuevo comentario al frente
    clearInterval(showcaseInterval);

    showcaseData.unshift({
        name,
        role: 'Cliente verificado',
        text: '\u201c' + text + '\u201d',
    });

    currentShowcaseIndex = 0;

    // Reconstruye los puntos
    if (showcaseDotsContainer) {
        showcaseDotsContainer.innerHTML = '';
        buildShowcaseDots();
    }

    // Muestra el nuevo comentario con animacion
    showcaseCard.classList.add('is-entering');
    showcaseTextEl.textContent = showcaseData[0].text;
    showcaseNameEl.textContent = showcaseData[0].name;
    showcaseRoleEl.textContent = showcaseData[0].role;
    setActiveDot(0);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            showcaseCard.classList.remove('is-entering');
        });
    });

    restartShowcaseInterval();
}

initShowcase();

// ========== COMENTARIOS ==========

const commentForm = document.getElementById('comment-form');
const commentsList = document.getElementById('comments-list');
const commentError = document.getElementById('comment-error');
const COMMENTS_KEY = 'fotoexpress_comments';

function getComments() {
    try {
        const stored = localStorage.getItem(COMMENTS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveComments(comments) {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function renderComments() {
    if (!commentsList) return;

    commentsList.innerHTML = '';
    const comments = getComments();

    if (comments.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'comments-empty';
        empty.textContent = 'Aun no hay comentarios. Se el primero en comentar.';
        commentsList.appendChild(empty);
        return;
    }

    comments.forEach((comment) => {
        const article = document.createElement('article');
        article.className = 'comment-card';

        const header = document.createElement('div');
        header.className = 'comment-header';

        const nameEl = document.createElement('strong');
        nameEl.textContent = comment.name;

        const dateEl = document.createElement('span');
        dateEl.className = 'comment-date';
        dateEl.textContent = formatDate(comment.date);

        header.appendChild(nameEl);
        header.appendChild(dateEl);

        const textEl = document.createElement('p');
        textEl.textContent = comment.text;

        article.appendChild(header);
        article.appendChild(textEl);
        commentsList.appendChild(article);
    });
}

if (commentForm) {
    renderComments();

    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('comment-name');
        const textInput = document.getElementById('comment-text');
        const name = nameInput.value.trim();
        const text = textInput.value.trim();

        if (commentError) {
            commentError.hidden = true;
            commentError.textContent = '';
        }

        if (!name || !text) {
            if (commentError) {
                commentError.textContent = 'Por favor completa tu nombre y comentario antes de publicar.';
                commentError.hidden = false;
            }
            return;
        }

        const comments = getComments();
        comments.unshift({ name, text, date: new Date().toISOString() });
        saveComments(comments);
        renderComments();
        addCommentToShowcase(name, text);

        nameInput.value = '';
        textInput.value = '';
        nameInput.focus();
    });
}