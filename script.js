// ====================================
// TORRES FINTECH - LANDING PAGE SCRIPTS
// ====================================

// Header shadow on scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile menu toggle
const mobileToggle = document.getElementById('mobileToggle');
const nav = document.querySelector('.nav');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        mobileToggle.classList.toggle('open');
        if (nav.classList.contains('open')) {
            nav.style.display = 'flex';
            nav.style.flexDirection = 'column';
            nav.style.position = 'absolute';
            nav.style.top = '100%';
            nav.style.left = '0';
            nav.style.right = '0';
            nav.style.background = 'white';
            nav.style.padding = '20px 24px';
            nav.style.boxShadow = '0 8px 24px rgba(15, 10, 30, 0.1)';
            nav.style.gap = '16px';
            nav.style.borderTop = '1px solid #E4E4E7';
        } else {
            nav.style.display = '';
        }
    });

    // Close on click
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            nav.style.display = '';
        });
    });
}

// Phone mask
const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
    input.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
        } else if (value.length > 0) {
            value = value.replace(/^(\d{0,2}).*/, '($1');
        }
        e.target.value = value;
    });
});

// Form handler - sends to WhatsApp
function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);

    const nome = data.get('nome') || '';
    const whatsapp = data.get('whatsapp') || '';
    const email = data.get('email') || '';
    const empresa = data.get('empresa') || '';
    const servicoMap = {
        'contabilidade': 'Apenas Contabilidade',
        'bpo': 'Apenas BPO Financeiro',
        'completo': 'Combo Completo (Contabilidade + BPO)',
        'abertura': 'Abertura de empresa',
        'duvida': 'Ainda tenho dúvidas'
    };
    const servico = servicoMap[data.get('servico')] || '';

    const mensagemRaw = `Olá Torres Fintech! Quero meu diagnóstico gratuito.\n\n` +
        `*Nome:* ${nome}\n` +
        `*WhatsApp:* ${whatsapp}\n` +
        `*E-mail:* ${email}\n` +
        `*Empresa:* ${empresa}\n` +
        `*Serviço de interesse:* ${servico}`;
        
    const mensagemEncoded = encodeURIComponent(mensagemRaw);
    const whatsappLink = `https://wa.me/5583996348370?text=${mensagemEncoded}`;

    // Feedback visual
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Redirecionando...';
    btn.style.background = '#10B981';

    // Usar window.location.href ao invés de window.open previne bloqueadores de popup
    window.location.href = whatsappLink;

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        form.reset();
    }, 3000);
}

// Animate elements on scroll (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Elements to animate
const animateElements = document.querySelectorAll(
    '.problem-card, .solution-card, .diff-card, .bpo-item, .testimonial-card, .pricing-card, .process-step, .faq-item'
);

animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s`;
    observer.observe(el);
});

// Counter animation for stats
const stats = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const finalText = el.textContent;
            const hasSymbol = finalText.match(/[^\d]/g);

            // Skip animation for already animated
            if (el.dataset.animated) return;
            el.dataset.animated = 'true';

            const numberPart = parseFloat(finalText.replace(/[^\d.]/g, ''));
            const prefix = finalText.match(/^[^\d]+/)?.[0] || '';
            const suffix = finalText.match(/[^\d]+$/)?.[0] || '';

            if (isNaN(numberPart)) return;

            let current = 0;
            const increment = numberPart / 40;
            const timer = setInterval(() => {
                current += increment;
                if (current >= numberPart) {
                    current = numberPart;
                    clearInterval(timer);
                    el.textContent = finalText;
                } else {
                    const isInt = numberPart % 1 === 0;
                    el.textContent = `${prefix}${isInt ? Math.floor(current) : current.toFixed(1)}${suffix}`;
                }
            }, 30);

            statObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

stats.forEach(stat => statObserver.observe(stat));

// ====================================
// DARK MODE LOGIC
// ====================================
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
}

// Initial check
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
    setTheme(savedTheme);
} else if (systemPrefersDark) {
    setTheme('dark');
}

// Toggle click handler
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

// ====================================
// STORIES CAROUSEL LOGIC
// ====================================
const scrollContainer = document.querySelector('.stories-scroll');
const prevBtn = document.querySelector('.story-nav.prev');
const nextBtn = document.querySelector('.story-nav.next');

if (scrollContainer && prevBtn && nextBtn) {
    const scrollAmount = 246; // 230px width + 16px gap
    
    prevBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
}

// ====================================
// VIDEO MODAL LOGIC
// ====================================
function openVideoModal(videoId) {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('modalIframe');
    
    // Set iframe source with autoplay
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    
    // Show modal
    modal.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('modalIframe');
    
    // Hide modal
    modal.classList.remove('active');
    
    // Stop video by clearing src
    iframe.src = '';
    
    // Restore body scroll
    document.body.style.overflow = '';
}
