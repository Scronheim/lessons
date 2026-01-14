<script setup lang="ts">
import ru from 'element-plus/es/locale/lang/ru'
</script>

<template>
  <el-config-provider :locale="ru">
    <el-container>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-config-provider>
</template>

<style scoped></style>
