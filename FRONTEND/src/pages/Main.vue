<template>
    <form @submit.prevent="handleSubmit">
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Mark's Design
          </span>
        </h1>
        <div v-if="user" class="flex items-center space-x-2">
          <img :src="user.picture" class="w-10 h-10 rounded-full border-2 border-white shadow" />
          <span class="font-medium text-gray-700">{{ user.name }}</span>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Appointment Booking Form -->
        <div class="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Book an Appointment</h2>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Service Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Service</label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  v-for="service in services"
                  :key="service.id"
                  @click.prevent="selectedService = service"
                  :class="[
                    'p-4 border rounded-lg transition-all duration-200 text-left',
                    selectedService?.id === service.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  ]"
                >
                  <div class="font-medium text-gray-800">{{ service.name }}</div>
                  <div class="text-sm text-gray-600 mt-1">{{ service.duration }} min</div>
                  <!-- <div class="text-sm font-medium text-blue-600 mt-2">${{ service.price }}</div> -->
                </button>
              </div>
            </div>

            <!-- Date Picker -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <div class="relative">
                <input
                  v-model="selectedDate"
                  type="date"
                  :min="today"
                  @change="handleDateChange"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <CalendarIcon class="h-5 w-5 text-gray-400 absolute right-3 top-3.5" />
              </div>
            </div>

            <!-- Time Slots -->
            <div v-if="selectedDate && availableSlots.length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-1">Available Times</label>
              <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                <button
                  v-for="slot in availableSlots"
                  :key="slot"
                  @click.prevent="selectedTime = slot"
                  :class="[
                    'py-2 px-3 rounded-md text-sm font-medium transition-colors',
                    selectedTime === slot
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  ]"
                >
                  {{ formatTime(slot) }}
                </button>
              </div>
            </div>
            <div v-else-if="selectedDate" class="text-gray-500 italic">
              Loading available times...
            </div>

            <!-- Personal Info -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-800">Your Information</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    id="name"
                    v-model="formData.name"
                    type="text"
                    required
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    id="email"
                    v-model="formData.email"
                    type="email"
                    required
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  id="notes"
                  v-model="formData.notes"
                  rows="3"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit" 
              class="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span v-if="!isBooking">Confirm Booking</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            </button>
          </form>
        </div>

        <!-- Appointment Summary -->
        <div class="bg-white rounded-xl shadow-lg p-6 sticky top-8 h-fit">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Appointment Summary</h2>

          <div v-if="selectedService" class="space-y-6">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium text-gray-800">{{ selectedService.name }}</h3>
                <p class="text-sm text-gray-500">{{ selectedService.duration }} min</p>
              </div>
              <span class="font-medium text-gray-800">${{ selectedService.price }}</span>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Date</span>
                <span class="font-medium">{{ formattedSelectedDate }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Time</span>
                <span class="font-medium">
                  {{ selectedTime ? formatTime(selectedTime) : 'Not selected' }}
                </span>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <div class="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>${{ selectedService.price }}</span>
              </div>
            </div>

            <!-- Google Calendar Add Button -->
            <button
              v-if="isBookingSuccess && user"
              @click="addToGoogleCalendar"
              class="w-full mt-6 flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <!-- Google Calendar Icon Paths -->
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Add to Google Calendar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
    </form>

</template>

<script setup>
import { ref, computed, watch } from 'vue'
// import CalendarIcon from './icons/CalendarIcon.vue'

// Define all reactive state
const user = ref({ name: 'John Doe', picture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKwDxVtZCkl6uKvreSTGjk6IHaTWWIzySm0-HM5aMmfhbSkPBZxMCH2ZmbXKRv2kaBfS0&usqp=CAU' })
const services = ref([
  { id: 1, name: 'Haircut', duration: 30, price: 25 },
  { id: 2, name: 'Beard Trim', duration: 15, price: 15 },
])
const selectedService = ref(null)
const selectedDate = ref(null)
const selectedTime = ref(null)
const formData = ref({
  name: '',
  email: '',
  notes: ''
})
const isBooking = ref(false)
const isBookingSuccess = ref(false)
const availableSlots = ref([])

const today = new Date().toISOString().split('T')[0]

const handleSubmit = () => {
  isBooking.value = true
  setTimeout(() => {
    isBooking.value = false
    isBookingSuccess.value = true
  }, 1500)
}

const handleDateChange = () => {
  availableSlots.value = [
    '09:00',
    '10:00',
    '11:00',
    '14:00',
    '15:00'
  ]
}

const formatTime = (time) => {
  const [h, m] = time.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  return `${(hour % 12 || 12)}:${m} ${ampm}`
}

const formattedSelectedDate = computed(() => {
  return selectedDate.value
    ? new Date(selectedDate.value).toLocaleDateString()
    : 'Not selected'
})

const isFormValid = computed(() => {
  return selectedService.value && selectedDate.value && selectedTime.value &&
    formData.value.name && formData.value.email
})

const addToGoogleCalendar = () => {
  alert('Added to calendar!')
}
</script>


<style>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Animation for time slots */
button {
  transition: all 0.2s ease;
}

/* Gradient border for selected service */
.border-blue-500 {
  position: relative;
}

.border-blue-500::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 12px;
  background: linear-gradient(45deg, #3b82f6, #6366f1);
  z-index: -1;
}
</style>