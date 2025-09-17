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

// Initialize speech recognition with better settings for Chinese
const initSpeechRecognition = () => {
  if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true; // Enable interim results for better single character detection
    recognition.lang = "zh-CN";
    recognition.maxAlternatives = 10; // Increase alternatives for single characters
    recognition.timeout = 10000; // Longer timeout for single characters

    recognition.onstart = () => {
      console.log("Speech recognition started for:", currentWord.value.chinese);
    };

    recognition.onresult = (event) => {
      console.log("Full speech recognition results:", event.results);

      // Collect all results including interim ones
      const allTranscripts = [];

      // Process all result items
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];

        // For each result, get all alternatives
        for (let j = 0; j < result.length; j++) {
          const alternative = result[j];
          const transcript = alternative.transcript.trim();
          const confidence = alternative.confidence || 0;
          const isFinal = result.isFinal;

          if (transcript) {
            allTranscripts.push({
              text: transcript,
              confidence: confidence,
              isFinal: isFinal,
            });

            console.log(
              `Result ${i}, Alt ${j}: "${transcript}" (confidence: ${confidence}, final: ${isFinal})`
            );
          }
        }
      }

      // If we have final results, process them immediately
      const finalResults = allTranscripts.filter((t) => t.isFinal);
      if (finalResults.length > 0) {
        console.log("Processing final results:", finalResults);
        processSpeechResult(finalResults[0].text, finalResults);
        return;
      }

      // For single characters, also consider interim results if they seem confident
      const currentChinese = currentWord.value.chinese;
      if (currentChinese.length === 1 && allTranscripts.length > 0) {
        // Sort by confidence and look for matches
        const sortedTranscripts = allTranscripts.sort(
          (a, b) => (b.confidence || 0) - (a.confidence || 0)
        );

        for (const transcript of sortedTranscripts) {
          // If we find an exact match or high confidence interim result, use it
          if (
            transcript.text === currentChinese ||
            (transcript.confidence && transcript.confidence > 0.7) ||
            transcript.text.includes(currentChinese)
          ) {
            console.log(
              "Using interim result for single character:",
              transcript
            );
            processSpeechResult(transcript.text, sortedTranscripts);
            return;
          }
        }
      }
    };

    recognition.onspeechend = () => {
      console.log("Speech ended - processing any available results");
      // Give it a moment to finalize results
      setTimeout(() => {
        if (isRecording.value) {
          recognition.stop();
        }
      }, 500);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      handleSpeechError(event.error);
    };

    recognition.onend = () => {
      isRecording.value = false;
      console.log("Speech recognition ended");
    };
  }
};

// Enhanced speech result processing with better single character handling
const processSpeechResult = (transcript, alternatives = []) => {
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
  console.log("Target word:", currentChinese);
  console.log("Primary transcript:", transcript);
  console.log("All alternatives:", alternatives);

  // Try the primary transcript first
  let bestSimilarity = calculateSimilarity(transcript, currentChinese);
  let bestMatch = transcript;

  // Check all alternatives for better matches
  if (alternatives.length > 0) {
    for (const alt of alternatives) {
      const similarity = calculateSimilarity(alt.text, currentChinese);
      console.log(
        `Checking alternative "${alt.text}": similarity ${similarity}`
      );

      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = alt.text;
      }
    }
  }

  // Special handling for single characters - be more aggressive in finding matches
  if (currentChinese.length === 1) {
    // Check if any alternative contains the target character
    for (const alt of alternatives) {
      if (alt.text.includes(currentChinese)) {
        bestSimilarity = Math.max(bestSimilarity, 0.9);
        bestMatch = alt.text;
        console.log(
          `Found target character "${currentChinese}" in "${alt.text}"`
        );
        break;
      }
    }

    // Also check the primary transcript
    if (transcript.includes(currentChinese)) {
      bestSimilarity = Math.max(bestSimilarity, 0.9);
      bestMatch = transcript;
      console.log(
        `Found target character "${currentChinese}" in primary transcript "${transcript}"`
      );
    }
  }

  console.log(`Best match: "${bestMatch}" with similarity: ${bestSimilarity}`);

  // Adjust threshold based on word length - be more lenient for single characters
  let threshold = 0.7;
  if (currentChinese.length === 1) {
    threshold = 0.4; // Very lenient for single characters
  } else if (currentChinese.length === 2) {
    threshold = 0.6;
  }

  const isCorrect = bestSimilarity >= threshold;
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
      message: `You said "${bestMatch}" - ${
        bestSimilarity >= 0.9 ? "perfect" : "close enough"
      }! 🎉`,
      points: points,
    };
  } else {
    recordingStatus.value = {
      type: "error",
      title: "Try again next time!",
      message: `I heard "${bestMatch}". The correct pronunciation is "${currentChinese}". (Similarity: ${Math.round(
        bestSimilarity * 100
      )}%)`,
    };
  }

  canProceed.value = true;
};

// Improved similarity calculation for Chinese characters
const calculateSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;

  const s1 = str1.replace(/\s/g, "").toLowerCase().trim();
  const s2 = str2.replace(/\s/g, "").toLowerCase().trim();

  console.log(`Comparing: "${s1}" vs "${s2}"`);

  // Exact match
  if (s1 === s2) return 1.0;

  // For single character targets, check if it's contained in the recognition
  if (s2.length === 1) {
    // Direct character match
    if (s1.includes(s2)) {
      console.log("Single character found in transcript");
      return 0.9;
    }

    // Check for common phonetic confusions
    const phoneticScore = checkPhoneticSimilarity(s1, s2);
    if (phoneticScore > 0) {
      console.log("Phonetic similarity found:", phoneticScore);
      return phoneticScore;
    }
  }

  // Levenshtein distance calculation
  const len1 = s1.length;
  const len2 = s2.length;

  if (len1 === 0) return len2 === 0 ? 1.0 : 0.0;
  if (len2 === 0) return 0.0;

  const matrix = Array(len2 + 1)
    .fill()
    .map(() => Array(len1 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[0][i] = i;
  for (let j = 0; j <= len2; j++) matrix[j][0] = j;

  for (let j = 1; j <= len2; j++) {
    for (let i = 1; i <= len1; i++) {
      if (s1[i - 1] === s2[j - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1
        );
      }
    }
  }

  const maxLen = Math.max(len1, len2);
  const similarity = (maxLen - matrix[len2][len1]) / maxLen;
  console.log("Levenshtein similarity:", similarity);
  return similarity;
};

// Enhanced phonetic similarity for common Chinese character confusions
const checkPhoneticSimilarity = (recognized, target) => {
  const phoneticGroups = [
    ["一", "七", "医", "衣"],
    ["二", "儿", "而", "尔"],
    ["三", "山", "散"],
    ["四", "是", "十", "事"],
    ["五", "午", "无", "武"],
    ["六", "流", "柳"],
    ["七", "一", "气", "期"],
    ["八", "爸", "巴"],
    ["九", "就", "久"],
    ["十", "是", "四", "时"],
    ["你", "尼", "泥"],
    ["我", "握", "沃"],
    ["他", "她", "它", "塔"],
    ["的", "得", "德"],
    ["了", "乐", "勒"],
    ["和", "河", "何", "核"],
    ["有", "又", "右"],
    ["在", "再", "载"],
    ["会", "回", "汇"],
    ["说", "水", "税"],
    ["来", "累", "类"],
    ["去", "区", "趣"],
    ["好", "号", "豪"],
    ["人", "任", "认"],
    ["年", "念", "粘"],
    ["天", "田", "甜"],
    ["上", "商", "尚"],
    ["下", "夏", "吓"],
    ["大", "打", "达"],
    ["小", "笑", "校"],
  ];

  // Find the group containing the target character
  for (const group of phoneticGroups) {
    if (group.includes(target)) {
      // Check if any character from this group is in the recognized text
      for (const char of group) {
        if (recognized.includes(char)) {
          console.log(`Phonetic match found: ${char} for target ${target}`);
          return 0.8; // High similarity for phonetic matches
        }
      }
    }
  }

  return 0;
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
      recordingStatus.value = {
        type: "error",
        title: "Speech Recognition Not Supported",
        message:
          "Please use Chrome or Safari browser for speech recognition. Make sure you're on a secure (HTTPS) connection.",
      };
      return;
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
        "Speak the Chinese word clearly into your microphone. Click 'Stop Recording' when finished.",
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
