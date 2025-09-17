<template>
  <!-- Loading State -->
  <div
    v-if="loading"
    class="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 flex items-center justify-center p-4"
  >
    <div class="text-center">
      <div class="text-4xl md:text-6xl mb-3 md:mb-4">⏳</div>
      <p class="text-lg md:text-2xl text-gray-600">Loading progress data...</p>
    </div>
  </div>

  <!-- Error State -->
  <div
    v-else-if="error"
    class="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 flex items-center justify-center p-4"
  >
    <div class="text-center">
      <div class="text-4xl md:text-6xl mb-3 md:mb-4">❌</div>
      <p class="text-lg md:text-xl text-red-600 mb-4">{{ error }}</p>
      <button
        @click="refreshCurrentWeekData"
        class="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-base md:text-lg"
      >
        Try Again
      </button>
    </div>
  </div>

  <!-- Main Content -->
  <div
    v-else
    class="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100"
  >
    <!-- Header -->
    <header class="flex justify-between items-center p-4 md:p-6">
      <NuxtLink
        to="/"
        class="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-sm md:text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <span>←</span>
        <span class="hidden sm:inline">Back Home</span>
      </NuxtLink>

      <div class="text-lg md:text-2xl font-bold text-blue-600">
        📚 <span class="hidden sm:inline">Reading Progress</span>
      </div>

      <div class="w-16 md:w-32"></div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 md:px-6 py-6 md:py-8">
      <!-- Page Title and Today's Quiz Button -->
      <div class="text-center mb-8 md:mb-12">
        <h1 class="text-3xl md:text-5xl font-bold text-blue-600 mb-3 md:mb-4">
          Elsa's Reading Journey
        </h1>
        <div class="text-lg md:text-xl text-gray-700 mb-4 md:mb-6">
          <p v-if="!isTodayQuizCompleted">
            Track your progress and keep learning!
          </p>
          <p v-else>Quiz Completed for the day. Click to try again!</p>
        </div>

        <!-- Start Today's Quiz Button -->
        <NuxtLink
          to="/quiz/reading"
          class="inline-block bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-full text-lg md:text-2xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 pulse-slow"
        >
          <span class="text-2xl md:text-3xl">🎮</span>
          <span class="ml-2" v-if="!isTodayQuizCompleted">Start Quiz!</span>
          <span class="ml-2" v-else>Restart Quiz</span>
        </NuxtLink>
      </div>

      <!-- Weekly Scores Overview -->
      <div class="card mb-6 md:mb-8">
        <h2
          class="text-2xl md:text-3xl font-bold text-center text-gray-700 mb-4 md:mb-2 flex items-center justify-center gap-2"
        >
          <span>📊</span>
          <span class="hidden sm:inline">Weekly Progress Summary</span>
          <span class="sm:hidden">Weekly Progress</span>
        </h2>
        <div
          class="text-sm md:text-lg font-semibold text-gray-600 text-center mb-6"
        >
          {{ currentWeekRange }}
        </div>
        <!-- Week Navigation -->
        <div
          class="flex flex-row justify-between items-center mb-4 md:mb-6 gap-3"
        >
          <button
            @click="previousWeek"
            class="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-2 px-3 md:px-4 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 text-sm md:text-base"
          >
            <span class="hidden sm:inline">← Previous Week</span>
            <span class="sm:hidden">← Prev</span>
          </button>

          <div class="flex flex-col sm:flex-row items-center gap-2 md:gap-4">
            <button
              @click="goToToday"
              class="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-1 px-3 md:py-2 md:px-4 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 text-sm md:text-base"
            >
              <div>📅</div>
              Today
            </button>
          </div>

          <button
            @click="nextWeek"
            class="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-2 px-3 md:px-4 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 text-sm md:text-base"
          >
            <span class="hidden sm:inline">Next Week →</span>
            <span class="sm:hidden">Next →</span>
          </button>
        </div>

        <!-- Weekly Stats Grid -->
        <div
          class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6"
        >
          <div
            class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 md:p-4 text-center border-2 border-green-200"
          >
            <div class="text-2xl md:text-3xl mb-1 md:mb-2">📚</div>
            <div class="text-lg md:text-2xl font-bold text-green-600">
              {{ weeklyStats.totalWords }}
            </div>
            <div class="text-xs md:text-sm text-gray-600">
              <span class="hidden sm:inline">Total Words</span>
              <span class="sm:hidden">Words</span>
            </div>
          </div>

          <div
            class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 md:p-4 text-center border-2 border-blue-200"
          >
            <div class="text-2xl md:text-3xl mb-1 md:mb-2">🎯</div>
            <div class="text-lg md:text-2xl font-bold text-blue-600">
              {{ weeklyStats.averageAccuracy }}%
            </div>
            <div class="text-xs md:text-sm text-gray-600">
              <span class="hidden sm:inline">Avg Accuracy</span>
              <span class="sm:hidden">Accuracy</span>
            </div>
          </div>

          <div
            class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 md:p-4 text-center border-2 border-purple-200"
          >
            <div class="text-2xl md:text-3xl mb-1 md:mb-2">📊</div>
            <div class="text-lg md:text-2xl font-bold text-purple-600">
              {{ weeklyStats.grade }}
            </div>
            <div class="text-xs md:text-sm text-gray-600">
              <span class="hidden sm:inline">Weekly Grade</span>
              <span class="sm:hidden">Grade</span>
            </div>
          </div>

          <div
            class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-3 md:p-4 text-center border-2 border-yellow-200"
          >
            <div class="text-2xl md:text-3xl mb-1 md:mb-2">📅</div>
            <div class="text-lg md:text-2xl font-bold text-yellow-600">
              {{ weeklyStats.daysActive }}
            </div>
            <div class="text-xs md:text-sm text-gray-600">
              <span class="hidden sm:inline">Days Active</span>
              <span class="sm:hidden">Days</span>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-3 md:p-4">
          <!-- Daily Breakdown for the Week -->
          <div class="space-y-6 md:space-y-8">
            <!-- Mobile: 2 rows (4 days + 3 days) -->
            <div class="sm:hidden space-y-2">
              <!-- First row: 4 days -->
              <div class="grid grid-cols-4 gap-1">
                <div
                  v-for="(day, index) in weekDays.slice(0, 4)"
                  :key="index"
                  @click="toggleDaySelection(day)"
                  :class="getWeekDayClass(day)"
                  class="text-center p-2 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-lg"
                >
                  <div class="font-bold text-xs">{{ day.shortName }}</div>
                  <div class="text-xs text-gray-500 mb-1">{{ day.date }}</div>
                  <div v-if="day.data" class="space-y-1">
                    <div
                      class="text-sm font-bold"
                      :class="
                        day.data.completed ? 'text-green-600' : 'text-gray-400'
                      "
                    >
                      {{ day.data.score || 0 }}pts
                    </div>
                    <div class="text-xs">
                      {{ day.data.wordsStudied || 0 }}
                    </div>
                    <div class="text-xs">{{ day.data.accuracy || 0 }}%</div>
                  </div>
                  <div v-else class="text-gray-400 text-xs">-</div>
                </div>
              </div>

              <!-- Second row: 3 days -->
              <div class="grid grid-cols-3 gap-1">
                <div
                  v-for="(day, index) in weekDays.slice(4, 7)"
                  :key="index + 4"
                  @click="toggleDaySelection(day)"
                  :class="getWeekDayClass(day)"
                  class="text-center p-2 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-lg"
                >
                  <div class="font-bold text-xs">{{ day.shortName }}</div>
                  <div class="text-xs text-gray-500 mb-1">{{ day.date }}</div>
                  <div v-if="day.data" class="space-y-1">
                    <div
                      class="text-sm font-bold"
                      :class="
                        day.data.completed ? 'text-green-600' : 'text-gray-400'
                      "
                    >
                      {{ day.data.score || 0 }}pts
                    </div>
                    <div class="text-xs">
                      {{ day.data.wordsStudied || 0 }}
                    </div>
                    <div class="text-xs">{{ day.data.accuracy || 0 }}%</div>
                  </div>
                  <div v-else class="text-gray-400 text-xs">-</div>
                </div>
              </div>
            </div>

            <!-- Desktop: Single row (7 days) -->
            <div class="hidden sm:grid grid-cols-7 gap-2">
              <div
                v-for="(day, index) in weekDays"
                :key="index"
                @click="toggleDaySelection(day)"
                :class="getWeekDayClass(day)"
                class="text-center p-3 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-lg"
              >
                <div class="font-bold text-sm">{{ day.shortName }}</div>
                <div class="text-xs text-gray-500 mb-1">{{ day.date }}</div>
                <div v-if="day.data" class="space-y-1">
                  <div
                    class="text-lg font-bold"
                    :class="
                      day.data.completed ? 'text-green-600' : 'text-gray-400'
                    "
                  >
                    {{ day.data.score || 0 }}pts
                  </div>
                  <div class="text-xs">
                    {{ day.data.wordsStudied || 0 }} words
                  </div>
                  <div class="text-xs">{{ day.data.accuracy || 0 }}%</div>
                </div>
                <div v-else class="text-gray-400 text-xs">No activity</div>
              </div>
            </div>

            <!-- Selected Day Details -->
            <div v-if="selectedDay && showDayDetails">
              <h3
                class="text-xl md:text-2xl font-bold text-center text-gray-700 mb-4 md:mb-6"
              >
                📊 {{ selectedDateFormatted }} Details
              </h3>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <!-- Day Stats -->
                <div>
                  <h4
                    class="text-lg md:text-xl font-bold text-blue-600 mb-3 md:mb-4 flex items-center gap-2"
                  >
                    <span>📈</span>
                    Performance
                  </h4>
                  <div class="space-y-2 md:space-y-3">
                    <div
                      class="flex justify-between p-2 md:p-3 bg-green-50 rounded-lg text-sm md:text-base"
                    >
                      <span>Words Studied:</span>
                      <span class="font-bold text-green-600">{{
                        selectedDayData.wordsStudied || 0
                      }}</span>
                    </div>
                    <div
                      class="flex justify-between p-2 md:p-3 bg-blue-50 rounded-lg text-sm md:text-base"
                    >
                      <span>Correct Answers:</span>
                      <span class="font-bold text-blue-600">{{
                        selectedDayData.correctAnswers || 0
                      }}</span>
                    </div>
                    <div
                      class="flex justify-between p-2 md:p-3 bg-purple-50 rounded-lg text-sm md:text-base"
                    >
                      <span>Accuracy:</span>
                      <span class="font-bold text-purple-600"
                        >{{ selectedDayData.accuracy || 0 }}%</span
                      >
                    </div>
                    <div
                      class="flex justify-between p-2 md:p-3 bg-yellow-50 rounded-lg text-sm md:text-base"
                    >
                      <span>Points Earned:</span>
                      <span class="font-bold text-yellow-600">{{
                        selectedDayData.score || 0
                      }}</span>
                    </div>
                  </div>
                </div>

                <!-- Words List -->
                <div>
                  <h4
                    class="text-lg md:text-xl font-bold text-green-600 mb-3 md:mb-4 flex items-center gap-2"
                  >
                    <span>📝</span>
                    Words Practiced
                  </h4>
                  <div class="max-h-48 md:max-h-60 overflow-y-auto space-y-2">
                    <div
                      v-if="
                        selectedDayData.words &&
                        selectedDayData.words.length > 0
                      "
                    >
                      <div
                        v-for="word in selectedDayData.words"
                        :key="word.id"
                        class="flex justify-between items-center p-2 md:p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div
                            class="chinese-text text-base md:text-lg font-semibold"
                          >
                            {{ word.chinese }}
                          </div>
                          <div class="text-xs md:text-sm text-gray-600">
                            {{ word.english }}
                          </div>
                        </div>
                        <div
                          :class="
                            word.correct ? 'text-green-500' : 'text-red-500'
                          "
                          class="text-lg md:text-xl"
                        >
                          {{ word.correct ? "✅" : "❌" }}
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-center text-gray-500 py-6 md:py-8">
                      <span class="text-sm md:text-base"
                        >No words practiced on this day yet</span
                      >
                    </div>
                  </div>
                </div>
              </div>
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
  title: "Reading Progress - Chinese Learning Fun!",
  meta: [
    {
      name: "description",
      content: "Track reading progress and view daily performance",
    },
  ],
});

// Supabase client
const supabase = useSupabaseClient();

// Reactive data
const selectedDay = ref(null);
const showDayDetails = ref(false);
const progressData = ref({});
const todayQuizData = ref(null); // Store today's data separately
const loading = ref(false);
const error = ref(null);

// Weekly functionality
const currentWeekStart = ref(getWeekStart(new Date()));

// Fetch today's quiz data separately
const fetchTodayQuizData = async () => {
  try {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const { data: todayResult, error: todayError } = await supabase
      .from("quiz_results")
      .select("*")
      .eq("date", todayKey)
      .single();

    if (todayError && todayError.code !== "PGRST116") {
      // PGRST116 is "not found"
      throw todayError;
    }

    if (todayResult) {
      todayQuizData.value = {
        wordsStudied: todayResult.words_studied,
        correctAnswers: todayResult.correct_answers,
        accuracy: parseFloat(todayResult.accuracy),
        score: todayResult.score,
        completed: todayResult.completed,
        words: todayResult.words_data || [],
      };
    } else {
      todayQuizData.value = null;
    }
  } catch (err) {
    console.error("❌ Error fetching today's quiz data:", err);
    // Don't set error state for this, as it's not critical for the main UI
  }
};

// Fetch progress data from database
const fetchProgressData = async (startDate, endDate) => {
  loading.value = true;
  error.value = null;

  try {
    // Fetch quiz results for the date range
    const { data: quizResults, error: quizError } = await supabase
      .from("quiz_results")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true });

    if (quizError) throw quizError;

    // Transform data into the format expected by the UI
    const transformedData = {};

    quizResults.forEach((result) => {
      const dateKey = result.date;
      transformedData[dateKey] = {
        wordsStudied: result.words_studied,
        correctAnswers: result.correct_answers,
        accuracy: parseFloat(result.accuracy),
        score: result.score,
        completed: result.completed,
        words: result.words_data || [], // JSON data directly
      };
    });

    progressData.value = transformedData;
  } catch (err) {
    console.error("❌ Error fetching progress data:", err);
    error.value = "Failed to load progress data. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Check if today's quiz is completed - now uses separate today data
const isTodayQuizCompleted = computed(() => {
  return todayQuizData.value?.completed || false;
});

const selectedDateFormatted = computed(() => {
  if (!selectedDay.value) return "";

  const dateKey = selectedDay.value.dateKey;
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const selectedDayData = computed(() => {
  if (!selectedDay.value) return {};
  const dateKey = selectedDay.value.dateKey;
  return progressData.value[dateKey] || {};
});

const currentWeekRange = computed(() => {
  const start = new Date(currentWeekStart.value);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return `${start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
});

const weekDays = computed(() => {
  const days = [];
  const dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < 7; i++) {
    const date = new Date(currentWeekStart.value);
    date.setDate(date.getDate() + i);

    const dateKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    const dayObj = {
      date: date.getDate(),
      shortName: dayNamesShort[date.getDay()],
      data: progressData.value[dateKey],
      isToday: date.toDateString() === new Date().toDateString(),
      dateKey: dateKey,
      isSelected: selectedDay.value?.dateKey === dateKey,
    };

    days.push(dayObj);
  }

  return days;
});

const weeklyStats = computed(() => {
  const weekData = weekDays.value.filter((day) => day.data);

  if (weekData.length === 0) {
    return {
      totalWords: 0,
      averageAccuracy: 0,
      grade: "F",
      daysActive: 0,
    };
  }

  const totalWords = weekData.reduce(
    (sum, day) => sum + (day.data.wordsStudied || 0),
    0
  );
  const averageAccuracy = Math.round(
    weekData.reduce((sum, day) => sum + (day.data.accuracy || 0), 0) /
      weekData.length
  );

  const grade = calculateWeeklyGrade(averageAccuracy, weekData.length);

  return {
    totalWords,
    averageAccuracy,
    grade,
    daysActive: weekData.length,
  };
});

// Calculate weekly grade based on accuracy and days active
const calculateWeeklyGrade = (averageAccuracy, daysActive) => {
  if (daysActive === 0) return "F";

  let baseGrade = "F";
  if (averageAccuracy >= 95) baseGrade = "A+";
  else if (averageAccuracy >= 90) baseGrade = "A";
  else if (averageAccuracy >= 85) baseGrade = "A-";
  else if (averageAccuracy >= 80) baseGrade = "B+";
  else if (averageAccuracy >= 75) baseGrade = "B";
  else if (averageAccuracy >= 70) baseGrade = "B-";
  else if (averageAccuracy >= 65) baseGrade = "C+";
  else if (averageAccuracy >= 60) baseGrade = "C";
  else if (averageAccuracy >= 55) baseGrade = "C-";
  else if (averageAccuracy >= 50) baseGrade = "D";

  if (daysActive >= 6) {
    return baseGrade;
  } else if (daysActive >= 4) {
    if (["A+", "A", "A-"].includes(baseGrade)) {
      const gradeMap = { "A+": "A", A: "A-", "A-": "B+" };
      return gradeMap[baseGrade];
    }
    return baseGrade;
  } else if (daysActive >= 2) {
    if (["A+", "A", "A-", "B+", "B"].includes(baseGrade)) {
      return "C+";
    } else if (["B-", "C+", "C"].includes(baseGrade)) {
      return "C-";
    }
    return baseGrade;
  } else {
    return "D";
  }
};

// Helper functions
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

// Refresh current week data
const refreshCurrentWeekData = async () => {
  const start = new Date(currentWeekStart.value);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  await fetchProgressData(formatDate(start), formatDate(end));
};

const previousWeek = async () => {
  const newStart = new Date(currentWeekStart.value);
  newStart.setDate(newStart.getDate() - 7);
  currentWeekStart.value = newStart;
  selectedDay.value = null;
  showDayDetails.value = false;

  await refreshCurrentWeekData();
};

const nextWeek = async () => {
  const newStart = new Date(currentWeekStart.value);
  newStart.setDate(newStart.getDate() + 7);
  currentWeekStart.value = newStart;
  selectedDay.value = null;
  showDayDetails.value = false;

  await refreshCurrentWeekData();
};

const goToToday = async () => {
  const today = new Date();
  currentWeekStart.value = getWeekStart(today);

  await refreshCurrentWeekData();

  nextTick(() => {
    const todayWeekDay = weekDays.value.find((day) => day.isToday);
    if (todayWeekDay) {
      selectedDay.value = todayWeekDay;
      showDayDetails.value = true;
    }
  });
};

const toggleDaySelection = (day) => {
  if (selectedDay.value?.dateKey === day.dateKey && showDayDetails.value) {
    showDayDetails.value = false;
    selectedDay.value = null;
  } else {
    selectedDay.value = day;
    showDayDetails.value = true;
  }
};

const getWeekDayClass = (day) => {
  let classes = [];

  if (day.isSelected) {
    classes.push(
      "border-4 border-gray-600",
      "scale-105",
      "bg-purple-100",
      "z-10 relative",
      "transform"
    );
  } else {
    classes.push("border-2");

    if (day.isToday) {
      classes.push("border-blue-500 bg-blue-100");
    } else if (day.data?.completed) {
      classes.push("border-green-500 bg-green-100");
    } else {
      classes.push("border-gray-300 bg-gray-50");
    }
  }

  return classes.join(" ");
};

// Load initial data
onMounted(async () => {
  // Fetch today's data first (for the quiz button)
  await fetchTodayQuizData();

  // Then fetch the current week's data
  await refreshCurrentWeekData();

  nextTick(() => {
    const todayWeekDay = weekDays.value.find((day) => day.isToday);
    if (todayWeekDay) {
      selectedDay.value = todayWeekDay;
      showDayDetails.value = true;
    }
  });
});
</script>

<style scoped>
.pulse-slow {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.chinese-text {
  font-family: "Noto Sans SC", "Source Han Sans", "PingFang SC",
    "Microsoft YaHei", sans-serif;
}
</style>
