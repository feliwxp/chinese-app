<template>
  <div
    class="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100"
  >
    <!-- Header -->
    <header class="flex justify-between items-center p-4 md:p-6">
      <NuxtLink
        to="/settings"
        class="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <span>←</span>
        <span class="hidden sm:inline">Back to Settings</span>
      </NuxtLink>

      <div class="text-lg md:text-2xl font-bold text-green-600">
        📚 <span class="hidden sm:inline">Manage Words</span>
      </div>

      <NuxtLink
        to="/"
        class="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <span>🏠</span>
        <span class="hidden sm:inline">Home</span>
      </NuxtLink>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 md:px-6 py-6 md:py-8">
      <!-- Page Title -->
      <div class="text-center mb-8 md:mb-12">
        <h1
          class="text-3xl md:text-5xl font-bold text-green-600 mb-2 md:mb-4 bounce-gentle"
        >
          Study Word Manager
        </h1>
        <p class="text-lg md:text-xl text-gray-700">
          Add, edit, pause, or remove words from Elsa's practice list
        </p>
      </div>

      <!-- Add New Word Form -->
      <div class="max-w-4xl mx-auto mb-8 md:mb-12">
        <div class="card-colorful">
          <div class="text-3xl md:text-4xl mb-3 md:mb-4 text-center">➕</div>
          <h2
            class="text-2xl md:text-3xl font-bold text-gray-700 mb-4 md:mb-6 text-center"
          >
            Add New Word
          </h2>

          <form @submit.prevent="addWord" class="space-y-4 md:space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <!-- Chinese Word -->
              <div>
                <label
                  class="block text-base md:text-lg font-semibold text-gray-700 mb-2"
                >
                  Chinese Word <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="newWord.chinese"
                  type="text"
                  required
                  placeholder="你好"
                  class="w-full p-3 md:p-4 text-xl md:text-2xl border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none chinese-text"
                />
              </div>

              <!-- English Translation -->
              <div>
                <label
                  class="block text-base md:text-lg font-semibold text-gray-700 mb-2"
                >
                  English Translation <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="newWord.english"
                  type="text"
                  required
                  placeholder="Hello"
                  class="w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <!-- Sample Sentence Chinese -->
              <div>
                <label
                  class="block text-base md:text-lg font-semibold text-gray-700 mb-2"
                >
                  Example Sentence (Chinese)
                </label>
                <textarea
                  v-model="newWord.sampleSentenceChinese"
                  rows="3"
                  placeholder="你好，我是学生。"
                  class="w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none chinese-text resize-none"
                ></textarea>
              </div>

              <!-- Sample Sentence English -->
              <div>
                <label
                  class="block text-base md:text-lg font-semibold text-gray-700 mb-2"
                >
                  Example Sentence (English)
                </label>
                <textarea
                  v-model="newWord.sampleSentenceEnglish"
                  rows="3"
                  placeholder="Hello, I am a student."
                  class="w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none resize-none"
                ></textarea>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="text-center">
              <button
                type="submit"
                :disabled="loading || !newWord.chinese || !newWord.english"
                class="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-full text-lg md:text-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                <span v-if="loading">⏳ Adding...</span>
                <span v-else>➕ Add Word</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="max-w-6xl mx-auto mb-6">
        <div class="flex justify-center">
          <div class="bg-white rounded-xl p-1 shadow-lg">
            <button
              @click="filterStatus = 'all'"
              :class="[
                'px-4 py-2 rounded-lg font-semibold transition-all duration-200',
                filterStatus === 'all'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100',
              ]"
            >
              All ({{ words.length }})
            </button>
            <button
              @click="filterStatus = 'active'"
              :class="[
                'px-4 py-2 rounded-lg font-semibold transition-all duration-200',
                filterStatus === 'active'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100',
              ]"
            >
              Active ({{ activeWords.length }})
            </button>
            <button
              @click="filterStatus = 'paused'"
              :class="[
                'px-4 py-2 rounded-lg font-semibold transition-all duration-200',
                filterStatus === 'paused'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100',
              ]"
            >
              Paused ({{ pausedWords.length }})
            </button>
          </div>
        </div>
      </div>

      <!-- Current Words List -->
      <div class="max-w-6xl mx-auto">
        <div class="bg-white rounded-2xl shadow-xl p-4 md:p-8">
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4"
          >
            <h2
              class="text-2xl md:text-3xl font-bold text-gray-700 flex items-center gap-3"
            >
              <span>📖</span>
              <span class="hidden sm:inline"
                >{{
                  filterStatus === "all"
                    ? "All"
                    : filterStatus === "active"
                    ? "Active"
                    : "Paused"
                }}
                Study Words ({{ filteredWords.length }})</span
              >
              <span class="sm:hidden">Words ({{ filteredWords.length }})</span>
            </h2>

            <button
              @click="refreshWords"
              :disabled="loading"
              class="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2 px-4 rounded-full text-sm shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100"
            >
              <span v-if="loading">⏳</span>
              <span v-else>🔄</span>
              Refresh
            </button>
          </div>

          <!-- Loading State -->
          <div
            v-if="loading && words.length === 0"
            class="text-center py-8 md:py-12"
          >
            <div class="text-4xl md:text-6xl mb-3 md:mb-4">⏳</div>
            <p class="text-lg md:text-xl text-gray-600">Loading words...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-8 md:py-12">
            <div class="text-4xl md:text-6xl mb-3 md:mb-4">❌</div>
            <p class="text-lg md:text-xl text-red-600 mb-4">{{ error }}</p>
            <button
              @click="refreshWords"
              class="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold py-2 px-4 rounded-full"
            >
              Try Again
            </button>
          </div>

          <!-- Words Grid -->
          <div v-else-if="filteredWords.length > 0" class="grid gap-4 md:gap-6">
            <div
              v-for="word in filteredWords"
              :key="word.id"
              :class="[
                'border-2 rounded-xl p-4 md:p-6 transition-all duration-200',
                word.status === 'paused'
                  ? 'border-orange-200 bg-orange-50 hover:border-orange-300'
                  : 'border-gray-200 hover:border-green-300',
              ]"
            >
              <div
                class="flex flex-col lg:flex-row lg:items-start justify-between gap-4"
              >
                <div class="flex-1">
                  <!-- Status Badge -->
                  <div class="mb-2">
                    <span
                      :class="[
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold',
                        word.status === 'paused'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800',
                      ]"
                    >
                      {{ word.status === "paused" ? "⏸️ Paused" : "✅ Active" }}
                    </span>
                  </div>

                  <!-- Word Info -->
                  <div
                    class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4"
                  >
                    <div>
                      <label
                        class="block text-xs md:text-sm font-semibold text-gray-600 mb-1"
                      >
                        Chinese
                      </label>
                      <div
                        :class="[
                          'text-2xl md:text-3xl font-bold chinese-text',
                          word.status === 'paused'
                            ? 'text-orange-600'
                            : 'text-green-600',
                        ]"
                      >
                        {{ word.chinese }}
                      </div>
                    </div>
                    <div>
                      <label
                        class="block text-xs md:text-sm font-semibold text-gray-600 mb-1"
                      >
                        English
                      </label>
                      <div class="text-lg md:text-xl text-gray-700">
                        {{ word.english }}
                      </div>
                    </div>
                  </div>

                  <!-- Sample Sentences -->
                  <div
                    v-if="
                      word.sample_sentence_chinese ||
                      word.sample_sentence_english
                    "
                    class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
                  >
                    <div v-if="word.sample_sentence_chinese">
                      <label
                        class="block text-xs md:text-sm font-semibold text-gray-600 mb-1"
                      >
                        Example (Chinese)
                      </label>
                      <div
                        class="text-base md:text-lg text-gray-600 chinese-text"
                      >
                        {{ word.sample_sentence_chinese }}
                      </div>
                    </div>
                    <div v-if="word.sample_sentence_english">
                      <label
                        class="block text-xs md:text-sm font-semibold text-gray-600 mb-1"
                      >
                        Example (English)
                      </label>
                      <div class="text-base md:text-lg text-gray-600">
                        {{ word.sample_sentence_english }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div
                  class="flex lg:flex-col gap-2 justify-end lg:justify-start lg:ml-6"
                >
                  <button
                    @click="editWord(word)"
                    class="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-2 px-3 md:px-4 rounded-full text-xs md:text-sm shadow-lg transform transition-all duration-200 hover:scale-105 flex-1 lg:flex-none"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    @click="toggleWordStatus(word)"
                    :disabled="loading"
                    :class="[
                      'font-bold py-2 px-3 md:px-4 rounded-full text-xs md:text-sm shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100 flex-1 lg:flex-none',
                      word.status === 'paused'
                        ? 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white'
                        : 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white',
                    ]"
                  >
                    {{ word.status === "paused" ? "▶️ Resume" : "⏸️ Pause" }}
                  </button>
                  <button
                    @click="deleteWord(word)"
                    :disabled="loading"
                    class="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2 px-3 md:px-4 rounded-full text-xs md:text-sm shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100 flex-1 lg:flex-none"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-8 md:py-12">
            <div class="text-4xl md:text-6xl mb-3 md:mb-4">📚</div>
            <p class="text-lg md:text-xl text-gray-600 mb-3 md:mb-4">
              {{
                filterStatus === "all"
                  ? "No words found"
                  : `No ${filterStatus} words found`
              }}
            </p>
            <p class="text-gray-500">
              {{
                filterStatus === "all"
                  ? "Add your first word using the form above!"
                  : `Try switching to a different filter or add new words.`
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div
        v-if="editingWord"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click.self="cancelEdit"
      >
        <div
          class="bg-white rounded-2xl p-4 md:p-8 max-w-2xl w-full max-h-90vh overflow-y-auto"
        >
          <h3
            class="text-xl md:text-2xl font-bold text-gray-700 mb-4 md:mb-6 text-center"
          >
            ✏️ Edit Word
          </h3>

          <form @submit.prevent="updateWord" class="space-y-4 md:space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label
                  class="block text-base md:text-lg font-semibold text-gray-700 mb-2"
                >
                  Chinese Word <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="editingWord.chinese"
                  type="text"
                  required
                  class="w-full p-3 md:p-4 text-xl md:text-2xl border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none chinese-text"
                />
              </div>

              <div>
                <label
                  class="block text-base md:text-lg font-semibold text-gray-700 mb-2"
                >
                  English Translation <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="editingWord.english"
                  type="text"
                  required
                  class="w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label
                  class="block text-base md:text-lg font-semibold text-gray-700 mb-2"
                >
                  Example Sentence (Chinese)
                </label>
                <textarea
                  v-model="editingWord.sample_sentence_chinese"
                  rows="3"
                  class="w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none chinese-text resize-none"
                ></textarea>
              </div>

              <div>
                <label
                  class="block text-base md:text-lg font-semibold text-gray-700 mb-2"
                >
                  Example Sentence (English)
                </label>
                <textarea
                  v-model="editingWord.sample_sentence_english"
                  rows="3"
                  class="w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none resize-none"
                ></textarea>
              </div>
            </div>

            <!-- Status Selection -->
            <div>
              <label
                class="block text-base md:text-lg font-semibold text-gray-700 mb-2"
              >
                Status
              </label>
              <select
                v-model="editingWord.status"
                class="w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
              >
                <option value="active">✅ Active</option>
                <option value="paused">⏸️ Paused</option>
              </select>
            </div>

            <div
              class="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center"
            >
              <button
                type="button"
                @click="cancelEdit"
                class="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-base md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-base md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100"
              >
                <span v-if="loading">⏳ Saving...</span>
                <span v-else>💾 Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// Page metadata
useHead({
  title: "Manage Words - Chinese Learning Fun!",
  meta: [
    {
      name: "description",
      content: "Add, edit, and manage Chinese words for practice",
    },
  ],
});

// Reactive state
const words = ref([]);
const loading = ref(false);
const error = ref(null);
const editingWord = ref(null);
const filterStatus = ref("all");

// New word form
const newWord = ref({
  chinese: "",
  english: "",
  sampleSentenceChinese: "",
  sampleSentenceEnglish: "",
});

const supabase = useSupabaseClient();

// Computed properties for filtering
const activeWords = computed(() =>
  words.value.filter((word) => word.status === "active")
);
const pausedWords = computed(() =>
  words.value.filter((word) => word.status === "paused")
);
const filteredWords = computed(() => {
  if (filterStatus.value === "active") return activeWords.value;
  if (filterStatus.value === "paused") return pausedWords.value;
  return words.value;
});

const fetchWords = async () => {
  loading.value = true;
  error.value = null;

  try {
    const { data, error: fetchError } = await supabase
      .from("quiz_words")
      .select("*")
      .order("created_at", { ascending: true });

    if (fetchError) throw fetchError;

    return (words.value = data);
  } catch (err) {
    console.error("❌ Error fetching words:", err);
    error.value = "Failed to load words. Please try again.";
  } finally {
    loading.value = false;
  }
};

const addWord = async () => {
  if (!newWord.value.chinese || !newWord.value.english) return;

  loading.value = true;
  error.value = null;

  try {
    const { data, error: insertError } = await supabase
      .from("quiz_words")
      .insert({
        chinese: newWord.value.chinese,
        english: newWord.value.english,
        sample_sentence_chinese: newWord.value.sampleSentenceChinese || null,
        sample_sentence_english: newWord.value.sampleSentenceEnglish || null,
        status: "active", // New words are active by default
      })
      .select();

    if (insertError) throw insertError;

    // Reset form
    newWord.value = {
      chinese: "",
      english: "",
      sampleSentenceChinese: "",
      sampleSentenceEnglish: "",
    };

    // Refresh the words list to show the new word
    await fetchWords();

    console.log("✅ Word added successfully");
  } catch (err) {
    console.error("❌ Error adding word:", err);
    error.value = "Failed to add word. Please try again.";
  } finally {
    loading.value = false;
  }
};

const editWord = (word) => {
  editingWord.value = { ...word };
};

const cancelEdit = () => {
  editingWord.value = null;
};

const updateWord = async () => {
  if (
    !editingWord.value ||
    !editingWord.value.chinese ||
    !editingWord.value.english
  )
    return;

  loading.value = true;
  error.value = null;

  try {
    const { data, error: updateError } = await supabase
      .from("quiz_words")
      .update({
        chinese: editingWord.value.chinese,
        english: editingWord.value.english,
        sample_sentence_chinese:
          editingWord.value.sample_sentence_chinese || null,
        sample_sentence_english:
          editingWord.value.sample_sentence_english || null,
        status: editingWord.value.status || "active",
      })
      .eq("id", editingWord.value.id)
      .select();

    if (updateError) throw updateError;

    // Close the edit modal
    editingWord.value = null;

    // Refresh the words list to show the updated word
    await fetchWords();

    console.log("✅ Word updated successfully");
  } catch (err) {
    console.error("❌ Error updating word:", err);
    error.value = "Failed to update word. Please try again.";
  } finally {
    loading.value = false;
  }
};

const toggleWordStatus = async (word) => {
  loading.value = true;
  error.value = null;

  try {
    const newStatus = word.status === "active" ? "paused" : "active";

    const { error: updateError } = await supabase
      .from("quiz_words")
      .update({ status: newStatus })
      .eq("id", word.id);

    if (updateError) throw updateError;

    // Refresh the words list to show the updated status
    await fetchWords();

    console.log(
      `✅ Word ${newStatus === "paused" ? "paused" : "resumed"} successfully`
    );
  } catch (err) {
    console.error("❌ Error updating word status:", err);
    error.value = "Failed to update word status. Please try again.";
  } finally {
    loading.value = false;
  }
};

const deleteWord = async (word) => {
  if (
    !confirm(
      `Are you sure you want to delete "${word.chinese}" (${word.english})?`
    )
  ) {
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const { error: deleteError } = await supabase
      .from("quiz_words")
      .delete()
      .eq("id", word.id);

    if (deleteError) throw deleteError;

    // Refresh the words list to remove the deleted word
    await fetchWords();

    console.log("✅ Word deleted successfully");
  } catch (err) {
    console.error("❌ Error deleting word:", err);
    error.value = "Failed to delete word. Please try again.";
  } finally {
    loading.value = false;
  }
};

const refreshWords = () => {
  fetchWords();
};

// Load words on mount
onMounted(() => {
  fetchWords();
});
</script>

<style scoped>
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

.chinese-text {
  font-family: "Noto Sans SC", "Source Han Sans", "PingFang SC",
    "Microsoft YaHei", sans-serif;
}

.max-h-90vh {
  max-height: 90vh;
}
</style>
