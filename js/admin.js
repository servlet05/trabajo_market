// js/admin.js - Lógica del panel administrativo

// ============================================
// VARIABLES GLOBALES
// ============================================
let jobs = [];
let editMode = false;
let currentJobId = null;
const STORAGE_KEY = 'maestromx_jobs';

// ============================================
// LOGIN
// ============================================
function loginAdmin() {
    const password = document.getElementById('adminPassword').value;
    
    if (password === CONFIG.adminPassword) {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadJobsAdmin();
    } else {
        document.getElementById('loginError').textContent = '❌ Contraseña incorrecta';
        document.getElementById('loginError').style.color = 'var(--danger)';
        
        // Limpiar después de 3 segundos
        setTimeout(() => {
            document.getElementById('loginError').textContent = '';
        }, 3000);
    }
}

function logoutAdmin() {
    if (confirm('¿Seguro que quieres cerrar sesión?')) {
        document.getElementById('loginContainer').style.display = 'block';
        document.getElementById('adminPanel').style.display = 'none';
        document.getElementById('adminPassword').value = '';
        document.getElementById('loginError').textContent = '';
    }
}

// ============================================
// CARGAR TRABAJOS
// ============================================
async function loadJobsAdmin() {
    try {
        // Intentar cargar desde localStorage primero
        const localData = localStorage.getItem(STORAGE_KEY);
        if (localData) {
            jobs = JSON.parse(localData);
            renderJobsList();
            updateStats();
            return;
        }
        
        // Si no hay local, cargar del JSON
        const response = await fetch('data/trabajos.json');
        jobs = await response.json();
        renderJobsList();
        updateStats();
        saveToLocalStorage();
        
    } catch (error) {
        console.error('Error cargando trabajos:', error);
        // Si falla, usar datos de ejemplo
        jobs = getSampleJobs();
        renderJobsList();
        updateStats();
        saveToLocalStorage();
    }
}

// ============================================
// RENDERIZAR LISTA
// ============================================
function renderJobsList() {
    const container = document.getElementById('jobsList');
    
    if (jobs.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; background: var(--gray-light); border-radius: var(--radius);">
                <p style="font-size: 1.2rem; color: var(--gray);">📭 No hay trabajos publicados</p>
                <p style="color: var(--gray);">Haz clic en "Nuevo Trabajo" para empezar</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = jobs.map((job, index) => `
        <div class="job-card" style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <div style="flex: 1; min-width: 200px;">
                <div>
                    <span class="status-badge status-${job.status}">
                        ${getStatusIcon(job.status)} ${getStatusText(job.status)}
                    </span>
                    <span style="font-weight: 600; margin-left: 0.5rem;">${job.title}</span>
                </div>
                <div style="font-size: 0.9rem; color: var(--gray); margin-top: 0.2rem;">
                    ${job.category} · 📍 ${job.location} · 💰 ${job.price}
                    ${job.code ? `· 📌 ${job.code}` : ''}
                </div>
                <div style="font-size: 0.8rem; color: var(--gray); margin-top: 0.2rem;">
                    📅 ${job.date} ${job.time || ''}
                </div>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button onclick="editJob(${index})" 
                        style="background: #3b82f6; color: white; border: none; padding: 0.4rem 1rem; border-radius: 6px; cursor: pointer; transition: var(--transition);">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteJob(${index})" 
                        style="background: var(--danger); color: white; border: none; padding: 0.4rem 1rem; border-radius: 6px; cursor: pointer; transition: var(--transition);">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ============================================
// ESTADÍSTICAS
// ============================================
function updateStats() {
    const total = jobs.length;
    const available = jobs.filter(j => j.status === 'available').length;
    const progress = jobs.filter(j => j.status === 'progress').length;
    const closed = jobs.filter(j => j.status === 'closed').length;
    
    document.getElementById('stats').innerHTML = `
        <div style="background: var(--gray-light); padding: 1.5rem; border-radius: var(--radius); text-align: center; border-left: 4px solid var(--primary);">
            <div style="font-size: 2.5rem; font-weight: bold; color: var(--primary);">${total}</div>
            <div style="color: var(--gray);">Total</div>
        </div>
        <div style="background: #dcfce7; padding: 1.5rem; border-radius: var(--radius); text-align: center; border-left: 4px solid #22c55e;">
            <div style="font-size: 2.5rem; font-weight: bold; color: #166534;">${available}</div>
            <div style="color: #166534;">Disponibles 🟢</div>
        </div>
        <div style="background: #fef9c3; padding: 1.5rem; border-radius: var(--radius); text-align: center; border-left: 4px solid #eab308;">
            <div style="font-size: 2.5rem; font-weight: bold; color: #854d0e;">${progress}</div>
            <div style="color: #854d0e;">En proceso 🟡</div>
        </div>
        <div style="background: #fee2e2; padding: 1.5rem; border-radius: var(--radius); text-align: center; border-left: 4px solid #ef4444;">
            <div style="font-size: 2.5rem; font-weight: bold; color: #991b1b;">${closed}</div>
            <div style="color: #991b1b;">Cerrados 🔴</div>
        </div>
    `;
}

// ============================================
// FORMULARIO - NUEVO/EDITAR
// ============================================
function showNewJobForm() {
    editMode = false;
    currentJobId = null;
    document.getElementById('formTitle').innerHTML = '<i class="fas fa-plus-circle"></i> Nuevo Trabajo';
    document.getElementById('jobForm').style.display = 'block';
    clearForm();
    document.getElementById('jobForm').scrollIntoView({ behavior: 'smooth' });
}

function editJob(index) {
    editMode = true;
    currentJobId = index;
    const job = jobs[index];
    
    document.getElementById('formTitle').innerHTML = '<i class="fas fa-edit"></i> Editar Trabajo';
    document.getElementById('jobForm').style.display = 'block';
    
    // Llenar campos
    document.getElementById('editJobId').value = index;
    document.getElementById('jobTitle').value = job.title || '';
    document.getElementById('jobCategory').value = job.category || '';
    document.getElementById('jobLocation').value = job.location || '';
    document.getElementById('jobPrice').value = job.price || '';
    document.getElementById('jobDate').value = job.date || '';
    document.getElementById('jobTime').value = job.time || '';
    document.getElementById('jobStatus').value = job.status || 'available';
    document.getElementById('jobCode').value = job.code || '';
    document.getElementById('jobDescription').value = job.description || '';
    
    // Contactos
    document.getElementById('contactPhone').value = job.contact?.phone || '';
    document.getElementById('contactWhatsapp').value = job.contact?.whatsapp || '';
    document.getElementById('contactEmail').value = job.contact?.email || '';
    document.getElementById('contactWebsite').value = job.contact?.website || '';
    document.getElementById('contactPreferred').value = job.contact?.preferred || '';
    
    document.getElementById('jobForm').scrollIntoView({ behavior: 'smooth' });
}

function cancelForm() {
    document.getElementById('jobForm').style.display = 'none';
    clearForm();
}

function clearForm() {
    document.getElementById('editJobId').value = '';
    document.querySelectorAll('#jobForm input, #jobForm textarea, #jobForm select').forEach(el => {
        if (el.type !== 'hidden' && el.type !== 'submit') {
            el.value = '';
        }
    });
}

// ============================================
// GUARDAR TRABAJO
// ============================================
function saveJob() {
    // Recolectar datos
    const jobData = {
        title: document.getElementById('jobTitle').value.trim(),
        category: document.getElementById('jobCategory').value,
        location: document.getElementById('jobLocation').value.trim(),
        price: document.getElementById('jobPrice').value.trim(),
        date: document.getElementById('jobDate').value,
        time: document.getElementById('jobTime').value,
        status: document.getElementById('jobStatus').value,
        code: document.getElementById('jobCode').value.trim() || generateJobCode(),
        description: document.getElementById('jobDescription').value.trim(),
        contact: {
            phone: document.getElementById('contactPhone').value.trim(),
            whatsapp: document.getElementById('contactWhatsapp').value.trim(),
            email: document.getElementById('contactEmail').value.trim(),
            website: document.getElementById('contactWebsite').value.trim(),
            preferred: document.getElementById('contactPreferred').value
        },
        views: 0,
        created_at: new Date().toISOString()
    };
    
    // Validar campos obligatorios
    if (!jobData.title || !jobData.location || !jobData.description) {
        alert('⚠️ Por favor llena todos los campos obligatorios: Título, Ubicación y Descripción.');
        return;
    }
    
    // Al menos un método de contacto
    const hasContact = jobData.contact.phone || jobData.contact.whatsapp || 
                       jobData.contact.email || jobData.contact.website;
    if (!hasContact) {
        alert('⚠️ Por favor agrega al menos un método de contacto.');
        return;
    }
    
    const editIndex = document.getElementById('editJobId').value;
    if (editIndex !== '') {
        // Editar existente
        const index = parseInt(editIndex);
        jobData.id = jobs[index].id;
        jobData.created_at = jobs[index].created_at;
        jobs[index] = jobData;
    } else {
        // Nuevo trabajo
        jobData.id = Date.now();
        jobs.push(jobData);
    }
    
    // Guardar
    saveToLocalStorage();
    renderJobsList();
    updateStats();
    cancelForm();
    
    alert('✅ Trabajo guardado exitosamente');
}

// ============================================
// ELIMINAR TRABAJO
// ============================================
function deleteJob(index) {
    const job = jobs[index];
    if (confirm(`¿Estás seguro de eliminar el trabajo: "${job.title}"?`)) {
        jobs.splice(index, 1);
        saveToLocalStorage();
        renderJobsList();
        updateStats();
        alert('✅ Trabajo eliminado');
    }
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================
function generateJobCode() {
    const year = new Date().getFullYear();
    const count = jobs.length + 1;
    return `MX-${year}-${String(count).padStart(3, '0')}`;
}

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

// ============================================
// ALMACENAMIENTO LOCAL
// ============================================
function saveToLocalStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    } catch (error) {
        console.error('Error guardando en localStorage:', error);
    }
}

// ============================================
// EXPORTAR JSON
// ============================================
function exportJobs() {
    if (jobs.length === 0) {
        alert('⚠️ No hay trabajos para exportar');
        return;
    }
    
    const blob = new Blob([JSON.stringify(jobs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trabajos_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// ============================================
// ACTUALIZAR
// ============================================
function refreshJobs() {
    loadJobsAdmin();
    alert('✅ Trabajos actualizados');
}

// ============================================
// DATOS DE EJEMPLO
// ============================================
function getSampleJobs() {
    return [
        {
            id: Date.now(),
            title: "Reparación de PC e instalación de redes",
            category: "💻 Sistemas",
            location: "CDMX, Roma Norte",
            price: "$500 MXN",
            date: new Date().toISOString().split('T')[0],
            time: "14:00",
            status: "available",
            code: "MX-2026-001",
            description: "Se necesita técnico para revisar 5 PCs con problemas de rendimiento e instalar cableado de red en oficina pequeña.",
            contact: {
                phone: "5512345678",
                whatsapp: "5512345678",
                email: "empresa@ejemplo.com",
                website: "https://ejemplo.com",
                preferred: "whatsapp"
            },
            views: 0,
            created_at: new Date().toISOString()
        },
        {
            id: Date.now() + 1,
            title: "Instalación de contactos y lámparas",
            category: "⚡ Electricista",
            location: "GDL, Centro",
            price: "$800 MXN",
            date: new Date().toISOString().split('T')[0],
            time: "10:00",
            status: "available",
            code: "MX-2026-002",
            description: "Instalación de 4 contactos nuevos y 3 lámparas LED en departamento remodelado.",
            contact: {
                phone: "3312345678",
                whatsapp: "3312345678",
                email: null,
                website: null,
                preferred: "phone"
            },
            views: 0,
            created_at: new Date().toISOString()
        }
    ];
}

// ============================================
// INICIALIZAR
// ============================================
// Si la página se carga con el panel visible, cargar datos
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya está autenticado (usando sessionStorage)
    const isLoggedIn = sessionStorage.getItem('maestromx_admin_logged');
    if (isLoggedIn === 'true') {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadJobsAdmin();
    }
});

// Guardar estado de sesión al loguearse
const originalLogin = loginAdmin;
loginAdmin = function() {
    originalLogin();
    if (document.getElementById('adminPanel').style.display !== 'none') {
        sessionStorage.setItem('maestromx_admin_logged', 'true');
    }
};

// Cerrar sesión y limpiar estado
const originalLogout = logoutAdmin;
logoutAdmin = function() {
    originalLogout();
    sessionStorage.removeItem('maestromx_admin_logged');
};