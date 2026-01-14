<template>
  <div class="theory-content">
    <!-- Видео -->
    <div class="mb-8">
      <h3 class="mb-4 flex items-center text-lg font-semibold text-gray-700">
        <el-icon class="mr-2"><VideoCamera /></el-icon>
        Видеоурок
      </h3>
      <div class="overflow-hidden rounded-lg bg-gray-900">
        <iframe
          :src="lesson.video"
          class="h-64 w-full md:h-96"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <!-- Текст урока -->
    <div class="prose max-w-none">
      <div v-for="(item, index) in lesson.text" :key="index">
        <p v-if="item.type === 'p'" class="mb-4 leading-relaxed text-gray-700">
          {{ item.content }}
        </p>
        <h3 v-else-if="item.type === 'h3'" class="mt-8 mb-4 flex items-center text-xl font-bold text-gray-800">
          {{ item.content }}
        </h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VideoCamera } from '@element-plus/icons-vue'
import type { Lesson } from '../types/lesson'

defineProps<{
  lesson: Lesson
}>()
</script>
