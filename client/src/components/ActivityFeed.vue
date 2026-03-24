<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
      InspireFeed
    </h1>

    <div class="mb-6">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search activities by title..."
          class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
        <svg 
          class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <div v-if="isSearching" class="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      <p class="font-medium">Error loading activities</p>
      <p class="text-sm">{{ error }}</p>
      <button 
        @click="retryFetch" 
        class="mt-2 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors"
      >
        Try Again
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ActivityCard 
        v-for="activity in activities" 
        :key="activity._id" 
        :activity="activity" 
      />

      <template v-if="loading">
        <LoadingSkeleton v-for="n in 4" :key="'skeleton-' + n" />
      </template>
    </div>

    <div 
      ref="sentinelRef" 
      class="h-10 flex items-center justify-center"
    >
      <p v-if="!hasMore && activities.length > 0" class="text-gray-500 text-sm py-4">
        No more activities to load
      </p>
    </div>

    <div v-if="!loading && activities.length === 0 && !error" class="text-center py-12">
      <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <p class="text-gray-500">No activities found</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { fetchFeed } from '../services/api'
import ActivityCard from './ActivityCard.vue'
import LoadingSkeleton from './LoadingSkeleton.vue'

const activities = ref([])
const loading = ref(false)
const lastId = ref(null)
const hasMore = ref(true)
const error = ref(null)
const sentinelRef = ref(null)
const searchQuery = ref('')
const isSearching = ref(false)

let observer = null
let debounceTimer = null

const loadActivities = async (isSearch = false) => {
  if (loading.value || (!hasMore.value && !isSearch)) return

  loading.value = true
  error.value = null

  try {
    const searchTerm = searchQuery.value.trim() || null
    const data = await fetchFeed(isSearch ? null : lastId.value, 10, searchTerm)
    
    if (isSearch) {
      activities.value = data || []
      hasMore.value = false
      lastId.value = null
    } else if (data && data.length > 0) {
      activities.value = [...activities.value, ...data]
      lastId.value = data[data.length - 1]._id
      
      if (data.length < 10) {
        hasMore.value = false
      }
    } else {
      hasMore.value = false
    }
  } catch (err) {
    error.value = err.message || 'Failed to load activities'
  } finally {
    loading.value = false
    isSearching.value = false
  }
}

const performSearch = () => {
  activities.value = []
  lastId.value = null
  hasMore.value = true
  loadActivities(true)
}

watch(searchQuery, (newValue, oldValue) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  isSearching.value = true
  
  debounceTimer = setTimeout(() => {
    if (newValue.trim() === '') {
      activities.value = []
      lastId.value = null
      hasMore.value = true
      isSearching.value = false
      loadActivities(false)
    } else {
      performSearch()
    }
  }, 2000)
})

const retryFetch = () => {
  error.value = null
  loadActivities(searchQuery.value.trim() !== '')
}

const setupIntersectionObserver = () => {
  const options = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && hasMore.value && !loading.value && !searchQuery.value.trim()) {
        loadActivities()
      }
    })
  }, options)

  if (sentinelRef.value) {
    observer.observe(sentinelRef.value)
  }
}

onMounted(() => {
  loadActivities()
  setupIntersectionObserver()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})
</script>
