/** TuneTogether - Auth Module */
const AUTH = {
    user: null,
    init() {
        if (typeof firebase === 'undefined' || !CONFIG.FIREBASE_CONFIG || CONFIG.FIREBASE_CONFIG.apiKey === 'YOUR_FIREBASE_API_KEY') {
            console.warn('Firebase not configured for auth');
            this.setupGuestOnly();
            return;
        }
        try {
            if (!firebase.apps.length) firebase.initializeApp(CONFIG.FIREBASE_CONFIG);
            firebase.auth().onAuthStateChanged(user => {
                if (user) { this.onLogin(user); } else { this.showLogin(); }
            });
        } catch(e) { console.error('Auth init error:', e); this.setupGuestOnly(); }
        document.getElementById('google-login-btn').addEventListener('click', () => this.googleLogin());
        document.getElementById('guest-login-btn').addEventListener('click', () => this.guestLogin());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
    },
    setupGuestOnly() {
        document.getElementById('google-login-btn').addEventListener('click', () => this.googleLogin());
        document.getElementById('guest-login-btn').addEventListener('click', () => this.guestLogin());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
    },
    googleLogin() {
        if (typeof firebase === 'undefined' || !firebase.apps.length) {
            this.showToast('Firebase not configured. Using guest mode.', 'error');
            this.guestLogin(); return;
        }
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).catch(e => {
            console.error('Google login error:', e);
            this.showToast('Google login failed: ' + e.message, 'error');
        });
    },
    guestLogin() {
        const name = 'Guest_' + Math.floor(Math.random() * 9999);
        this.onLogin({ displayName: name, email: null, photoURL: null, uid: 'guest_' + Date.now(), isGuest: true });
    },
    onLogin(user) {
        this.user = { name: user.displayName || 'Guest', email: user.email, photo: user.photoURL, uid: user.uid, isGuest: !!user.isGuest };
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-wrapper').style.display = 'flex';
        document.getElementById('user-name').textContent = this.user.name;
        const avatar = document.getElementById('user-avatar');
        if (this.user.photo) { avatar.src = this.user.photo; avatar.style.display = 'block'; }
        else { avatar.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect fill="%236c5ce7" width="40" height="40" rx="20"/><text x="50%" y="55%" text-anchor="middle" fill="white" font-size="16" dominant-baseline="middle">' + (this.user.name.charAt(0).toUpperCase()) + '</text></svg>'; avatar.style.display = 'block'; }
        this.showToast('Welcome, ' + this.user.name + '!', 'success');
        if (typeof initializeApp === 'function') initializeApp();
    },
    logout() {
        if (typeof firebase !== 'undefined' && firebase.apps.length) { firebase.auth().signOut().catch(() => {}); }
        this.user = null;
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('app-wrapper').style.display = 'none';
    },
    showLogin() {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('app-wrapper').style.display = 'none';
    },
    showToast(msg, type) {
        const c = document.getElementById('toast-container');
        if (!c) return;
        const t = document.createElement('div');
        t.className = 'toast ' + (type || '');
        t.textContent = msg;
        c.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3000);
    }
};
document.addEventListener('DOMContentLoaded', () => AUTH.init());
