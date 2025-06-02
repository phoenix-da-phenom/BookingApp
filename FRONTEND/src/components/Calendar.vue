<template>
  <div class="p-6 max-w-6xl mx-auto">
    <!-- Month/Year Navigation -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">
        {{ currentMonth }} {{ currentYear }}
      </h2>
      <div class="flex space-x-2">
        <button @click="previousMonth" class="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button @click="nextMonth" class="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Day Headers -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div v-for="day in days" :key="day" class="text-center font-medium text-gray-500 py-2 text-sm">
        {{ day }}
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-1">
      <TransitionGroup name="list" tag="div" class="contents">
        <div
          v-for="date in calendarDates"
          :key="date.date"
          class="min-h-32 p-2 rounded-lg border border-gray-200 bg-white shadow-sm relative"
          :class="{
            'bg-blue-50': isToday(date.date),
            'opacity-60': !isCurrentMonth(date.date)
          }"
          @dragover.prevent="handleDragOver($event, date.date)"
          @drop="handleDrop($event, date.date)"
        >
          <!-- Date Number -->
          <div class="absolute top-2 right-2 text-sm font-medium" :class="{
            'text-blue-600': isToday(date.date),
            'text-gray-500': !isToday(date.date) && isCurrentMonth(date.date),
            'text-gray-400': !isCurrentMonth(date.date)
          }">
            {{ date.label }}
          </div>

          <!-- Events -->
          <TransitionGroup name="event" tag="div" class="mt-6 space-y-1">
            <div
              v-for="event in date.events"
              :key="event.id"
              draggable="true"
              @dragstart="handleDragStart($event, event)"
              class="px-2 py-1 rounded text-xs font-medium cursor-move truncate"
              :class="eventClasses(event)"
              @click="openEventModal(event)"
            >
              {{ event.title }}
            </div>
          </TransitionGroup>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'

// Setup days and initial events
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const currentDate = ref(dayjs())
const draggedEvent = ref(null)

// Sample events
const events = ref([
  { id: 1, title: 'Team Meeting', date: dayjs().date(5).format('YYYY-MM-DD'), color: 'blue' },
  { id: 2, title: 'Doctor Appointment', date: dayjs().date(15).format('YYYY-MM-DD'), color: 'green' },
  { id: 3, title: 'Lunch with Client', date: dayjs().date(25).format('YYYY-MM-DD'), color: 'purple' }
])

// Compute current month's calendar
const calendarDates = computed(() => {
  const startOfMonth = currentDate.value.startOf('month')
  const endOfMonth = currentDate.value.endOf('month')
  
  // Get the start day of the month (0-6, Sun-Sat)
  const startDay = startOfMonth.day()
  
  // Get the total days in month
  const daysInMonth = endOfMonth.date()
  
  // Get days from previous month to show
  const daysFromPrevMonth = startDay
  
  // Get days from next month to show (to fill the last row)
  const totalCells = Math.ceil((daysInMonth + daysFromPrevMonth) / 7) * 7
  const daysFromNextMonth = totalCells - (daysInMonth + daysFromPrevMonth)
  
  const dates = []
  
  // Add previous month's days
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    const date = startOfMonth.subtract(i + 1, 'day')
    dates.push({
      date: date.format('YYYY-MM-DD'),
      label: date.format('D'),
      isCurrentMonth: false,
      events: []
    })
  }
  
  // Add current month's days
  for (let i = 0; i < daysInMonth; i++) {
    const date = startOfMonth.add(i, 'day')
    dates.push({
      date: date.format('YYYY-MM-DD'),
      label: date.format('D'),
      isCurrentMonth: true,
      events: events.value.filter(e => e.date === date.format('YYYY-MM-DD'))
    })
  }
  
  // Add next month's days
  for (let i = 0; i < daysFromNextMonth; i++) {
    const date = endOfMonth.add(i + 1, 'day')
    dates.push({
      date: date.format('YYYY-MM-DD'),
      label: date.format('D'),
      isCurrentMonth: false,
      events: []
    })
  }
  
  return dates
})

// Current month and year display
const currentMonth = computed(() => currentDate.value.format('MMMM'))
const currentYear = computed(() => currentDate.value.format('YYYY'))

// Navigation methods
const previousMonth = () => {
  currentDate.value = currentDate.value.subtract(1, 'month')
}

const nextMonth = () => {
  currentDate.value = currentDate.value.add(1, 'month')
}

// Date helpers
const isToday = (date) => dayjs(date).isSame(dayjs(), 'day')
const isCurrentMonth = (date) => dayjs(date).month() === currentDate.value.month()

// Event styling
const eventClasses = (event) => {
  return {
    'bg-blue-100 text-blue-800 border border-blue-200': event.color === 'blue',
    'bg-green-100 text-green-800 border border-green-200': event.color === 'green',
    'bg-purple-100 text-purple-800 border border-purple-200': event.color === 'purple',
    'bg-yellow-100 text-yellow-800 border border-yellow-200': !event.color
  }
}

// Drag and drop handlers
const handleDragStart = (e, event) => {
  e.dataTransfer.setData('text/plain', event.id)
  draggedEvent.value = event
  e.target.classList.add('opacity-50')
}

const handleDragOver = (e) => {
  e.preventDefault()
  e.currentTarget.classList.add('ring-2', 'ring-blue-400')
}

const handleDrop = (e, newDate) => {
  e.preventDefault()
  e.currentTarget.classList.remove('ring-2', 'ring-blue-400')
  
  const eventId = e.dataTransfer.getData('text/plain')
  const updated = events.value.map(ev =>
    ev.id.toString() === eventId ? { ...ev, date: newDate } : ev
  )
  events.value = updated
}

const openEventModal = (event) => {
  console.log('Opening event:', event)
  // You would implement your modal opening logic here
}
</script>

<style scoped>
/* List transition for month change */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Event transition for drag and drop */
.event-enter-active,
.event-leave-active {
  transition: all 0.2s ease;
}
.event-move {
  transition: transform 0.3s ease;
}
.event-enter-from,
.event-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.event-leave-active {
  position: absolute;
}

/* Drag preview styling */
[draggable] {
  user-select: none;
}
</style>