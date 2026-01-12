<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '../stores/store'

const store = useStore()

const sortedPlayers = computed(() => store.players.sort((a, b) => b.Online - a.Online))
</script>

<template>
  <el-card header="Игроки">
    <div v-for="player in sortedPlayers" :key="player.ID" class="mb-2">
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <div v-if="player.Online" class="h-3 w-3 rounded-full bg-lime-500" />
          <div v-else class="h-3 w-3 rounded-full bg-gray-400" />
          {{ player.Name ? player.Name : player.ID }}
        </div>
        <el-progress :percentage="player.PlayerHP" :color="store.getColor(player.PlayerHP)">{{ player.PlayerHP.toFixed(0) }}%</el-progress>
      </div>
    </div>
  </el-card>
</template>

<style scoped></style>
