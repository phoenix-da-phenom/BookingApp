// src/composables/useAuth.js
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const GOOGLE_CLIENT_ID =
    import.meta.env.VITE_GOOGLE_CLIENT_ID;

const useAuth = () => {

    const router = useRouter();
    const isConnected = ref(false);
    const isConnecting = ref(false);
    const errorMessage = ref('');
    const googleScriptLoaded = ref(false);
    const user = ref(JSON.parse(localStorage.getItem('user')) || null)
    const isAuthenticated = computed(() => !!user.value);
    console.log("user value us ", user)
    const handleCredentialResponse = async(response) => {
        isConnecting.value = false;
        try {
            const res = await fetch('http://localhost:8000/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    credential: response.credential,
                    client_id: GOOGLE_CLIENT_ID,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Authentication failed');

            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            user.value = data.user;
            isConnected.value = true;
            window.google ?.accounts.id.cancel ?.();
            removeGoogleButton();
            setTimeout(() => router.push('/view'), 1500);
        } catch (err) {
            handleGoogleError(err);
        }
    };

    const handleGoogleError = (err) => {
        console.error('Google Auth Error', err);
        errorMessage.value = err.message || 'Failed to connect with Google.';
        isConnecting.value = false;
        removeGoogleButton();
    };

    const removeGoogleButton = () => {
        document.getElementById('google-button-container') ?.remove();
    };

    const renderGoogleButton = () => {
        removeGoogleButton();
        const container = document.createElement('div');
        container.id = 'google-button-container';
        Object.assign(container.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
        });
        document.body.appendChild(container);

        window.google.accounts.id.renderButton(container, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            width: '300',
        });
    };

    const connectGoogle = () => {
        if (!googleScriptLoaded.value) {
            errorMessage.value = 'Google auth not loaded yet.';
            return;
        }

        isConnecting.value = true;
        errorMessage.value = '';
        removeGoogleButton();

        try {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
                cancel_on_tap_outside: false,
            });

            window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isDismissedMoment()) {
                    renderGoogleButton();
                }
            });
        } catch (err) {
            handleGoogleError(err);
        }
    };

    const loadGoogleScript = () => {
        if (window.google ?.accounts ?.id) {
            googleScriptLoaded.value = true;
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            googleScriptLoaded.value = true;
            console.log('Google auth script loaded');
        };
        script.onerror = () => {
            errorMessage.value = 'Failed to load Google authentication.';
        };
        document.head.appendChild(script);
    };
    const logout = () => {
        localStorage.removeItem('auth_token');
        isConnected.value = false;
        localStorage.removeItem('user')
        user.value = null
        router.push('/auth');
    };

    return {
        isConnected,
        isConnecting,
        errorMessage,
        connectGoogle,
        loadGoogleScript,
        user,
        isAuthenticated,
        logout,
    };
}
export default useAuth;