<template>
  <div
    class="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100"
  >
    <!-- Header -->
    <header class="flex justify-between items-center p-6">
      <NuxtLink
        to="/progress/reading"
        class="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <span>←</span>
        Back to Progress
      </NuxtLink>

      <div class="text-2xl font-bold text-purple-600">🎮 Reading Quiz</div>

      <div class="mx-14"></div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-96">
      <div class="text-center">
        <div class="text-6xl mb-4">⏳</div>
        <p class="text-2xl text-gray-600">Loading quiz...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-96">
      <div class="text-center">
        <div class="text-6xl mb-4">❌</div>
        <p class="text-xl text-red-600 mb-4">{{ error }}</p>
        <button
          @click="loadQuizData"
          class="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 px-6 rounded-full text-lg"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Quiz Container -->
    <main v-else class="container mx-auto px-6 py-8">
      <!-- Today's Quiz Already Completed -->
      <div v-if="todayCompleted && !quizStarted" class="text-center">
        <h1 class="text-6xl font-bold text-green-600 mb-8 bounce-gentle">
          Already Completed! ✅
        </h1>

        <div class="card-colorful max-w-2xl mx-auto">
          <div class="text-4xl mb-6">🎉</div>
          <h2 class="text-3xl font-bold text-gray-700 mb-4">
            Great job! You've already completed today's quiz
          </h2>

          <div class="bg-white rounded-xl p-6 mb-6">
            <h3 class="font-bold text-green-600 mb-4">Today's Results:</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-green-50 rounded-lg p-3">
                <div class="text-2xl font-bold text-green-600">
                  {{ todayResults.score }}
                </div>
                <div class="text-sm text-gray-600">Points</div>
              </div>
              <div class="bg-blue-50 rounded-lg p-3">
                <div class="text-2xl font-bold text-blue-600">
                  {{ Math.round(todayResults.accuracy) }}%
                </div>
                <div class="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <NuxtLink
              to="/progress/reading"
              class="btn-primary inline-flex items-center gap-2"
            >
              <span>📊</span>
              View Progress
            </NuxtLink>

            <div>
              <button
                @click="allowRetake"
                class="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 mx-2"
              >
                🔄 Practice Again
              </button>

              <NuxtLink
                to="/"
                class="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 mx-2"
              >
                🏠 Home
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Quiz Not Started -->
      <div v-else-if="!quizStarted" class="text-center">
        <h1 class="text-6xl font-bold text-purple-600 mb-8 bounce-gentle">
          Ready to Practice? 🎯
        </h1>

        <div class="card-colorful max-w-2xl mx-auto">
          <div class="text-4xl mb-6">📚</div>
          <h2 class="text-3xl font-bold text-gray-700 mb-4">
            Today's Chinese Reading Challenge
          </h2>

          <div class="bg-white rounded-xl p-4 mb-6">
            <h3 class="font-bold text-purple-600 mb-2">
              📊 Today's Word List ({{ quizWords.length }} words):
            </h3>
            <div class="grid grid-cols-2 gap-2 text-sm">
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

          <div class="space-y-4 mb-8">
            <div class="bg-white rounded-xl p-4 text-left">
              <h3 class="font-bold text-purple-600 mb-2">🎤 How it works:</h3>
              <ul class="text-gray-600 space-y-2">
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
            class="btn-primary text-2xl py-4 px-8 inline-flex items-center gap-2 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
          >
            <span>🚀</span>
            {{ quizWords.length === 0 ? "No Words Available" : "Start Quiz!" }}
          </button>
        </div>
      </div>

      <!-- Quiz in Progress -->
      <div v-else-if="!quizCompleted" class="max-w-4xl mx-auto">
        <!-- Progress Bar -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-2">
            <span class="text-lg font-semibold text-gray-600">
              Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}
            </span>
            <span class="text-lg font-semibold text-purple-600">
              Score: {{ score }} points
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div
              class="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full transition-all duration-500"
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
          <div class="text-6xl mb-4">📖</div>
          <h2 class="text-2xl font-bold text-gray-700 mb-6">
            Read this Chinese word aloud:
          </h2>

          <!-- Chinese Word Display -->
          <div
            class="chinese-text text-8xl font-bold text-purple-600 mb-8 select-none"
          >
            {{ currentWord.chinese }}
          </div>

          <!-- Control Buttons -->
          <div class="flex justify-center gap-4 mb-6 flex-wrap">
            <!-- Listen Button -->
            <button
              @click="playAudio"
              :disabled="isPlaying"
              class="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100 flex items-center gap-2"
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
              class="bg-gradient-to-r text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100 flex items-center gap-2"
            >
              <span>{{ isRecording ? "⏹️" : "🎤" }}</span>
              {{
                hasAttempted
                  ? "Already Attempted"
                  : isRecording
                  ? "Stop Recording"
                  : "Record Yourself"
              }}
            </button>

            <!-- Hint Button -->
            <button
              @click="showHint = !showHint"
              class="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center gap-2"
            >
              <span>💡</span>
              {{ showHint ? "Hide Hint" : "Need Help?" }}
            </button>
          </div>

          <!-- Hint Section -->
          <div
            v-if="showHint"
            class="bg-yellow-50 rounded-xl p-6 mb-6 text-left"
          >
            <h3 class="font-bold text-yellow-700 mb-3 flex items-center gap-2">
              <span>💡</span>
              Helpful Hints:
            </h3>
            <div class="space-y-3">
              <div class="bg-white rounded-lg p-3">
                <strong>English meaning:</strong> {{ currentWord.english }}
              </div>

              <div
                v-if="currentWord.sample_sentence_chinese"
                class="bg-white rounded-lg p-3"
              >
                <strong>Example sentence:</strong><br />
                <span class="chinese-text">{{
                  currentWord.sample_sentence_chinese
                }}</span
                ><br />
                <span class="text-gray-600">{{
                  currentWord.sample_sentence_english
                }}</span>
              </div>
            </div>
          </div>

          <!-- Recording Status -->
          <div v-if="recordingStatus" class="mb-6">
            <div
              :class="
                recordingStatus.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : recordingStatus.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-blue-50 border-blue-200 text-blue-700'
              "
              class="border-2 rounded-xl p-4"
            >
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">
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
              <p>{{ recordingStatus.message }}</p>
              <div v-if="recordingStatus.points" class="mt-2 text-lg font-bold">
                +{{ recordingStatus.points }} points!
              </div>
            </div>
          </div>

          <!-- Next Button -->
          <div class="flex justify-center gap-4">
            <button
              v-if="canProceed"
              @click="nextQuestion"
              class="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105"
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
        <h1 class="text-6xl font-bold text-green-600 mb-8 bounce-gentle">
          Great Job! 🎉
        </h1>

        <div class="card-colorful max-w-2xl mx-auto">
          <div class="text-4xl mb-6">🏆</div>
          <h2 class="text-3xl font-bold text-gray-700 mb-6">Quiz Complete!</h2>

          <div v-if="saving" class="mb-6">
            <div class="text-2xl mb-2">💾</div>
            <p class="text-lg text-blue-600">Saving your results...</p>
          </div>

          <!-- Final Score -->
          <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="bg-green-50 rounded-xl p-4 border-2 border-green-200">
              <div class="text-3xl font-bold text-green-600">{{ score }}</div>
              <div class="text-sm text-gray-600">Total Points</div>
            </div>
            <div class="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
              <div class="text-3xl font-bold text-blue-600">
                {{ Math.round(accuracy) }}%
              </div>
              <div class="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>

          <!-- Grade Display -->
          <div class="mb-8">
            <div class="text-6xl mb-2">{{ gradeEmoji }}</div>
            <div class="text-3xl font-bold" :class="gradeColor">
              Grade: {{ finalGrade }}
            </div>
            <div class="text-lg text-gray-600 mt-2">{{ gradeMessage }}</div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4">
            <NuxtLink
              to="/progress/reading"
              class="btn-primary inline-flex items-center gap-2"
            >
              <span>📊</span>
              View Progress
            </NuxtLink>

            <div>
              <button
                @click="restartQuiz"
                class="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 mx-2"
              >
                🔄 Try Again
              </button>

              <NuxtLink
                to="/"
                class="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 mx-2"
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
    const today = new Date().toISOString().split("T")[0];
    const { data: existingResult, error: resultError } = await supabase
      .from("quiz_results")
      .select("*")
      .eq("date", today)
      .single();

    if (resultError && resultError.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is expected if no quiz today
      throw resultError;
    }

    if (existingResult) {
      todayCompleted.value = true;
      todayResults.value = {
        score: existingResult.score,
        accuracy: existingResult.accuracy,
        wordsStudied: existingResult.words_studied,
        correctAnswers: existingResult.correct_answers,
      };
    }

    // Load words from database
    const { data: words, error: wordsError } = await supabase
      .from("quiz_words")
      .select("*")
      .order("id");

    if (wordsError) throw wordsError;

    if (!words || words.length === 0) {
      throw new Error(
        "No words found in database. Please add some words first."
      );
    }

    quizWords.value = words;
    console.log(`✅ Loaded ${words.length} words from database`);
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
    const today = new Date().toISOString().split("T")[0];

    // Prepare words data for JSON storage
    const wordsData = wordResults.value.filter(Boolean).map((word) => ({
      chinese: word.chinese,
      english: word.english,
      correct: word.correct,
    }));

    // Insert or update quiz result
    const { data, error: upsertError } = await supabase
      .from("quiz_results")
      .upsert(
        {
          date: today,
          words_studied: totalQuestions.value,
          correct_answers: correctAnswers.value,
          accuracy: accuracy.value,
          score: score.value,
          completed: true,
          words_data: wordsData,
        },
        {
          onConflict: "date",
        }
      )
      .select();

    if (upsertError) throw upsertError;

    console.log("✅ Quiz results saved successfully");

    // Update today's status
    todayCompleted.value = true;
    todayResults.value = {
      score: score.value,
      accuracy: accuracy.value,
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

    recognition.onstart = () => {
      console.log("Speech recognition started");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Recognized speech:", transcript);
      processSpeechResult(transcript);
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
  console.log(
    `Comparing "${transcript}" with "${currentChinese}" - similarity: ${similarity}`
  );

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

const finalGrade = computed(() => {
  const acc = accuracy.value;
  if (acc >= 95) return "A+";
  if (acc >= 90) return "A";
  if (acc >= 85) return "A-";
  if (acc >= 80) return "B+";
  if (acc >= 75) return "B";
  if (acc >= 70) return "B-";
  if (acc >= 65) return "C+";
  if (acc >= 60) return "C";
  if (acc >= 55) return "C-";
  if (acc >= 50) return "D";
  return "F";
});

const gradeEmoji = computed(() => {
  const grade = finalGrade.value;
  if (["A+", "A"].includes(grade)) return "🌟";
  if (["A-", "B+", "B"].includes(grade)) return "😊";
  if (["B-", "C+", "C"].includes(grade)) return "🙂";
  if (["C-", "D"].includes(grade)) return "😐";
  return "😔";
});

const gradeColor = computed(() => {
  const grade = finalGrade.value;
  if (["A+", "A"].includes(grade)) return "text-green-600";
  if (["A-", "B+", "B"].includes(grade)) return "text-blue-600";
  if (["B-", "C+", "C"].includes(grade)) return "text-yellow-600";
  if (["C-", "D"].includes(grade)) return "text-orange-600";
  return "text-red-600";
});

const gradeMessage = computed(() => {
  const grade = finalGrade.value;
  if (["A+", "A"].includes(grade)) return "Excellent pronunciation! 🎉";
  if (["A-", "B+", "B"].includes(grade))
    return "Great job! Keep practicing! 👏";
  if (["B-", "C+", "C"].includes(grade))
    return "Good effort! You're improving! 💪";
  if (["C-", "D"].includes(grade))
    return "Keep practicing, you'll get better! 📚";
  return "Don't give up! Practice makes perfect! 🌱";
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
