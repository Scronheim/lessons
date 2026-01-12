<script setup lang="ts">
import { onMounted } from 'vue'
import ru from 'element-plus/es/locale/lang/ru'

import { useStore } from './stores/store'

const store = useStore()
</script>

<template>
  <el-config-provider :locale="ru">
    <el-container>
      <el-main><router-view /></el-main>
    </el-container>
  </el-config-provider>
</template>

<style scoped></style>
