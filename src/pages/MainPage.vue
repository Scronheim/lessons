<template>
  <div class="min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
    <!-- Декоративные элементы -->
    <div class="animate-blob absolute top-0 left-0 h-72 w-72 rounded-full bg-purple-300 opacity-70 mix-blend-multiply blur-xl filter"></div>
    <div
      class="animate-blob animation-delay-2000 absolute top-0 right-0 h-72 w-72 rounded-full bg-yellow-300 opacity-70 mix-blend-multiply blur-xl filter"
    ></div>
    <div
      class="animate-blob animation-delay-4000 absolute -bottom-8 left-20 h-72 w-72 rounded-full bg-pink-300 opacity-70 mix-blend-multiply blur-xl filter"
    ></div>

    <div class="relative container mx-auto px-4 py-8 md:py-16">
      <!-- Header -->
      <header class="mb-12 flex items-center justify-between md:mb-16">
        <div class="flex items-center space-x-2">
          <el-icon class="text-3xl text-indigo-600">
            <Flower />
          </el-icon>
          <span class="text-xl font-bold text-gray-800">Арома Школа</span>
        </div>

        <el-button type="primary" plain @click="goToLessons" class="hidden items-center md:flex">
          <el-icon class="mr-2"><Reading /></el-icon>
          Перейти к урокам
        </el-button>
      </header>

      <!-- Основной контент -->
      <main class="mx-auto max-w-4xl">
        <div class="mb-12 text-center">
          <span class="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
            Добро пожаловать!
          </span>
          <h1 class="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-5xl lg:text-6xl">
            ШКОЛА <span class="text-indigo-600">НОВИЧКА</span>
          </h1>

          <div class="relative mb-8 inline-block">
            <h2 class="mb-8 text-2xl text-gray-700 md:text-3xl">Ура!!! Теперь ты с нами!</h2>
            <div
              class="absolute -bottom-2 left-1/2 h-1 w-32 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            ></div>
          </div>
        </div>

        <!-- Блок с текстом -->
        <div class="mb-12 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm md:p-8">
          <div class="mb-6 flex items-start space-x-4">
            <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
              <el-icon class="text-2xl text-indigo-600">
                <StarFilled />
              </el-icon>
            </div>
            <div>
              <h3 class="mb-2 text-xl font-bold text-gray-900">Советы от опытных ароматерапевтов</h3>
              <p class="text-lg text-gray-700">
                Советуем ознакомиться с накопленным нами опытом и знаниями, которые помогут вам начать свой путь в мире ароматерапии.
              </p>
            </div>
          </div>

          <!-- Декоративная цитата -->
          <div class="relative my-8 border-l-4 border-indigo-400 pl-6">
            <el-icon class="absolute top-0 -left-3 rounded-full bg-white p-1 text-indigo-400">
              <QuoteLeft />
            </el-icon>
            <p class="text-gray-600 italic">
              Ароматерапия — это не просто запахи, это целая наука о гармонии тела и души через природные эфирные масла.
            </p>
          </div>
        </div>

        <!-- Преимущества -->
        <div class="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div class="rounded-xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <el-icon class="text-2xl text-blue-600">
                <VideoPlay />
              </el-icon>
            </div>
            <h4 class="mb-2 font-bold text-gray-900">Видео-уроки</h4>
            <p class="text-gray-600">Наглядные инструкции от экспертов с пошаговыми объяснениями</p>
          </div>

          <div class="rounded-xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <el-icon class="text-2xl text-green-600">
                <QuestionFilled />
              </el-icon>
            </div>
            <h4 class="mb-2 font-bold text-gray-900">Тестирование знаний</h4>
            <p class="text-gray-600">Проверочные вопросы после каждого урока для закрепления материала</p>
          </div>

          <div class="rounded-xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100">
              <el-icon class="text-2xl text-purple-600">
                <Trophy />
              </el-icon>
            </div>
            <h4 class="mb-2 font-bold text-gray-900">Прогресс обучения</h4>
            <p class="text-gray-600">Отслеживайте свой прогресс и получайте достижения</p>
          </div>
        </div>

        <!-- Призыв к действию -->
        <div class="text-center">
          <div class="mb-8">
            <h3 class="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">Готовы начать обучение?</h3>
            <p class="mx-auto mb-6 max-w-2xl text-gray-600">
              Присоединяйтесь к сообществу начинающих ароматерапевтов и откройте для себя мир природных ароматов!
            </p>
          </div>

          <div class="flex flex-col justify-center gap-4 sm:flex-row">
            <el-button
              type="primary"
              size="large"
              @click="goToLessons"
              class="transform px-8 py-6 text-lg shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <span class="flex items-center">
                <el-icon class="mr-3">
                  <Reading />
                </el-icon>
                Начать обучение
              </span>
            </el-button>

            <el-button type="info" size="large" @click="showInfo" class="px-8 py-6 text-lg" plain>
              <span class="flex items-center">
                <el-icon class="mr-3">
                  <InfoFilled />
                </el-icon>
                Подробнее о курсе
              </span>
            </el-button>
          </div>

          <!-- Статистика -->
          <div class="mt-12 border-t border-gray-200 pt-8">
            <div class="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div class="text-center">
                <div class="text-3xl font-bold text-indigo-600">2</div>
                <div class="text-gray-600">Урока</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-green-600">10+</div>
                <div class="text-gray-600">Вопросов</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-600">∞</div>
                <div class="text-gray-600">Повторений</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-purple-600">100%</div>
                <div class="text-gray-600">Практика</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="mt-16 border-t border-gray-200 pt-8">
        <div class="flex flex-col items-center justify-between md:flex-row">
          <div class="mb-4 md:mb-0">
            <div class="flex items-center space-x-2">
              <el-icon class="text-2xl text-indigo-600">
                <Flower />
              </el-icon>
              <span class="text-lg font-semibold text-gray-800">Арома Школа</span>
            </div>
            <p class="mt-2 text-sm text-gray-600">Образовательная платформа по ароматерапии для начинающих</p>
          </div>

          <div class="flex space-x-4">
            <el-button type="text" class="text-gray-600 hover:text-indigo-600">
              <el-icon><ChatDotRound /></el-icon>
            </el-button>
            <el-button type="text" class="text-gray-600 hover:text-indigo-600">
              <el-icon><HelpFilled /></el-icon>
            </el-button>
            <el-button type="text" class="text-gray-600 hover:text-indigo-600">
              <el-icon><Setting /></el-icon>
            </el-button>
          </div>
        </div>

        <div class="mt-6 text-center text-sm text-gray-500">© 2024 Арома Школа. Все права защищены.</div>
      </footer>
    </div>

    <!-- Диалог с информацией -->
    <el-dialog v-model="showInfoDialog" title="О курсе" width="90%" class="max-w-md">
      <div class="space-y-4">
        <p class="text-gray-700">
          Этот курс разработан специально для новичков в ароматерапии. Мы собрали самую важную и практическую информацию, чтобы вы могли
          начать использовать эфирные масла безопасно и эффективно.
        </p>
        <div class="rounded-lg bg-blue-50 p-4">
          <h4 class="mb-2 font-semibold text-blue-800">Что вы узнаете:</h4>
          <ul class="list-disc space-y-1 pl-5 text-blue-700">
            <li>Основные инструменты для работы</li>
            <li>Правила безопасности</li>
            <li>Методы применения масел</li>
            <li>Советы по хранению</li>
          </ul>
        </div>
        <p class="text-sm text-gray-500">Курс бесплатный и доступен всем зарегистрированным пользователям.</p>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showInfoDialog = false">Закрыть</el-button>
          <el-button type="primary" @click="goToLessons">Начать обучение</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Reading,
  StarFilled,
  VideoPlay,
  QuestionFilled,
  Trophy,
  InfoFilled,
  ChatDotRound,
  HelpFilled,
  Setting,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const showInfoDialog = ref(false)

const goToLessons = () => {
  router.push('/lessons')
}

const showInfo = () => {
  showInfoDialog.value = true
}

// Анимация для мобильного приветствия
const showMobileWelcome = ref(false)

// Показать приветствие на мобильных устройствах
if (window.innerWidth < 768) {
  setTimeout(() => {
    showMobileWelcome.value = true
    setTimeout(() => {
      showMobileWelcome.value = false
    }, 3000)
  }, 1000)
}
</script>

<style scoped>
/* Стили для стеклянного морфизма */
.glass-effect {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
</style>
