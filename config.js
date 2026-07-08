// config.js - Configuración global del sitio MaestroMX
// ============================================================
// INSTRUCCIONES: 
// 1. Cambia los valores según tu región y preferencias
// 2. La contraseña de admin es CRÍTICA - cámbiala en producción
// 3. Los colores siguen la paleta naranja/blanco (puedes modificarla)
// ============================================================

const CONFIG = {
    // ============================================
    // INFORMACIÓN DEL SITIO
    // ============================================
    siteName: 'MaestroMX',
    siteSlogan: 'Conectamos talento local con oportunidades',
    siteDescription: 'Encuentra trabajos de oficios verificados cerca de ti',
    siteKeywords: 'trabajos, handyman, electricista, plomero, técnico, méxico',
    siteUrl: 'https://maestromx.com', // Cambia por tu dominio
    siteYear: new Date().getFullYear(),
    
    // ============================================
    // CONFIGURACIÓN REGIONAL
    // ============================================
    region: {
        country: 'México',
        countryCode: '52', // Código de país para teléfonos
        currency: 'MXN',
        currencySymbol: '$',
        locale: 'es-MX',
        timezone: 'America/Mexico_City',
        dateFormat: 'YYYY-MM-DD',
        phoneFormat: '##-####-####', // Formato de teléfono local
    },
    
    // ============================================
    // SEGURIDAD - CONTRASEÑA ADMIN (¡CAMBIA ESTO!)
    // ============================================
    admin: {
        password: 'maestromx2026', // 🔴 CAMBIA ESTA CONTRASEÑA EN PRODUCCIÓN
        email: 'admin@maestromx.com',
        phone: '5512345678',
        sessionTimeout: 3600, // Segundos (1 hora)
    },
    
    // ============================================
    // CATEGORÍAS DE TRABAJOS
    // ============================================
    categories: [
        { id: 'sistemas', icon: '💻', label: 'Sistemas', color: '#3b82f6' },
        { id: 'electricista', icon: '⚡', label: 'Electricista', color: '#f59e0b' },
        { id: 'plomero', icon: '🔧', label: 'Plomero', color: '#06b6d4' },
        { id: 'mueblero', icon: '🪚', label: 'Mueblero', color: '#8b5cf6' },
        { id: 'ferretero', icon: '🔩', label: 'Ferretero', color: '#6b7280' },
        { id: 'handyman', icon: '🛠️', label: 'Handyman General', color: '#ef4444' },
        { id: 'jardinero', icon: '🌿', label: 'Jardinero', color: '#22c55e' },
        { id: 'pintor', icon: '🎨', label: 'Pintor', color: '#ec4899' },
        { id: 'carpintero', icon: '🪵', label: 'Carpintero', color: '#d97706' },
        { id: 'limpieza', icon: '🧹', label: 'Limpieza', color: '#14b8a6' },
        { id: 'albañil', icon: '🧱', label: 'Albañil', color: '#92400e' },
        { id: 'cerrajero', icon: '🔑', label: 'Cerrajero', color: '#78716c' },
        { id: 'jardinero', icon: '🌱', label: 'Jardinería', color: '#16a34a' },
        { id: 'reparaciones', icon: '🔨', label: 'Reparaciones Generales', color: '#ea580c' },
        { id: 'transporte', icon: '🚚', label: 'Transporte/Mudanzas', color: '#2563eb' },
        { id: 'cocina', icon: '🍳', label: 'Cocina/Catering', color: '#db2777' },
    ],
    
    // ============================================
    // UBICACIONES (Ciudades/Estados de México)
    // ============================================
    locations: [
        'CDMX',
        'Guadalajara',
        'Monterrey',
        'Puebla',
        'Querétaro',
        'León',
        'Toluca',
        'Tijuana',
        'Ciudad Juárez',
        'Cancún',
        'Mérida',
        'San Luis Potosí',
        'Aguascalientes',
        'Morelia',
        'Hermosillo',
        'Saltillo',
        'Mexicali',
        'Culiacán',
        'Acapulco',
        'Chihuahua',
        'Oaxaca',
        'Veracruz',
        'Villahermosa',
        'Cuernavaca',
        'Zacatecas',
        'Durango',
        'Tepic',
        'Colima',
        'Chetumal',
        'Tuxtla Gutiérrez',
    ],
    
    // ============================================
    // CONTACTO DEL ADMINISTRADOR
    // ============================================
    adminContact: {
        name: 'Administrador MaestroMX',
        phone: '55-1234-5678',
        email: 'admin@maestromx.com',
        whatsapp: 'https://wa.me/525512345678',
        facebook: 'https://facebook.com/maestromx',
        twitter: 'https://twitter.com/maestromx',
        instagram: 'https://instagram.com/maestromx',
    },
    
    // ============================================
    // REDES SOCIALES
    // ============================================
    social: {
        facebook: 'https://facebook.com/maestromx',
        twitter: 'https://twitter.com/maestromx',
        instagram: 'https://instagram.com/maestromx',
        youtube: 'https://youtube.com/maestromx',
        linkedin: 'https://linkedin.com/company/maestromx',
    },
    
    // ============================================
    // PALETA DE COLORES (Naranja/Blanco)
    // ============================================
    colors: {
        primary: '#FF7F00',
        primaryDark: '#E65C00',
        primaryLight: '#FFA500',
        primaryGradient: 'linear-gradient(135deg, #FF7F00 0%, #FFA500 100%)',
        white: '#FFFFFF',
        grayLight: '#F4F4F4',
        gray: '#666666',
        grayDark: '#333333',
        textDark: '#333333',
        textLight: '#666666',
        success: '#22c55e',
        successLight: '#dcfce7',
        warning: '#eab308',
        warningLight: '#fef9c3',
        danger: '#ef4444',
        dangerLight: '#fee2e2',
        info: '#3b82f6',
        infoLight: '#dbeafe',
    },
    
    // ============================================
    // CONFIGURACIÓN DE SEGURIDAD
    // ============================================
    security: {
        // Protección de contactos
        contactProtection: {
            enabled: false, // 🔴 Cambiar a true cuando implementes SMS
            codeExpiry: 300, // Segundos (5 minutos)
            maxAttempts: 3,
            cooldown: 3600, // Segundos (1 hora)
            maxRequestsPerDay: 10,
            maxViewsPerJob: 50,
        },
        
        // Protección contra bots
        botProtection: {
            enabled: false, // 🔴 Cambiar a true para activar reCAPTCHA
            recaptchaSiteKey: '', // Obtener de Google reCAPTCHA
            recaptchaSecretKey: '',
            minScore: 0.5,
        },
        
        // Límites de tasa (rate limiting)
        rateLimits: {
            maxRequestsPerMinute: 60,
            maxApiRequestsPerHour: 1000,
            maxJobViewsPerHour: 100,
        },
        
        // Lista negra de IPs (para bloquear manualmente)
        blockedIPs: [
            // '192.168.1.100', // Ejemplo
        ],
        
        // Whitelist de IPs (para acceso admin)
        adminWhitelist: [
            // '192.168.1.1', // Ejemplo - solo estas IPs pueden acceder al admin
        ],
    },
    
    // ============================================
    // MÉTODOS DE CONTACTO PERMITIDOS
    // ============================================
    contactMethods: {
        phone: {
            enabled: true,
            label: '📱 Teléfono',
            icon: 'fa-phone',
        },
        whatsapp: {
            enabled: true,
            label: '💬 WhatsApp',
            icon: 'fa-whatsapp',
        },
        email: {
            enabled: true,
            label: '✉️ Email',
            icon: 'fa-envelope',
        },
        website: {
            enabled: true,
            label: '🌐 Sitio Web',
            icon: 'fa-globe',
        },
        telegram: {
            enabled: false,
            label: '📨 Telegram',
            icon: 'fa-telegram',
        },
        signal: {
            enabled: false,
            label: '🔒 Signal',
            icon: 'fa-signal',
        },
    },
    
    // ============================================
    // CONFIGURACIÓN DE NOTIFICACIONES
    // ============================================
    notifications: {
        email: {
            enabled: true,
            from: 'noreply@maestromx.com',
            adminEmail: 'admin@maestromx.com',
        },
        sms: {
            enabled: false, // 🔴 Cambiar a true cuando tengas Twilio
            provider: 'twilio',
            accountSid: '',
            authToken: '',
            phoneNumber: '',
        },
        whatsapp: {
            enabled: true,
            businessPhone: '5512345678',
        },
    },
    
    // ============================================
    // CONFIGURACIÓN DE ALMACENAMIENTO
    // ============================================
    storage: {
        type: 'local', // 'local' | 'firebase' | 'supabase'
        dataFile: 'data/trabajos.json',
        backupInterval: 86400, // Segundos (24 horas)
        maxBackups: 7,
    },
    
    // ============================================
    // CONFIGURACIÓN DE ANALÍTICAS
    // ============================================
    analytics: {
        enabled: false, // 🔴 Cambiar a true cuando tengas Google Analytics
        googleAnalyticsId: '',
        facebookPixelId: '',
        enableHeatmaps: false,
    },
    
    // ============================================
    // CONFIGURACIÓN DE SEO
    // ============================================
    seo: {
        title: 'MaestroMX - Trabajos de oficios verificados',
        description: 'Encuentra electricistas, plomeros, técnicos y más en tu ciudad. Trabajos verificados y 100% gratuitos.',
        ogImage: 'https://maestromx.com/assets/og-image.jpg',
        twitterCard: 'summary_large_image',
        robots: 'index, follow',
        canonical: 'https://maestromx.com',
    },
    
    // ============================================
    // CONFIGURACIÓN DE INTERFAZ
    // ============================================
    ui: {
        showHero: true,
        showStats: true,
        showCategories: true,
        showFooter: true,
        jobsPerPage: 20,
        defaultSort: 'newest', // 'newest' | 'oldest' | 'price_asc' | 'price_desc'
        enableInfiniteScroll: false,
        enableDarkMode: false,
        animations: true,
    },
    
    // ============================================
    // CONFIGURACIÓN DE INTEGRACIONES
    // ============================================
    integrations: {
        payment: {
            enabled: false,
            provider: 'mercadopago', // 'mercadopago' | 'stripe' | 'paypal'
            publicKey: '',
            secretKey: '',
        },
        maps: {
            enabled: false,
            provider: 'google', // 'google' | 'openstreetmap'
            apiKey: '',
        },
        chat: {
            enabled: false,
            provider: 'tawkto', // 'tawkto' | 'chatwoot' | 'custom'
            widgetId: '',
        },
    },
};

// ============================================
// FUNCIONES DE UTILIDAD PARA CONFIG
// ============================================

// Obtener categoría por ID
function getCategoryById(id) {
    return CONFIG.categories.find(cat => cat.id === id) || null;
}

// Obtener categoría por label
function getCategoryByLabel(label) {
    return CONFIG.categories.find(cat => cat.label === label) || null;
}

// Obtener todas las categorías como array de strings
function getCategoryLabels() {
    return CONFIG.categories.map(cat => cat.label);
}

// Obtener categorías con íconos para UI
function getCategoriesWithIcons() {
    return CONFIG.categories.map(cat => ({
        ...cat,
        display: `${cat.icon} ${cat.label}`
    }));
}

// Verificar si una IP está bloqueada
function isIPBlocked(ip) {
    return CONFIG.security.blockedIPs.includes(ip);
}

// Verificar si una IP está en whitelist
function isIPInWhitelist(ip) {
    if (CONFIG.security.adminWhitelist.length === 0) return true;
    return CONFIG.security.adminWhitelist.includes(ip);
}

// Obtener método de contacto por ID
function getContactMethod(id) {
    return CONFIG.contactMethods[id] || null;
}

// Obtener métodos de contacto habilitados
function getEnabledContactMethods() {
    const methods = {};
    Object.keys(CONFIG.contactMethods).forEach(key => {
        if (CONFIG.contactMethods[key].enabled) {
            methods[key] = CONFIG.contactMethods[key];
        }
    });
    return methods;
}

// ============================================
// EXPORTAR PARA DIFERENTES ENTORNOS
// ============================================

// Para uso en navegador (window)
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
    window.getCategoryById = getCategoryById;
    window.getCategoryByLabel = getCategoryByLabel;
    window.getCategoryLabels = getCategoryLabels;
    window.getCategoriesWithIcons = getCategoriesWithIcons;
    window.isIPBlocked = isIPBlocked;
    window.isIPInWhitelist = isIPInWhitelist;
    window.getContactMethod = getContactMethod;
    window.getEnabledContactMethods = getEnabledContactMethods;
}

// Para uso en Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        getCategoryById,
        getCategoryByLabel,
        getCategoryLabels,
        getCategoriesWithIcons,
        isIPBlocked,
        isIPInWhitelist,
        getContactMethod,
        getEnabledContactMethods,
    };
}