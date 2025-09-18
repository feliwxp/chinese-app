<template>
  <div
    class="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100"
  >
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="text-4xl md:text-6xl mb-4">⏳</div>
        <p class="text-lg md:text-2xl text-gray-600">
          Loading spelling words...
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
          @click="loadWords"
          class="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 px-6 rounded-full text-lg"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- No Words State -->
    <div
      v-else-if="wordList.length === 0"
      class="min-h-screen flex items-center justify-center p-4"
    >
      <div class="text-center">
        <div class="text-4xl md:text-6xl mb-4">📝</div>
        <h2 class="text-2xl font-bold text-gray-700 mb-4">
          No Spelling Words Available
        </h2>
        <p class="text-lg text-gray-600 mb-6">
          Ask your parent to add some spelling words in Settings first!
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/settings/spelling-english"
            class="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Add Words
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
          to="/progress/spelling-english"
          class="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <span>←</span>
          <span class="hidden sm:inline">Back</span>
        </NuxtLink>

        <div class="text-lg md:text-2xl font-bold text-green-600">
          ✏️ <span class="hidden sm:inline">Spelling Practice</span>
        </div>

        <div
          v-if="practiceStarted"
          class="text-sm md:text-lg font-semibold text-green-600"
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
                to="/progress/spelling-english"
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
            class="text-3xl md:text-5xl font-bold text-green-600 mb-4 md:mb-6 bounce-gentle"
          >
            Ready to Practice? 🎯
          </h1>

          <div class="card-colorful max-w-2xl mx-auto">
            <div class="text-3xl md:text-4xl mb-4 md:mb-6">✏️</div>
            <h2 class="text-xl md:text-2xl font-bold text-gray-700 mb-4">
              <span class="hidden sm:inline"
                >Today's Spelling Practice Challenge</span
              >
              <span class="sm:hidden">Today's Challenge</span>
            </h2>

            <div class="bg-white rounded-xl p-3 md:p-4 mb-4 md:mb-6">
              <h3 class="font-bold text-green-600 mb-2 text-sm md:text-lg">
                📊
                <span class="hidden sm:inline"
                  >Today's Words ({{ totalQuestions }} words):</span
                >
                <span class="sm:hidden">{{ totalQuestions }} Words:</span>
              </h3>
              <div
                class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm"
              >
                <div
                  v-for="(word, index) in wordList.slice(0, 6)"
                  :key="index"
                  class="bg-green-50 rounded px-2 py-1 text-left"
                >
                  <span class="font-bold">{{ index + 1 }}.</span>
                  {{ word.word }} - {{ word.definition.substring(0, 30) }}...
                </div>
                <div
                  v-if="wordList.length > 6"
                  class="bg-gray-50 rounded px-2 py-1 text-gray-500"
                >
                  +{{ wordList.length - 6 }} more...
                </div>
              </div>
            </div>

            <div class="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <div class="bg-white rounded-xl p-3 md:p-4 text-left">
                <h3 class="font-bold text-green-600 mb-2 text-sm md:text-lg">
                  🎯 How it works:
                </h3>
                <ul
                  class="text-gray-600 space-y-1 md:space-y-2 text-xs md:text-base"
                >
                  <li>• Listen to each word being spoken</li>
                  <li>• Hear it used in a sentence for context</li>
                  <li>• Type the word with correct spelling</li>
                  <li>• Learn definitions and see examples</li>
                  <li>• Earn points for correct spelling!</li>
                </ul>
              </div>
            </div>

            <button
              @click="startPractice"
              :disabled="wordList.length === 0"
              class="btn-primary text-base md:text-xl py-3 px-6 md:py-4 md:px-8 inline-flex items-center gap-2 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
            >
              <span>🚀</span>
              {{
                wordList.length === 0 ? "No Words Available" : "Start Practice!"
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
                Word {{ currentQuestionIndex + 1 }} of
                {{ totalQuestions }}
              </span>
              <span class="font-semibold text-green-600">
                Score: {{ score }} points
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 md:h-3">
              <div
                class="bg-gradient-to-r from-green-400 to-teal-400 h-2 md:h-3 rounded-full transition-all duration-500"
                :style="{
                  width: `${
                    ((currentQuestionIndex + 1) / totalQuestions) * 100
                  }%`,
                }"
              ></div>
            </div>
          </div>

          <!-- Current Question -->
          <div
            v-if="currentWord"
            class="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8"
          >
            <div class="text-center mb-6">
              <h2 class="text-xl md:text-2xl font-bold text-gray-700 mb-4">
                Word {{ currentQuestionIndex + 1 }} of
                {{ totalQuestions }}
              </h2>
              <!-- Audio Controls -->
              <div class="bg-green-50 rounded-2xl p-6 mb-6">
                <h3 class="text-lg md:text-xl font-bold text-green-700 mb-4">
                  🎧 Listen and Spell the Word
                </h3>

                <!-- Audio Buttons -->
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    @click="playAudio('word')"
                    :disabled="isPlaying"
                    class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100"
                  >
                    🔊
                    {{ isPlaying === "word" ? "Playing Word..." : "Play Word" }}
                  </button>

                  <button
                    @click="playAudio('sentence')"
                    :disabled="isPlaying"
                    class="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100"
                  >
                    📝
                    {{
                      isPlaying === "sentence"
                        ? "Playing Sentence..."
                        : "Play Sentence"
                    }}
                  </button>
                </div>

                <p class="text-sm text-gray-600 mt-4">
                  Click to hear the word or a sentence containing the word. You
                  can play them multiple times!
                </p>
              </div>
            </div>

            <!-- Word Input -->
            <div class="mb-6">
              <label class="block text-lg font-semibold text-gray-700 mb-3">
                Type the word you heard:
              </label>
              <div class="flex gap-2 items-center">
                <input
                  v-model="userAnswer"
                  ref="answerInput"
                  type="text"
                  placeholder="Enter the word here..."
                  class="flex-1 p-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-xl font-bold text-center"
                  @keypress.enter="submitAnswer"
                  :disabled="showFeedback"
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
                :disabled="!userAnswer.trim() || showFeedback"
                class="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100"
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
                The correct spelling is:
                <strong class="text-2xl text-green-600">{{
                  currentWord.word
                }}</strong>
              </p>
              <p v-if="!isCorrect" class="text-gray-600 mb-4">
                Your answer: "{{ userAnswer }}"
              </p>

              <!-- Word Definition and Sentence -->
              <div class="space-y-4 mb-6">
                <div class="p-4 bg-blue-50 rounded-xl text-left">
                  <h4 class="font-bold text-blue-700 mb-2">📖 Definition:</h4>
                  <p class="text-gray-700">{{ currentWord.definition }}</p>
                </div>

                <div class="p-4 bg-green-50 rounded-xl text-left">
                  <h4 class="font-bold text-green-700 mb-2">
                    📝 Example Sentence:
                  </h4>
                  <p class="text-gray-700 italic">
                    "{{ currentWord.sentence }}"
                  </p>
                </div>
              </div>

              <button
                @click="nextQuestion"
                class="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {{
                  currentQuestionIndex + 1 < totalQuestions
                    ? "Next Word"
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
              <p class="text-base md:text-lg text-green-600">
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
                to="/progress/spelling-english"
                class="btn-primary inline-flex items-center gap-2 text-base md:text-xl py-3 px-6"
              >
                <span>📊</span>
                View Progress
              </NuxtLink>

              <div class="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  @click="restartPractice"
                  class="bg-gradient-to-r from-green-400 to-teal-400 hover:from-green-500 hover:to-teal-500 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105"
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
  title: "Spelling Practice - Learning Fun!",
  meta: [
    {
      name: "description",
      content: "Practice spelling English words with interactive exercises",
    },
  ],
});

// Supabase client
const supabase = useSupabaseClient();

// Reactive data
const loading = ref(true);
const error = ref(null);
const saving = ref(false);

// New state variables to match math page
const practiceStarted = ref(false);
const practiceCompleted = ref(false);
const todayCompleted = ref(false);
const todayResults = ref({});

// Track practice session
const practiceStartTime = ref(null);
const practiceWords = ref([]);

// Quiz state
const currentQuestionIndex = ref(0);
const score = ref(0);
const totalQuestions = ref(10); // Will be updated when words are loaded
const userAnswer = ref("");
const showFeedback = ref(false);
const isCorrect = ref(false);
const isPlaying = ref(false);
const answerInput = ref(null);

// Word database with sentences
const wordList = ref([]);

// Current quiz data
const currentWords = ref([]);
const currentWord = computed(
  () => currentWords.value[currentQuestionIndex.value]
);

// Computed properties
const accuracy = computed(() => {
  return totalQuestions.value > 0
    ? Math.round((score.value / totalQuestions.value) * 100)
    : 0;
});

// Load words (similar to math page loadQuestions)
const loadWords = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Check if today's practice is already completed
    const today = new Date();
    const todayDateString = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const { data: existingResult, error: resultError } = await supabase
      .from("spelling_results")
      .select("*")
      .eq("date", todayDateString)
      .maybeSingle();

    if (resultError) {
      console.error("Error checking existing spelling result:", resultError);
      throw resultError;
    }

    if (existingResult) {
      todayCompleted.value = true;
      todayResults.value = {
        score: existingResult.score || 0,
        accuracy: Math.round(existingResult.accuracy || 0),
        wordsAttempted: existingResult.words_attempted || 0,
        correctAnswers: existingResult.correct_answers || 0,
      };
    } else {
      todayCompleted.value = false;
    }

    // Try to fetch words from Supabase first
    const { data: spellingWords, error: fetchError } = await supabase
      .from("spelling_words")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: true });

    if (fetchError) throw fetchError;

    if (spellingWords && spellingWords.length > 0) {
      // Transform database format to match expected format
      wordList.value = spellingWords.map((word) => ({
        id: word.id,
        word: word.word,
        definition: word.definition,
        sentence: word.sentence,
      }));

      // Update total questions to match available words
      totalQuestions.value = wordList.value.length;
    }
    // If no words in database, keep the default wordList as fallback
  } catch (err) {
    console.error("❌ Error loading spelling words:", err);
    error.value = "Failed to load spelling words. Please try again.";

    // Keep the default wordList as fallback
    if (wordList.value.length === 0) {
      error.value = "No spelling words available.";
    } else {
      error.value = null; // Clear error if we have fallback words
    }
  } finally {
    loading.value = false;
  }
};

// Save spelling results to database
const saveSpellingResults = async (spellingData) => {
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
      .from("spelling_results")
      .select("*")
      .eq("date", localDate)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "not found" error
      throw fetchError;
    }

    const resultData = {
      date: localDate,
      words_attempted: spellingData.wordsAttempted,
      correct_answers: spellingData.correctAnswers,
      accuracy: spellingData.accuracy,
      score: spellingData.score,
      completed: spellingData.completed,
      time_spent: spellingData.timeSpent,
      words_data: spellingData.words,
      updated_at: new Date().toISOString(),
    };

    if (existingResult) {
      // Replace existing record with latest results
      const { error: updateError } = await supabase
        .from("spelling_results")
        .update(resultData)
        .eq("date", localDate);

      if (updateError) throw updateError;
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from("spelling_results")
        .insert(resultData);

      if (insertError) throw insertError;
    }

    // Update today's status
    todayCompleted.value = true;
    todayResults.value = {
      score: spellingData.score,
      accuracy: Math.round(spellingData.accuracy),
      wordsAttempted: spellingData.wordsAttempted,
      correctAnswers: spellingData.correctAnswers,
    };
  } catch (err) {
    console.error("❌ Error saving spelling results:", err);
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
  startQuiz();
};

const resetPractice = () => {
  currentQuestionIndex.value = 0;
  userAnswer.value = "";
  score.value = 0;
  showFeedback.value = false;
  isCorrect.value = false;
  practiceWords.value = [];
  practiceStartTime.value = new Date();
};

const restartPractice = () => {
  practiceStarted.value = false;
  practiceCompleted.value = false;
  resetPractice();
};

const startQuiz = () => {
  // Shuffle all available words for the quiz
  const selectedWordList = [...wordList.value];
  currentWords.value = selectedWordList.sort(() => Math.random() - 0.5);

  // Focus on input
  nextTick(() => {
    if (answerInput.value) {
      answerInput.value.focus();
    }
  });
};

const clearAnswer = () => {
  userAnswer.value = "";
};

const playAudio = (type = "word") => {
  if (isPlaying.value || !currentWord.value) return;

  isPlaying.value = type;

  // Use Web Speech API for text-to-speech
  if ("speechSynthesis" in window) {
    const textToSpeak =
      type === "word" ? currentWord.value.word : currentWord.value.sentence;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Select a better voice
    const voices = speechSynthesis.getVoices();
    let selectedVoice = null;

    // Look for high-quality English voices (prefer female voices for clarity)
    const preferredVoices = [
      "Samantha", // macOS - high quality female voice
      "Alex", // macOS - high quality male voice
      "Victoria", // macOS - female voice
      "Allison", // macOS - female voice
      "Ava", // macOS - female voice
      "Susan", // macOS - female voice
      "Microsoft Zira Desktop", // Windows - female
      "Microsoft David Desktop", // Windows - male
      "Google UK English Female", // Chrome - female
      "Google US English", // Chrome - neutral
    ];

    // First, try to find preferred voices
    for (const voiceName of preferredVoices) {
      selectedVoice = voices.find(
        (voice) => voice.name.includes(voiceName) && voice.lang.startsWith("en")
      );
      if (selectedVoice) break;
    }

    // If no preferred voice found, look for any good English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(
        (voice) =>
          voice.lang.startsWith("en") &&
          (voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("premium") ||
            voice.name.toLowerCase().includes("enhanced"))
      );
    }

    // Final fallback: any English voice
    if (!selectedVoice) {
      selectedVoice = voices.find((voice) => voice.lang.startsWith("en"));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = type === "word" ? 0.6 : 0.7; // Slower for better pronunciation
    utterance.volume = 1;
    utterance.pitch = 1; // Normal pitch

    utterance.onend = () => {
      isPlaying.value = false;
    };

    speechSynthesis.speak(utterance);
  } else {
    // Fallback: just show the word briefly
    setTimeout(
      () => {
        isPlaying.value = false;
      },
      type === "word" ? 1000 : 3000
    );
  }
};

const submitAnswer = () => {
  if (!userAnswer.value.trim() || showFeedback.value) return;

  const correct =
    userAnswer.value.toLowerCase().trim() ===
    currentWord.value.word.toLowerCase();
  isCorrect.value = correct;

  if (correct) {
    score.value++;
  }

  // Track this word attempt
  practiceWords.value.push({
    word_id: currentWord.value.id || currentQuestionIndex.value,
    word: currentWord.value.word,
    definition: currentWord.value.definition,
    sentence: currentWord.value.sentence,
    user_answer: userAnswer.value.trim(),
    correct: correct,
    timestamp: new Date().toISOString(),
  });

  showFeedback.value = true;
};

const nextQuestion = async () => {
  showFeedback.value = false;
  userAnswer.value = "";

  if (currentQuestionIndex.value + 1 < totalQuestions.value) {
    // Move to next question
    currentQuestionIndex.value++;

    // Focus on input
    nextTick(() => {
      if (answerInput.value) {
        answerInput.value.focus();
      }
    });
  } else {
    // Practice complete - save results to database
    if (practiceWords.value.length > 0) {
      const endTime = new Date();
      const timeSpent = Math.round(
        (endTime - practiceStartTime.value) / (1000 * 60)
      ); // minutes

      const accuracy =
        practiceWords.value.length > 0
          ? Math.round((score.value / practiceWords.value.length) * 100)
          : 0;

      const spellingData = {
        wordsAttempted: practiceWords.value.length,
        correctAnswers: score.value,
        accuracy: accuracy,
        score: score.value * 10, // 10 points per correct answer
        completed: true,
        timeSpent: Math.max(timeSpent, 1), // Minimum 1 minute
        words: practiceWords.value,
      };

      try {
        await saveSpellingResults(spellingData);
      } catch (error) {
        console.error("❌ Failed to save spelling results:", error);
        // Could show a toast notification here
      }
    }

    practiceCompleted.value = true;
  }
};

// Load words on mount
onMounted(async () => {
  await loadWords();
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
  @apply bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95;
}
</style>
