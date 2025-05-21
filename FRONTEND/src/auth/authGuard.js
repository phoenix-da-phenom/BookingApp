// src/auth/authGuard.js
export function authGuard(to, from, next) {
    const token = localStorage.getItem('auth_token');
    if (!token) {
        next('/auth');
    } else {
        next();
    }
}