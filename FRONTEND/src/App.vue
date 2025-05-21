<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, RouterView } from 'vue-router'
import RouteLoadingSpinner from './components/RouteLoadingSpinner.vue'
import { setLoadingSpinner } from './router'
import useAuth from './auth/useAuth'

// Get user auth values
const { logout, user, isAuthenticated } = useAuth()

// Spinner reference
const loadingSpinner = ref(null)

onMounted(() => {
  setLoadingSpinner(loadingSpinner.value)
})
</script>

<template>
  <div id="app">
    <nav class="bg-white shadow px-6 lg:px-38 py-4 flex items-center justify-between">
      <!-- Left links -->
      <div class="space-x-6 flex items-center">
        <!-- Home Link -->
        <router-link to="/" class="text-gray-700 hover:text-blue-500 font-medium flex items-center group">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               class="w-5 h-5 mr-1 transition-transform duration-300 group-hover:scale-110">
            <path d="M3 9.5L12 4l9 5.5M4 10v10h6v-6h4v6h6V10" />
          </svg>
          <span>Home</span>
        </router-link>

        <!-- View & Adjust Event Link -->
        <router-link to="/view" class="text-gray-700 hover:text-blue-500 font-medium flex items-center group">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               class="w-5 h-5 mr-1 transition-transform duration-300 group-hover:scale-110">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>View & Adjust Event</span>
        </router-link>
      </div>

      <!-- Logout Button (Only if authenticated) -->
      <div class="flex items-center space-x-2" >
        <button @click="logout" class="text-red-600 hover:text-red-800 font-medium flex items-center group">
          <span>Log out</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round"
               class="w-5 h-5 ml-2 transition-all duration-300 group-hover:rotate-12 group-hover:stroke-red-800">
            <path d="M13 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3"/>
            <path d="M12 12v4"/>
            <path d="M12 8v1"/>
          </svg>
        </button>
      </div>
    </nav>

    <router-view />
    <RouteLoadingSpinner ref="loadingSpinner" />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
