<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <!-- Кнопка возврата на главную -->
    <div class="mx-auto mb-6 max-w-6xl">
      <el-button @click="goToHome" type="info" plain class="flex items-center">
        <el-icon class="mr-2"><House /></el-icon>
        На главную
      </el-button>
    </div>

    <div class="mx-auto max-w-6xl">
      <!-- Заголовок -->
      <header class="mb-8 text-center">
        <h1 class="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">📚 Курс по эфирным маслам</h1>
        <p class="text-gray-600">Изучайте уроки и проверяйте свои знания</p>
      </header>

      <!-- Панель выбора урока -->
      <div class="mb-8">
        <h2 class="mb-4 text-xl font-semibold text-gray-700">Выберите урок:</h2>
        <el-radio-group v-model="selectedLessonId" class="flex flex-wrap gap-4">
          <el-radio v-for="lesson in lessons" :key="lesson.id" :label="lesson.id" class="flex items-center">
            <div class="lesson-card-radio">
              <span class="font-medium text-gray-800">{{ lesson.title }}</span>
            </div>
          </el-radio>
        </el-radio-group>
      </div>

      <!-- Контейнер урока -->
      <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        <!-- Заголовок текущего урока -->
        <div class="border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-100 px-6 py-4">
          <div class="flex flex-col justify-between md:flex-row md:items-center">
            <div>
              <h2 class="text-2xl font-bold text-gray-800">📖 {{ currentLesson.title }}</h2>
              <div class="mt-2 flex items-center text-gray-600">
                <el-icon class="mr-2"><VideoCamera /></el-icon>
                <span>Урок {{ currentLesson.id }} из {{ lessons.length }}</span>
              </div>
            </div>

            <!-- Общий прогресс по вопросам -->
            <div v-if="userAnswers.length > 0" class="mt-2 md:mt-0">
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-600">Прогресс:</span>
                <el-progress
                  :percentage="Math.round((userAnswers.length / currentLesson.questions.length) * 100)"
                  :color="getProgressColor(userAnswers.length, currentLesson.questions.length)"
                  :show-text="false"
                  :stroke-width="8"
                  class="w-24"
                />
                <span class="text-sm font-medium text-gray-700"> {{ userAnswers.length }}/{{ currentLesson.questions.length }} </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Вкладки -->
        <el-tabs v-model="activeTab" class="lesson-tabs">
          <el-tab-pane label="📝 Теория" name="theory">
            <TheoryTab :lesson="currentLesson" />
          </el-tab-pane>
          <el-tab-pane label="❓ Вопросы" name="questions">
            <QuestionsTab :questions="currentLesson.questions" @answer-selected="handleAnswer" />
          </el-tab-pane>
          <el-tab-pane label="📊 Результаты" name="results" v-if="userAnswers.length > 0">
            <ResultsTab :user-answers="userAnswers" :total-questions="currentLesson.questions.length" @restart="restartLesson" />
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- Навигация -->
      <div class="mt-8 flex justify-between">
        <el-button :disabled="selectedLessonId === 1" @click="prevLesson" type="primary" plain>
          <el-icon class="mr-2"><ArrowLeft /></el-icon>
          Предыдущий урок
        </el-button>

        <div class="flex items-center space-x-4">
          <el-button v-if="activeTab !== 'theory'" @click="activeTab = 'theory'" type="success" plain> К теории </el-button>
          <el-button
            v-if="activeTab !== 'questions' && userAnswers.length < currentLesson.questions.length"
            @click="activeTab = 'questions'"
            type="warning"
            plain
          >
            Продолжить тест
          </el-button>
          <el-button
            v-if="activeTab !== 'results' && userAnswers.length === currentLesson.questions.length"
            @click="activeTab = 'results'"
            type="primary"
          >
            <el-icon class="mr-2"><Trophy /></el-icon>
            Посмотреть результаты
          </el-button>
        </div>

        <el-button :disabled="selectedLessonId === lessons.length" @click="nextLesson" type="primary">
          Следующий урок
          <el-icon class="ml-2"><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { VideoCamera, ArrowLeft, ArrowRight, House, Trophy } from '@element-plus/icons-vue'
import TheoryTab from '../components/TheoryTab.vue'
import QuestionsTab from '../components/QuestionsTab.vue'
import ResultsTab from '../components/ResultsTab.vue'
import type { Lesson, UserAnswer } from '../types/lesson'
import { lessons } from '../data/lessons'

const router = useRouter()

// Реактивное состояние
const selectedLessonId = ref<number>(1)
const activeTab = ref<string>('theory')
const userAnswers = ref<UserAnswer[]>([])

// Текущий урок
const currentLesson = computed<Lesson>(() => {
  return lessons.find((lesson) => lesson.id === selectedLessonId.value) || lessons[0]
})

// Навигация по урокам
const prevLesson = () => {
  if (selectedLessonId.value > 1) {
    selectedLessonId.value--
    resetAnswers()
  }
}

const nextLesson = () => {
  if (selectedLessonId.value < lessons.length) {
    selectedLessonId.value++
    resetAnswers()
  }
}

// Обработка ответов
const handleAnswer = (data: { questionIndex: number; answerIndex: number; isCorrect: boolean }) => {
  const existingIndex = userAnswers.value.findIndex((answer) => answer.questionIndex === data.questionIndex)

  if (existingIndex !== -1) {
    userAnswers.value[existingIndex] = data
  } else {
    userAnswers.value.push(data)
  }

  // Если все вопросы отвечены, предлагаем посмотреть результаты
  if (userAnswers.value.length === currentLesson.value.questions.length) {
    setTimeout(() => {
      activeTab.value = 'results'
    }, 500)
  }
}

// Сброс ответов при смене урока
const resetAnswers = () => {
  userAnswers.value = []
  activeTab.value = 'theory'
}

// Перезапуск урока
const restartLesson = () => {
  resetAnswers()
  activeTab.value = 'questions'
}

// Переход на главную
const goToHome = () => {
  router.push('/')
}

// Получение цвета прогресса
const getProgressColor = (current: number, total: number) => {
  const percentage = (current / total) * 100
  if (percentage < 30) return '#f56c6c' // red
  if (percentage < 70) return '#e6a23c' // orange
  return '#67c23a' // green
}

// Следим за сменой урока
watch(selectedLessonId, resetAnswers)
</script>

<style scoped>
.lesson-tabs {
  min-height: 500px;
}

:deep(.el-tabs__nav-wrap) {
  padding: 0 24px;
}

:deep(.el-tabs__content) {
  padding: 24px;
}

.lesson-card-radio {
  @apply cursor-pointer rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:border-green-400;
}

:deep(.el-radio.is-checked .lesson-card-radio) {
  @apply border-green-500 bg-green-50;
}

/* Стили для прогресс-бара */
:deep(.el-progress-bar__outer) {
  @apply rounded-full;
}

:deep(.el-progress-bar__inner) {
  transition: width 0.6s ease;
}
</style>
