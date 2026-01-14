<template>
  <div class="lesson-card mb-6 overflow-hidden rounded-lg bg-white shadow-md">
    <!-- Заголовок урока -->
    <div class="border-b border-indigo-100 bg-indigo-50 p-4">
      <h2 class="text-xl font-bold text-gray-800">{{ lesson.title }}</h2>
      <div class="mt-2 flex items-center text-sm text-gray-600">
        <el-icon class="mr-1"><VideoCamera /></el-icon>
        <span>Видео-урок</span>
      </div>
    </div>

    <!-- Контент урока -->
    <div class="p-4 md:p-6">
      <!-- Видео -->
      <div class="mb-6">
        <div class="relative overflow-hidden rounded-lg bg-black pt-[56.25%]">
          <iframe :src="lesson.video" class="absolute top-0 left-0 h-full w-full" frameborder="0" allowfullscreen></iframe>
        </div>
      </div>

      <!-- Текст урока -->
      <div class="lesson-content mb-8 space-y-4">
        <template v-for="(item, index) in lesson.text" :key="index">
          <h3 v-if="item.type === 'h3'" class="mt-4 mb-2 text-lg font-semibold text-gray-800">
            {{ item.content }}
          </h3>
          <p v-else class="leading-relaxed text-gray-700">{{ item.content }}</p>
        </template>
      </div>

      <!-- Вопросы -->
      <div class="questions-section">
        <h3 class="mb-4 flex items-center text-xl font-bold text-gray-800">
          <el-icon class="mr-2"><QuestionFilled /></el-icon>
          Вопросы для проверки знаний
        </h3>

        <div class="space-y-6">
          <div
            v-for="(question, qIndex) in lesson.questions"
            :key="qIndex"
            class="question-card rounded-lg border p-4"
            :class="{
              'border-green-200 bg-green-50': isAnswered(qIndex),
              'border-gray-200': !isAnswered(qIndex),
            }"
          >
            <h4 class="mb-3 font-semibold text-gray-800">{{ qIndex + 1 }}. {{ question.question }}</h4>

            <div class="space-y-2">
              <div v-for="(answer, aIndex) in question.answers" :key="aIndex" class="answer-option" @click="selectAnswer(qIndex, aIndex)">
                <div
                  class="flex cursor-pointer items-center rounded-lg p-3 transition-all duration-200"
                  :class="getAnswerClasses(qIndex, aIndex)"
                >
                  <div class="mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2">
                    <div v-if="selectedAnswers[qIndex] === aIndex" class="h-3 w-3 rounded-full bg-indigo-600"></div>
                  </div>
                  <span class="text-gray-700">{{ answer.text }}</span>
                  <!-- Показываем правильный ответ только после выбора -->
                  <div v-if="showFeedback && selectedAnswers[qIndex] === aIndex" class="ml-auto">
                    <el-icon v-if="answer.correct" class="text-green-500">
                      <CircleCheck />
                    </el-icon>
                    <el-icon v-else class="text-red-500">
                      <CircleClose />
                    </el-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Lesson } from '@/types'
import { VideoCamera, QuestionFilled, CircleCheck, CircleClose } from '@element-plus/icons-vue'

interface Props {
  lesson: Lesson
  selectedAnswers: { [key: number]: number }
  showFeedback: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'answer-selected': [questionIndex: number, answerIndex: number]
}>()

const allQuestionsAnswered = computed(() => {
  return props.lesson.questions.every((_, index) => props.selectedAnswers[index] !== undefined)
})

const isAnswered = (questionIndex: number) => {
  return props.selectedAnswers[questionIndex] !== undefined
}

const selectAnswer = (questionIndex: number, answerIndex: number) => {
  emit('answer-selected', questionIndex, answerIndex)
}

const getAnswerClasses = (questionIndex: number, answerIndex: number) => {
  const isSelected = props.selectedAnswers[questionIndex] === answerIndex

  if (!isSelected) {
    return 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
  }

  // Если выбран ответ, проверяем правильность
  const answer = props.lesson.questions[questionIndex].answers[answerIndex]

  if (props.showFeedback) {
    return answer.correct ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
  }

  return 'bg-indigo-50 border-2 border-indigo-500'
}
</script>

<style scoped>
.lesson-card {
  transition: all 0.3s ease;
}

.answer-option {
  user-select: none;
}

.answer-option:hover .answer-content {
  transform: translateX(4px);
}

@media (max-width: 640px) {
  .lesson-content h3 {
    font-size: 1.125rem;
  }

  .questions-section {
    padding: 0.75rem;
  }

  .question-card {
    padding: 1rem;
  }
}
</style>
