<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100"
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

      <div class="text-lg md:text-2xl font-bold text-blue-600">
        🧮 <span class="hidden sm:inline">Manage Math</span>
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
          class="text-3xl md:text-5xl font-bold text-blue-600 mb-2 md:mb-4 bounce-gentle"
        >
          Math Question Manager
        </h1>
        <p class="text-lg md:text-xl text-gray-700">
          Add, edit, pause, or remove math questions from Elsa's practice list
        </p>
      </div>

      <!-- Add New Question Form -->
      <div class="max-w-4xl mx-auto mb-8 md:mb-12">
        <div class="card-colorful">
          <div class="text-3xl md:text-4xl mb-3 md:mb-4 text-center">➕</div>
          <h2
            class="text-2xl md:text-3xl font-bold text-gray-700 mb-4 md:mb-6 text-center"
          >
            Add New Question
          </h2>

          <form @submit.prevent="saveQuestion" class="space-y-4 md:space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <!-- Math Question -->
              <div>
                <label
                  class="block text-base md:text-lg font-semibold text-gray-700 mb-2"
                >
                  Math Question <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.question"
                  type="text"
                  required
                  placeholder="e.g., 15 + 27 = ?"
                  class="w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>

              <!-- Correct Answer -->
              <div>
                <label
                  class="block text-base md:text-lg font-semibold text-gray-700 mb-2"
                >
                  Correct Answer <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.answer"
                  type="text"
                  required
                  placeholder="e.g., 42"
                  class="w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <!-- Explanation -->
              <div>
                <label
                  class="block text-base md:text-lg font-semibold text-gray-700 mb-2"
                >
                  Explanation (Optional)
                </label>
                <textarea
                  v-model="formData.explanation"
                  rows="3"
                  placeholder="Explain how to solve this problem..."
                  class="w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                ></textarea>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="text-center">
              <button
                type="submit"
                :disabled="loading || !formData.question || !formData.answer"
                class="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-full text-lg md:text-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                <span v-if="loading">⏳ Adding...</span>
                <span v-else>➕ Add Question</span>
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
              All ({{ questions.length }})
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
              Active ({{ activeQuestions.length }})
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
              Paused ({{ pausedQuestions.length }})
            </button>
          </div>
        </div>
      </div>

      <!-- Current Questions List -->
      <div class="max-w-6xl mx-auto">
        <div class="bg-white rounded-2xl shadow-xl p-4 md:p-8">
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4"
          >
            <h2
              class="text-2xl md:text-3xl font-bold text-gray-700 flex items-center gap-3"
            >
              <span>🧮</span>
              <span class="hidden sm:inline"
                >{{
                  filterStatus === "all"
                    ? "All"
                    : filterStatus === "active"
                    ? "Active"
                    : "Paused"
                }}
                Math Questions ({{ filteredQuestions.length }})</span
              >
              <span class="sm:hidden"
                >Questions ({{ filteredQuestions.length }})</span
              >
            </h2>

            <button
              @click="refreshQuestions"
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
            v-if="loading && questions.length === 0"
            class="text-center py-8 md:py-12"
          >
            <div class="text-4xl md:text-6xl mb-3 md:mb-4">⏳</div>
            <p class="text-lg md:text-xl text-gray-600">Loading questions...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-8 md:py-12">
            <div class="text-4xl md:text-6xl mb-3 md:mb-4">❌</div>
            <p class="text-lg md:text-xl text-red-600 mb-4">{{ error }}</p>
            <button
              @click="refreshQuestions"
              class="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold py-2 px-4 rounded-full"
            >
              Try Again
            </button>
          </div>

          <!-- Questions Grid -->
          <div
            v-else-if="filteredQuestions.length > 0"
            class="grid gap-4 md:gap-6"
          >
            <div
              v-for="question in filteredQuestions"
              :key="question.id"
              :class="[
                'border-2 rounded-xl p-4 md:p-6 transition-all duration-200',
                question.status === 'paused'
                  ? 'border-orange-200 bg-orange-50 hover:border-orange-300'
                  : 'border-gray-200 hover:border-blue-300',
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
                        question.status === 'paused'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800',
                      ]"
                    >
                      {{
                        question.status === "paused" ? "⏸️ Paused" : "✅ Active"
                      }}
                    </span>
                  </div>

                  <!-- Question Info -->
                  <div class="mb-3 md:mb-4">
                    <label
                      class="block text-xs md:text-sm font-semibold text-gray-600 mb-1"
                    >
                      Question
                    </label>
                    <div
                      :class="[
                        'text-xl md:text-2xl font-bold mb-2',
                        question.status === 'paused'
                          ? 'text-orange-600'
                          : 'text-blue-600',
                      ]"
                    >
                      {{ question.question }}
                    </div>

                    <label
                      class="block text-xs md:text-sm font-semibold text-gray-600 mb-1"
                    >
                      Answer
                    </label>
                    <div
                      class="text-lg md:text-xl text-green-600 font-semibold mb-2"
                    >
                      {{ question.answer }}
                    </div>

                    <!-- Explanation -->
                    <div v-if="question.explanation">
                      <label
                        class="block text-xs md:text-sm font-semibold text-gray-600 mb-1"
                      >
                        Explanation
                      </label>
                      <div class="text-base md:text-lg text-gray-600">
                        {{ question.explanation }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div
                  class="flex lg:flex-col gap-2 justify-end lg:justify-start lg:ml-6"
                >
                  <button
                    @click="editQuestion(question)"
                    class="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-2 px-3 md:px-4 rounded-full text-xs md:text-sm shadow-lg transform transition-all duration-200 hover:scale-105 flex-1 lg:flex-none"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    @click="toggleQuestionStatus(question)"
                    :disabled="loading"
                    :class="[
                      'font-bold py-2 px-3 md:px-4 rounded-full text-xs md:text-sm shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100 flex-1 lg:flex-none',
                      question.status === 'paused'
                        ? 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white'
                        : 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white',
                    ]"
                  >
                    {{
                      question.status === "paused" ? "▶️ Resume" : "⏸️ Pause"
                    }}
                  </button>
                  <button
                    @click="deleteQuestion(question)"
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
            <div class="text-4xl md:text-6xl mb-3 md:mb-4">🧮</div>
            <p class="text-lg md:text-xl text-gray-600 mb-3 md:mb-4">
              {{
                filterStatus === "all"
                  ? "No questions found"
                  : `No ${filterStatus} questions found`
              }}
            </p>
            <p class="text-gray-500">
              {{
                filterStatus === "all"
                  ? "Add your first question using the form above!"
                  : `Try switching to a different filter or add new questions.`
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div
        v-if="editingQuestion"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click.self="cancelEdit"
      >
        <div
          class="bg-white rounded-2xl p-4 md:p-8 max-w-2xl w-full max-h-90vh overflow-y-auto"
        >
          <h3
            class="text-xl md:text-2xl font-bold text-gray-700 mb-4 md:mb-6 text-center"
          >
            ✏️ Edit Question
          </h3>

          <form @submit.prevent="updateQuestion" class="space-y-4 md:space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label
                  class="block text-base md:text-lg font-semibold text-gray-700 mb-2"
                >
                  Math Question <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="editingQuestion.question"
                  type="text"
                  required
                  class="w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  class="block text-base md:text-lg font-semibold text-gray-700 mb-2"
                >
                  Correct Answer <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="editingQuestion.answer"
                  type="text"
                  required
                  class="w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                class="block text-base md:text-lg font-semibold text-gray-700 mb-2"
              >
                Explanation (Optional)
              </label>
              <textarea
                v-model="editingQuestion.explanation"
                rows="3"
                class="w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
              ></textarea>
            </div>

            <!-- Status Selection -->
            <div>
              <label
                class="block text-base md:text-lg font-semibold text-gray-700 mb-2"
              >
                Status
              </label>
              <select
                v-model="editingQuestion.status"
                class="w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
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
                class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-base md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100"
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
useHead({
  title: "Manage Math Questions - Chinese Learning Fun!",
  meta: [
    {
      name: "description",
      content: "Add, edit, and manage math practice questions",
    },
  ],
});

const questions = ref([]);
const loading = ref(false);
const error = ref(null);
const editingQuestion = ref(null);
const filterStatus = ref("all");
const formData = ref({
  question: "",
  answer: "",
  explanation: "",
});

// Supabase client
const supabase = useSupabaseClient();

// Computed properties for filtering
const activeQuestions = computed(() =>
  questions.value.filter((question) => question.status === "active")
);
const pausedQuestions = computed(() =>
  questions.value.filter((question) => question.status === "paused")
);
const filteredQuestions = computed(() => {
  if (filterStatus.value === "active") return activeQuestions.value;
  if (filterStatus.value === "paused") return pausedQuestions.value;
  return questions.value;
});

// Load questions from database
const loadQuestions = async () => {
  loading.value = true;
  error.value = null;

  try {
    const { data: mathQuestions, error: fetchError } = await supabase
      .from("math_questions")
      .select("*")
      .order("created_at", { ascending: true });

    if (fetchError) throw fetchError;

    questions.value = mathQuestions || [];
    console.log("✅ Math questions loaded from database");
  } catch (err) {
    console.error("❌ Error loading math questions:", err);
    error.value = "Failed to load questions. Please try again.";

    // Fallback to localStorage
    const stored = localStorage.getItem("mathQuestions");
    if (stored) {
      questions.value = JSON.parse(stored);
    }
  } finally {
    loading.value = false;
  }
};

// Save question to database
const saveQuestionToDatabase = async (questionData) => {
  try {
    // Insert new question
    const { error: insertError } = await supabase
      .from("math_questions")
      .insert({
        question: questionData.question,
        answer: questionData.answer,
        explanation: questionData.explanation,
        status: "active", // New questions are always active
      });

    if (insertError) throw insertError;

    console.log("✅ Question saved to database");
    await loadQuestions(); // Reload questions
  } catch (err) {
    console.error("❌ Error saving question to database:", err);
    error.value = "Failed to save question. Please try again.";
  }
};

// Toggle question status
const toggleQuestionStatus = async (question) => {
  loading.value = true;
  error.value = null;

  try {
    const newStatus = question.status === "active" ? "paused" : "active";

    const { error: updateError } = await supabase
      .from("math_questions")
      .update({ status: newStatus })
      .eq("id", question.id);

    if (updateError) throw updateError;

    // Refresh the questions list to show the updated status
    await loadQuestions();

    console.log(
      `✅ Question ${
        newStatus === "paused" ? "paused" : "resumed"
      } successfully`
    );
  } catch (err) {
    console.error("❌ Error updating question status:", err);
    error.value = "Failed to update question status. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Delete question from database
const deleteQuestionFromDatabase = async (question) => {
  if (!confirm(`Are you sure you want to delete "${question.question}"?`)) {
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const { error: deleteError } = await supabase
      .from("math_questions")
      .delete()
      .eq("id", question.id);

    if (deleteError) throw deleteError;

    console.log("✅ Question deleted from database");
    await loadQuestions(); // Reload questions
  } catch (err) {
    console.error("❌ Error deleting question from database:", err);
    error.value = "Failed to delete question. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Methods
const saveQuestion = async () => {
  if (!formData.value.question || !formData.value.answer) return;

  await saveQuestionToDatabase(formData.value);

  // Reset form
  formData.value = {
    question: "",
    answer: "",
    explanation: "",
  };
};

const deleteQuestion = async (question) => {
  await deleteQuestionFromDatabase(question);
};

const editQuestion = (question) => {
  editingQuestion.value = { ...question };
};

const cancelEdit = () => {
  editingQuestion.value = null;
};

const updateQuestion = async () => {
  if (
    !editingQuestion.value ||
    !editingQuestion.value.question ||
    !editingQuestion.value.answer
  )
    return;

  loading.value = true;
  error.value = null;

  try {
    const { error: updateError } = await supabase
      .from("math_questions")
      .update({
        question: editingQuestion.value.question,
        answer: editingQuestion.value.answer,
        explanation: editingQuestion.value.explanation || null,
        status: editingQuestion.value.status || "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingQuestion.value.id);

    if (updateError) throw updateError;

    // Close the edit modal
    editingQuestion.value = null;

    // Refresh the questions list to show the updated question
    await loadQuestions();

    console.log("✅ Question updated successfully");
  } catch (err) {
    console.error("❌ Error updating question:", err);
    error.value = "Failed to update question. Please try again.";
  } finally {
    loading.value = false;
  }
};

const refreshQuestions = () => {
  loadQuestions();
};

// Load questions on mount
onMounted(async () => {
  await loadQuestions();
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

.card-colorful {
  @apply bg-white rounded-2xl shadow-xl p-6 md:p-8;
}

.max-h-90vh {
  max-height: 90vh;
}
</style>
