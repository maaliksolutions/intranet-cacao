// ============================================
// Cacao San José - Intranet JavaScript
// ============================================

// Simulación de datos
const mockData = {
    user: {
        name: 'Ravit Maalik',
        role: 'Administrator',
        groups: ['Administrators', 'Therefore Users']
    }
};

// ============================================
// Login Functionality
// ============================================

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Simulación de login
    console.log('Login attempt:', { username, remember });
    
    // Simulación de validación (en producción esto sería LDAP)
    if (username && password) {
        // Guardar sesión
        if (remember) {
            localStorage.setItem('intranet_session', JSON.stringify({
                username: username,
                loginTime: new Date().toISOString()
            }));
        } else {
            sessionStorage.setItem('intranet_session', JSON.stringify({
                username: username,
                loginTime: new Date().toISOString()
            }));
        }
        
        // Mostrar loading
        const btn = event.target.querySelector('.btn-login');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Validando...';
        
        // Simular delay y redireccionar
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        alert('Por favor ingresa usuario y contraseña');
    }
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// ============================================
// Dashboard Functionality
// ============================================

function openApp(url) {
    if (url === '#') {
        alert('Esta aplicación estará disponible próximamente');
        return;
    }
    
    // Registrar acceso (en producción esto iría a la BD)
    logAccess(url);
    
    // Abrir en nueva pestaña
    window.open(url, '_blank');
}

function logAccess(url) {
    const access = {
        url: url,
        timestamp: new Date().toISOString(),
        user: mockData.user.name
    };
    
    console.log('Access logged:', access);
    
    // Guardar en localStorage para demo
    const logs = JSON.parse(localStorage.getItem('access_logs') || '[]');
    logs.push(access);
    localStorage.setItem('access_logs', JSON.stringify(logs.slice(-100))); // Mantener últimos 100
}

function logout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        localStorage.removeItem('intranet_session');
        sessionStorage.removeItem('intranet_session');
        window.location.href = 'login.html';
    }
}

// ============================================
// Search Functionality
// ============================================

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        if (query.length < 2) {
            showAllCards();
            return;
        }
        
        filterCards(query);
    });
}

function showAllCards() {
    const cards = document.querySelectorAll('.option-card');
    const sections = document.querySelectorAll('.category-section');
    
    cards.forEach(card => {
        card.style.display = 'flex';
    });
    
    sections.forEach(section => {
        section.style.display = 'block';
    });
}

function filterCards(query) {
    const cards = document.querySelectorAll('.option-card');
    const sections = document.querySelectorAll('.category-section');
    
    // Ocultar todo primero
    cards.forEach(card => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(query) || description.includes(query)) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.3s';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Ocultar secciones sin resultados
    sections.forEach(section => {
        const visibleCards = section.querySelectorAll('.option-card[style*="display: flex"]');
        if (visibleCards.length === 0) {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });
}

// ============================================
// Admin Panel Functionality
// ============================================

function showTab(tabName) {
    // Ocultar todos los tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Desactivar botones
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar tab seleccionado
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Activar botón
    event.target.classList.add('active');
}

function openModal(modalType) {
    switch(modalType) {
        case 'newOption':
            alert('Modal: Nueva Opción\n\nEn la versión completa, aquí se abrirá un formulario para:\n- Título\n- Descripción\n- URL\n- Icono\n- Categoría\n- Color');
            break;
        case 'newCategory':
            alert('Modal: Nueva Categoría\n\nEn la versión completa, aquí se abrirá un formulario para:\n- Nombre\n- Descripción\n- Icono\n- Color\n- Orden');
            break;
        default:
            alert('Modal: ' + modalType);
    }
}

function syncGroups() {
    const btn = event.target;
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sincronizando...';
    btn.disabled = true;
    
    // Simular sincronización
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> ¡Sincronizado!';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            
            alert('Grupos sincronizados desde Active Directory\n\n- Administradores (5 usuarios)\n- Therefore Users (45 usuarios)\n- RRHH (12 usuarios)\n- Finanzas (8 usuarios)');
        }, 1500);
    }, 2000);
}

// ============================================
// Session Check
// ============================================

function isLoginPage() {
    return document.body.classList.contains('login-page');
}

function checkSession() {
    // Si estoy en la página de login, nunca redirijo
    if (isLoginPage()) {
        return;
    }

    const session = localStorage.getItem('intranet_session') || 
                    sessionStorage.getItem('intranet_session');

    if (!session) {
        // No hay sesión, redirigir a login
        window.location.href = '/login.html';
    }
}


// ============================================
// Welcome Message
// ============================================

function updateWelcomeMessage() {
    const welcomeSection = document.querySelector('.welcome-section h2');
    if (!welcomeSection) return;
    
    const session = JSON.parse(
        localStorage.getItem('intranet_session') || 
        sessionStorage.getItem('intranet_session') || 
        '{}'
    );
    
    if (session.username) {
        const firstName = session.username.split('.')[0];
        const capitalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        welcomeSection.textContent = `Bienvenido, ${capitalizedName}`;
    }
}

// ============================================
// Statistics (for demo)
// ============================================

function generateMockStatistics() {
    const stats = {
        totalAccesses: Math.floor(Math.random() * 1000) + 500,
        activeUsers: Math.floor(Math.random() * 50) + 20,
        mostUsedApp: 'Therefore Web',
        lastSync: new Date().toLocaleString()
    };
    
    console.log('System Statistics:', stats);
    return stats;
}

// ============================================
// Modal Management
// ============================================

function openModal(modalType, data = null) {
    let modalId;
    
    switch(modalType) {
        case 'newOption':
            modalId = 'modalOption';
            document.getElementById('modalOptionTitle').textContent = 'Nueva Opción';
            document.getElementById('formOption').reset();
            document.getElementById('optionId').value = '';
            break;
            
        case 'editOption':
            modalId = 'modalOption';
            document.getElementById('modalOptionTitle').textContent = 'Editar Opción';
            if (data) populateOptionForm(data);
            break;
            
        case 'newCategory':
            modalId = 'modalCategory';
            document.getElementById('modalCategoryTitle').textContent = 'Nueva Categoría';
            document.getElementById('formCategory').reset();
            document.getElementById('categoryId').value = '';
            break;
            
        case 'editCategory':
            modalId = 'modalCategory';
            document.getElementById('modalCategoryTitle').textContent = 'Editar Categoría';
            if (data) populateCategoryForm(data);
            break;
            
        case 'permissions':
            modalId = 'modalPermissions';
            if (data) {
                document.getElementById('permissionsGroupName').textContent = data.groupName;
                document.getElementById('permissionsGroupId').value = data.groupId;
                loadGroupPermissions(data.groupId);
            }
            break;
            
        default:
            console.warn('Unknown modal type:', modalType);
            return;
    }
    
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function populateOptionForm(data) {
    document.getElementById('optionId').value = data.id || '';
    document.getElementById('optionTitle').value = data.title || '';
    document.getElementById('optionCategory').value = data.categoryId || '';
    document.getElementById('optionDescription').value = data.description || '';
    document.getElementById('optionUrl').value = data.url || '';
    document.getElementById('optionIcon').value = data.icon || '';
    document.getElementById('optionColor').value = data.color || '#667eea';
    document.getElementById('optionColorText').value = data.color || '#667eea';
    document.getElementById('optionImage').value = data.image || '';
    document.getElementById('optionOrder').value = data.order || 0;
    document.getElementById('optionNewWindow').checked = data.newWindow !== false;
    document.getElementById('optionActive').checked = data.active !== false;
}

function populateCategoryForm(data) {
    document.getElementById('categoryId').value = data.id || '';
    document.getElementById('categoryName').value = data.name || '';
    document.getElementById('categoryDescription').value = data.description || '';
    document.getElementById('categoryIcon').value = data.icon || '';
    document.getElementById('categoryColor').value = data.color || '#2C3E50';
    document.getElementById('categoryColorText').value = data.color || '#2C3E50';
    document.getElementById('categoryOrder').value = data.order || 0;
    document.getElementById('categoryActive').checked = data.active !== false;
}

function loadGroupPermissions(groupId) {
    // Simulación de carga de permisos
    // En producción, esto vendría de la BD
    const mockPermissions = {
        1: [1, 2, 3], // Administradores tienen acceso a opciones 1, 2, 3
        2: [1], // Therefore Users solo tienen acceso a opción 1
        3: [6, 7] // RRHH tiene acceso a opciones 6, 7
    };
    
    const permissions = mockPermissions[groupId] || [];
    
    // Desmarcar todos
    document.querySelectorAll('.permission-item input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Marcar los permisos del grupo
    permissions.forEach(permId => {
        const checkbox = document.querySelector(`.permission-item input[value="${permId}"]`);
        if (checkbox) checkbox.checked = true;
    });
}

// ============================================
// Form Handlers
// ============================================

function handleSaveOption(event) {
    event.preventDefault();
    
    const optionData = {
        id: document.getElementById('optionId').value,
        title: document.getElementById('optionTitle').value,
        categoryId: document.getElementById('optionCategory').value,
        description: document.getElementById('optionDescription').value,
        url: document.getElementById('optionUrl').value,
        icon: document.getElementById('optionIcon').value,
        color: document.getElementById('optionColor').value,
        image: document.getElementById('optionImage').value,
        order: document.getElementById('optionOrder').value,
        newWindow: document.getElementById('optionNewWindow').checked,
        active: document.getElementById('optionActive').checked
    };
    
    console.log('Saving option:', optionData);
    
    // Simular guardado
    setTimeout(() => {
        showNotification('success', optionData.id ? 'Opción actualizada correctamente' : 'Opción creada correctamente');
        closeModal('modalOption');
        
        // En producción, aquí recargarías la tabla
    }, 500);
}

function handleSaveCategory(event) {
    event.preventDefault();
    
    const categoryData = {
        id: document.getElementById('categoryId').value,
        name: document.getElementById('categoryName').value,
        description: document.getElementById('categoryDescription').value,
        icon: document.getElementById('categoryIcon').value,
        color: document.getElementById('categoryColor').value,
        order: document.getElementById('categoryOrder').value,
        active: document.getElementById('categoryActive').checked
    };
    
    console.log('Saving category:', categoryData);
    
    // Simular guardado
    setTimeout(() => {
        showNotification('success', categoryData.id ? 'Categoría actualizada correctamente' : 'Categoría creada correctamente');
        closeModal('modalCategory');
    }, 500);
}

function handleSavePermissions(event) {
    event.preventDefault();
    
    const groupId = document.getElementById('permissionsGroupId').value;
    const selectedPermissions = [];
    
    document.querySelectorAll('.permission-item input[type="checkbox"]:checked').forEach(cb => {
        selectedPermissions.push(cb.value);
    });
    
    console.log('Saving permissions for group', groupId, ':', selectedPermissions);
    
    // Simular guardado
    setTimeout(() => {
        showNotification('success', `Permisos actualizados: ${selectedPermissions.length} opciones asignadas`);
        closeModal('modalPermissions');
    }, 500);
}

// ============================================
// Delete Confirmation
// ============================================

let deleteCallback = null;

function confirmDelete(type, id, name) {
    const modal = document.getElementById('modalConfirm');
    const title = document.getElementById('modalConfirmTitle');
    const message = document.getElementById('modalConfirmMessage');
    
    title.textContent = `Eliminar ${type}`;
    message.textContent = `¿Estás seguro de eliminar "${name}"?`;
    
    deleteCallback = () => {
        console.log(`Deleting ${type} with id:`, id);
        
        // Simular eliminación
        setTimeout(() => {
            showNotification('success', `${type} eliminado correctamente`);
            closeModal('modalConfirm');
            deleteCallback = null;
        }, 500);
    };
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function confirmAction() {
    if (deleteCallback) {
        deleteCallback();
    }
}

// ============================================
// Notifications
// ============================================

function showNotification(type, message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Agregar estilos inline si no existen en CSS
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ============================================
// Color Picker Sync
// ============================================

function initColorPickers() {
    // Sincronizar color picker con input de texto
    const syncColorPicker = (colorInput, textInput) => {
        if (!colorInput || !textInput) return;
        
        colorInput.addEventListener('input', (e) => {
            textInput.value = e.target.value;
        });
        
        textInput.addEventListener('input', (e) => {
            if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                colorInput.value = e.target.value;
            }
        });
    };
    
    syncColorPicker(
        document.getElementById('optionColor'),
        document.getElementById('optionColorText')
    );
    
    syncColorPicker(
        document.getElementById('categoryColor'),
        document.getElementById('categoryColorText')
    );
}

// ============================================
// Category Checkboxes
// ============================================

function initCategoryCheckboxes() {
    const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
    
    categoryCheckboxes.forEach(catCheckbox => {
        catCheckbox.addEventListener('change', (e) => {
            const category = e.target.dataset.category;
            const itemCheckboxes = document.querySelectorAll(`.permission-item input[data-category="${category}"]`);
            
            itemCheckboxes.forEach(itemCb => {
                itemCb.checked = e.target.checked;
            });
        });
    });
}

// ============================================
// Permissions Search
// ============================================

function initPermissionsSearch() {
    const searchInput = document.getElementById('permissionsSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const items = document.querySelectorAll('.permission-item');
        
        items.forEach(item => {
            const title = item.querySelector('strong').textContent.toLowerCase();
            const description = item.querySelector('span').textContent.toLowerCase();
            
            if (title.includes(query) || description.includes(query)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Mostrar/ocultar categorías vacías
        document.querySelectorAll('.permission-category').forEach(category => {
            const visibleItems = category.querySelectorAll('.permission-item[style*="display: flex"]');
            category.style.display = visibleItems.length > 0 ? 'block' : 'none';
        });
    });
}

// ============================================
// Quick Edit Actions
// ============================================

function quickEditOption(id) {
    // Simulación de datos
    const mockData = {
        id: id,
        title: 'Therefore Web',
        categoryId: '1',
        description: 'Sistema de gestión documental',
        url: 'https://therefore.cacaosanjose.com',
        icon: 'fas fa-folder-open',
        color: '#667eea',
        order: 1,
        newWindow: true,
        active: true
    };
    
    openModal('editOption', mockData);
}

function quickEditCategory(id) {
    const mockData = {
        id: id,
        name: 'Sistema',
        description: 'Aplicaciones principales del sistema',
        icon: 'fas fa-cog',
        color: '#2C3E50',
        order: 1,
        active: true
    };
    
    openModal('editCategory', mockData);
}

function configureGroupPermissions(groupId, groupName) {
    openModal('permissions', {
        groupId: groupId,
        groupName: groupName
    });
}

// ============================================
// Close modal on ESC key
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            closeModal(activeModal.id);
        }
    }
});

// ============================================
// Initialize on Load
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌱 Intranet Cacao San José - Prototipo v1.0');
    
    // Check session
    checkSession();
    
    // Initialize search
    initSearch();
    
    // Update welcome message
    updateWelcomeMessage();
    
    // Initialize color pickers
    initColorPickers();
    
    // Initialize category checkboxes
    initCategoryCheckboxes();
    
    // Initialize permissions search
    initPermissionsSearch();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K para búsqueda
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // ESC para limpiar búsqueda
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('searchInput');
            if (searchInput && searchInput.value) {
                searchInput.value = '';
                showAllCards();
            }
        }
    });
    
    // Mostrar stats en consola
    if (!window.location.pathname.includes('login.html')) {
        setTimeout(() => {
            generateMockStatistics();
        }, 1000);
    }
});

// ============================================
// Service Worker (para PWA en el futuro)
// ============================================

if ('serviceWorker' in navigator) {
    // Comentado para el prototipo
    // navigator.serviceWorker.register('/sw.js');
}

// ============================================
// Utility Functions
// ============================================

function formatDate(date) {
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// Export para testing (opcional)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleLogin,
        openApp,
        logout,
        showTab,
        openModal,
        closeModal,
        handleSaveOption,
        handleSaveCategory,
        handleSavePermissions
    };
}
