<template>
  <div ref="questionsContainer" class="questions-container">
    <div class="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <p class="flex items-center text-blue-800">
        <el-icon class="mr-2"><InfoFilled /></el-icon>
        Выберите правильный ответ для каждого вопроса. Можно отвечать в любом порядке.
      </p>
    </div>

    <div
      v-for="(question, qIndex) in questions"
      :key="qIndex"
      :ref="(el) => (questionRefs[qIndex] = el)"
      :data-question-index="qIndex"
      class="question-section mb-12"
      :class="{ 'opacity-50': isAnswered(qIndex) && !currentQuestion(qIndex) }"
    >
      <div class="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div class="mb-2 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-800">Вопрос {{ qIndex + 1 }}</h3>
          <div v-if="isAnswered(qIndex)" class="flex items-center">
            <el-icon v-if="getAnswerResult(qIndex)" class="mr-1 text-green-500" size="small">
              <CircleCheck />
            </el-icon>
            <el-icon v-else class="mr-1 text-red-500" size="small">
              <CircleClose />
            </el-icon>
            <span class="text-sm font-medium" :class="getAnswerResult(qIndex) ? 'text-green-600' : 'text-red-600'">
              {{ getAnswerResult(qIndex) ? 'Правильно' : 'Неверно' }}
            </span>
          </div>
        </div>
        <p class="text-lg text-gray-700">{{ question.question }}</p>
      </div>

      <div class="space-y-3">
        <div
          v-for="(answer, aIndex) in question.answers"
          :key="aIndex"
          @click="selectAnswer(qIndex, aIndex)"
          :class="['answer-card cursor-pointer rounded-lg border p-4 transition-all duration-300', getAnswerClasses(qIndex, aIndex)]"
          :disabled="isAnswered(qIndex)"
        >
          <div class="flex items-center">
            <div
              class="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border transition-colors"
              :class="getAnswerLetterClasses(qIndex, aIndex)"
            >
              {{ String.fromCharCode(65 + aIndex) }}
            </div>
            <span class="text-gray-800">{{ answer.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUpdate, nextTick } from 'vue'
import { InfoFilled, CircleCheck, CircleClose, ArrowLeft, ArrowRight, Trophy } from '@element-plus/icons-vue'
import type { Question } from '../types/lesson'

const props = defineProps<{
  questions: Question[]
}>()

const emit = defineEmits<{
  answerSelected: [data: { questionIndex: number; answerIndex: number; isCorrect: boolean }]
}>()

// Refs для элементов вопросов и контейнера
const questionRefs = ref<HTMLElement[]>([])
const questionsContainer = ref<HTMLElement>()

// Сброс refs при обновлении
onBeforeUpdate(() => {
  questionRefs.value = []
})

// Состояние
const selectedAnswers = ref<Map<number, number>>(new Map())
const currentQuestionIndex = ref<number>(0)

// Вычисляемые свойства
const answeredCount = computed(() => {
  return selectedAnswers.value.size
})

const answeredQuestions = computed(() => {
  return Array.from(selectedAnswers.value.keys()).sort((a, b) => a - b)
})

// Методы
const isAnswered = (questionIndex: number) => {
  return selectedAnswers.value.has(questionIndex)
}

const getAnswerResult = (questionIndex: number): boolean => {
  const answerIndex = selectedAnswers.value.get(questionIndex)
  if (answerIndex === undefined) return false
  return props.questions[questionIndex].answers[answerIndex].correct
}

const selectAnswer = async (questionIndex: number, answerIndex: number) => {
  // Если уже отвечали на этот вопрос, ничего не делаем
  if (isAnswered(questionIndex)) return

  selectedAnswers.value.set(questionIndex, answerIndex)

  const isCorrect = props.questions[questionIndex].answers[answerIndex].correct

  emit('answerSelected', {
    questionIndex,
    answerIndex,
    isCorrect,
  })

  // Ждем обновления DOM
  await nextTick()

  // Находим следующий неотвеченный вопрос
  const nextUnansweredIndex = findNextUnansweredQuestion(questionIndex)

  if (nextUnansweredIndex !== -1) {
    // Прокручиваем к следующему вопросу с плавной анимацией
    scrollToQuestion(nextUnansweredIndex)
    currentQuestionIndex.value = nextUnansweredIndex
  } else {
    // Все вопросы отвечены, прокручиваем к верху
    scrollToTop()
  }
}

const findNextUnansweredQuestion = (currentIndex: number): number => {
  // Проверяем вопросы после текущего
  for (let i = currentIndex + 1; i < props.questions.length; i++) {
    if (!isAnswered(i)) return i
  }

  // Если не нашли после текущего, проверяем с начала
  for (let i = 0; i < currentIndex; i++) {
    if (!isAnswered(i)) return i
  }

  // Все вопросы отвечены
  return -1
}

const scrollToQuestion = (index: number) => {
  if (index < 0 || index >= props.questions.length) return

  const questionElement = questionRefs.value[index]
  if (questionElement && questionsContainer.value) {
    const containerRect = questionsContainer.value.getBoundingClientRect()
    const elementRect = questionElement.getBoundingClientRect()
    const offset = elementRect.top - containerRect.top - 100 // 100px отступ сверху

    questionsContainer.value.scrollTo({
      top: questionsContainer.value.scrollTop + offset,
      behavior: 'smooth',
    })

    // Добавляем визуальный акцент на текущий вопрос
    questionElement.classList.add('ring-2', 'ring-blue-300', 'ring-offset-2')
    setTimeout(() => {
      questionElement.classList.remove('ring-2', 'ring-blue-300', 'ring-offset-2')
    }, 1500)

    currentQuestionIndex.value = index
  }
}

const scrollToTop = () => {
  if (questionsContainer.value) {
    questionsContainer.value.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
}

const showResults = () => {
  // Генерируем событие для показа результатов
  // В реальном приложении здесь можно эмитить событие для родителя
  alert('Все вопросы отвечены! Переходим к результатам.')
}

const getAnswerClasses = (questionIndex: number, answerIndex: number) => {
  const selectedAnswerIndex = selectedAnswers.value.get(questionIndex)
  const answer = props.questions[questionIndex].answers[answerIndex]

  if (selectedAnswerIndex === undefined) {
    return 'border-gray-200 hover:border-green-400 hover:bg-green-50 hover:shadow-md'
  }

  if (selectedAnswerIndex === answerIndex) {
    return answer.correct ? 'border-green-500 bg-green-50 shadow-lg shadow-green-100' : 'border-red-500 bg-red-50 shadow-lg shadow-red-100'
  }

  if (answer.correct && selectedAnswerIndex !== undefined) {
    return 'border-green-300 bg-green-50 shadow-sm'
  }

  return 'border-gray-200 bg-gray-100 opacity-70'
}

const getAnswerLetterClasses = (questionIndex: number, answerIndex: number) => {
  const selectedAnswerIndex = selectedAnswers.value.get(questionIndex)
  const answer = props.questions[questionIndex].answers[answerIndex]

  if (selectedAnswerIndex === undefined) {
    return 'border-gray-300 bg-white text-gray-700'
  }

  if (selectedAnswerIndex === answerIndex) {
    return answer.correct ? 'border-green-500 bg-green-500 text-white' : 'border-red-500 bg-red-500 text-white'
  }

  if (answer.correct && selectedAnswerIndex !== undefined) {
    return 'border-green-400 bg-green-100 text-green-700'
  }

  return 'border-gray-300 bg-gray-100 text-gray-500'
}

const currentQuestion = (index: number) => {
  return index === currentQuestionIndex.value
}

// Автоматически прокручиваем к первому неотвеченному вопросу при монтировании
onMounted(() => {
  const firstUnanswered = findNextUnansweredQuestion(-1)
  if (firstUnanswered !== -1) {
    scrollToQuestion(firstUnanswered)
  }
})
</script>

<style scoped>
.questions-container {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  padding: 0 6px;
  scroll-behavior: smooth;
}

.questions-container::-webkit-scrollbar {
  width: 8px;
}

.questions-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.questions-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.questions-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.question-section {
  transition: all 0.3s ease;
  border-radius: 12px;
  padding: 16px;
}

.question-section:hover {
  background-color: rgba(243, 244, 246, 0.5);
}

.answer-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.answer-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, currentColor, transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.answer-card:hover::before {
  opacity: 0.3;
}

.answer-card:active {
  transform: scale(0.99);
}

/* Анимация при выборе ответа */
.answer-card.selected {
  animation: pulse 0.5s ease;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

/* Анимация для навигации по вопросам */
@keyframes highlight {
  0% {
    background-color: rgba(59, 130, 246, 0.1);
  }
  100% {
    background-color: transparent;
  }
}

.ring-2.ring-blue-300 {
  animation: highlight 1.5s ease;
}

/* Адаптивность */
@media (max-width: 768px) {
  .questions-container {
    max-height: calc(100vh - 400px);
  }
}
</style>
