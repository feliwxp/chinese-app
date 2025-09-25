# Chinese Learning App 🎓

A comprehensive educational app designed for young learners to practice Chinese reading, English spelling, and math skills through interactive exercises and progress tracking.

## 🌟 Overview

This app provides a fun, engaging learning environment with three main practice areas:

- **Chinese Reading Practice** 📚 - Learn Chinese characters with pronunciation
- **Math Problem Solving** 🧮 - Practice word problems with step-by-step solutions
- **English Spelling** ✏️ - Master English vocabulary through interactive spelling exercises

## 🚀 Tech Stack

- **Framework**: Nuxt.js 4.1.2 (Vue.js 3.5.21)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Fonts**: Google Fonts (Noto Sans SC for Chinese characters)
- **Speech Recognition**: Web Speech API
- **Audio Recording**: RecordRTC

## 📱 App Structure

### Core Pages

#### 1. Home Page (`/`)

- **Functionality**: Main dashboard with navigation to all learning modules
- **Features**:
  - Quick access buttons to each practice area
  - Visual cards showing Chinese Reading, Math Practice, and Spelling Practice
  - Responsive design with mobile-first approach
  - Animated Chinese character backgrounds (学, ∑)

#### 2. Chinese Reading Module (`/quiz/reading`, `/progress/reading`, `/settings/reading`)

**Quiz Page (`/quiz/reading`):**

- **Core Functionality**: Interactive Chinese character reading practice with speech recognition
- **Features**:
  - Word-by-word pronunciation practice
  - Speech recognition for pronunciation assessment
  - English translations and sample sentences (Chinese & English)
  - Real-time feedback on pronunciation accuracy
  - Progress tracking with points system
  - Daily practice completion tracking
  - Session state persistence (resume interrupted sessions)

**Progress Page (`/progress/reading`):**

- **Functionality**: Detailed progress tracking and performance analytics
- **Features**:
  - Weekly progress overview with navigation
  - Daily performance breakdown showing:
    - Words practiced
    - Accuracy percentage
    - Time spent
    - Points earned
  - Detailed question-by-question review
  - Weekly statistics and grade calculation
  - Visual progress indicators and charts

**Settings Page (`/settings/reading`):**

- **Functionality**: Word management system for educators/parents
- **Features**:
  - Add new Chinese words with:
    - Chinese characters
    - Pinyin pronunciation
    - English translation
    - Sample sentences (Chinese & English)
  - Edit existing words
  - Activate/pause words from practice rotation
  - Delete words from database
  - Filter words by status (active/paused/all)
  - Bulk word management capabilities

#### 3. Math Practice Module (`/quiz/math`, `/progress/math`, `/settings/math`)

**Quiz Page (`/quiz/math`):**

- **Core Functionality**: Interactive math word problem solving with work area
- **Features**:
  - Step-by-step problem solving interface
  - Interactive work area with math operation buttons (+, -, ×, ÷, =)
  - Number pad for easy input
  - Free-form text area for showing mathematical work
  - Immediate feedback with detailed explanations
  - Points system (10 points per correct answer)
  - Session persistence and resumption
  - Daily practice completion tracking

**Progress Page (`/progress/math`):**

- **Functionality**: Comprehensive math performance analytics
- **Features**:
  - Weekly overview with key metrics:
    - Total questions attempted
    - Average accuracy
    - Weekly grade calculation
    - Days active
  - Daily breakdown showing:
    - Questions attempted and correct answers
    - Accuracy percentage
    - Points earned
    - Time spent
  - **Work shown review**: Display of student's mathematical work for each problem
  - Question-by-question analysis with correct vs. submitted answers

**Settings Page (`/settings/math`):**

- **Functionality**: Math question management for educators
- **Features**:
  - Add new word problems with:
    - Question text
    - Correct numerical answer
    - Step-by-step explanation
  - Edit existing questions
  - Activate/pause questions
  - Delete questions
  - Filter questions by status
  - Real-time question count tracking

#### 4. English Spelling Module (`/quiz/spelling-english`, `/progress/spelling-english`, `/settings/spelling-english`)

**Quiz Page (`/quiz/spelling-english`):**

- **Core Functionality**: Interactive spelling practice with audio pronunciation
- **Features**:
  - Audio pronunciation of words
  - Context sentences for better understanding
  - Type-to-spell interface
  - Immediate feedback on spelling accuracy
  - Word definitions and usage examples
  - Progress tracking with scoring system
  - Daily completion tracking
  - Session state management

**Progress Page (`/progress/spelling-english`):**

- **Functionality**: Spelling performance tracking and analytics
- **Features**:
  - Weekly spelling progress overview
  - Daily performance metrics:
    - Words attempted
    - Correct spellings
    - Accuracy percentage
    - Points earned
  - Detailed word-by-word review
  - Progress visualization and statistics

**Settings Page (`/settings/spelling-english`):**

- **Functionality**: Spelling word management system
- **Features**:
  - Add new words with:
    - Word spelling
    - Definition
    - Sample sentence for context
  - Edit existing words
  - Activate/pause words from practice
  - Delete words
  - Status filtering and management
  - Word inventory tracking

#### 5. Settings Hub (`/settings/`)

- **Functionality**: Central configuration dashboard
- **Features**:
  - Navigation hub to all content management areas
  - Quick access to:
    - Reading word management
    - Math question management
    - Spelling word management
  - Unified settings interface design

## 🗄️ Database Structure

### Supabase Tables:

1. **`reading_words`**

   - `id`, `chinese`, `pinyin`, `english`
   - `sample_sentence_chinese`, `sample_sentence_english`
   - `status` (active/paused), `created_at`, `updated_at`

2. **`reading_results`**

   - `id`, `date`, `words_practiced`, `correct_pronunciations`
   - `accuracy`, `score`, `time_spent`, `words_data`
   - `completed`, `created_at`, `updated_at`

3. **`math_questions`**

   - `id`, `question`, `answer`, `explanation`
   - `status` (active/paused), `created_at`, `updated_at`

4. **`math_results`**

   - `id`, `date`, `questions_attempted`, `correct_answers`
   - `accuracy`, `score`, `time_spent`, `questions_data`
   - `completed`, `created_at`, `updated_at`

5. **`spelling_words`**

   - `id`, `word`, `definition`, `sentence`
   - `status` (active/paused), `created_at`, `updated_at`

6. **`spelling_results`**
   - `id`, `date`, `words_attempted`, `correct_spellings`
   - `accuracy`, `score`, `time_spent`, `words_data`
   - `completed`, `created_at`, `updated_at`

## ✨ Key Features

### 🎯 Learning Features

- **Adaptive Practice**: Only active content appears in practice sessions
- **Session Persistence**: Resume interrupted practice sessions
- **Real-time Feedback**: Immediate responses to student input
- **Multi-modal Learning**: Visual, audio, and text-based learning
- **Progress Tracking**: Detailed analytics and performance history

### 📊 Analytics & Progress

- **Daily Completion Tracking**: Prevents over-practice, encourages consistency
- **Weekly Performance Analytics**: Trends and improvement tracking
- **Detailed Work Review**: See student's thought process and work
- **Grade Calculation**: Automated performance grading
- **Visual Progress Indicators**: Easy-to-understand progress visualization

### 🛠️ Content Management

- **Educator Dashboard**: Complete content control for teachers/parents
- **Bulk Operations**: Efficiently manage large sets of content
- **Status Management**: Easily activate/pause content without deletion
- **Real-time Sync**: Changes immediately reflect in practice sessions
- **Data Persistence**: All content stored securely in Supabase

### 📱 User Experience

- **Responsive Design**: Optimized for mobile and desktop
- **Accessibility**: Clear typography, logical navigation
- **Error Handling**: Graceful error states and recovery options
- **Loading States**: Clear feedback during data operations
- **Offline Resilience**: LocalStorage fallbacks for critical data

### 🔧 Technical Features

- **Speech Recognition**: Advanced pronunciation assessment
- **Audio Playback**: High-quality word pronunciation
- **Local Storage**: Session persistence and offline functionality
- **Real-time Database**: Live sync with Supabase
- **Modular Architecture**: Clean separation of concerns
- **Performance Optimized**: Efficient data loading and caching

## 🎨 Design Philosophy

The app follows a **child-friendly design** with:

- **Vibrant Colors**: Engaging gradient backgrounds and colorful UI elements
- **Large Touch Targets**: Easy interaction on mobile devices
- **Clear Typography**: Readable fonts with appropriate sizing
- **Consistent Iconography**: Emoji-based icons for universal understanding
- **Encouraging Feedback**: Positive reinforcement and celebration of progress
- **Intuitive Navigation**: Simple, logical flow between sections

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18+)
- Supabase account and project
- Environment variables configured

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd chinese-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   ```bash
   # Create .env file with:
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📈 Usage Workflow

### For Students:

1. **Start Practice**: Choose a learning module from home page
2. **Complete Session**: Work through problems/words with real-time feedback
3. **Review Progress**: Check daily and weekly performance
4. **Continue Learning**: Resume sessions and track improvement

### For Educators/Parents:

1. **Manage Content**: Add/edit questions, words, and learning materials
2. **Monitor Progress**: Review detailed analytics and student work
3. **Adjust Difficulty**: Activate/pause content based on student needs
4. **Track Growth**: Use progress data to guide learning plans

## 🎯 Educational Goals

- **Chinese Literacy**: Build character recognition and pronunciation skills
- **Mathematical Reasoning**: Develop problem-solving and calculation abilities
- **English Vocabulary**: Expand spelling and vocabulary knowledge
- **Self-paced Learning**: Allow students to learn at their own speed
- **Progress Awareness**: Help students understand their learning journey
- **Consistent Practice**: Encourage regular, manageable learning sessions

## 🔄 Future Enhancements

Potential areas for expansion:

- **Multi-user Support**: Individual student accounts and profiles
- **Achievement System**: Badges, streaks, and learning milestones
- **Advanced Analytics**: Deeper insights into learning patterns
- **Content Import/Export**: Bulk content management capabilities
- **Parent Dashboard**: Detailed reports for parents and teachers
- **Gamification**: Learning games and challenges
- **Voice Commands**: Enhanced speech interaction capabilities

---

**Built with ❤️ for young learners everywhere! 🌟**
