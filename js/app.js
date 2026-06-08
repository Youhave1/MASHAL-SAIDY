// FINOVIX Main Application
class FinovixApp {
    constructor() {
        this.currentUser = null;
        this.exchangeRates = {};
        this.init();
    }

    init() {
        console.log('FINOVIX App Initialized');
        this.loadUserSession();
        this.setupEventListeners();
        this.loadExchangeRates();
    }

    loadUserSession() {
        const userSession = localStorage.getItem('finovix_user');
        if (userSession) {
            this.currentUser = JSON.parse(userSession);
            console.log('User logged in:', this.currentUser.email);
        }
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupNavigation();
        });
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('a[href^="pages/"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (!this.currentUser && link.href.includes('dashboard')) {
                    e.preventDefault();
                    window.location.href = 'pages/login.html';
                }
            });
        });
    }

    loadExchangeRates() {
        this.exchangeRates = {
            'USD': 1,
            'EUR': 0.92,
            'AFN': 88.5,
            'PKR': 278.5,
            'IRR': 42105
        };
    }

    getExchangeRate(from, to) {
        if (from === to) return 1;
        const fromRate = this.exchangeRates[from] || 1;
        const toRate = this.exchangeRates[to] || 1;
        return toRate / fromRate;
    }

    convertCurrency(amount, from, to) {
        return amount * this.getExchangeRate(from, to);
    }

    generateUniqueId(prefix = '') {
        return prefix + Date.now() + Math.random().toString(36).substr(2, 9);
    }

    generateAccountNumber() {
        const randomNum = Math.floor(Math.random() * 899999) + 100000;
        return 'FNX' + randomNum;
    }

    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    getDestinationCountries() {
        return [
            {
                id: 'AFG',
                name: 'Afghanistan',
                cities: ['Kabul', 'Herat', 'Mazar-e-Sharif', 'Kandahar', 'Jalalabad']
            },
            {
                id: 'PAK',
                name: 'Pakistan',
                cities: ['Islamabad', 'Lahore', 'Karachi', 'Peshawar', 'Quetta']
            }
        ];
    }

    calculateTransferFee(amount) {
        return amount * 0.02;
    }

    calculateTotal(amount) {
        const fee = this.calculateTransferFee(amount);
        return {
            amount: amount,
            fee: fee,
            total: amount + fee
        };
    }

    logActivity(action, details = {}) {
        const log = {
            user: this.currentUser?.email || 'guest',
            action: action,
            details: details,
            timestamp: new Date().toISOString()
        };
        console.log('Activity Log:', log);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    exportToJSON(data, filename) {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new FinovixApp();
    });
} else {
    window.app = new FinovixApp();
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);