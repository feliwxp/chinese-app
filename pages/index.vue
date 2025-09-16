<template>
  <div
    class="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 bg-pattern-stars"
  >
    <!-- Header with Settings Button -->
    <header class="flex justify-between items-center p-6">
      <div class="text-2xl font-bold text-purple-600">
        🎯 Chinese Learning Fun!
      </div>

      <!-- Settings Button -->
      <NuxtLink
        to="/settings"
        class="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <span>⚙️</span>
        Settings
      </NuxtLink>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-12">
      <!-- Greeting Section -->
      <div class="text-center mb-16">
        <h1 class="text-6xl font-bold text-purple-600 mb-4 bounce-gentle">
          Hi Elsa! 👋
        </h1>
        <p class="text-2xl text-gray-700 font-semibold">
          What would you like to learn today?
        </p>
      </div>

      <!-- Learning Options -->
      <div class="max-w-2xl mx-auto">
        <!-- Reading Chinese Words Card -->
        <div
          class="card-colorful mb-8 transform hover:scale-105 transition-all duration-300"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h2
                class="text-3xl font-bold text-purple-700 mb-3 flex items-center gap-3"
              >
                <span class="text-4xl">📚</span>
                Reading Chinese Words
              </h2>
              <p class="text-lg text-gray-600 mb-4">
                Practice reading and pronouncing Chinese words! Listen, speak,
                and learn new words every day.
              </p>
              <div class="flex gap-3">
                <NuxtLink
                  to="/progress/reading"
                  class="btn-primary flex items-center gap-2"
                >
                  <span>🎮</span>
                  Start Quiz
                </NuxtLink>
              </div>
            </div>
            <div class="text-8xl opacity-20 ml-8">
              <span class="chinese-text">学</span>
            </div>
          </div>
        </div>

        <!-- Coming Soon Cards -->
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Writing Practice -->
          <div class="card opacity-60">
            <div class="text-center">
              <div class="text-4xl mb-3">✍️</div>
              <h3 class="text-xl font-bold text-gray-500 mb-2">
                Writing Practice
              </h3>
              <p class="text-gray-400 text-sm mb-3">
                Learn to write Chinese characters
              </p>
              <button
                class="bg-gray-300 text-gray-500 py-2 px-4 rounded-full text-sm cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>

          <!-- Listening Comprehension -->
          <div class="card opacity-60">
            <div class="text-center">
              <div class="text-4xl mb-3">👂</div>
              <h3 class="text-xl font-bold text-gray-500 mb-2">Listening</h3>
              <p class="text-gray-400 text-sm mb-3">
                Listen and understand Chinese
              </p>
              <button
                class="bg-gray-300 text-gray-500 py-2 px-4 rounded-full text-sm cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Fun Stats Section -->
      <div class="max-w-xl mx-auto mt-16">
        <div class="bg-white rounded-2xl shadow-xl p-6 border-4 border-rainbow">
          <h3
            class="text-2xl font-bold text-center text-purple-600 mb-4 flex items-center justify-center gap-2"
          >
            <span>🏆</span>
            Your Learning Journey
          </h3>
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-3xl font-bold text-green-500">0</div>
              <div class="text-sm text-gray-600">Words Learned</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-blue-500">0</div>
              <div class="text-sm text-gray-600">Days Practiced</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-purple-500">0</div>
              <div class="text-sm text-gray-600">Total Points</div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="text-center py-8 text-gray-500">
      <p class="text-lg">Keep learning, keep growing! 🌟</p>
    </footer>
  </div>
</template>

<script setup>
// Page metadata
useHead({
  title: "Home - Chinese Learning Fun!",
  meta: [
    {
      name: "description",
      content: "Fun Chinese language learning app for kids",
    },
  ],
});

// You can add any reactive data or methods here later
// For example, fetching user stats from Supabase
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
