<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="mx-auto max-w-6xl">
      <!-- Заголовок -->
      <header class="mb-8 text-center">
        <h1 class="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">📚 Курс по эфирным маслам</h1>
        <p class="text-gray-600">Изучайте уроки и проверяйте свои знания</p>
      </header>

      <!-- Контейнер урока -->
      <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        <!-- Заголовок текущего урока -->
        <div class="border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-100 px-6 py-4">
          <h2 class="text-2xl font-bold text-gray-800">📖 {{ currentLesson.title }}</h2>
          <div class="mt-2 flex items-center text-gray-600">
            <el-icon class="mr-2"><VideoCamera /></el-icon>
            <span>Урок {{ currentLesson.id }} из {{ lessons.length }}</span>
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
            <ResultsTab :user-answers="userAnswers" :total-questions="currentLesson.questions.length" />
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
          <el-button v-if="activeTab !== 'questions'" @click="activeTab = 'questions'" type="warning" plain> К вопросам </el-button>
        </div>

        <el-button
          :disabled="
            selectedLessonId === lessons.length || (activeTab !== 'results' && userAnswers.length !== currentLesson.questions.length)
          "
          @click="nextLesson"
          type="primary"
        >
          Следующий урок
          <el-icon class="ml-2"><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { VideoCamera, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

import TheoryTab from '@/components/TheoryTab.vue'
import QuestionsTab from '@/components/QuestionsTab.vue'
import ResultsTab from '@/components/ResultsTab.vue'

import { lessons } from '@/data/lessons'

import type { Lesson, UserAnswer } from '@/types/lesson'

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

  // Если все вопросы отвечены, переходим на вкладку результатов
  if (userAnswers.value.length === currentLesson.value.questions.length) {
    activeTab.value = 'results'
  }
}

// Сброс ответов при смене урока
const resetAnswers = () => {
  userAnswers.value = []
  activeTab.value = 'theory'
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
</style>
