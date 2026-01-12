<script setup lang="ts">
import { useStore } from '../stores/store'

const store = useStore()
</script>

<template>
  <el-card header="Сессия">
    <div class="flex flex-col">
      <el-text>Имя сессии: {{ store.sessionInfo?.SessionName }}</el-text>
      <el-text>Время игры: {{ store.sessionInfo?.TotalPlayDurationText }}</el-text>
      <el-text>Дней: {{ store.sessionInfo?.PassedDays }}</el-text>
      <el-text>С последнего инцидента: {{ store.sessionInfo?.NumberOfDaysSinceLastDeath }}</el-text>
      <el-divider style="margin: 10px 0" />
      <el-text>Купонов: {{ store.resourceSink?.NumCoupon }}</el-text>
      <el-text>Купоны за ресурсы</el-text>
      <el-progress :percentage="store.resourceSink?.Percent" :stroke-width="20" text-inside status="success">
        {{ store.resourceSink?.Percent.toFixed(5) }}%
      </el-progress>
      <el-text>Купоны за исследования</el-text>
      <el-progress :percentage="store.explorationSink?.Percent" :stroke-width="20" text-inside status="success">
        {{ store.explorationSink?.Percent.toFixed(5) }}%
      </el-progress>
    </div>
  </el-card>
</template>

<style scoped></style>
