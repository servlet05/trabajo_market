// js/app.js - Lógica ultra user-friendly

// ============================================
// VARIABLES GLOBALES
// ============================================
let allJobs = [];
let currentFilter = 'all';
let searchTerm = '';

// ============================================
// SPLASH SCREEN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar splash por 2.5 segundos
    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        splash.style.transition = 'opacity 0.5s ease';
        splash.style.opacity = '0';
        
        setTimeout(() => {
            splash.style.display = 'none';
            document.getElementById('app').style.display = 'block';
            // Inicializar app
            initApp();
        }, 500);
    }, 2500);
});

// ============================================
// INICIALIZAR APP
// ============================================
async function initApp() {
    await loadJobs();
    renderCategories();
    setupEventListeners();
}

// ============================================
// CARGAR TRABAJOS
// ============================================
async function loadJobs() {
    try {
        const response = await fetch('data/trabajos.json');
        allJobs = await response.json();
        
        const availableJobs = allJobs.filter(job => job.status !== 'closed');
        displayJobs(availableJobs);
        updateCount(availableJobs.length);
        
        document.getElementById('loadingJobs').style.display = 'none';
        
        if (availableJobs.length === 0) {
            document.getElementById('emptyState').style.display = 'block';
        }
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loadingJobs').innerHTML = `
            <p style="color: var(--danger);">❌ Error al cargar. Recarga la página.</p>
        `;
    }
}

// ============================================
// MOSTRAR TRABAJOS - Tarjetas visuales
// ============================================
function displayJobs(jobs) {
    const container = document.getElementById('jobsContainer');
    
    if (jobs.length === 0) {
        container.innerHTML = '';
        document.getElementById('emptyState').style.display = 'block';
        return;
    }
    
    document.getElementById('emptyState').style.display = 'none';
    
    container.innerHTML = jobs.map(job => `
        <div class="job-card" onclick="showJobDetail(${job.id})">
            <div class="job-card-header">
                <span class="job-card-category">
                    ${getCategoryIcon(job.category)} ${job.category}
                </span>
                <span class="job-card-status status-${job.status}">
                    ${getStatusEmoji(job.status)} ${getStatusText(job.status)}
                </span>
            </div>
            
            <h3 class="job-card-title">${job.title}</h3>
            
            <div class="job-card-details">
                <span>📍 ${job.location}</span>
                <span>📅 ${job.date}</span>
                ${job.time ? `<span>⏰ ${job.time}</span>` : ''}
            </div>
            
            <div class="job-card-price">${job.price}</div>
            
            <div class="job-card-footer">
                <div class="job-card-contact">
                    ${renderContactIcons(job.contact)}
                </div>
                <span class="job-card-views">👁️ ${job.views || 0}</span>
            </div>
        </div>
    `).join('');
}

// ============================================
// RENDERIZAR ÍCONOS DE CONTACTO
// ============================================
function renderContactIcons(contact) {
    if (!contact) return '';
    
    let icons = '';
    
    if (contact.phone) {
        icons += `
            <a href="tel:+${CONFIG.region.countryCode}${contact.phone}" 
               class="contact-icon-btn phone" 
               onclick="event.stopPropagation();">
                <i class="fas fa-phone"></i>
            </a>
        `;
    }
    
    if (contact.whatsapp) {
        const number = contact.whatsapp.replace(/-/g, '');
        const msg = encodeURIComponent('Hola, vi tu trabajo en MaestroMX');
        icons += `
            <a href="https://wa.me/${CONFIG.region.countryCode}${number}?text=${msg}" 
               target="_blank" 
               class="contact-icon-btn whatsapp"
               onclick="event.stopPropagation();">
                <i class="fab fa-whatsapp"></i>
            </a>
        `;
    }
    
    if (contact.email) {
        const subject = encodeURIComponent('Trabajo MaestroMX');
        icons += `
            <a href="mailto:${contact.email}?subject=${subject}" 
               class="contact-icon-btn email"
               onclick="event.stopPropagation();">
                <i class="fas fa-envelope"></i>
            </a>
        `;
    }
    
    return icons || '<span style="font-size:0.7rem;color:var(--gray);">Sin contacto</span>';
}

// ============================================
// RENDERIZAR CATEGORÍAS
// ============================================
function renderCategories() {
    const container = document.getElementById('categoryScroll');
    
    // Obtener categorías únicas
    const categories = [...new Set(allJobs.map(job => job.category))];
    
    let html = `
        <button class="category-pill active" data-category="all" onclick="filterJobs('all', this)">
            <span class="pill-icon">📋</span>
            <span class="pill-label">Todos</span>
        </button>
    `;
    
    categories.forEach(cat => {
        html += `
            <button class="category-pill" data-category="${cat}" onclick="filterJobs('${cat}', this)">
                <span class="pill-icon">${getCategoryIcon(cat)}</span>
                <span class="pill-label">${cat}</span>
            </button>
        `;
    });
    
    container.innerHTML = html;
}

// ============================================
// FILTRAR TRABAJOS
// ============================================
function filterJobs(category, button) {
    // Actualizar active
    document.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    
    currentFilter = category;
    applyFilters();
}

function applyFilters() {
    let filtered = allJobs.filter(job => job.status !== 'closed');
    
    if (currentFilter !== 'all') {
        filtered = filtered.filter(job => job.category === currentFilter);
    }
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(job => 
            job.title.toLowerCase().includes(term) ||
            job.description.toLowerCase().includes(term) ||
            job.location.toLowerCase().includes(term)
        );
    }
    
    displayJobs(filtered);
    updateCount(filtered.length);
}

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================
function getCategoryIcon(category) {
    // Extraer el emoji de la categoría
    const match = category.match(/^([^\s]+)/);
    return match ? match[1] : '🛠️';
}

function getStatusEmoji(status) {
    const map = {
        'available': '🟢',
        'progress': '🟡',
        'closed': '🔴'
    };
    return map[status] || '⚪';
}

function getStatusText(status) {
    const map = {
        'available': 'Disponible',
        'progress': 'En proceso',
        'closed': 'Cerrado'
    };
    return map[status] || status;
}

function updateCount(count) {
    document.getElementById('jobsCount').textContent = count;
}

// ============================================
// MOSTRAR DETALLE DEL TRABAJO
// ============================================
function showJobDetail(jobId) {
    const job = allJobs.find(j => j.id === jobId);
    if (!job) return;
    
    // Crear modal con detalles
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
        animation: fadeIn 0.3s ease;
        padding: 1rem;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 20px;
            max-width: 400px;
            width: 100%;
            padding: 2rem;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        ">
            <button onclick="this.closest('div[style]').remove()" style="
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                width: 40px;
                height: 40px;
                border: none;
                background: var(--gray-light);
                border-radius: 50%;
                font-size: 1.2rem;
                cursor: pointer;
            ">✕</button>
            
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 1.5rem;">${getCategoryIcon(job.category)}</span>
                <span style="font-weight: 600; color: var(--gray);">${job.category}</span>
                <span class="job-card-status status-${job.status}" style="margin-left: auto;">
                    ${getStatusEmoji(job.status)} ${getStatusText(job.status)}
                </span>
            </div>
            
            <h2 style="font-size: 1.5rem; margin: 0.5rem 0;">${job.title}</h2>
            
            <div style="display: flex; gap: 0.8rem; font-size: 0.9rem; color: var(--gray); margin: 0.5rem 0; flex-wrap: wrap;">
                <span>📍 ${job.location}</span>
                <span>📅 ${job.date} ${job.time || ''}</span>
                <span>💰 ${job.price}</span>
            </div>
            
            <div style="background: var(--gray-light); padding: 1rem; border-radius: var(--radius-sm); margin: 1rem 0;">
                <p style="color: var(--text-dark); line-height: 1.6;">${job.description}</p>
            </div>
            
            <div style="margin: 1rem 0;">
                <p style="font-weight: 600; margin-bottom: 0.5rem;">📞 Contactar:</p>
                <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
                    ${renderContactButtons(job.contact)}
                </div>
            </div>
            
            <div style="font-size: 0.8rem; color: var(--gray); text-align: center; padding-top: 0.5rem; border-top: 1px solid #E2E8F0;">
                🔒 Trabajo verificado · 📌 ${job.code || 'N/A'}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
}

// ============================================
// RENDERIZAR BOTONES DE CONTACTO (para modal)
// ============================================
function renderContactButtons(contact) {
    if (!contact) return '<span style="color:var(--gray);">Sin contacto disponible</span>';
    
    let buttons = '';
    
    if (contact.phone) {
        buttons += `
            <a href="tel:+${CONFIG.region.countryCode}${contact.phone}" 
               class="contact-btn phone" style="
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.6rem 1.2rem;
                background: #3182CE;
                color: white;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.2s;
            ">
                <i class="fas fa-phone"></i> Llamar
            </a>
        `;
    }
    
    if (contact.whatsapp) {
        const number = contact.whatsapp.replace(/-/g, '');
        const msg = encodeURIComponent('Hola, vi tu trabajo en MaestroMX');
        buttons += `
            <a href="https://wa.me/${CONFIG.region.countryCode}${number}?text=${msg}" 
               target="_blank" 
               class="contact-btn whatsapp" style="
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.6rem 1.2rem;
                background: #25D366;
                color: white;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.2s;
            ">
                <i class="fab fa-whatsapp"></i> WhatsApp
            </a>
        `;
    }
    
    if (contact.email) {
        const subject = encodeURIComponent('Trabajo MaestroMX');
        buttons += `
            <a href="mailto:${contact.email}?subject=${subject}" 
               class="contact-btn email" style="
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.6rem 1.2rem;
                background: #E53E3E;
                color: white;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.2s;
            ">
                <i class="fas fa-envelope"></i> Email
            </a>
        `;
    }
    
    return buttons || '<span style="color:var(--gray);">Sin contacto disponible</span>';
}

// ============================================
// FUNCIONES DE INTERFAZ
// ============================================
function toggleSearch() {
    const bar = document.getElementById('searchBar');
    const input = document.getElementById('searchInput');
    
    if (bar.style.display === 'none') {
        bar.style.display = 'block';
        setTimeout(() => input.focus(), 100);
    } else {
        bar.style.display = 'none';
        input.value = '';
        searchTerm = '';
        applyFilters();
    }
}

function toggleFilters() {
    // Por ahora solo scroll a categorías
    document.querySelector('.categories-section').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
}

function contactAdmin() {
    const phone = window.CONFIG?.adminContact?.phone || '5512345678';
    const msg = encodeURIComponent('Hola, quiero publicar un trabajo en MaestroMX');
    window.open(`https://wa.me/52${phone.replace(/-/g, '')}?text=${msg}`, '_blank');
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        searchTerm = this.value.trim();
        applyFilters();
    });
}