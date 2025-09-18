<template>
  <div
    class="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100"
  >
    <!-- Header -->
    <header class="flex justify-between items-center p-4 md:p-6">
      <NuxtLink
        to="/progress/spelling-english"
        class="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <span>←</span>
        <span class="hidden sm:inline">Back to Progress</span>
      </NuxtLink>

      <div class="text-lg md:text-2xl font-bold text-green-600">
        ⚙️ <span class="hidden sm:inline">Spelling Settings</span>
      </div>

      <div class="w-16 md:w-32"></div>
    </header>

    <main class="container mx-auto px-4 md:px-6 py-6 md:py-8">
      <!-- Page Title -->
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-5xl font-bold text-green-600 mb-4">
          ✏️ Manage Spelling Words
        </h1>
        <p class="text-lg md:text-xl text-gray-700">
          Add, edit, pause, or remove words from spelling practice list
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
              <!-- Word -->
              <div>
                <label
                  class="block text-base md:text-lg font-semibold text-gray-700 mb-2"
                >
                  Word <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="newWord.word"
                  type="text"
                  placeholder="Enter the word to spell"
                  class="input-primary"
                  required
                />
              </div>

              <!-- Definition -->
              <div>
                <label
                  class="block text-base md:text-lg font-semibold text-gray-700 mb-2"
                >
                  Definition <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="newWord.definition"
                  type="text"
                  placeholder="What does this word mean?"
                  class="input-primary"
                  required
                />
              </div>
            </div>

            <!-- Sample Sentence -->
            <div>
              <label
                class="block text-base md:text-lg font-semibold text-gray-700 mb-2"
              >
                Sample Sentence
              </label>
              <textarea
                v-model="newWord.sentence"
                rows="3"
                placeholder="Use the word in a sentence for context"
                class="input-primary resize-none"
              ></textarea>
            </div>

            <!-- Submit Button -->
            <div class="text-center">
              <button
                type="submit"
                :disabled="!newWord.word || !newWord.definition || loading"
                class="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-full text-base md:text-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100"
              >
                {{ loading ? "Adding..." : "Add Word" }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Words List -->
      <div class="max-w-6xl mx-auto">
        <!-- Filter Tabs -->
        <div class="flex justify-center mb-6 md:mb-8">
          <div class="bg-white rounded-full p-1 shadow-lg">
            <button
              @click="filterStatus = 'all'"
              :class="[
                'px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold transition-all duration-200',
                filterStatus === 'all'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 hover:text-green-600',
              ]"
            >
              All Words ({{ words.length }})
            </button>
            <button
              @click="filterStatus = 'active'"
              :class="[
                'px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold transition-all duration-200',
                filterStatus === 'active'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 hover:text-green-600',
              ]"
            >
              Active ({{ activeWords.length }})
            </button>
            <button
              @click="filterStatus = 'paused'"
              :class="[
                'px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold transition-all duration-200',
                filterStatus === 'paused'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-orange-600',
              ]"
            >
              Paused ({{ pausedWords.length }})
            </button>
          </div>
        </div>

        <!-- Error Display -->
        <div v-if="error" class="mb-6">
          <div
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl"
          >
            {{ error }}
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading && words.length === 0" class="text-center py-8">
          <div class="text-4xl mb-4">⏳</div>
          <p class="text-lg text-gray-600">Loading words...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredWords.length === 0" class="text-center py-8">
          <div class="text-4xl mb-4">📝</div>
          <h3 class="text-xl font-bold text-gray-700 mb-2">
            {{
              filterStatus === "all"
                ? "No words yet"
                : `No ${filterStatus} words`
            }}
          </h3>
          <p class="text-gray-600 mb-4">
            {{
              filterStatus === "all"
                ? "Add your first spelling word above!"
                : `No ${filterStatus} words found.`
            }}
          </p>
        </div>

        <!-- Words Grid -->
        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          <div
            v-for="word in filteredWords"
            :key="word.id"
            :class="[
              'bg-white rounded-2xl shadow-lg p-4 md:p-6 transition-all duration-200 hover:shadow-xl',
              word.status === 'paused'
                ? 'opacity-75 border-2 border-orange-200'
                : 'hover:scale-105',
            ]"
          >
            <!-- Word Header -->
            <div class="flex justify-between items-start mb-3">
              <div class="flex-1">
                <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-1">
                  {{ word.word }}
                </h3>
                <p class="text-sm text-gray-600">{{ word.definition }}</p>
              </div>
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-semibold',
                  word.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-orange-100 text-orange-800',
                ]"
              >
                {{ word.status }}
              </span>
            </div>

            <!-- Sample Sentence -->
            <div v-if="word.sentence" class="mb-4">
              <p class="text-sm text-gray-600 italic">"{{ word.sentence }}"</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-2">
              <button
                @click="editWord(word)"
                class="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white text-xs px-3 py-1 rounded-full transform transition-all duration-200 hover:scale-105"
              >
                ✏️ Edit
              </button>

              <button
                @click="toggleWordStatus(word)"
                :class="[
                  'text-white text-xs px-3 py-1 rounded-full transform transition-all duration-200 hover:scale-105',
                  word.status === 'active'
                    ? 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600'
                    : 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600',
                ]"
              >
                {{ word.status === "active" ? "⏸️ Pause" : "▶️ Activate" }}
              </button>

              <button
                @click="deleteWord(word)"
                class="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white text-xs px-3 py-1 rounded-full transform transition-all duration-200 hover:scale-105"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Edit Word Modal -->
    <div
      v-if="editingWord"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div class="text-center mb-4">
          <div class="text-4xl mb-4">✏️</div>
          <h3 class="text-xl font-bold text-gray-700 mb-4">Edit Word</h3>
        </div>

        <form @submit.prevent="updateWord" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Word <span class="text-red-500">*</span>
            </label>
            <input
              v-model="editingWord.word"
              type="text"
              class="input-primary"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Definition <span class="text-red-500">*</span>
            </label>
            <input
              v-model="editingWord.definition"
              type="text"
              class="input-primary"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Sample Sentence
            </label>
            <textarea
              v-model="editingWord.sentence"
              rows="3"
              class="input-primary resize-none"
            ></textarea>
          </div>

          <div class="flex gap-4 pt-4">
            <button
              type="button"
              @click="cancelEdit"
              class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="
                !editingWord.word || !editingWord.definition || loading
              "
              class="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-full"
            >
              {{ loading ? "Saving..." : "Save" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Toast -->
    <div
      v-if="showSuccessToast"
      class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-bounce"
    >
      ✅ Word updated successfully!
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// Page metadata
useHead({
  title: "Manage Spelling Words - Learning Fun!",
  meta: [
    {
      name: "description",
      content: "Add, edit, and manage English spelling words for practice",
    },
  ],
});

// Supabase client
const supabase = useSupabaseClient();

// Component state
const loading = ref(false);
const error = ref(null);
const words = ref([]);
const editingWord = ref(null);
const filterStatus = ref("all");
const showSuccessToast = ref(false);

// New word form
const newWord = ref({
  word: "",
  definition: "",
  sentence: "",
});

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

// Load words from database
const fetchWords = async () => {
  loading.value = true;
  error.value = null;

  try {
    const { data, error: fetchError } = await supabase
      .from("spelling_words")
      .select("*")
      .order("created_at", { ascending: true });

    if (fetchError) throw fetchError;

    words.value = data || [];
  } catch (err) {
    console.error("❌ Error fetching words:", err);
    error.value = "Failed to load words. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Add new word
const addWord = async () => {
  if (!newWord.value.word || !newWord.value.definition) return;

  loading.value = true;
  error.value = null;

  try {
    const { data, error: insertError } = await supabase
      .from("spelling_words")
      .insert({
        word: newWord.value.word.trim(),
        definition: newWord.value.definition.trim(),
        sentence: newWord.value.sentence.trim() || null,
        status: "active", // New words are active by default
      })
      .select();

    if (insertError) throw insertError;

    // Reset form
    newWord.value = {
      word: "",
      definition: "",
      sentence: "",
    };

    // Refresh the words list to show the new word
    await fetchWords();

    // Show success feedback
    showSuccessToast.value = true;
    setTimeout(() => {
      showSuccessToast.value = false;
    }, 3000);
  } catch (err) {
    console.error("❌ Error adding word:", err);
    error.value = "Failed to add word. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Edit word functions
const editWord = (word) => {
  editingWord.value = { ...word };
};

const cancelEdit = () => {
  editingWord.value = null;
};

const updateWord = async () => {
  if (
    !editingWord.value ||
    !editingWord.value.word ||
    !editingWord.value.definition
  )
    return;

  loading.value = true;
  error.value = null;

  try {
    const { data, error: updateError } = await supabase
      .from("spelling_words")
      .update({
        word: editingWord.value.word.trim(),
        definition: editingWord.value.definition.trim(),
        sentence: editingWord.value.sentence?.trim() || null,
        status: editingWord.value.status || "active",
      })
      .eq("id", editingWord.value.id)
      .select();

    if (updateError) throw updateError;

    // Close the edit modal
    editingWord.value = null;

    // Refresh the words list to show the updated word
    await fetchWords();

    // Show success feedback
    showSuccessToast.value = true;
    setTimeout(() => {
      showSuccessToast.value = false;
    }, 3000);
  } catch (err) {
    console.error("❌ Error updating word:", err);
    error.value = "Failed to update word. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Toggle word status (active/paused)
const toggleWordStatus = async (word) => {
  loading.value = true;
  error.value = null;

  try {
    const newStatus = word.status === "active" ? "paused" : "active";

    const { error: updateError } = await supabase
      .from("spelling_words")
      .update({ status: newStatus })
      .eq("id", word.id);

    if (updateError) throw updateError;

    // Refresh the words list to show the updated status
    await fetchWords();
  } catch (err) {
    console.error("❌ Error updating word status:", err);
    error.value = "Failed to update word status. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Delete word
const deleteWord = async (word) => {
  if (
    !confirm(
      `Are you sure you want to delete "${word.word}" (${word.definition})?`
    )
  ) {
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const { error: deleteError } = await supabase
      .from("spelling_words")
      .delete()
      .eq("id", word.id);

    if (deleteError) throw deleteError;

    // Refresh the words list to remove the deleted word
    await fetchWords();

    // Show success feedback
    showSuccessToast.value = true;
    setTimeout(() => {
      showSuccessToast.value = false;
    }, 3000);
  } catch (err) {
    console.error("❌ Error deleting word:", err);
    error.value = "Failed to delete word. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchWords();
});
</script>

<style scoped>
/* Custom input styles */
.input-primary {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  outline: none;
  transition: all 0.2s ease-in-out;
}

.input-primary:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

/* Card styles */
.card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

@media (min-width: 768px) {
  .card {
    padding: 2rem;
  }
}

.card-colorful {
  background-color: white;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 1.5rem;
}

@media (min-width: 768px) {
  .card-colorful {
    padding: 2rem;
  }
}
</style>
