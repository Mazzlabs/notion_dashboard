/**
 * Academic Management Dashboard - Main JavaScript Module
 * Shared utilities and functionality across the application
 */

// Global app configuration
window.AcademicApp = {
    apiBase: '/api',
    version: '1.0.0',
    debug: true
};

// Utility functions
const Utils = {
    /**
     * Format date for display
     */
    formatDate(dateString, options = {}) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            ...options
        });
    },

    /**
     * Get relative date string (e.g., "2 days ago", "in 3 days")
     */
    getRelativeDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = date - now;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            const absDays = Math.abs(diffDays);
            if (absDays === 1) return 'Yesterday';
            return `${absDays} days ago`;
        } else if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Tomorrow';
        } else if (diffDays <= 7) {
            return `In ${diffDays} days`;
        } else {
            return this.formatDate(dateString);
        }
    },

    /**
     * Debounce function calls
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function calls
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    /**
     * Generate unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Local storage helpers
     */
    storage: {
        get(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.warn('Failed to parse localStorage item:', key);
                return null;
            }
        },

        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn('Failed to set localStorage item:', key);
                return false;
            }
        },

        remove(key) {
            localStorage.removeItem(key);
        }
    },

    /**
     * Color helpers for status and priority
     */
    getStatusColor(status) {
        const colors = {
            'Not Started': 'gray',
            'In Progress': 'blue',
            'Completed': 'green',
            'Overdue': 'red',
            'On Hold': 'yellow'
        };
        return colors[status] || 'gray';
    },

    getPriorityColor(priority) {
        const colors = {
            'Low': 'green',
            'Medium': 'yellow',
            'High': 'orange',
            'Urgent': 'red'
        };
        return colors[priority] || 'gray';
    },

    /**
     * Progress calculation helpers
     */
    calculateProgress(completed, total) {
        if (total === 0) return 0;
        return Math.round((completed / total) * 100);
    },

    /**
     * Validation helpers
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    },

    /**
     * API helpers
     */
    async apiCall(endpoint, options = {}) {
        const url = `${window.AcademicApp.apiBase}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const config = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }
};

// Toast notification system
const Toast = {
    container: null,

    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'fixed top-4 right-4 z-50 space-y-2';
            document.body.appendChild(this.container);
        }
    },

    show(message, type = 'info', duration = 3000) {
        this.init();

        const toast = document.createElement('div');
        toast.className = `
            max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto
            flex ring-1 ring-black ring-opacity-5 transform transition-all duration-300
            translate-x-full opacity-0
        `;

        const typeColors = {
            success: 'text-green-500',
            error: 'text-red-500',
            warning: 'text-yellow-500',
            info: 'text-blue-500'
        };

        const typeIcons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        toast.innerHTML = `
            <div class="flex-1 w-0 p-4">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <span class="text-lg">${typeIcons[type] || typeIcons.info}</span>
                    </div>
                    <div class="ml-3 flex-1">
                        <p class="text-sm font-medium text-gray-900">${message}</p>
                    </div>
                </div>
            </div>
            <div class="flex border-l border-gray-200">
                <button onclick="this.parentElement.parentElement.remove()" 
                        class="w-full border border-transparent rounded-none rounded-r-lg p-4 
                               flex items-center justify-center text-sm font-medium text-gray-600 
                               hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-turquoise-500">
                    ✕
                </button>
            </div>
        `;

        this.container.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
            toast.classList.add('translate-x-0', 'opacity-100');
        }, 100);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                toast.classList.add('translate-x-full', 'opacity-0');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
    },

    success(message, duration) {
        this.show(message, 'success', duration);
    },

    error(message, duration) {
        this.show(message, 'error', duration);
    },

    warning(message, duration) {
        this.show(message, 'warning', duration);
    },

    info(message, duration) {
        this.show(message, 'info', duration);
    }
};

// Loading state manager
const LoadingManager = {
    overlay: null,

    show(message = 'Loading...') {
        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            this.overlay.innerHTML = `
                <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
                    <div class="loading-spinner"></div>
                    <span class="text-granite-800 font-medium">${message}</span>
                </div>
            `;
        }
        document.body.appendChild(this.overlay);
    },

    hide() {
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
    }
};

// Modal manager
const ModalManager = {
    activeModals: [],

    open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            this.activeModals.push(modalId);
            document.body.style.overflow = 'hidden';
        }
    },

    close(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            this.activeModals = this.activeModals.filter(id => id !== modalId);
            if (this.activeModals.length === 0) {
                document.body.style.overflow = '';
            }
        }
    },

    closeAll() {
        this.activeModals.forEach(modalId => this.close(modalId));
    }
};

// Chart utilities
const ChartUtils = {
    defaultColors: {
        primary: '#20b2aa',
        secondary: '#404040',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6'
    },

    createProgressChart(canvas, data, options = {}) {
        const ctx = canvas.getContext('2d');
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        this.defaultColors.primary,
                        this.defaultColors.secondary,
                        this.defaultColors.success,
                        this.defaultColors.warning,
                        this.defaultColors.danger
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                },
                ...options
            }
        });
    },

    createLineChart(canvas, data, options = {}) {
        const ctx = canvas.getContext('2d');
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: data.label || 'Progress',
                    data: data.values,
                    borderColor: this.defaultColors.primary,
                    backgroundColor: `${this.defaultColors.primary}20`,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                ...options
            }
        });
    }
};

// Form validation
const FormValidator = {
    rules: {
        required: (value) => value.trim() !== '',
        email: (value) => Utils.isValidEmail(value),
        minLength: (value, min) => value.length >= min,
        maxLength: (value, max) => value.length <= max,
        date: (value) => Utils.isValidDate(value),
        number: (value) => !isNaN(parseFloat(value)),
        positive: (value) => parseFloat(value) > 0
    },

    validate(form, rules) {
        const errors = {};
        
        Object.keys(rules).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            const value = field ? field.value : '';
            const fieldRules = rules[fieldName];

            fieldRules.forEach(rule => {
                if (typeof rule === 'string') {
                    if (!this.rules[rule](value)) {
                        errors[fieldName] = errors[fieldName] || [];
                        errors[fieldName].push(`${fieldName} ${rule} validation failed`);
                    }
                } else if (typeof rule === 'object') {
                    const { type, param, message } = rule;
                    if (!this.rules[type](value, param)) {
                        errors[fieldName] = errors[fieldName] || [];
                        errors[fieldName].push(message || `${fieldName} ${type} validation failed`);
                    }
                }
            });
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    },

    showErrors(form, errors) {
        // Clear existing errors
        form.querySelectorAll('.error-message').forEach(el => el.remove());
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

        // Show new errors
        Object.keys(errors).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.classList.add('error');
                const errorEl = document.createElement('div');
                errorEl.className = 'error-message text-red-500 text-sm mt-1';
                errorEl.textContent = errors[fieldName][0];
                field.parentNode.appendChild(errorEl);
            }
        });
    }
};

// Keyboard shortcuts
const KeyboardShortcuts = {
    shortcuts: new Map(),

    register(key, callback, description = '') {
        this.shortcuts.set(key, { callback, description });
    },

    init() {
        document.addEventListener('keydown', (e) => {
            const key = this.getKeyString(e);
            const shortcut = this.shortcuts.get(key);
            
            if (shortcut) {
                e.preventDefault();
                shortcut.callback(e);
            }
        });

        // Register default shortcuts
        this.register('ctrl+/', () => this.showHelp(), 'Show keyboard shortcuts');
        this.register('escape', () => ModalManager.closeAll(), 'Close all modals');
    },

    getKeyString(event) {
        const parts = [];
        
        if (event.ctrlKey) parts.push('ctrl');
        if (event.altKey) parts.push('alt');
        if (event.shiftKey) parts.push('shift');
        if (event.metaKey) parts.push('meta');
        
        parts.push(event.key.toLowerCase());
        
        return parts.join('+');
    },

    showHelp() {
        const shortcuts = Array.from(this.shortcuts.entries())
            .filter(([key, data]) => data.description)
            .map(([key, data]) => `<tr><td class="font-mono">${key}</td><td>${data.description}</td></tr>`)
            .join('');

        const helpContent = `
            <div class="modal-overlay" onclick="this.remove()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h3 class="modal-title">Keyboard Shortcuts</h3>
                        <button onclick="this.closest('.modal-overlay').remove()" 
                                class="text-granite-400 hover:text-granite-600">✕</button>
                    </div>
                    <div class="modal-body">
                        <table class="table">
                            <thead>
                                <tr><th>Shortcut</th><th>Action</th></tr>
                            </thead>
                            <tbody>${shortcuts}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', helpContent);
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize keyboard shortcuts
    KeyboardShortcuts.init();

    // Initialize any global Alpine.js data or functionality
    window.Alpine && Alpine.start();

    // Log app initialization
    if (window.AcademicApp.debug) {
        console.log('Academic Management Dashboard initialized');
    }
});

// Export utilities for use in other modules
window.Utils = Utils;
window.Toast = Toast;
window.LoadingManager = LoadingManager;
window.ModalManager = ModalManager;
window.ChartUtils = ChartUtils;
window.FormValidator = FormValidator;
window.KeyboardShortcuts = KeyboardShortcuts;
