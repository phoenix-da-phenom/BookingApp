<template>
  <Transition name="fade">
    <div v-if="isLoading" class="route-loading-spinner">
      <div class="spinner"></div>
      <p class="mt-4 text-gray-700 font-medium">Loading...</p>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'

const isLoading = ref(false)

const start = () => { 
  isLoading.value = true 
}
const finish = () => { 
  isLoading.value = false 
}

defineExpose({ start, finish })
</script>

<style scoped>
.route-loading-spinner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>