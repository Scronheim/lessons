<template>
  <div class="lessons-view">
    <!-- Header -->
    <header class="sticky top-0 z-10 bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <el-button type="text" @click="goToHome" class="flex items-center text-gray-600 hover:text-indigo-600">
              <el-icon class="mr-1"><ArrowLeft /></el-icon>
              На главную
            </el-button>
            <div class="hidden items-center space-x-3 md:flex">
              <el-icon class="text-2xl text-indigo-600">
                <Reading />
              </el-icon>
              <h1 class="text-xl font-bold text-gray-800 md:text-2xl">Курс по ароматерапии</h1>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="hidden text-sm text-gray-600 md:inline"> Урок {{ currentLessonIndex + 1 }} из {{ lessons.length }} </span>
            <el-progress :percentage="progressPercentage" :stroke-width="6" :show-text="false" class="hidden w-24 md:block" />
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6 md:py-8">
      <div class="flex flex-col gap-6 lg:flex-row">
        <!-- Основной контент -->
        <div class="lg:w-2/3">
          <LessonCard
            :lesson="currentLesson"
            :selected-answers="userAnswers[currentLesson.id] || {}"
            :show-feedback="showFeedback"
            @answer-selected="handleAnswerSelected"
          />
        </div>

        <!-- Боковая панель -->
        <div class="lg:w-1/3">
          <div class="sticky top-20">
            <!-- Прогресс -->
            <div class="mb-6 rounded-lg bg-white p-4 shadow-md">
              <h3 class="mb-3 font-semibold text-gray-800">Прогресс обучения</h3>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Пройдено уроков:</span>
                  <span class="font-medium">{{ completedLessonsCount }}/{{ lessons.length }}</span>
                </div>
                <el-progress :percentage="progressPercentage" :stroke-width="10" :format="() => ''" />
              </div>
            </div>

            <!-- Навигация по урокам -->
            <div class="mb-6 rounded-lg bg-white p-4 shadow-md">
              <h3 class="mb-3 font-semibold text-gray-800">Все уроки</h3>
              <div class="max-h-80 space-y-2 overflow-y-auto">
                <div
                  v-for="lesson in lessons"
                  :key="lesson.id"
                  @click="goToLesson(lesson.id)"
                  class="cursor-pointer rounded-lg p-3 transition-colors duration-200"
                  :class="{
                    'border-l-4 border-indigo-500 bg-indigo-100': lesson.id === currentLesson.id,
                    'hover:bg-gray-50': lesson.id !== currentLesson.id,
                    'opacity-100': isLessonAvailable(lesson.id),
                    'opacity-60': !isLessonAvailable(lesson.id),
                  }"
                >
                  <div class="flex items-center">
                    <div
                      class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                      :class="{
                        'bg-indigo-500 text-white': lesson.id === currentLesson.id,
                        'bg-gray-200 text-gray-600': lesson.id !== currentLesson.id,
                      }"
                    >
                      {{ lesson.id }}
                    </div>
                    <div class="ml-3">
                      <h4 class="truncate text-sm font-medium text-gray-800">
                        {{ lesson.title }}
                      </h4>
                      <div class="mt-1 flex items-center">
                        <div v-if="isLessonCompleted(lesson.id)" class="flex items-center text-xs text-green-600">
                          <el-icon size="12"><CircleCheck /></el-icon>
                          <span class="ml-1">Завершен</span>
                        </div>
                        <div v-else class="text-xs text-gray-500">{{ lesson.questions.length }} вопросов</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Статистика -->
            <div class="rounded-lg bg-white p-4 shadow-md">
              <h3 class="mb-3 font-semibold text-gray-800">Ваша статистика</h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="rounded-lg bg-blue-50 p-3 text-center">
                  <div class="text-2xl font-bold text-blue-600">{{ correctAnswersCount }}</div>
                  <div class="mt-1 text-xs text-blue-500">Правильных ответов</div>
                </div>
                <div class="rounded-lg bg-green-50 p-3 text-center">
                  <div class="text-2xl font-bold text-green-600">{{ progressPercentage }}%</div>
                  <div class="mt-1 text-xs text-green-500">Прогресс курса</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Навигационные кнопки -->
      <div class="mt-8 flex justify-between">
        <el-button type="default" :disabled="currentLessonIndex === 0" @click="goToPreviousLesson" class="flex items-center">
          <el-icon class="mr-2"><ArrowLeft /></el-icon>
          Предыдущий урок
        </el-button>

        <el-button
          v-if="currentLessonIndex < lessons.length - 1"
          type="primary"
          :disabled="!isCurrentLessonCompleted"
          @click="goToNextLesson"
          class="flex items-center"
        >
          Следующий урок
          <el-icon class="ml-2"><ArrowRight /></el-icon>
        </el-button>

        <el-button v-else type="success" :disabled="!isCurrentLessonCompleted" @click="completeCourse" class="flex items-center">
          <el-icon class="mr-2"><CircleCheck /></el-icon>
          Завершить курс
        </el-button>
      </div>
    </main>

    <!-- Уведомление о завершении урока -->
    <el-dialog v-model="showCompletionDialog" title="Урок завершен!" width="90%" class="max-w-md">
      <div class="py-4 text-center">
        <el-icon class="mb-4 text-4xl text-green-500">
          <CircleCheckFilled />
        </el-icon>
        <p class="mb-2 text-gray-700">
          Вы успешно завершили урок
          <span class="font-semibold">"{{ currentLesson.title }}"</span>
        </p>
        <p class="text-sm text-gray-500">Правильных ответов: {{ currentLessonCorrectAnswers }}/{{ currentLesson.questions.length }}</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCompletionDialog = false">Продолжить</el-button>
          <el-button type="primary" @click="goToNextLesson" v-if="currentLessonIndex < lessons.length - 1"> Следующий урок </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LessonCard from '@/components/LessonCard.vue'
import { lessons } from '@/data/lessons'
import type { UserAnswer } from '@/types'
import { Reading, ArrowLeft, ArrowRight, CircleCheck, CircleCheckFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

// Состояние
const currentLessonIndex = ref(0)
const userAnswers = ref<Record<number, { [key: number]: number }>>({})
const showFeedback = ref(false)
const showCompletionDialog = ref(false)

// Вычисляемые свойства
const currentLesson = computed(() => lessons[currentLessonIndex.value])

const completedLessonsCount = computed(() => {
  return lessons.filter((lesson) => isLessonCompleted(lesson.id)).length
})

const progressPercentage = computed(() => {
  return Math.round((completedLessonsCount.value / lessons.length) * 100)
})

const isCurrentLessonCompleted = computed(() => {
  return isLessonCompleted(currentLesson.value.id)
})

const correctAnswersCount = computed(() => {
  let count = 0
  Object.entries(userAnswers.value).forEach(([lessonId, answers]) => {
    const lesson = lessons.find((l) => l.id === Number(lessonId))
    if (lesson) {
      Object.entries(answers).forEach(([qIndex, aIndex]) => {
        if (lesson.questions[Number(qIndex)].answers[aIndex].correct) {
          count++
        }
      })
    }
  })
  return count
})

const currentLessonCorrectAnswers = computed(() => {
  const answers = userAnswers.value[currentLesson.value.id]
  if (!answers) return 0

  return Object.entries(answers).reduce((count, [qIndex, aIndex]) => {
    if (currentLesson.value.questions[Number(qIndex)].answers[aIndex].correct) {
      return count + 1
    }
    return count
  }, 0)
})

// Методы
const goToHome = () => {
  router.push('/')
}

const isLessonCompleted = (lessonId: number) => {
  const answers = userAnswers.value[lessonId]
  if (!answers) return false

  const lesson = lessons.find((l) => l.id === lessonId)
  return lesson && Object.keys(answers).length === lesson.questions.length
}

const isLessonAvailable = (lessonId: number) => {
  const lessonIndex = lessons.findIndex((l) => l.id === lessonId)
  if (lessonIndex === 0) return true

  const previousLesson = lessons[lessonIndex - 1]
  return isLessonCompleted(previousLesson.id)
}

const handleAnswerSelected = (questionIndex: number, answerIndex: number) => {
  if (!userAnswers.value[currentLesson.value.id]) {
    userAnswers.value[currentLesson.value.id] = {}
  }

  userAnswers.value[currentLesson.value.id][questionIndex] = answerIndex
  showFeedback.value = true

  // Проверяем, завершен ли урок
  if (isCurrentLessonCompleted.value) {
    showCompletionDialog.value = true
    saveProgress()
  }
}

const goToLesson = (lessonId: number) => {
  if (!isLessonAvailable(lessonId)) {
    ElMessage.warning('Сначала завершите предыдущий урок')
    return
  }

  const index = lessons.findIndex((l) => l.id === lessonId)
  if (index !== -1) {
    currentLessonIndex.value = index
    showFeedback.value = false
  }
}

const goToNextLesson = () => {
  if (currentLessonIndex.value < lessons.length - 1) {
    currentLessonIndex.value++
    showFeedback.value = false
    showCompletionDialog.value = false
  }
}

const goToPreviousLesson = () => {
  if (currentLessonIndex.value > 0) {
    currentLessonIndex.value--
    showFeedback.value = false
  }
}

const completeCourse = () => {
  ElMessage.success({
    message: 'Поздравляем! Вы успешно завершили курс!',
    duration: 3000,
  })
  // Можно добавить переход на главную или страницу с сертификатом
  router.push('/')
}

const saveProgress = () => {
  localStorage.setItem('aromatherapy-course-progress', JSON.stringify(userAnswers.value))
}

const loadProgress = () => {
  const saved = localStorage.getItem('aromatherapy-course-progress')
  if (saved) {
    userAnswers.value = JSON.parse(saved)
  }
}

// Хуки жизненного цикла
onMounted(() => {
  loadProgress()
})
</script>

<style scoped>
.lessons-view {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
}

@media (max-width: 1024px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 768px) {
  .dialog-footer {
    @apply flex flex-col;
  }

  .dialog-footer button {
    @apply w-full;
  }
}
</style>
