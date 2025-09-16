<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100"
  >
    <!-- Header -->
    <header class="flex justify-between items-center p-4 md:p-6">
      <NuxtLink
        to="/settings"
        class="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <span>←</span>
        <span class="hidden sm:inline">Back</span>
      </NuxtLink>

      <div class="text-lg md:text-2xl font-bold text-blue-600">
        🧮 Manage Math Questions
      </div>

      <button
        @click="showAddForm = true"
        class="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <span>+</span>
        <span class="hidden sm:inline">Add Question</span>
      </button>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 md:px-6 py-8">
      <!-- Filter Tabs -->
      <div class="max-w-4xl mx-auto mb-6">
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

      <!-- Questions List -->
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold text-gray-700 mb-6">
          {{
            filterStatus === "all"
              ? "All"
              : filterStatus === "active"
              ? "Active"
              : "Paused"
          }}
          Questions ({{ filteredQuestions.length }})
        </h2>

        <div v-if="filteredQuestions.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📝</div>
          <p class="text-xl text-gray-500 mb-4">
            {{
              filterStatus === "all"
                ? "No math questions yet"
                : `No ${filterStatus} questions found`
            }}
          </p>
          <button
            @click="showAddForm = true"
            class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {{
              filterStatus === "all"
                ? "Add Your First Question"
                : "Add New Question"
            }}
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(question, index) in filteredQuestions"
            :key="question.id"
            :class="[
              'bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300',
              question.status === 'paused' ? 'border-2 border-orange-200' : '',
            ]"
          >
            <div
              class="flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div class="flex-1 mb-4 md:mb-0">
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

                <h3
                  :class="[
                    'text-xl font-bold mb-2',
                    question.status === 'paused'
                      ? 'text-orange-600'
                      : 'text-gray-800',
                  ]"
                >
                  {{ question.question }}
                </h3>
                <p class="text-lg text-green-600 font-semibold mb-2">
                  Answer: {{ question.answer }}
                </p>
                <p v-if="question.explanation" class="text-gray-600">
                  {{ question.explanation }}
                </p>
              </div>
              <div class="flex gap-2">
                <button
                  @click="editQuestion(question)"
                  class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full text-sm shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Edit
                </button>
                <button
                  @click="toggleQuestionStatus(question)"
                  :disabled="loading"
                  :class="[
                    'font-bold py-2 px-4 rounded-full text-sm shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100',
                    question.status === 'paused'
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white',
                  ]"
                >
                  {{ question.status === "paused" ? "Resume" : "Pause" }}
                </button>
                <button
                  @click="deleteQuestion(question.id)"
                  class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full text-sm shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Question Modal -->
      <div
        v-if="showAddForm || editingQuestion"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-screen overflow-y-auto"
        >
          <h3 class="text-2xl font-bold text-gray-800 mb-6">
            {{ editingQuestion ? "Edit Question" : "Add New Question" }}
          </h3>

          <form @submit.prevent="saveQuestion" class="space-y-6">
            <div>
              <label class="block text-lg font-semibold text-gray-700 mb-2">
                Math Question:
              </label>
              <input
                v-model="formData.question"
                type="text"
                placeholder="e.g., 15 + 27 = ?"
                class="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                required
              />
            </div>

            <div>
              <label class="block text-lg font-semibold text-gray-700 mb-2">
                Correct Answer:
              </label>
              <input
                v-model="formData.answer"
                type="text"
                placeholder="e.g., 42"
                class="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                required
              />
            </div>

            <div>
              <label class="block text-lg font-semibold text-gray-700 mb-2">
                Explanation (Optional):
              </label>
              <textarea
                v-model="formData.explanation"
                placeholder="Explain how to solve this problem..."
                class="w-full h-24 p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg resize-none"
              ></textarea>
            </div>

            <!-- Status Selection (only shown when editing) -->
            <div v-if="editingQuestion">
              <label class="block text-lg font-semibold text-gray-700 mb-2">
                Status:
              </label>
              <select
                v-model="formData.status"
                class="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
              >
                <option value="active">✅ Active</option>
                <option value="paused">⏸️ Paused</option>
              </select>
            </div>

            <div class="flex gap-4 justify-end">
              <button
                type="button"
                @click="cancelEdit"
                class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {{ editingQuestion ? "Update" : "Add" }} Question
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
  title: "Manage Math Questions - Settings",
  meta: [
    {
      name: "description",
      content: "Manage math practice questions for your child",
    },
  ],
});

const questions = ref([]);
const loading = ref(false);
const error = ref(null);
const showAddForm = ref(false);
const editingQuestion = ref(null);
const filterStatus = ref("all");
const formData = ref({
  question: "",
  answer: "",
  explanation: "",
  status: "active",
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
    if (editingQuestion.value) {
      // Update existing question
      const { error: updateError } = await supabase
        .from("math_questions")
        .update({
          question: questionData.question,
          answer: questionData.answer,
          explanation: questionData.explanation,
          status: questionData.status || "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingQuestion.value.id);

      if (updateError) throw updateError;
    } else {
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
    }

    console.log("✅ Question saved to database");
    await loadQuestions(); // Reload questions
  } catch (err) {
    console.error("❌ Error saving question to database:", err);
    // Fallback to localStorage
    saveToLocalStorage();
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
const deleteQuestionFromDatabase = async (id) => {
  try {
    const { error: deleteError } = await supabase
      .from("math_questions")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    console.log("✅ Question deleted from database");
    await loadQuestions(); // Reload questions
  } catch (err) {
    console.error("❌ Error deleting question from database:", err);
    // Fallback to localStorage
    questions.value = questions.value.filter((q) => q.id !== id);
    saveToLocalStorage();
  }
};

// Update methods
const saveQuestion = async () => {
  await saveQuestionToDatabase(formData.value);
  cancelEdit();
};

const deleteQuestion = async (id) => {
  if (confirm("Are you sure you want to delete this question?")) {
    await deleteQuestionFromDatabase(id);
  }
};

// Methods
const editQuestion = (question) => {
  editingQuestion.value = question;
  formData.value = { ...question };
};

const cancelEdit = () => {
  showAddForm.value = false;
  editingQuestion.value = null;
  formData.value = {
    question: "",
    answer: "",
    explanation: "",
    status: "active",
  };
};

const saveToLocalStorage = () => {
  localStorage.setItem("mathQuestions", JSON.stringify(questions.value));
};

// Load questions on mount
onMounted(async () => {
  await loadQuestions();
});
</script>
