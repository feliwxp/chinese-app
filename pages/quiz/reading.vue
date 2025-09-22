<template>
  <div
    class="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100"
  >
    <!-- Header -->
    <header class="flex justify-between items-center p-4 md:p-6">
      <NuxtLink
        to="/progress/reading"
        class="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <span>←</span>
        <span class="hidden sm:inline">Back to Progress</span>
      </NuxtLink>

      <div class="text-lg md:text-2xl font-bold text-purple-600">
        🎮 <span class="hidden sm:inline">Reading Quiz</span>
      </div>

      <div class="w-16 md:w-14"></div>
    </header>

    <!-- Browser Compatibility & Permissions Notice -->

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-96 px-4">
      <div class="text-center">
        <div class="text-4xl md:text-6xl mb-4">⏳</div>
        <p class="text-lg md:text-2xl text-gray-600">Loading quiz...</p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex items-center justify-center min-h-96 px-4"
    >
      <div class="text-center">
        <div class="text-4xl md:text-6xl mb-4">❌</div>
        <p class="text-lg md:text-xl text-red-600 mb-4">{{ error }}</p>
        <button
          @click="loadQuizData"
          class="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-base md:text-lg"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Quiz Container -->
    <main v-else class="container mx-auto px-4 md:px-6 py-6 md:py-8">
      <!-- Today's Quiz Already Completed -->
      <div v-if="todayCompleted && !quizStarted" class="text-center">
        <h1
          class="text-3xl md:text-5xl font-bold text-green-600 mb-4 md:mb-6 bounce-gentle"
        >
          Already Done Today! 🎉
        </h1>

        <div class="card-colorful max-w-2xl mx-auto">
          <div class="text-3xl md:text-4xl mb-4 md:mb-6">🏆</div>
          <h2 class="text-xl md:text-2xl font-bold text-gray-700 mb-4 md:mb-6">
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
              to="/progress/reading"
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

      <!-- Quiz Not Started -->
      <div v-else-if="!quizStarted" class="text-center">
        <h1
          class="text-3xl md:text-5xl font-bold text-purple-600 mb-4 md:mb-6 bounce-gentle"
        >
          Ready to Practice? 🎯
        </h1>

        <div class="card-colorful max-w-2xl mx-auto">
          <div class="text-3xl md:text-4xl mb-4 md:mb-6">📚</div>
          <h2 class="text-xl md:text-2xl font-bold text-gray-700 mb-4">
            <span class="hidden sm:inline"
              >Today's Chinese Reading Challenge</span
            >
            <span class="sm:hidden">Today's Challenge</span>
          </h2>

          <div class="bg-white rounded-xl p-3 md:p-4 mb-4 md:mb-6">
            <h3 class="font-bold text-purple-600 mb-2 text-sm md:text-lg">
              📊
              <span class="hidden sm:inline"
                >Today's Word List ({{ quizWords.length }} words):</span
              >
              <span class="sm:hidden">{{ quizWords.length }} Words:</span>
            </h3>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm"
            >
              <div
                v-for="word in quizWords.slice(0, 6)"
                :key="word.id"
                class="bg-purple-50 rounded px-2 py-1"
              >
                <span class="chinese-text font-bold">{{ word.chinese }}</span>
                - {{ word.english }}
              </div>
              <div
                v-if="quizWords.length > 6"
                class="bg-gray-50 rounded px-2 py-1 text-gray-500"
              >
                +{{ quizWords.length - 6 }} more...
              </div>
            </div>
          </div>

          <div class="space-y-3 md:space-y-4 mb-6 md:mb-8">
            <div class="bg-blue-50 rounded-xl p-3 md:p-4 text-left">
              <h3 class="font-bold text-blue-700 mb-2 text-sm md:text-lg">
                Before you start:
              </h3>
              <ul
                class="text-gray-600 space-y-1 md:space-y-2 text-xs md:text-base"
              >
                <li>
                  • <strong>Please allow microphone access</strong> when your
                  browser asks
                </li>
                <li>
                  • <strong>Enable speech recognition</strong> for the best
                  experience
                </li>
                <li>
                  • For optimal results, use
                  <strong>Chrome or Safari</strong> browser
                </li>
                <li>
                  • Speak clearly and ensure you're in a quiet environment
                </li>
              </ul>
            </div>
            <div class="bg-white rounded-xl p-3 md:p-4 text-left">
              <h3 class="font-bold text-purple-600 mb-2 text-sm md:text-lg">
                How it works:
              </h3>
              <ul
                class="text-gray-600 space-y-1 md:space-y-2 text-xs md:text-base"
              >
                <li>• Look at the Chinese word and try to read it aloud</li>
                <li>• Click "Listen" to hear the correct pronunciation</li>
                <li>• Click "Record" and say the word yourself</li>
                <li>• Get hints and translations if you need help</li>
                <li>• Earn points for correct pronunciation!</li>
              </ul>
            </div>
          </div>

          <button
            @click="startQuiz"
            :disabled="quizWords.length === 0"
            class="btn-primary text-base md:text-xl py-3 px-6 md:py-4 md:px-8 inline-flex items-center gap-2 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
          >
            <span>🚀</span>
            {{ quizWords.length === 0 ? "No Words Available" : "Start Quiz!" }}
          </button>
        </div>
      </div>

      <!-- Quiz in Progress -->
      <div v-else-if="!quizCompleted" class="max-w-4xl mx-auto">
        <!-- Progress Bar -->
        <div class="mb-4 md:mb-6">
          <div
            class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 text-xs md:text-base gap-1"
          >
            <span class="font-semibold text-gray-600">
              Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}
            </span>
            <span class="font-semibold text-purple-600">
              Score: {{ score }} points
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2 md:h-3">
            <div
              class="bg-gradient-to-r from-purple-400 to-pink-400 h-2 md:h-3 rounded-full transition-all duration-500"
              :style="{
                width: `${
                  ((currentQuestionIndex + 1) / totalQuestions) * 100
                }%`,
              }"
            ></div>
          </div>
        </div>

        <!-- Current Question -->
        <div class="card-colorful text-center">
          <div class="text-3xl md:text-4xl mb-3 md:mb-4">📖</div>
          <h2 class="text-lg md:text-xl font-bold text-gray-700 mb-3 md:mb-4">
            <span class="hidden sm:inline">Read this Chinese word aloud:</span>
            <span class="sm:hidden">Read aloud:</span>
          </h2>

          <!-- Chinese Word Display -->
          <div
            class="chinese-text text-4xl md:text-6xl lg:text-8xl font-bold text-purple-600 mb-4 md:mb-6 select-none"
          >
            {{ currentWord.chinese }}
          </div>

          <!-- Control Buttons -->
          <div class="flex flex-col gap-2 md:gap-3 mb-4 md:mb-6">
            <!-- Listen Button -->
            <button
              @click="playAudio"
              :disabled="isPlaying"
              class="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100 flex items-center gap-2 justify-center"
            >
              <span>{{ isPlaying ? "🔊" : "🎵" }}</span>
              {{ isPlaying ? "Playing..." : "Listen" }}
            </button>

            <!-- Record Button -->
            <button
              @click="toggleRecording"
              :disabled="hasAttempted || isProcessing"
              :class="[
                hasAttempted || isProcessing
                  ? 'from-gray-400 to-gray-500 cursor-not-allowed'
                  : isRecording
                  ? 'from-red-400 to-red-500 hover:from-red-500 hover:to-red-600'
                  : 'from-green-400 to-green-500 hover:from-green-500 hover:to-green-600',
              ]"
              class="bg-gradient-to-r text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100 flex items-center gap-2 justify-center"
            >
              <span>{{ isProcessing ? "⚙️" : isRecording ? "⏹️" : "🎤" }}</span>
              <span class="hidden sm:inline">{{
                isProcessing
                  ? "Processing..."
                  : hasAttempted
                  ? "Already Attempted"
                  : isRecording
                  ? "Submit Recording"
                  : "Record Yourself"
              }}</span>
              <span class="sm:hidden">{{
                isProcessing
                  ? "Wait"
                  : hasAttempted
                  ? "Done"
                  : isRecording
                  ? "Stop"
                  : "Record"
              }}</span>
            </button>

            <!-- Add Restart Recording Button (only show while recording and not processing) -->
            <button
              v-if="isRecording && !hasAttempted && !isProcessing"
              @click="restartRecording"
              class="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center gap-2 justify-center"
            >
              <span>🔄</span>
              <span class="hidden sm:inline">Restart Recording</span>
              <span class="sm:hidden">Restart</span>
            </button>

            <!-- Hint Button -->
            <button
              @click="showHint = !showHint"
              class="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center gap-2 justify-center"
            >
              <span>💡</span>
              {{ showHint ? "Hide Hint" : "Need Help?" }}
            </button>
          </div>

          <!-- Hint Section -->
          <div
            v-if="showHint"
            class="bg-yellow-50 rounded-xl p-3 md:p-4 mb-4 md:mb-6 text-left"
          >
            <h3
              class="font-bold text-yellow-700 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-lg"
            >
              <span>💡</span>
              Helpful Hints:
            </h3>
            <div class="space-y-2 md:space-y-3">
              <div class="bg-white rounded-lg p-2 md:p-3">
                <strong class="text-sm md:text-base">English meaning:</strong>
                <span class="text-sm md:text-base">{{
                  currentWord.english
                }}</span>
              </div>

              <div
                v-if="currentWord.sample_sentence_chinese"
                class="bg-white rounded-lg p-2 md:p-3"
              >
                <strong class="text-sm md:text-base">Example sentence:</strong>
                <div class="chinese-text mt-1 text-sm md:text-base">
                  {{ currentWord.sample_sentence_chinese }}
                </div>
                <div
                  v-if="currentWord.sample_sentence_english"
                  class="text-gray-600 text-xs md:text-sm mt-1"
                >
                  {{ currentWord.sample_sentence_english }}
                </div>
              </div>
            </div>
          </div>

          <!-- Recording Status -->
          <div v-if="recordingStatus" class="mb-4 md:mb-6">
            <div
              :class="[
                recordingStatus.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : recordingStatus.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-blue-50 border-blue-200 text-blue-700',
              ]"
              class="rounded-xl p-3 md:p-4 border-2"
            >
              <div
                class="flex items-center gap-2 mb-1 font-bold text-sm md:text-lg"
              >
                <span>
                  {{
                    recordingStatus.type === "success"
                      ? "✅"
                      : recordingStatus.type === "error"
                      ? "❌"
                      : "ℹ️"
                  }}
                </span>
                <strong>{{ recordingStatus.title }}</strong>
              </div>
              <p class="text-xs md:text-base">{{ recordingStatus.message }}</p>
              <div
                v-if="recordingStatus.points"
                class="mt-2 text-sm md:text-lg font-bold"
              >
                +{{ recordingStatus.points }} points!
              </div>
            </div>
          </div>

          <!-- Next Button -->
          <div class="flex justify-center gap-4">
            <button
              v-if="canProceed"
              @click="nextQuestion"
              class="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              {{
                currentQuestionIndex === totalQuestions - 1
                  ? "Finish Quiz!"
                  : "Next Word"
              }}
            </button>
          </div>
        </div>
      </div>

      <!-- Quiz Completed -->
      <div v-else class="text-center">
        <h1
          class="text-3xl md:text-5xl font-bold text-green-600 mb-4 md:mb-6 bounce-gentle"
        >
          Great Job! 🎉
        </h1>

        <div class="card-colorful max-w-2xl mx-auto">
          <div class="text-3xl md:text-4xl mb-4 md:mb-6">🏆</div>
          <h2 class="text-xl md:text-2xl font-bold text-gray-700 mb-4 md:mb-6">
            Quiz Complete!
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
              to="/progress/reading"
              class="btn-primary inline-flex items-center gap-2 text-base md:text-xl py-3 px-6"
            >
              <span>📊</span>
              View Progress
            </NuxtLink>

            <div class="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                @click="restartQuiz"
                class="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105"
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
</template>

<script setup>
// Page metadata
useHead({
  title: "Reading Quiz - Chinese Learning Fun!",
  meta: [
    {
      name: "description",
      content: "Practice reading Chinese words with voice recognition",
    },
  ],
});

import pinyin from "pinyin";

// Supabase client
const supabase = useSupabaseClient();

// Reactive state
const loading = ref(true);
const error = ref(null);
const saving = ref(false);
const quizWords = ref([]);
const wordResults = ref([]);
const todayCompleted = ref(false);
const todayResults = ref({});

const quizStarted = ref(false);
const quizCompleted = ref(false);
const currentQuestionIndex = ref(0);
const score = ref(0);
const correctAnswers = ref(0);
const showHint = ref(false);
const isRecording = ref(false);
const isPlaying = ref(false);
const recordingStatus = ref(null);
const canProceed = ref(false);
const hasAttempted = ref(false);

// Add processing state
const isProcessing = ref(false);

// Speech recognition setup
let recognition = null;
let selectedVoice = null;

// ⭐ VOICE CONFIGURATION ⭐
const PREFERRED_VOICES = [
  "Tingting",
  "Li-Mu",
  "Flo (Chinese (China mainland))",
  "Sandy (Chinese (China mainland))",
  "Google 普通话（中国大陆）",
];

const VOICE_SETTINGS = {
  rate: 0.3,
  pitch: 1.0,
  volume: 1.0,
};

// Load quiz data from database
const loadQuizData = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Check if today's quiz is already completed
    const today = new Date();
    const todayDateString = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const { data: existingResult, error: resultError } = await supabase
      .from("quiz_results")
      .select("*")
      .eq("date", todayDateString)
      .maybeSingle(); // Use maybeSingle instead of single to avoid error when no record exists

    if (resultError) {
      console.error("Error checking existing quiz result:", resultError);
      throw resultError;
    }

    if (existingResult) {
      // Check if there's an ongoing quiz session even if today is completed
      const savedState = loadQuizState();
      if (savedState && savedState.quizStarted && !savedState.quizCompleted) {
        // There's an ongoing session, don't mark as completed yet
        todayCompleted.value = false;
      } else {
        todayCompleted.value = true;
        todayResults.value = {
          score: existingResult.score || 0,
          accuracy: Math.round(existingResult.accuracy || 0),
          wordsStudied: existingResult.words_studied || 0,
          correctAnswers: existingResult.correct_answers || 0,
        };
      }
    } else {
      todayCompleted.value = false;
    }

    // Load words from database
    const { data: words, error: wordsError } = await supabase
      .from("quiz_words")
      .select("*")
      .eq("status", "active") // Add this line to filter only active words
      .order("id");

    if (wordsError) throw wordsError;

    if (!words || words.length === 0) {
      throw new Error(
        "No active words found in database. Please add some words or activate existing words first." // Update error message
      );
    }
    quizWords.value = words;

    // Check for existing quiz session after loading words
    const savedState = loadQuizState();
    if (savedState && savedState.quizStarted && !savedState.quizCompleted) {
      // Restore the ongoing quiz session
      restoreQuizState(savedState);

      // Reset any UI states that shouldn't persist
      isRecording.value = false;
      isPlaying.value = false;
      isProcessing.value = false;
      recordingStatus.value = null;
    }
  } catch (err) {
    console.error("❌ Error loading quiz data:", err);
    error.value = err.message || "Failed to load quiz data. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Save quiz results to database
const saveQuizResults = async () => {
  saving.value = true;

  try {
    const today = new Date();
    const todayDateString = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    // Prepare words data for JSON storage
    const wordsData = wordResults.value.filter(Boolean).map((word) => ({
      chinese: word.chinese,
      english: word.english,
      correct: word.correct,
    }));

    const quizResult = {
      date: todayDateString,
      words_studied: totalQuestions.value,
      correct_answers: correctAnswers.value,
      accuracy: accuracy.value,
      score: score.value,
      completed: true,
      words_data: wordsData,
    };

    // Insert or update quiz result
    const { data, error: upsertError } = await supabase
      .from("quiz_results")
      .upsert(quizResult, {
        onConflict: "date",
      })
      .select();

    if (upsertError) throw upsertError;

    // Update today's status
    todayCompleted.value = true;
    todayResults.value = {
      score: score.value,
      accuracy: Math.round(accuracy.value),
      wordsStudied: totalQuestions.value,
      correctAnswers: correctAnswers.value,
    };
  } catch (err) {
    console.error("❌ Error saving quiz results:", err);
    // Show error to user but don't prevent them from seeing results
    recordingStatus.value = {
      type: "error",
      title: "Save Error",
      message: "Results could not be saved, but you completed the quiz!",
    };
  } finally {
    saving.value = false;
  }
};

// Allow retaking today's quiz
const allowRetake = () => {
  // Clear any existing session state
  clearQuizState();

  todayCompleted.value = false;
  quizStarted.value = false;
  quizCompleted.value = false;
  resetQuiz();
};

// Initialize speech recognition
const initSpeechRecognition = () => {
  if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "zh-CN";

    // Store the transcript temporarily
    let currentTranscript = "";

    recognition.onstart = () => {
      console.log("Speech recognition started");
      currentTranscript = ""; // Reset transcript
      recordingStatus.value = {
        type: "info",
        title: "Listening...",
        message: "Say the word clearly. Listening...",
      };
    };

    recognition.onresult = (event) => {
      // Log all results for debugging
      console.log("🎤 Speech results:", event.results);

      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.trim();
        console.log(
          `Result ${i}: "${transcript}" (confidence: ${event.results[i][0].confidence}, final: ${event.results[i].isFinal})`
        );

        // Skip empty transcripts
        if (!transcript) continue;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Update current transcript but don't process yet
      if (finalTranscript) {
        currentTranscript = finalTranscript.trim();
      }

      // Show interim results to user without processing (only if not empty)
      const displayText = finalTranscript || interimTranscript;
      if (displayText && isRecording.value) {
        const displayPinyin = convertToPinyin(displayText);
        const properPinyin = convertPinyinToToneMarks(displayPinyin);
        recordingStatus.value = {
          type: "info",
          title: "Hearing...",
          message: `I'm hearing: "${properPinyin}" - Submit when ready or Restart to try again.`,
        };
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      if (event.error === "no-speech") {
        recordingStatus.value = {
          type: "info",
          title: "No Speech Detected",
          message:
            "Try speaking louder, closer to the microphone, or restart recording.",
        };
        return;
      }

      handleSpeechError(event.error);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");

      // Only process the result if the user manually stopped recording (not restarted) AND we have valid content
      if (
        currentTranscript &&
        currentTranscript.trim() &&
        !isRecording.value &&
        !isRestarting.value
      ) {
        console.log(
          "🎯 Processing transcript on user stop:",
          currentTranscript
        );
        processSpeechResult(currentTranscript);
      } else if (
        (!currentTranscript || !currentTranscript.trim()) &&
        !isRecording.value &&
        !isRestarting.value
      ) {
        // Only show error if we haven't processed any result and user stopped (not restarted)
        recordingStatus.value = {
          type: "error",
          title: "No Clear Speech Detected",
          message:
            "Please speak more clearly and try again. Make sure you're in a quiet environment.",
        };
      }

      // Reset restart flag
      isRestarting.value = false;
    };
  }
};

// Add restart flag
const isRestarting = ref(false);

// Convert numbered pinyin to proper tone marks
const convertPinyinToToneMarks = (numberedPinyin) => {
  const toneMap = {
    a1: "ā",
    a2: "á",
    a3: "ǎ",
    a4: "à",
    o1: "ō",
    o2: "ó",
    o3: "ǒ",
    o4: "ò",
    e1: "ē",
    e2: "é",
    e3: "ě",
    e4: "è",
    i1: "ī",
    i2: "í",
    i3: "ǐ",
    i4: "ì",
    u1: "ū",
    u2: "ú",
    u3: "ǔ",
    u4: "ù",
    ü1: "ǖ",
    ü2: "ǘ",
    ü3: "ǚ",
    ü4: "ǜ",
    v1: "ǖ",
    v2: "ǘ",
    v3: "ǚ",
    v4: "ǜ",
  };

  // Function to apply tone mark to the correct vowel in a syllable
  const applyToneToSyllable = (syllable, tone) => {
    if (!tone || tone < 1 || tone > 4) return syllable;

    // Tone marking rules for Pinyin:
    // 1. If there's 'a' or 'e', mark it
    // 2. If there's 'ou', mark the 'o'
    // 3. Otherwise, mark the last vowel

    // Convert v to ü for processing
    let processedSyllable = syllable.replace(/v/g, "ü");

    // Rule 1: Mark 'a' or 'e' if present
    if (processedSyllable.includes("a")) {
      const key = "a" + tone;
      return processedSyllable.replace("a", toneMap[key] || "a");
    }
    if (processedSyllable.includes("e")) {
      const key = "e" + tone;
      return processedSyllable.replace("e", toneMap[key] || "e");
    }

    // Rule 2: Mark 'o' in 'ou'
    if (processedSyllable.includes("ou")) {
      const key = "o" + tone;
      return processedSyllable.replace("o", toneMap[key] || "o");
    }

    // Rule 3: Mark the last vowel
    const vowels = ["i", "u", "ü", "o"];
    for (let i = vowels.length - 1; i >= 0; i--) {
      const vowel = vowels[i];
      if (processedSyllable.includes(vowel)) {
        const key = vowel + tone;
        // Only replace the last occurrence of this vowel
        const lastIndex = processedSyllable.lastIndexOf(vowel);
        if (lastIndex !== -1) {
          return (
            processedSyllable.substring(0, lastIndex) +
            (toneMap[key] || vowel) +
            processedSyllable.substring(lastIndex + 1)
          );
        }
      }
    }

    return processedSyllable;
  };

  // Split into words, then syllables
  return numberedPinyin
    .split(/\s+/)
    .map((word) => {
      // Handle syllables with tone numbers at the end
      const match = word.match(/^(.+?)([1-4])$/);
      if (match) {
        const [, syllable, tone] = match;
        return applyToneToSyllable(syllable, parseInt(tone));
      }

      // Handle syllables with tone numbers attached to vowels (existing logic)
      return word
        .replace(/([aeiouüv])([1-4])/g, (match, vowel, tone) => {
          const key = vowel + tone;
          return toneMap[key] || match;
        })
        .replace(/[1-4]/g, ""); // Remove any remaining numbers
    })
    .join(" ");
};

// Process speech recognition result
const processSpeechResult = (transcript) => {
  if (hasAttempted.value) {
    recordingStatus.value = {
      type: "info",
      title: "Already Answered",
      message:
        "You've already attempted this word. Click 'Next Word' to continue.",
    };
    return;
  }

  // Start processing
  isProcessing.value = true;
  recordingStatus.value = {
    type: "info",
    title: "Processing...",
    message: "Analyzing your pronunciation, please wait...",
  };

  const currentChinese = currentWord.value.chinese;

  // Convert both to pinyin for comparison
  const transcriptPinyin = convertToPinyin(transcript);
  const correctPinyin = convertToPinyin(currentChinese);

  console.log("🎯 Pinyin comparison:", {
    transcript,
    transcriptPinyin,
    currentChinese,
    correctPinyin,
  });

  const similarity = calculatePinyinSimilarity(transcriptPinyin, correctPinyin);
  console.log("📊 Pinyin similarity:", similarity);

  const isCorrect = similarity > 0.8;
  hasAttempted.value = true;
  isProcessing.value = false;

  // Track this word's result
  wordResults.value[currentQuestionIndex.value] = {
    chinese: currentWord.value.chinese,
    english: currentWord.value.english,
    correct: isCorrect,
  };

  if (isCorrect) {
    const points = showHint.value ? 5 : 10;
    score.value += points;
    correctAnswers.value++;

    // Check if it was an exact match or just similar
    if (transcriptPinyin === correctPinyin) {
      recordingStatus.value = {
        type: "success",
        title: "Perfect pronunciation!",
        message: `You said ${convertPinyinToToneMarks(
          transcriptPinyin
        )} - that's exactly right! 🎉`,
        points: points,
      };
    } else {
      recordingStatus.value = {
        type: "success",
        title: "Great pronunciation!",
        message: `You said ${convertPinyinToToneMarks(
          transcriptPinyin
        )} - close enough! The exact pronunciation is ${convertPinyinToToneMarks(
          correctPinyin
        )}. 🎉`,
        points: points,
      };
    }
  } else {
    // For incorrect answers, always show the correct pinyin
    recordingStatus.value = {
      type: "error",
      title: "Try again next time!",
      message: `I heard ${convertPinyinToToneMarks(
        transcriptPinyin
      )}. The correct pronunciation is ${convertPinyinToToneMarks(
        correctPinyin
      )}.`,
    };
  }

  canProceed.value = true;

  // Save state after processing answer
  saveQuizState();
};

// Convert Chinese text to pinyin
const convertToPinyin = (chineseText) => {
  try {
    // Convert to pinyin with tone numbers, without spaces
    const pinyinArray = pinyin(chineseText, {
      style: pinyin.STYLE_TONE2, // Use tone numbers (e.g., "ni3 hao3")
      heteronym: false, // Don't return multiple pronunciations
      segment: false, // Don't segment
    });

    // Join all pinyin syllables with spaces
    return pinyinArray
      .map((syllable) => syllable[0])
      .join(" ")
      .toLowerCase();
  } catch (error) {
    console.error("Error converting to pinyin:", error);
    return chineseText.toLowerCase();
  }
};

// Calculate similarity between pinyin strings
const calculatePinyinSimilarity = (pinyin1, pinyin2) => {
  const p1 = pinyin1.trim().toLowerCase();
  const p2 = pinyin2.trim().toLowerCase();

  // Exact match
  if (p1 === p2) return 1.0;

  // Split into syllables for comparison
  const syllables1 = p1.split(/\s+/).filter((s) => s.length > 0);
  const syllables2 = p2.split(/\s+/).filter((s) => s.length > 0);

  // If different number of syllables, lower similarity
  if (syllables1.length !== syllables2.length) {
    // Still calculate similarity but penalize length difference
    const maxLength = Math.max(syllables1.length, syllables2.length);
    const lengthPenalty =
      Math.abs(syllables1.length - syllables2.length) / maxLength;
    return Math.max(0, calculateLevenshteinSimilarity(p1, p2) - lengthPenalty);
  }

  // Compare syllable by syllable
  let matchCount = 0;
  for (let i = 0; i < syllables1.length; i++) {
    const syl1 = syllables1[i];
    const syl2 = syllables2[i];

    // Exact syllable match
    if (syl1 === syl2) {
      matchCount += 1;
    }
    // Check without tone numbers (for partial credit)
    else if (removeTones(syl1) === removeTones(syl2)) {
      matchCount += 0.8; // 80% credit for correct pronunciation without tone
    }
    // Check phonetic similarity
    else if (calculateLevenshteinSimilarity(syl1, syl2) > 0.7) {
      matchCount += 0.6; // 60% credit for similar pronunciation
    }
  }

  return matchCount / syllables1.length;
};

// Remove tone numbers from pinyin
const removeTones = (pinyinSyllable) => {
  return pinyinSyllable.replace(/[1-4]/g, "");
};

// Levenshtein distance similarity (keep existing function for fallback)
const calculateLevenshteinSimilarity = (str1, str2) => {
  const s1 = str1.replace(/\s/g, "").toLowerCase();
  const s2 = str2.replace(/\s/g, "").toLowerCase();

  if (s1 === s2) return 1.0;

  const matrix = [];
  const len1 = s1.length;
  const len2 = s2.length;

  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  const maxLen = Math.max(len1, len2);
  return (maxLen - matrix[len2][len1]) / maxLen;
};

// Handle speech recognition errors
const handleSpeechError = (error) => {
  let message = "Speech recognition failed. Please try again.";
  let title = "Recognition Error";

  switch (error) {
    case "network":
      message =
        "Network error. Please check your internet connection and try again.";
      break;
    case "not-allowed":
      title = "Permission Required";
      message =
        "Microphone access was denied. Please allow microphone permissions in your browser settings and refresh the page.";
      break;
    case "no-speech":
      message =
        "No speech detected. Please speak louder and closer to your microphone.";
      break;
    case "audio-capture":
      title = "Microphone Error";
      message =
        "Microphone not found or not working. Please check your audio settings and try again.";
      break;
    case "service-not-allowed":
      title = "Service Error";
      message =
        "Speech recognition service is not available. Please try using Chrome or Safari browser.";
      break;
  }

  recordingStatus.value = {
    type: "error",
    title: title,
    message: message,
  };

  isRecording.value = false;
};

// Voice selection function
const selectBestChineseVoice = () => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();

  for (const preferredName of PREFERRED_VOICES) {
    const voice = voices.find(
      (v) => v.name.includes(preferredName) || v.name === preferredName
    );
    if (voice) {
      return voice;
    }
  }

  const zhCNVoice = voices.find((v) => v.lang === "zh-CN");
  if (zhCNVoice) {
    return zhCNVoice;
  }

  const anyChineseVoice = voices.find(
    (v) =>
      v.lang.includes("zh") ||
      v.name.toLowerCase().includes("chinese") ||
      v.name.toLowerCase().includes("mandarin")
  );

  return anyChineseVoice || null;
};

// Text-to-Speech
const playAudio = async () => {
  if (isPlaying.value) return;

  if (!hasAttempted.value) {
    hasAttempted.value = true;

    // Track this word as incorrect (listened to hint)
    wordResults.value[currentQuestionIndex.value] = {
      chinese: currentWord.value.chinese,
      english: currentWord.value.english,
      correct: false,
    };

    recordingStatus.value = {
      type: "info",
      title: "Hint Used",
      message:
        "You listened to the pronunciation. No points awarded for this word.",
    };
    canProceed.value = true;

    // Save state after using hint
    saveQuizState();
  }

  isPlaying.value = true;

  try {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(currentWord.value.chinese);
      utterance.lang = "zh-CN";
      utterance.rate = VOICE_SETTINGS.rate;
      utterance.pitch = VOICE_SETTINGS.pitch;
      utterance.volume = VOICE_SETTINGS.volume;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        isPlaying.value = false;
      };

      utterance.onerror = (event) => {
        console.error("TTS error:", event.error);
        isPlaying.value = false;
        recordingStatus.value = {
          type: "error",
          title: "Audio Error",
          message: "Could not play audio. Please try again.",
        };
      };

      window.speechSynthesis.speak(utterance);
    } else {
      throw new Error("Speech synthesis not supported");
    }
  } catch (error) {
    console.error("Error playing audio:", error);
    isPlaying.value = false;
    recordingStatus.value = {
      type: "error",
      title: "Audio Not Available",
      message: "Text-to-speech is not supported in your browser.",
    };
  }
};

const toggleRecording = async () => {
  if (hasAttempted.value || isProcessing.value) {
    recordingStatus.value = {
      type: "info",
      title: isProcessing.value ? "Processing..." : "Already Answered",
      message: isProcessing.value
        ? "Please wait while we analyze your pronunciation."
        : "You've already attempted this word. Click 'Next Word' to continue.",
    };
    return;
  }

  if (isRecording.value) {
    stopRecording();
  } else {
    startRecording();
  }
};

const startRecording = async () => {
  try {
    recordingStatus.value = null;

    if (!recognition) {
      recordingStatus.value = {
        type: "error",
        title: "Speech Recognition Not Supported",
        message:
          "Please use Chrome or Safari browser for speech recognition. Make sure you're on a secure (HTTPS) connection.",
      };
      return;
    }

    // Stop any existing recognition first
    if (isRecording.value) {
      recognition.stop();
      isRecording.value = false;
      await new Promise((resolve) => setTimeout(resolve, 100)); // Brief delay
    }

    // Request microphone permission explicitly
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop()); // Clean up
    } catch (permError) {
      let message = "Microphone access is required for this quiz.";

      if (permError.name === "NotAllowedError") {
        message =
          "Microphone access was denied. Please click the microphone icon in your browser's address bar and allow access, then refresh the page.";
      } else if (permError.name === "NotFoundError") {
        message =
          "No microphone found. Please connect a microphone and try again.";
      }

      recordingStatus.value = {
        type: "error",
        title: "Microphone Permission Required",
        message: message,
      };
      return;
    }

    isRecording.value = true;
    recordingStatus.value = {
      type: "info",
      title: "Recording...",
      message:
        "Speak the Chinese word clearly when ready. Click 'Stop Recording' when you're finished speaking.",
    };

    recognition.start();
  } catch (error) {
    console.error("Error starting recording:", error);
    recordingStatus.value = {
      type: "error",
      title: "Recording Error",
      message:
        "Could not start recording. Please check your microphone permissions and try again.",
    };
    isRecording.value = false;
  }
};

const stopRecording = () => {
  if (recognition) {
    try {
      if (isRecording.value) {
        isRecording.value = false; // Set this first
        recognition.stop(); // This will trigger onend which will process the result
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
      isRecording.value = false;
    }
  }
};

// Add restart recording function
const restartRecording = () => {
  if (recognition) {
    try {
      isRestarting.value = true; // Flag that this is a restart, not a stop

      if (isRecording.value) {
        recognition.stop(); // Stop current recording
        isRecording.value = false;
      }

      recordingStatus.value = null;

      // Start new recording after a brief delay
      setTimeout(() => {
        if (!hasAttempted.value && isRestarting.value) {
          // Make sure user hasn't attempted yet and this is still a restart
          startRecording();
        }
        isRestarting.value = false; // Reset restart flag
      }, 200);
    } catch (error) {
      console.error("Error restarting recording:", error);
      isRecording.value = false;
      isRestarting.value = false;
      recordingStatus.value = null; // Reset status on error too
    }
  }
};

// Cleanup - also update this to ensure everything stops
onUnmounted(() => {
  if (recognition) {
    try {
      if (isRecording.value) {
        recognition.stop();
      }
      isRecording.value = false;
    } catch (error) {
      console.error("Error cleaning up recognition:", error);
    }
  }

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
});

// Computed properties
const totalQuestions = computed(() => quizWords.value.length);
const currentWord = computed(
  () => quizWords.value[currentQuestionIndex.value] || {}
);
const accuracy = computed(() => {
  return totalQuestions.value > 0
    ? (correctAnswers.value / totalQuestions.value) * 100
    : 0;
});

// localStorage key for persisting quiz state
const STORAGE_KEY = "reading-quiz-state";

// Get today's date string for validation
const getTodayDateString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(today.getDate()).padStart(2, "0")}`;
};

// Save quiz state to localStorage
const saveQuizState = () => {
  if (!quizStarted.value) return;

  const quizState = {
    date: getTodayDateString(),
    quizStarted: quizStarted.value,
    quizCompleted: quizCompleted.value,
    currentQuestionIndex: currentQuestionIndex.value,
    score: score.value,
    correctAnswers: correctAnswers.value,
    totalQuestions: totalQuestions.value,
    wordResults: wordResults.value,
    quizWords: quizWords.value,
    hasAttempted: hasAttempted.value,
    canProceed: canProceed.value,
    showHint: showHint.value,
    timestamp: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizState));
  } catch (error) {
    console.error("Failed to save quiz state:", error);
  }
};

// Load quiz state from localStorage
const loadQuizState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const quizState = JSON.parse(saved);

    // Validate that the saved state is from today
    if (quizState.date !== getTodayDateString()) {
      // Clear old state if it's from a different day
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    // Validate that the state is not too old (more than 8 hours)
    const savedTime = new Date(quizState.timestamp);
    const now = new Date();
    const hoursDiff = (now - savedTime) / (1000 * 60 * 60);

    if (hoursDiff > 8) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return quizState;
  } catch (error) {
    console.error("Failed to load quiz state:", error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

// Restore quiz state
const restoreQuizState = (quizState) => {
  quizStarted.value = quizState.quizStarted;
  quizCompleted.value = quizState.quizCompleted;
  currentQuestionIndex.value = quizState.currentQuestionIndex;
  score.value = quizState.score;
  correctAnswers.value = quizState.correctAnswers;
  wordResults.value = quizState.wordResults || [];
  quizWords.value = quizState.quizWords || [];
  hasAttempted.value = quizState.hasAttempted || false;
  canProceed.value = quizState.canProceed || false;
  showHint.value = quizState.showHint || false;
};

// Clear quiz state from localStorage
const clearQuizState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear quiz state:", error);
  }
};

// Methods
const resetQuiz = () => {
  currentQuestionIndex.value = 0;
  score.value = 0;
  correctAnswers.value = 0;
  wordResults.value = [];
  resetQuestionState();
};

const startQuiz = () => {
  // Clear any existing session state when starting fresh
  clearQuizState();

  quizStarted.value = true;
  resetQuiz();

  // Save initial state
  saveQuizState();
};

const resetQuestionState = () => {
  showHint.value = false;
  recordingStatus.value = null;
  canProceed.value = false;
  isRecording.value = false;
  isPlaying.value = false;
  hasAttempted.value = false;
  isProcessing.value = false; // Reset processing state
};

const nextQuestion = () => {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    currentQuestionIndex.value++;
    resetQuestionState();

    // Save state after moving to next question
    saveQuizState();
  } else {
    completeQuiz();
  }
};

const completeQuiz = async () => {
  quizCompleted.value = true;
  await saveQuizResults();

  // Clear the quiz state from localStorage when quiz is completed
  clearQuizState();
};

const restartQuiz = () => {
  // Clear any existing session state
  clearQuizState();

  quizStarted.value = false;
  quizCompleted.value = false;
  resetQuiz();
};

// Initialize everything
onMounted(async () => {
  await loadQuizData();
  initSpeechRecognition();

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const setupVoice = () => {
      selectedVoice = selectBestChineseVoice();
    };

    setupVoice();
    window.speechSynthesis.onvoiceschanged = setupVoice;
    setTimeout(setupVoice, 100);
  }
});

// Cleanup
onUnmounted(() => {
  if (isRecording.value && recognition) {
    recognition.stop();
  }

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
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
</style>
