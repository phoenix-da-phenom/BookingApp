import { createRouter, createWebHistory } from "vue-router";
import authPage from "../pages/authPage.vue";
import Main from "../pages/Main.vue";
import CalendarView from "../pages/CalendarView.vue";
import { authGuard } from "../auth/authGuard.js";

function isAuthenticated() {
    return !!localStorage.getItem("auth_token");
}
// Create router instance
const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL),
    routes: [{
            path: "/auth",
            name: "authentication",
            component: authPage,
            meta: { onlyGuest: true },
        },
        {
            path: "/",
            name: "main-page",
            component: Main,
            beforeEnter: authGuard,
        },
        {
            path: "/view",
            name: "calendar-view",
            component: CalendarView,
            beforeEnter: authGuard,
        },
    ],
});

// Create a loading state that can be shared
let loadingSpinner = null;

// Function to set the spinner reference
export const setLoadingSpinner = (spinner) => {
    loadingSpinner = spinner;
};

router.beforeEach((to, from, next) => {
    const auth = isAuthenticated();

    // Block authenticated users from visiting guest-only pages
    if (to.meta.onlyGuest && auth) {
        return next("/");
    }

    // Optionally block unauthenticated access to protected pages
    if (to.meta.requiresAuth && !auth) {
        return next("/auth");
    }
    if (loadingSpinner) {
        loadingSpinner.start();
    }
    next();
});

router.afterEach(() => {
    if (loadingSpinner) {
        loadingSpinner.finish();
    }
});

// Export the router as default
export default router;