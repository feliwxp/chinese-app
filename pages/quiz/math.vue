<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100"
  >
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="text-4xl md:text-6xl mb-4">⏳</div>
        <p class="text-lg md:text-2xl text-gray-600">
          Loading math questions...
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="min-h-screen flex items-center justify-center p-4"
    >
      <div class="text-center">
        <div class="text-4xl md:text-6xl mb-4">❌</div>
        <p class="text-lg text-red-600 mb-4">{{ error }}</p>
        <button
          @click="loadQuestions"
          class="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 px-6 rounded-full text-lg"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- No Questions State -->
    <div
      v-else-if="questions.length === 0"
      class="min-h-screen flex items-center justify-center p-4"
    >
      <div class="text-center">
        <div class="text-4xl md:text-6xl mb-4">📝</div>
        <h2 class="text-2xl font-bold text-gray-700 mb-4">
          No Active Math Questions Available
        </h2>
        <p class="text-lg text-gray-600 mb-6">
          Ask your parent to add some math questions in Settings first!
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/settings/math"
            class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Add Questions
          </NuxtLink>
          <NuxtLink
            to="/"
            class="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Back Home
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Header -->
      <header class="flex justify-between items-center p-4 md:p-6">
        <NuxtLink
          to="/progress/math"
          class="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <span>←</span>
          <span class="hidden sm:inline">Back</span>
        </NuxtLink>

        <div class="text-lg md:text-2xl font-bold text-blue-600">
          🧮 <span class="hidden sm:inline">Math Practice</span>
        </div>

        <div
          v-if="practiceStarted"
          class="text-sm md:text-lg font-semibold text-blue-600"
        >
          Score: {{ score }}
        </div>
        <div v-else class="w-16 md:w-14"></div>
      </header>

      <main class="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <!-- Today's Practice Already Completed -->
        <div v-if="todayCompleted && !practiceStarted" class="text-center">
          <h1
            class="text-3xl md:text-5xl font-bold text-green-600 mb-4 md:mb-6 bounce-gentle"
          >
            Already Done Today! 🎉
          </h1>

          <div class="card-colorful max-w-2xl mx-auto">
            <div class="text-3xl md:text-4xl mb-4 md:mb-6">🏆</div>
            <h2
              class="text-xl md:text-2xl font-bold text-gray-700 mb-4 md:mb-6"
            >
              Today's Results
            </h2>

            <!-- Today's Results -->
            <div class="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
              <div
                class="bg-green-50 rounded-xl p-3 md:p-4 border-2 border-green-200"
              >
                <div class="text-xl md:text-2xl font-bold text-green-600">
                  {{ todayResults.score }}
                </div>
                <div class="text-xs md:text-sm text-gray-600">Score</div>
              </div>
              <div
                class="bg-blue-50 rounded-xl p-3 md:p-4 border-2 border-blue-200"
              >
                <div class="text-xl md:text-2xl font-bold text-blue-600">
                  {{ todayResults.accuracy }}%
                </div>
                <div class="text-xs md:text-sm text-gray-600">Accuracy</div>
              </div>
            </div>

            <div class="space-y-3 md:space-y-4">
              <NuxtLink
                to="/progress/math"
                class="btn-primary inline-flex items-center gap-2 text-base md:text-xl py-3 px-6"
              >
                <span>📊</span>
                View Progress
              </NuxtLink>

              <div class="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  @click="allowRetake"
                  class="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                  🔄 <span class="hidden sm:inline">Practice Again</span
                  ><span class="sm:hidden">Again</span>
                </button>

                <NuxtLink
                  to="/"
                  class="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                  🏠 Home
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Practice Not Started -->
        <div v-else-if="!practiceStarted" class="text-center">
          <h1
            class="text-3xl md:text-5xl font-bold text-blue-600 mb-4 md:mb-6 bounce-gentle"
          >
            Ready to Practice? 🎯
          </h1>

          <div class="card-colorful max-w-2xl mx-auto">
            <div class="text-3xl md:text-4xl mb-4 md:mb-6">🧮</div>
            <h2 class="text-xl md:text-2xl font-bold text-gray-700 mb-4">
              <span class="hidden sm:inline"
                >Today's Math Practice Challenge</span
              >
              <span class="sm:hidden">Today's Challenge</span>
            </h2>

            <div class="bg-white rounded-xl p-3 md:p-4 mb-4 md:mb-6">
              <h3 class="font-bold text-blue-600 mb-2 text-sm md:text-lg">
                📊
                <span class="hidden sm:inline"
                  >Today's Questions ({{ questions.length }} problems):</span
                >
                <span class="sm:hidden">{{ questions.length }} Problems:</span>
              </h3>
              <div
                class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm"
              >
                <div
                  v-for="(question, index) in questions.slice(0, 6)"
                  :key="question.id"
                  class="bg-blue-50 rounded px-2 py-1 text-left"
                >
                  <span class="font-bold">{{ index + 1 }}.</span>
                  {{ question.question.substring(0, 40) }}...
                </div>
                <div
                  v-if="questions.length > 6"
                  class="bg-gray-50 rounded px-2 py-1 text-gray-500"
                >
                  +{{ questions.length - 6 }} more...
                </div>
              </div>
            </div>

            <div class="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <div class="bg-white rounded-xl p-3 md:p-4 text-left">
                <h3 class="font-bold text-blue-600 mb-2 text-sm md:text-lg">
                  🎯 How it works:
                </h3>
                <ul
                  class="text-gray-600 space-y-1 md:space-y-2 text-xs md:text-base"
                >
                  <li>• Read each word problem carefully</li>
                  <li>• Use the work area to show your calculations</li>
                  <li>• Enter your final answer in the answer box</li>
                  <li>• Get detailed explanations for each problem</li>
                  <li>• Earn points for correct answers!</li>
                </ul>
              </div>
            </div>

            <button
              @click="startPractice"
              :disabled="questions.length === 0"
              class="btn-primary text-base md:text-xl py-3 px-6 md:py-4 md:px-8 inline-flex items-center gap-2 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
            >
              <span>🚀</span>
              {{
                questions.length === 0
                  ? "No Questions Available"
                  : "Start Practice!"
              }}
            </button>
          </div>
        </div>

        <!-- Practice in Progress -->
        <div v-else-if="!practiceCompleted" class="max-w-4xl mx-auto">
          <!-- Progress Bar -->
          <div class="mb-4 md:mb-6">
            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 text-xs md:text-base gap-1"
            >
              <span class="font-semibold text-gray-600">
                Question {{ currentQuestionIndex + 1 }} of
                {{ questions.length }}
              </span>
              <span class="font-semibold text-blue-600">
                Score: {{ score }} points
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 md:h-3">
              <div
                class="bg-gradient-to-r from-blue-400 to-purple-400 h-2 md:h-3 rounded-full transition-all duration-500"
                :style="{
                  width: `${
                    ((currentQuestionIndex + 1) / questions.length) * 100
                  }%`,
                }"
              ></div>
            </div>
          </div>

          <!-- Current Question -->
          <div
            v-if="currentQuestion"
            class="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8"
          >
            <div class="text-center mb-6">
              <h2 class="text-xl md:text-2xl font-bold text-gray-700 mb-4">
                Question {{ currentQuestionIndex + 1 }} of
                {{ questions.length }}
              </h2>
              <!-- Word Problem Display -->
              <div class="bg-blue-50 rounded-2xl p-6 mb-6">
                <div class="text-lg md:text-xl text-gray-800 leading-relaxed">
                  {{ currentQuestion.question }}
                </div>
              </div>
            </div>

            <!-- Work Area with Math Buttons -->
            <div class="mb-6">
              <label class="block text-lg font-semibold text-gray-700 mb-3">
                Show your work:
              </label>

              <!-- Math Operation Buttons -->
              <div class="flex flex-wrap gap-2 mb-4 justify-center">
                <button
                  @click="addToWork('+')"
                  class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  + (Plus)
                </button>
                <button
                  @click="addToWork('-')"
                  class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  - (Minus)
                </button>
                <button
                  @click="addToWork('×')"
                  class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg text-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  × (Times)
                </button>
                <button
                  @click="addToWork('÷')"
                  class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg text-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  ÷ (Divide)
                </button>
                <button
                  @click="addToWork('=')"
                  class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  = (Equals)
                </button>
              </div>

              <!-- Number Buttons -->
              <div class="grid grid-cols-5 gap-2 mb-4 max-w-md mx-auto">
                <button
                  v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]"
                  :key="num"
                  @click="addToWork(num.toString())"
                  class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg text-lg shadow transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {{ num }}
                </button>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-2 mb-4 justify-center">
                <button
                  @click="addToWork(' ')"
                  class="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg shadow transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Space
                </button>
                <button
                  @click="addToWork('\n')"
                  class="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg shadow transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  New Line
                </button>
                <button
                  @click="clearLastCharacter"
                  class="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  ⌫ Delete
                </button>
                <button
                  @click="clearWork"
                  class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Clear All
                </button>
              </div>

              <!-- Work Area Text Field -->
              <textarea
                v-model="workArea"
                placeholder="Your work will appear here... You can also type directly."
                class="w-full h-40 p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg font-mono resize-none bg-yellow-50"
              ></textarea>
            </div>

            <!-- Final Answer -->
            <div class="mb-6">
              <label class="block text-lg font-semibold text-gray-700 mb-3">
                Final Answer:
              </label>
              <div class="flex gap-2 items-center">
                <input
                  v-model="finalAnswer"
                  type="text"
                  placeholder="Enter your final answer (numbers only)"
                  class="flex-1 p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-xl font-bold text-center"
                  @keypress.enter="submitAnswer"
                />
                <button
                  @click="clearAnswer"
                  class="bg-red-400 hover:bg-red-500 text-white font-bold py-4 px-4 rounded-xl shadow transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  ⌫
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="text-center">
              <button
                @click="submitAnswer"
                :disabled="!finalAnswer.trim()"
                class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100"
              >
                Submit Answer
              </button>
            </div>
          </div>

          <!-- Feedback Modal -->
          <div
            v-if="showFeedback"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <div class="bg-white rounded-3xl p-8 max-w-lg mx-4 text-center">
              <div class="text-6xl mb-4">
                {{ isCorrect ? "🎉" : "😅" }}
              </div>
              <h3
                class="text-2xl font-bold mb-4"
                :class="isCorrect ? 'text-green-600' : 'text-orange-600'"
              >
                {{ isCorrect ? "Correct!" : "Not quite right" }}
              </h3>
              <p class="text-lg text-gray-700 mb-2">
                The correct answer is:
                <strong class="text-2xl text-blue-600">{{
                  currentQuestion.answer
                }}</strong>
              </p>
              <p
                v-if="currentQuestion.explanation"
                class="text-gray-600 mb-6 text-left bg-gray-50 p-4 rounded-lg"
              >
                <strong>Explanation:</strong><br />
                {{ currentQuestion.explanation }}
              </p>
              <div v-if="workArea" class="mb-6 text-left">
                <strong class="text-gray-700">Your work:</strong>
                <div
                  class="bg-yellow-50 p-3 rounded-lg font-mono text-sm mt-2 whitespace-pre-line"
                >
                  {{ workArea }}
                </div>
              </div>
              <button
                @click="nextQuestion"
                class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {{
                  currentQuestionIndex + 1 < questions.length
                    ? "Next Question"
                    : "Finish Practice"
                }}
              </button>
            </div>
          </div>
        </div>

        <!-- Practice Complete -->
        <div v-else class="text-center">
          <h1
            class="text-3xl md:text-5xl font-bold text-green-600 mb-4 md:mb-6 bounce-gentle"
          >
            Great Job! 🎉
          </h1>

          <div class="card-colorful max-w-2xl mx-auto">
            <div class="text-3xl md:text-4xl mb-4 md:mb-6">🏆</div>
            <h2
              class="text-xl md:text-2xl font-bold text-gray-700 mb-4 md:mb-6"
            >
              Practice Complete!
            </h2>

            <div v-if="saving" class="mb-4 md:mb-6">
              <div class="text-xl md:text-2xl mb-2">💾</div>
              <p class="text-base md:text-lg text-blue-600">
                Saving your results...
              </p>
            </div>

            <!-- Final Score -->
            <div class="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
              <div
                class="bg-green-50 rounded-xl p-3 md:p-4 border-2 border-green-200"
              >
                <div class="text-xl md:text-2xl font-bold text-green-600">
                  {{ score }}
                </div>
                <div class="text-xs md:text-sm text-gray-600">Total Points</div>
              </div>
              <div
                class="bg-blue-50 rounded-xl p-3 md:p-4 border-2 border-blue-200"
              >
                <div class="text-xl md:text-2xl font-bold text-blue-600">
                  {{ Math.round(accuracy) }}%
                </div>
                <div class="text-xs md:text-sm text-gray-600">Accuracy</div>
              </div>
            </div>

            <div class="space-y-3 md:space-y-4">
              <NuxtLink
                to="/progress/math"
                class="btn-primary inline-flex items-center gap-2 text-base md:text-xl py-3 px-6"
              >
                <span>📊</span>
                View Progress
              </NuxtLink>

              <div class="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  @click="restartPractice"
                  class="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                  🔄 <span class="hidden sm:inline">Try Again</span
                  ><span class="sm:hidden">Again</span>
                </button>

                <NuxtLink
                  to="/"
                  class="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                  🏠 Home
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Math Practice - Learning Fun!",
  meta: [
    {
      name: "description",
      content: "Practice solving math word problems step by step",
    },
  ],
});

// Supabase client
const supabase = useSupabaseClient();

// Reactive data
const questions = ref([]);
const currentQuestionIndex = ref(0);
const workArea = ref("");
const finalAnswer = ref("");
const score = ref(0);
const showFeedback = ref(false);
const isCorrect = ref(false);
const loading = ref(true);
const error = ref(null);
const saving = ref(false);

// New state variables to match reading page
const practiceStarted = ref(false);
const practiceCompleted = ref(false);
const todayCompleted = ref(false);
const todayResults = ref({});

// Track practice session
const practiceStartTime = ref(null);
const practiceQuestions = ref([]);

// Computed
const currentQuestion = computed(() => {
  return questions.value[currentQuestionIndex.value] || null;
});

const accuracy = computed(() => {
  return practiceQuestions.value.length > 0
    ? (score.value / practiceQuestions.value.length) * 100
    : 0;
});

// Load only active questions from database
const loadQuestions = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Check if today's practice is already completed
    const today = new Date();
    const todayDateString = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const { data: existingResult, error: resultError } = await supabase
      .from("math_results")
      .select("*")
      .eq("date", todayDateString)
      .maybeSingle();

    if (resultError) {
      console.error("Error checking existing math result:", resultError);
      throw resultError;
    }

    if (existingResult) {
      todayCompleted.value = true;
      todayResults.value = {
        score: existingResult.score || 0,
        accuracy: Math.round(existingResult.accuracy || 0),
        questionsAttempted: existingResult.questions_attempted || 0,
        correctAnswers: existingResult.correct_answers || 0,
      };
    } else {
      todayCompleted.value = false;
    }

    // Fetch only active questions from Supabase
    const { data: mathQuestions, error: fetchError } = await supabase
      .from("math_questions")
      .select("*")
      .eq("status", "active") // Only load active questions
      .order("created_at", { ascending: true });

    if (fetchError) throw fetchError;

    if (mathQuestions && mathQuestions.length > 0) {
      // Transform database format to match expected format
      questions.value = mathQuestions.map((question) => ({
        id: question.id,
        question: question.question,
        answer: question.answer,
        explanation: question.explanation,
      }));
    } else {
      // If no active questions in database, try localStorage as fallback
      const stored = localStorage.getItem("mathQuestions");
      if (stored) {
        const storedQuestions = JSON.parse(stored);
        // Filter only active questions from localStorage too
        const activeQuestions = storedQuestions.filter(
          (q) => q.status === "active" || !q.status
        );
        if (activeQuestions.length > 0) {
          questions.value = activeQuestions;
        } else {
          questions.value = [];
        }
      } else {
        questions.value = [];
      }
    }
  } catch (err) {
    console.error("❌ Error loading math questions:", err);
    error.value = "Failed to load math questions. Please try again.";

    // Try localStorage as fallback
    try {
      const stored = localStorage.getItem("mathQuestions");
      if (stored) {
        const storedQuestions = JSON.parse(stored);
        const activeQuestions = storedQuestions.filter(
          (q) => q.status === "active" || !q.status
        );
        if (activeQuestions.length > 0) {
          questions.value = activeQuestions;
          error.value = null;
        }
      }
    } catch (localError) {
      console.error("❌ Fallback failed:", localError);
    }
  } finally {
    loading.value = false;
  }
};

// Save math results to database
const saveMathResults = async (mathData) => {
  saving.value = true;

  try {
    // Get today's date in local timezone (YYYY-MM-DD format)
    const today = new Date();
    const localDate =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");

    // Check if entry for today already exists
    const { data: existingResult, error: fetchError } = await supabase
      .from("math_results")
      .select("*")
      .eq("date", localDate)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "not found" error
      throw fetchError;
    }

    const resultData = {
      date: localDate,
      questions_attempted: mathData.questionsAttempted,
      correct_answers: mathData.correctAnswers,
      accuracy: mathData.accuracy,
      score: mathData.score,
      completed: mathData.completed,
      time_spent: mathData.timeSpent,
      questions_data: mathData.questions,
      updated_at: new Date().toISOString(),
    };

    if (existingResult) {
      // Replace existing record with latest results
      const { error: updateError } = await supabase
        .from("math_results")
        .update(resultData)
        .eq("date", localDate);

      if (updateError) throw updateError;
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from("math_results")
        .insert(resultData);

      if (insertError) throw insertError;
    }

    // Update today's status
    todayCompleted.value = true;
    todayResults.value = {
      score: mathData.score,
      accuracy: Math.round(mathData.accuracy),
      questionsAttempted: mathData.questionsAttempted,
      correctAnswers: mathData.correctAnswers,
    };
  } catch (err) {
    console.error("❌ Error saving math results:", err);
    throw err;
  } finally {
    saving.value = false;
  }
};

// Allow retaking today's practice
const allowRetake = () => {
  todayCompleted.value = false;
  practiceStarted.value = false;
  practiceCompleted.value = false;
  resetPractice();
};

// Start practice
const startPractice = () => {
  practiceStarted.value = true;
  resetPractice();
};

// Methods
const addToWork = (value) => {
  workArea.value += value;
};

const clearLastCharacter = () => {
  workArea.value = workArea.value.slice(0, -1);
};

const clearWork = () => {
  workArea.value = "";
};

const clearAnswer = () => {
  finalAnswer.value = "";
};

const resetPractice = () => {
  currentQuestionIndex.value = 0;
  workArea.value = "";
  finalAnswer.value = "";
  score.value = 0;
  showFeedback.value = false;
  isCorrect.value = false;
  practiceQuestions.value = [];
  practiceStartTime.value = new Date();
};

const restartPractice = () => {
  practiceStarted.value = false;
  practiceCompleted.value = false;
  resetPractice();
};

// Update submitAnswer method
const submitAnswer = () => {
  if (!finalAnswer.value.trim()) return;

  // Extract numbers from the answer and compare
  const userAnswer = finalAnswer.value.trim().replace(/[^\d]/g, "");
  const correctAnswer = currentQuestion.value.answer.replace(/[^\d]/g, "");

  isCorrect.value = userAnswer === correctAnswer;
  if (isCorrect.value) {
    score.value++;
  }

  // Track this question attempt
  practiceQuestions.value.push({
    question_id: currentQuestion.value.id,
    question: currentQuestion.value.question,
    correct_answer: currentQuestion.value.answer,
    user_answer: finalAnswer.value.trim(),
    correct: isCorrect.value,
    work_shown: workArea.value,
    explanation: currentQuestion.value.explanation,
    timestamp: new Date().toISOString(),
  });

  showFeedback.value = true;
};

// Update nextQuestion method to save results when practice is complete
const nextQuestion = async () => {
  showFeedback.value = false;
  workArea.value = "";
  finalAnswer.value = "";

  if (currentQuestionIndex.value + 1 < questions.value.length) {
    currentQuestionIndex.value++;
  } else {
    // Practice complete - save results to database
    if (practiceQuestions.value.length > 0) {
      const endTime = new Date();
      const timeSpent = Math.round(
        (endTime - practiceStartTime.value) / (1000 * 60)
      ); // minutes

      const accuracy =
        practiceQuestions.value.length > 0
          ? Math.round((score.value / practiceQuestions.value.length) * 100)
          : 0;

      const mathData = {
        questionsAttempted: practiceQuestions.value.length,
        correctAnswers: score.value,
        accuracy: accuracy,
        score: score.value * 10, // 10 points per correct answer
        completed: true,
        timeSpent: Math.max(timeSpent, 1), // Minimum 1 minute
        questions: practiceQuestions.value,
      };

      try {
        await saveMathResults(mathData);
      } catch (error) {
        console.error("❌ Failed to save math results:", error);
        // Could show a toast notification here
      }
    }

    practiceCompleted.value = true;
  }
};

// Load questions and start practice on mount
onMounted(async () => {
  await loadQuestions();
  practiceStartTime.value = new Date();
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
  @apply bg-white rounded-3xl shadow-2xl p-6 md:p-8;
}

.btn-primary {
  @apply bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95;
}
</style>
