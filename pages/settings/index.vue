<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100"
  >
    <!-- Header with Back Button -->
    <header class="flex justify-between items-center p-4 md:p-6">
      <NuxtLink
        to="/"
        class="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <span>←</span>
        <span class="hidden sm:inline">Back Home</span>
      </NuxtLink>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <!-- Page Title -->
      <div class="text-center mb-12 md:mb-16">
        <h1
          class="text-4xl md:text-6xl font-bold text-indigo-600 mb-4 bounce-gentle"
        >
          Learning Settings
        </h1>
        <p class="text-lg md:text-2xl text-gray-700">
          Customize Elsa's learning experience
        </p>
      </div>

      <!-- Settings Cards -->
      <div class="max-w-4xl mx-auto">
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          <!-- Manage Study Words Card -->
          <div class="card-colorful text-center">
            <div class="text-6xl md:text-8xl mb-4 md:mb-6">📚</div>
            <h2
              class="text-2xl md:text-3xl font-bold text-indigo-700 mb-4 md:mb-6"
            >
              Manage Study Words
            </h2>
            <p class="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
              Add new words, edit existing ones, and customize the reading
              practice list for Elsa.
            </p>

            <NuxtLink
              to="/settings/reading"
              class="btn-primary text-lg md:text-xl py-3 px-6 md:py-4 md:px-8 inline-flex items-center gap-3"
            >
              <span>⚙️</span>
              Set Words
            </NuxtLink>
          </div>

          <!-- Manage Math Questions Card -->
          <div class="card-colorful text-center">
            <div class="text-6xl md:text-8xl mb-4 md:mb-6">🧮</div>
            <h2
              class="text-2xl md:text-3xl font-bold text-blue-700 mb-4 md:mb-6"
            >
              Manage Math Questions
            </h2>
            <p class="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
              Add new math problems, edit existing ones, and customize the math
              practice questions for Elsa.
            </p>

            <NuxtLink
              to="/settings/math"
              class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-full text-lg md:text-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 inline-flex items-center gap-3"
            >
              <span>🔢</span>
              Set Questions
            </NuxtLink>
          </div>

          <!-- Manage Spelling Words Card -->
          <div class="card-colorful text-center">
            <div class="text-6xl md:text-8xl mb-4 md:mb-6">✏️</div>
            <h2
              class="text-2xl md:text-3xl font-bold text-green-700 mb-4 md:mb-6"
            >
              Manage Spelling Words
            </h2>
            <p class="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
              Add new spelling words, edit definitions and sentences, and
              customize the English spelling practice.
            </p>

            <NuxtLink
              to="/settings/spelling-english"
              class="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-full text-lg md:text-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 inline-flex items-center gap-3"
            >
              <span>📝</span>
              Set Words
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="text-center py-6 md:py-8 text-gray-500">
      <p class="text-base md:text-lg">Keep learning, keep growing! 🌟</p>
    </footer>
  </div>
</template>

<script setup>
// Page metadata
useHead({
  title: "Settings - Chinese Learning Fun!",
  meta: [
    { name: "description", content: "Manage words and learning settings" },
  ],
});
</script>

<style scoped>
.border-rainbow {
  border-image: linear-gradient(
      45deg,
      #ff6b6b,
      #4ecdc4,
      #45b7d1,
      #96ceb4,
      #feca57,
      #ff9ff3
    )
    1;
}

@keyframes bounce-gentle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.bounce-gentle {
  animation: bounce-gentle 2s ease-in-out infinite;
}
</style>
