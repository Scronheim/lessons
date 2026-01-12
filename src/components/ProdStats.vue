<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '../stores/store'

const store = useStore()

const filter = ref<string>('')

const filteredStats = computed(() => store.prodStats.filter((s) => s.Name.toLowerCase().includes(filter.value.toLowerCase())))
</script>

<template>
  <el-card header="Статистика производства">
    <el-input v-model="filter" placeholder="Фильтр" />
    <div class="grid grid-cols-3 gap-2">
      <div v-for="item in filteredStats" class="flex flex-col items-center justify-center">
        <el-image style="width: 50px; height: 50px" :src="`http://${store.hostname}/Icons/${item.ClassName}.png`" />
        <el-text>{{ item.Name }}</el-text>
        <el-text>{{ item.ProdPerMin }}</el-text>
        <el-text>Max P: {{ item.MaxProd.toFixed(1) }} - C: {{ item.MaxConsumed.toFixed(1) }}</el-text>
      </div>
    </div>
  </el-card>
</template>

<style scoped></style>
