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
            <div class="bg-white rounded-xl p-3 md:p-4 text-left">
              <h3 class="font-bold text-purple-600 mb-2 text-sm md:text-lg">
                🎤 How it works:
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
              :disabled="hasAttempted"
              :class="[
                hasAttempted
                  ? 'from-gray-400 to-gray-500 cursor-not-allowed'
                  : isRecording
                  ? 'from-red-400 to-red-500 hover:from-red-500 hover:to-red-600'
                  : 'from-green-400 to-green-500 hover:from-green-500 hover:to-green-600',
              ]"
              class="bg-gradient-to-r text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100 flex items-center gap-2 justify-center"
            >
              <span>{{ isRecording ? "⏹️" : "🎤" }}</span>
              <span class="hidden sm:inline">{{
                hasAttempted
                  ? "Already Attempted"
                  : isRecording
                  ? "Stop Recording"
                  : "Record Yourself"
              }}</span>
              <span class="sm:hidden">{{
                hasAttempted ? "Done" : isRecording ? "Stop" : "Record"
              }}</span>
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
      todayCompleted.value = true;
      todayResults.value = {
        score: existingResult.score || 0,
        accuracy: Math.round(existingResult.accuracy || 0),
        wordsStudied: existingResult.words_studied || 0,
        correctAnswers: existingResult.correct_answers || 0,
      };
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
  todayCompleted.value = false;
  quizStarted.value = false;
  quizCompleted.value = false;
  resetQuiz();
};

// Initialize speech recognition
const initSpeechRecognition = () => {
  if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "zh-CN";

    recognition.onstart = () => {};

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      processSpeechResult(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      handleSpeechError(event.error);
    };

    recognition.onend = () => {
      isRecording.value = false;
    };
  }
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

  const currentChinese = currentWord.value.chinese;
  const similarity = calculateSimilarity(transcript, currentChinese);

  const isCorrect = similarity > 0.7;
  hasAttempted.value = true;

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

    recordingStatus.value = {
      type: "success",
      title: "Great pronunciation!",
      message: `You said "${transcript}" - that's correct! 🎉`,
      points: points,
    };
  } else {
    recordingStatus.value = {
      type: "error",
      title: "Try again next time!",
      message: `I heard "${transcript}". The correct pronunciation is "${currentChinese}".`,
    };
  }

  canProceed.value = true;
};

// Calculate similarity between two strings
const calculateSimilarity = (str1, str2) => {
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

  switch (error) {
    case "network":
      message = "Network error. Please check your internet connection.";
      break;
    case "not-allowed":
      message =
        "Microphone access denied. Please allow microphone permissions.";
      break;
    case "no-speech":
      message = "No speech detected. Please speak louder and try again.";
      break;
    case "audio-capture":
      message = "Microphone not found. Please check your audio settings.";
      break;
  }

  recordingStatus.value = {
    type: "error",
    title: "Recognition Error",
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
  if (hasAttempted.value) {
    recordingStatus.value = {
      type: "info",
      title: "Already Answered",
      message:
        "You've already attempted this word. Click 'Next Word' to continue.",
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
      throw new Error("Speech recognition not supported");
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    isRecording.value = true;
    recordingStatus.value = {
      type: "info",
      title: "Recording...",
      message: "Speak the Chinese word clearly into your microphone.",
    };

    recognition.start();
    stream.getTracks().forEach((track) => track.stop());
  } catch (error) {
    console.error("Error starting recording:", error);

    let message = "Could not access microphone. Please check your permissions.";

    if (error.message.includes("not supported")) {
      message =
        "Speech recognition is not supported in your browser. Try using Chrome.";
    }

    recordingStatus.value = {
      type: "error",
      title: "Recording Error",
      message: message,
    };

    isRecording.value = false;
  }
};

const stopRecording = () => {
  if (recognition) {
    recognition.stop();
  }
  isRecording.value = false;
};

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

// Methods
const resetQuiz = () => {
  currentQuestionIndex.value = 0;
  score.value = 0;
  correctAnswers.value = 0;
  wordResults.value = [];
  resetQuestionState();
};

const startQuiz = () => {
  quizStarted.value = true;
  resetQuiz();
};

const resetQuestionState = () => {
  showHint.value = false;
  recordingStatus.value = null;
  canProceed.value = false;
  isRecording.value = false;
  isPlaying.value = false;
  hasAttempted.value = false;
};

const nextQuestion = () => {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    currentQuestionIndex.value++;
    resetQuestionState();
  } else {
    completeQuiz();
  }
};

const completeQuiz = async () => {
  quizCompleted.value = true;
  await saveQuizResults();
};

const restartQuiz = () => {
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
