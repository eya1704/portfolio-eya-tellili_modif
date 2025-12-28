// common.js - Gestionnaire d'état partagé entre toutes les pages

// État global pour la langue
let currentLanguage = 'fr';

// Fonction pour définir la langue
function setLanguage(lang) {
    currentLanguage = lang;
    
    // Mettre à jour tous les boutons de langue
    document.querySelectorAll('[id^="btn-"]').forEach(btn => {
        if (btn.id.includes('en') || btn.id.includes('fr')) {
            const isActive = (btn.id.includes('en') && lang === 'en') || 
                            (btn.id.includes('fr') && lang === 'fr');
            btn.classList.toggle('bg-white', isActive);
            btn.classList.toggle('shadow-sm', isActive);
        }
    });
    
    // Mettre à jour tous les éléments avec la classe 'translate'
    document.querySelectorAll('.translate').forEach(element => {
        if (element.dataset[lang]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = element.dataset[lang];
            } else {
                element.textContent = element.dataset[lang];
            }
        }
    });
    
    // Mettre à jour le titre de la page
    updatePageTitle(lang);
    
    // Sauvegarder la préférence dans localStorage
    localStorage.setItem('preferredLanguage', lang);
}

// Fonction pour mettre à jour le titre de la page selon la langue
function updatePageTitle(lang) {
    const currentPage = window.location.pathname.split('/').pop();
    
    const titles = {
        'index_portfolio_eya.html': {
            'fr': 'Eya Tellili | Portfolio Ingénieur',
            'en': 'Eya Tellili | Engineering Portfolio'
        },
        'experience_eya.html': {
            'fr': 'Expériences | Eya Tellili',
            'en': 'Experiences | Eya Tellili'
        },
        'projets_eya.html': {
            'fr': 'Projets | Eya Tellili',
            'en': 'Projects | Eya Tellili'
        },
        'associative_eya.html': {
            'fr': 'Vie Associative | Eya Tellili',
            'en': 'Associative Life | Eya Tellili'
        }
    };
    
    if (titles[currentPage] && titles[currentPage][lang]) {
        document.title = titles[currentPage][lang];
    }
}

// Fonction pour initialiser la langue au chargement de la page
function initLanguage() {
    // Vérifier si une langue est sauvegardée dans localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage');
    
    // Vérifier la langue du navigateur
    const browserLanguage = navigator.language || navigator.userLanguage;
    const browserLangShort = browserLanguage.split('-')[0];
    
    // Déterminer la langue initiale
    let initialLang = 'fr'; // Par défaut français
    if (savedLanguage) {
        initialLang = savedLanguage;
    } else if (browserLangShort === 'en') {
        initialLang = 'en';
    }
    
    // Appliquer la langue
    setLanguage(initialLang);
}

// Gestion du modal pour les images et vidéos
function openModal(src, type) {
    const modal = document.getElementById('mediaModal');
    if (!modal) return;
    
    const content = document.getElementById('modalContent');
    
    // Vider le contenu précédent
    content.innerHTML = '';
    
    if (type === 'video') {
        content.innerHTML = `
            <video 
                src="${src}" 
                class="w-full max-h-[80vh] object-contain"
                controls
                autoplay
                muted
                playsinline
            >
                Votre navigateur ne supporte pas les vidéos HTML5.
            </video>
        `;
    } else {
        content.innerHTML = `
            <img 
                src="${src}" 
                class="w-full max-h-[80vh] object-contain"
                alt="Agrandi"
                loading="lazy"
            >
        `;
    }
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Focus sur le modal pour permettre la navigation au clavier
    modal.focus();
}

function closeModal() {
    const modal = document.getElementById('mediaModal');
    if (!modal) return;
    
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    // Arrêter la vidéo si elle joue
    const video = modal.querySelector('video');
    if (video) {
        video.pause();
        video.currentTime = 0;
    }
}

// Fonction pour gérer le menu mobile
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileMenu.classList.toggle('open');
            this.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
        });
        
        // Fermer le menu en cliquant en dehors
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                mobileMenu.classList.remove('open');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Fermer le menu en cliquant sur un lien
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// Fonction pour mettre à jour la navigation active
function updateActiveNav() {
    const currentPage = window.location.pathname.split('/').pop();
    
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkHref = link.getAttribute('href');
        const isActive = linkHref === currentPage || 
                        (currentPage === 'index_portfolio_eya.html' && linkHref === 'index.html') ||
                        (currentPage === 'experience_eya.html' && linkHref === 'experiences.html') ||
                        (currentPage === 'projets_eya.html' && linkHref === 'projets.html');
        
        link.classList.toggle('active', isActive);
        link.classList.toggle('text-blue-600', isActive);
        link.classList.toggle('font-bold', isActive);
    });
}

// Fonction pour ajouter des animations de scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);
    
    // Observer les sections
    document.querySelectorAll('section, .project-card, .association-card').forEach(element => {
        observer.observe(element);
    });
}

// Fonction pour améliorer l'accessibilité
function initAccessibility() {
    // Ajouter aria-labels aux boutons sans texte
    document.querySelectorAll('button:not([aria-label])').forEach(button => {
        if (!button.textContent.trim()) {
            const icon = button.querySelector('i');
            if (icon) {
                const iconClass = Array.from(icon.classList)
                    .find(cls => cls.startsWith('fa-'));
                if (iconClass) {
                    const action = iconClass.replace('fa-', '')
                        .replace('-', ' ');
                    button.setAttribute('aria-label', action);
                }
            }
        }
    });
    
    // Ajouter des titres aux iframes (s'il y en a)
    document.querySelectorAll('iframe:not([title])').forEach(iframe => {
        iframe.setAttribute('title', 'Contenu intégré');
    });
}

// Fonction pour gérer les vidéos
function initVideos() {
    document.querySelectorAll('video[autoplay]').forEach(video => {
        // Mettre en pause les vidéos quand elles ne sont pas visibles
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(e => console.log('Autoplay prevented:', e));
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(video);
        
        // Ajouter des contrôles sur mobile
        if ('ontouchstart' in window) {
            video.setAttribute('controls', 'true');
        }
    });
}

// Initialiser toutes les fonctionnalités au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser la langue
    initLanguage();
    
    // Initialiser le menu mobile
    initMobileMenu();
    
    // Mettre à jour la navigation active
    updateActiveNav();
    
    // Initialiser les animations de scroll
    initScrollAnimations();
    
    // Initialiser l'accessibilité
    initAccessibility();
    
    // Initialiser les vidéos
    initVideos();
    
    // Initialiser les événements du modal (si présent)
    const modal = document.getElementById('mediaModal');
    if (modal) {
        // Fermer avec ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
        
        // Fermer en cliquant en dehors du modal
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'mediaModal') closeModal();
        });
        
        // Ajouter des tooltips pour les images
        document.querySelectorAll('img[alt]').forEach(img => {
            if (!img.title) {
                img.title = img.alt;
            }
        });
    }
    
    // Ajouter des styles d'animation si non présents
    if (!document.querySelector('#animations-styles')) {
        const style = document.createElement('style');
        style.id = 'animations-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
                animation: fadeIn 0.6s ease-out forwards;
            }
        `;
        document.head.appendChild(style);
    }
});

// Fonction utilitaire pour la navigation fluide
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Fonction pour charger dynamiquement le contenu (pour les futures fonctionnalités)
async function loadPageContent(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.text();
    } catch (error) {
        console.error('Error loading content:', error);
        return null;
    }
}

// Exporter les fonctions globales
window.setLanguage = setLanguage;
window.openModal = openModal;
window.closeModal = closeModal;
window.smoothScrollTo = smoothScrollTo;

// Gérer le rafraîchissement de la langue lors du retour arrière
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        initLanguage();
        updateActiveNav();
    }
});

// Ajouter un message de console pour le développement
console.log('Portfolio Eya Tellili - Navigation et fonctionnalités initialisées');