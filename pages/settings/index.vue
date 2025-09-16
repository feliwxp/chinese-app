<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100"
  >
    <!-- Header with Back Button -->
    <header class="flex justify-between items-center p-6">
      <NuxtLink
        to="/"
        class="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <span>←</span>
        Back Home
      </NuxtLink>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-12">
      <!-- Page Title -->
      <div class="text-center mb-16">
        <h1 class="text-6xl font-bold text-indigo-600 mb-4 bounce-gentle">
          Learning Settings
        </h1>
        <p class="text-2xl text-gray-700">
          Customize Elsa's learning experience
        </p>
      </div>

      <!-- Single Settings Card -->
      <div class="max-w-2xl mx-auto">
        <div class="card-colorful text-center">
          <div class="text-8xl mb-6">📚</div>
          <h2 class="text-4xl font-bold text-indigo-700 mb-6">
            Manage Study Words
          </h2>
          <p class="text-xl text-gray-600 mb-8">
            Add new words, edit existing ones, and customize the reading
            practice list for Elsa.
          </p>

          <NuxtLink
            to="/settings/reading"
            class="btn-primary text-2xl py-4 px-8 inline-flex items-center gap-3"
          >
            <span>⚙️</span>
            Set Words
          </NuxtLink>
        </div>
      </div>

      <!-- Quick Stats (Optional - can remove if not needed) -->
      <div class="max-w-xl mx-auto mt-16">
        <div class="bg-white rounded-2xl shadow-xl p-6 border-4 border-rainbow">
          <h3
            class="text-2xl font-bold text-center text-indigo-600 mb-4 flex items-center justify-center gap-2"
          >
            <span>📊</span>
            Current Study List
          </h3>
          <div class="grid grid-cols-2 gap-4 text-center">
            <div class="bg-green-50 p-4 rounded-xl">
              <div class="text-3xl font-bold text-green-600">5</div>
              <div class="text-sm text-gray-600">Words Ready to Practice</div>
            </div>
            <div class="bg-blue-50 p-4 rounded-xl">
              <div class="text-3xl font-bold text-blue-600">0</div>
              <div class="text-sm text-gray-600">Mastered Words</div>
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
