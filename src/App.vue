<script setup lang="ts">
import ru from 'element-plus/es/locale/lang/ru'
</script>

<template>
  <el-config-provider :locale="ru">
    <el-container>
      <el-main>
        <div class="flex flex-col items-center justify-center" style="height: 95vh">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-config-provider>
</template>

<style scoped></style>
