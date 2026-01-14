<template>
  <div class="results-container">
    <!-- Статистика -->
    <div class="mb-8 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
      <div class="flex flex-col items-center justify-between md:flex-row">
        <div class="mb-4 text-center md:mb-0 md:text-left">
          <h3 class="mb-2 text-2xl font-bold text-gray-800">Результаты теста</h3>
          <p class="text-gray-600">Проверьте свои знания</p>
        </div>

        <div class="flex items-center space-x-6">
          <div class="text-center">
            <div class="text-4xl font-bold text-green-600">
              {{ correctCount }}
            </div>
            <div class="text-gray-600">Правильно</div>
          </div>

          <div class="text-center">
            <div class="text-4xl font-bold text-blue-600">
              {{ totalQuestions }}
            </div>
            <div class="text-gray-600">Всего вопросов</div>
          </div>

          <div class="text-center">
            <div class="text-4xl font-bold text-orange-600">{{ percentage }}%</div>
            <div class="text-gray-600">Успеваемость</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Кнопки действий -->
    <div class="mb-8 flex flex-wrap gap-4">
      <el-button @click="emit('restart')" type="primary" plain class="flex items-center">
        <el-icon class="mr-2"><Refresh /></el-icon>
        Пройти тест заново
      </el-button>

      <el-button v-if="percentage >= 70" type="success" class="flex items-center">
        <el-icon class="mr-2"><Check /></el-icon>
        Тест пройден успешно
      </el-button>
    </div>

    <!-- Детализация -->
    <div class="mb-8 space-y-4">
      <div
        v-for="answer in userAnswers"
        :key="answer.questionIndex"
        class="rounded-lg border p-4"
        :class="answer.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'"
      >
        <div class="flex items-start">
          <el-icon class="mt-1 mr-3 flex-shrink-0" :class="answer.isCorrect ? 'text-green-500' : 'text-red-500'">
            <CircleCheck v-if="answer.isCorrect" />
            <CircleClose v-else />
          </el-icon>

          <div class="flex-grow">
            <p class="mb-1 font-medium text-gray-800">Вопрос {{ answer.questionIndex + 1 }}</p>
            <p class="text-sm" :class="answer.isCorrect ? 'text-green-600' : 'text-red-600'">
              {{ answer.isCorrect ? 'Правильный ответ!' : 'Неправильный ответ' }}
            </p>
          </div>

          <div v-if="!answer.isCorrect" class="flex-shrink-0">
            <el-button size="small" @click="showCorrectAnswer(answer.questionIndex)" type="text" class="text-blue-600">
              Показать правильный ответ
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Рекомендации -->
    <div v-if="percentage < 70" class="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
      <h4 class="mb-2 flex items-center text-lg font-semibold text-yellow-800">
        <el-icon class="mr-2"><Warning /></el-icon>
        Рекомендация
      </h4>
      <p class="mb-4 text-yellow-700">
        Рекомендуем повторить материал урока для лучшего усвоения информации. Обратите особое внимание на вопросы, в которых допустили
        ошибки.
      </p>
      <el-button @click="emit('restart')" type="warning" plain class="flex items-center">
        <el-icon class="mr-2"><Refresh /></el-icon>
        Повторить тест
      </el-button>
    </div>

    <div v-else class="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6">
      <h4 class="mb-2 flex items-center text-lg font-semibold text-green-800">
        <el-icon class="mr-2"><SuccessFilled /></el-icon>
        Отличный результат!
      </h4>
      <p class="text-green-700">Вы хорошо усвоили материал урока. Можете переходить к следующему урокю!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleCheck, CircleClose, Warning, SuccessFilled, Refresh, Check } from '@element-plus/icons-vue'
import type { UserAnswer } from '../types/lesson'
import { computed } from 'vue'

const props = defineProps<{
  userAnswers: UserAnswer[]
  totalQuestions: number
}>()

const emit = defineEmits<{
  restart: []
}>()

const correctCount = computed(() => {
  return props.userAnswers.filter((answer) => answer.isCorrect).length
})

const percentage = computed(() => {
  return Math.round((correctCount.value / props.totalQuestions) * 100)
})

const showCorrectAnswer = (questionIndex: number) => {
  // В реальном приложении здесь можно показать модальное окно
  // или выделить правильный ответ
  alert(`Правильный ответ на вопрос ${questionIndex + 1}: [Здесь будет правильный ответ]`)
}
</script>

<style scoped>
.results-container {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
