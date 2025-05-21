import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import router from './router' // Now using default import
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)
app.use(vue3GoogleLogin, {
    clientId: "1049521897741-fhi2jk9jfqq0145eq3a0nku8fl6bg664.apps.googleusercontent.com"
})
app.use(router) // Register the router
app.mount('#app')