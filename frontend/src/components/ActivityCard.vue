<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div v-if="activity.imageUrl" class="relative">
      <img 
        :src="activity.imageUrl || 'https://pub-6a74383dd798433f8364e8d2b7ed45ca.r2.dev/static/outsite-co-R-LK3sqLiBw-unsplash.jpg'"
        :alt="activity.title"
        class="w-full h-48 sm:h-56 object-cover"
        @error="handleImageError"
      />
    </div>
    <div class="p-4 sm:p-6">
      <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
        {{ activity.title }}
      </h3>
      <p class="text-gray-600 text-sm sm:text-base mb-4 line-clamp-3">
        {{ activity.description }}
      </p>
      <div class="flex items-center text-gray-400 text-xs sm:text-sm">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{{ formatDate(activity.createdAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  activity: {
    type: Object,
    required: true
  }
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
