// common.js - Gestionnaire d'état partagé entre toutes les pages

// État global pour la langue
let currentLanguage = 'fr';

// Navigation entre les pages
const pages = {
    'index_portfolio_eya.html': {
        name: 'Accueil',
        en: 'Home'
    },
    'experience_eya.html': {
        name: 'Expériences',
        en: 'Experiences'
    },
    'projets_eya.html': {
        name: 'Projets',
        en: 'Projects'
    }
};

// Initialiser la navigation
function initNavigation() {
    const navElement = document.getElementById('main-nav');
    if (!navElement) return;
    
    const currentPage = window.location.pathname.split('/').pop();
    
    let navHTML = '';
    for (const [page, info] of Object.entries(pages)) {
        const isActive = currentPage === page || (currentPage === '' && page === 'index_portfolio_eya.html');
        const displayName = currentLanguage === 'fr' ? info.name : info.en;
        
        navHTML += `
            <a href="${page}" class="${isActive ? 'text-blue-600 font-bold' : ''} hover:text-blue-700 transition-colors">
                ${displayName}
            </a>
        `;
    }
    
    // Ajouter le lien Contact
    const contactText = currentLanguage === 'fr' ? 'Contact' : 'Contact';
    navHTML += `
        <a href="index_portfolio_eya.html#contact" class="hover:text-blue-700 transition-colors">
            ${contactText}
        </a>
    `;
    
    navElement.innerHTML = navHTML;
}

// Fonction pour définir la langue
function setLanguage(lang) {
    currentLanguage = lang;
    
    // Mettre à jour les boutons de langue
    const btnEn = document.getElementById('btn-en');
    const btnFr = document.getElementById('btn-fr');
    
    if (btnEn && btnFr) {
        btnEn.classList.toggle('bg-white', lang === 'en');
        btnEn.classList.toggle('shadow-sm', lang === 'en');
        btnFr.classList.toggle('bg-white', lang === 'fr');
        btnFr.classList.toggle('shadow-sm', lang === 'fr');
    }
    
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
    
    // Mettre à jour la navigation
    initNavigation();
    
    // Mettre à jour le titre de la page
    updatePageTitle(lang);
    
    // Sauvegarder la préférence dans localStorage
    localStorage.setItem('preferredLanguage', lang);
}

// Fonction pour mettre à jour le titre de la page selon la langue
function updatePageTitle(lang) {
    const currentPage = window.location.pathname.split('/').pop() || 'index_portfolio_eya.html';
    
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

// Gestion du modal (pour les pages qui l'utilisent)
function openModal(src, type) {
    const modal = document.getElementById('mediaModal');
    if (!modal) return;
    
    const content = document.getElementById('modalContent');
    
    if (type === 'video') {
        content.innerHTML = `
            <video 
                src="${src}" 
                class="w-full max-h-[80vh] object-contain"
                controls
                autoplay
                muted
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
    }
}

// Fonction pour créer le footer dynamiquement
function createFooter() {
    const footerElement = document.getElementById('dynamic-footer');
    if (!footerElement) return;
    
    const footerHTML = `
        <div class="grid md:grid-cols-3 gap-12 mb-16 text-center md:text-left">
            <div>
                <h3 class="text-xl font-bold mb-6 translate" data-en="Contact Details" data-fr="Coordonnées">Coordonnées</h3>
                <ul class="space-y-4 text-slate-400">
                    <li class="flex items-center justify-center md:justify-start gap-3">
                        <i class="fas fa-envelope text-blue-400"></i>
                        <a href="mailto:eya.tellili@etudiant-enit.utm.tn" class="hover:text-white transition">eya.tellili@etudiant-enit.utm.tn</a>
                    </li>
                    <li class="flex items-center justify-center md:justify-start gap-3">
                        <i class="fas fa-phone text-blue-400"></i>
                        <span>+216 23 695 271</span>
                    </li>
                    <li class="flex items-center justify-center md:justify-start gap-3">
                        <i class="fas fa-map-marker-alt text-blue-400"></i>
                        <span>Tunis, Tunisie</span>
                    </li>
                </ul>
            </div>
            
            <div>
                <h3 class="text-xl font-bold mb-6 translate" data-en="Navigation" data-fr="Navigation">Navigation</h3>
                <div class="flex flex-col gap-4 text-slate-400">
                    <a href="index_portfolio_eya.html" class="hover:text-white transition translate" data-en="Home" data-fr="Accueil">Accueil</a>
                    <a href="experience_eya.html" class="hover:text-white transition translate" data-en="Experiences" data-fr="Expériences">Expériences</a>
                    <a href="projets_eya.html" class="hover:text-white transition translate" data-en="Projects" data-fr="Projets">Projets</a>
                </div>
            </div>

            <div>
                <h3 class="text-xl font-bold mb-6 translate" data-en="Status" data-fr="Statut Actuel">Statut Actuel</h3>
                <p class="text-slate-400 text-sm leading-relaxed translate" 
                   data-en="Currently seeking a Graduation Project (PFE) internship starting February 2025." 
                   data-fr="Actuellement à la recherche d'un stage de Projet de Fin d'Études (PFE) à partir de février 2025.">
                   Actuellement à la recherche d'un stage de Projet de Fin d'Études (PFE) à partir de février 2025.
                </p>
            </div>
        </div>
        
        <div class="border-t border-slate-800 pt-8 text-center text-slate-500 text-xs uppercase tracking-widest">
            <p>© 2025 Eya Tellili — École Nationale d'Ingénieurs de Tunis</p>
        </div>
    `;
    
    footerElement.innerHTML = footerHTML;
}

// Initialiser les événements au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser la langue
    initLanguage();
    
    // Initialiser la navigation
    initNavigation();
    
    // Créer le footer dynamique
    createFooter();
    
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
            img.title = img.alt;
        });
    }
});