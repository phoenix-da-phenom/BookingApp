<script setup>

// import GoogleAuthButton from './components/Auth/GoogleAuthButton.vue'
import GoogleConnect from '../components/Auth/GoogleConnect.vue'



</script>

<template>
 
<!-- <GoogleAuthButton/> -->
<GoogleConnect
  :is-connected="isGoogleConnected" 
  @connected="handleGoogleConnected"
/>


</template>