// js/app.js - Lógica de la landing page

// ============================================
// VARIABLES GLOBALES
// ============================================
let allJobs = [];
let currentFilter = 'all';
let searchTerm = '';

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    loadJobs();
    setupEventListeners();
    renderCategories();
});

// ============================================
// CARGAR TRABAJOS
// ============================================
async function loadJobs() {
    try {
        const response = await fetch('data/trabajos.json');
        allJobs = await response.json();
        
        // Solo mostrar trabajos disponibles (no cerrados)
        const availableJobs = allJobs.filter(job => job.status !== 'closed');
        
        displayJobs(availableJobs);
        updateStats(availableJobs);
        
        document.getElementById('loadingIndicator').style.display = 'none';
        
        if (availableJobs.length === 0) {
            document.getElementById('emptyState').style.display = 'block';
        }
        
    } catch (error) {
        console.error('Error cargando trabajos:', error);
        document.getElementById('loadingIndicator').innerHTML = `
            <p style="color: var(--danger);">❌ Error al cargar los trabajos. Recarga la página.</p>
        `;
    }
}

// ============================================
// MOSTRAR TRABAJOS
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
        <div class="job-card" data-job-id="${job.id}">
            <div class="job-header">
                <div>
                    <span class="status-badge status-${job.status}">
                        ${getStatusIcon(job.status)} ${getStatusText(job.status)}
                    </span>
                    <span class="job-category">${job.category}</span>
                </div>
                <span class="job-code">📌 #${job.code || 'N/A'}</span>
            </div>
            
            <h3>${job.title}</h3>
            
            <div class="job-details">
                <span>📍 ${job.location}</span>
                <span>📅 ${job.date} ${job.time || ''}</span>
                <span>💰 ${job.price}</span>
            </div>
            
            <p class="job-description">${job.description}</p>
            
            <!-- SECCIÓN DE CONTACTO -->
            <div class="contact-section">
                <div class="contact-label">📞 Métodos de contacto:</div>
                <div class="contact-buttons">
                    ${renderContactButtons(job.contact)}
                </div>
                ${job.contact?.preferred ? `
                    <div class="contact-preferred">
                        ⭐ El cliente prefiere contacto por: 
                        <span>${getPreferredMethodLabel(job.contact.preferred)}</span>
                    </div>
                ` : ''}
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; font-size: 0.8rem; color: var(--gray);">
                <span>🔒 Trabajo verificado por MaestroMX</span>
                <span>📊 ${job.views || 0} vistas</span>
            </div>
        </div>
    `).join('');
}

// ============================================
// RENDERIZAR BOTONES DE CONTACTO
// ============================================
function renderContactButtons(contact) {
    if (!contact) return '<span style="color: var(--gray);">Sin métodos de contacto disponibles</span>';
    
    let buttons = '';
    
    // Teléfono
    if (contact.phone) {
        buttons += `
            <a href="tel:+${CONFIG.countryCode}${contact.phone}" class="contact-btn phone">
                <i class="fas fa-phone"></i> Llamar
            </a>
        `;
    }
    
    // WhatsApp
    if (contact.whatsapp) {
        const whatsappNumber = contact.whatsapp.replace(/-/g, '');
        const message = encodeURIComponent('Hola, vi tu trabajo en MaestroMX y estoy interesado');
        buttons += `
            <a href="https://wa.me/${CONFIG.countryCode}${whatsappNumber}?text=${message}" 
               target="_blank" class="contact-btn whatsapp">
                <i class="fab fa-whatsapp"></i> WhatsApp
            </a>
        `;
    }
    
    // Email
    if (contact.email) {
        const subject = encodeURIComponent(`Trabajo MaestroMX - Interesado`);
        buttons += `
            <a href="mailto:${contact.email}?subject=${subject}" class="contact-btn email">
                <i class="fas fa-envelope"></i> Email
            </a>
        `;
    }
    
    // Website
    if (contact.website) {
        buttons += `
            <a href="${contact.website}" target="_blank" class="contact-btn website">
                <i class="fas fa-globe"></i> Sitio Web
            </a>
        `;
    }
    
    return buttons || '<span style="color: var(--gray);">Sin métodos de contacto disponibles</span>';
}

// ============================================
// RENDERIZAR CATEGORÍAS
// ============================================
function renderCategories() {
    const container = document.getElementById('categoryFilters');
    
    // Obtener categorías únicas de los trabajos
    const categories = [...new Set(allJobs.map(job => job.category))];
    
    // Agregar botón "Todos"
    let html = `<button class="category-btn active" data-category="all">📋 Todos</button>`;
    
    // Agregar cada categoría
    categories.forEach(cat => {
        html += `
            <button class="category-btn" data-category="${cat}">
                ${cat}
            </button>
        `;
    });
    
    container.innerHTML = html;
    
    // Agregar event listeners a los botones
    container.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Quitar active de todos
            container.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            // Agregar active al clickeado
            this.classList.add('active');
            // Filtrar
            currentFilter = this.dataset.category;
            applyFilters();
        });
    });
}

// ============================================
// FILTRAR TRABAJOS
// ============================================
function applyFilters() {
    let filtered = allJobs.filter(job => job.status !== 'closed');
    
    // Filtrar por categoría
    if (currentFilter !== 'all') {
        filtered = filtered.filter(job => job.category === currentFilter);
    }
    
    // Filtrar por búsqueda
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(job => 
            job.title.toLowerCase().includes(term) ||
            job.description.toLowerCase().includes(term) ||
            job.location.toLowerCase().includes(term)
        );
    }
    
    displayJobs(filtered);
    updateStats(filtered);
}

// ============================================
// ACTUALIZAR ESTADÍSTICAS
// ============================================
function updateStats(jobs) {
    const total = jobs.length;
    const available = jobs.filter(j => j.status === 'available').length;
    const progress = jobs.filter(j => j.status === 'progress').length;
    
    // Actualizar badge del hero
    const badge = document.querySelector('.hero .badge');
    if (badge) {
        badge.textContent = `✅ ${total} trabajos disponibles · ${available} activos · Sin comisiones`;
    }
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================
function getStatusIcon(status) {
    const icons = {
        'available': '🟢',
        'progress': '🟡',
        'closed': '🔴'
    };
    return icons[status] || '⚪';
}

function getStatusText(status) {
    const texts = {
        'available': 'Disponible',
        'progress': 'En proceso',
        'closed': 'Cerrado'
    };
    return texts[status] || status;
}

function getPreferredMethodLabel(method) {
    const labels = {
        'phone': '📱 Llamada',
        'whatsapp': '💬 WhatsApp',
        'email': '✉️ Email',
        'website': '🌐 Sitio Web'
    };
    return labels[method] || method;
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Búsqueda en tiempo real
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        searchTerm = this.value.trim();
        applyFilters();
    });
}

// ============================================
// REPORTAR ABUSO
// ============================================
function reportAbuse() {
    const message = encodeURIComponent(
        '🚨 Reporte de abuso - MaestroMX\n\n' +
        'Por favor describe el problema:\n' +
        '- Número de trabajo (si lo tienes): \n' +
        '- Descripción del problema: '
    );
    window.open(`https://wa.me/${CONFIG.countryCode}${CONFIG.adminContact.phone}?text=${message}`, '_blank');
}

// ============================================
// EXPORTAR PARA USO EN OTROS SCRIPTS
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadJobs,
        displayJobs,
        applyFilters,
        reportAbuse
    };
}