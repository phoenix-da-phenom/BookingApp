<script setup>
import { onMounted } from 'vue';
import  useAuth  from '../../auth/useAuth.js';

const {
  isConnected,
  isConnecting,
  errorMessage,
  connectGoogle,
  loadGoogleScript
} = useAuth();

onMounted(() => {
  loadGoogleScript();
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
    <div class="relative bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 transition-all duration-300 hover:shadow-2xl">
      <!-- Success State -->
      <div v-if="isConnected" class="text-center space-y-4 animate-fade-in">
        <div class="mx-auto flex items-center justify-center h-16 w-16 bg-green-100 rounded-full">
          <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800">Connected Successfully!</h2>
        <p class="text-gray-600">You will be redirected shortly...</p>
      </div>

      <!-- Connect State -->
      <div v-else class="text-center space-y-6">
        <div class="animate-bounce-in">
          <div class="mx-auto flex items-center justify-center h-16 w-16 bg-blue-100 rounded-2xl">
            <svg class="h-8 w-8 text-[#4285F4]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4" />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853" />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05" />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335" />
            </svg>
          </div>
        </div>

        <div class="space-y-2">
          <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Connect Your Google Account
          </h2>
          <p class="text-gray-600">Connect to sync your calendar and manage appointments</p>
        </div>

        <button 
          @click="connectGoogle" 
          :disabled="isConnecting"
          class="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 rounded-lg py-3 px-4 transition-all duration-300
                 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md active:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Google logo SVG from above -->
          </svg>
          <span class="font-medium text-gray-700">
            {{ isConnecting ? 'Connecting...' : 'Continue with Google' }}
          </span>
        </button>

        <!-- Loading Spinner -->
        <div v-if="isConnecting" class="pt-4">
          <div class="inline-flex items-center space-x-2 text-blue-600">
            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Securely connecting to Google...</span>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg animate-shake">
          <svg class="inline h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {{ errorMessage }}
        </div>
      </div>

      <div class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
        <span class="text-xs font-medium">Secure</span>
        <svg class="inline h-4 w-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style>
/* Your existing styles remain the same */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-bounce-in {
  animation: bounceIn 0.6s ease-out;
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  60% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

@keyframes shake {
  10%, 90% {
    transform: translateX(-1px);
  }
  20%, 80% {
    transform: translateX(2px);
  }
  30%, 50%, 70% {
    transform: translateX(-4px);
  }
  40%, 60% {
    transform: translateX(4px);
  }
}
</style>