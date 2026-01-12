<script setup lang="ts">
import { ref, computed } from 'vue'

import { useStore } from '../stores/store'

import type { Power, Generator } from '@/types'

const store = useStore()

const selectedCircuitGroup = computed(() => {
  return store.power[store.selectedCircuitGroupIndex]
})
const selectedCircuitGroupGenerators = computed(() => {
  return store.generators.filter((g: Generator) => g.PowerInfo.CircuitGroupID === selectedCircuitGroup.value.CircuitGroupID)
})
// Biomass
const biomassGenerators = computed(() =>
  selectedCircuitGroupGenerators.value.filter((g: Generator) => g.ClassName === 'Build_GeneratorBiomass_Automated_C')
)
const biomassGeneratorsCapacitySum = computed(() =>
  biomassGenerators.value.reduce((acc: number, currentValue: Generator) => acc + currentValue.ProductionCapacity, 0)
)
// Coal
const coalGenerators = computed(() =>
  selectedCircuitGroupGenerators.value.filter((g: Generator) => g.ClassName === 'Build_GeneratorCoal_C')
)
const coalGeneratorsCapacitySum = computed(() =>
  coalGenerators.value.reduce((acc: number, currentValue: Generator) => acc + currentValue.ProductionCapacity, 0)
)
// Fuel
const fuelPoweredGenerators = computed(() =>
  selectedCircuitGroupGenerators.value.filter((g: Generator) => g.ClassName === 'Build_GeneratorFuel_C')
)
const fuelPoweredGeneratorsCapacitySum = computed(() =>
  fuelPoweredGenerators.value.reduce((acc: number, currentValue: Generator) => acc + currentValue.ProductionCapacity, 0)
)
// Geothermal
const geoThermalGenerators = computed(() =>
  selectedCircuitGroupGenerators.value.filter((g: Generator) => g.ClassName === 'Build_GeneratorGeoThermal_C')
)
const geoThermalGeneratorsCapacitySum = computed(() =>
  geoThermalGenerators.value.reduce((acc: number, currentValue: Generator) => acc + currentValue.ProductionCapacity, 0)
)
// Nuclear
const nuclearGenerators = computed(() =>
  selectedCircuitGroupGenerators.value.filter((g: Generator) => g.ClassName === 'Build_GeneratorNuclear_C')
)
const nuclearGeneratorsCapacitySum = computed(() =>
  nuclearGenerators.value.reduce((acc: number, currentValue: Generator) => acc + currentValue.ProductionCapacity, 0)
)

const getCircuitGroupLabel = (group: Power) => {
  return `${group.CircuitGroupID} - ${group.PowerCapacity.toFixed(2)} MW`
}
</script>

<template>
  <el-card header="Электроэнергия">
    <el-text>Сеть</el-text>
    <el-select v-model.number="store.selectedCircuitGroupIndex" placeholder="Выберите электросеть">
      <el-option v-for="(group, index) in store.power" :key="group.CircuitGroupID" :label="getCircuitGroupLabel(group)" :value="index" />
    </el-select>
    <el-descriptions v-if="selectedCircuitGroup" title="Статистика" direction="vertical" :column="4">
      <el-descriptions-item label="Ёмкость">{{ selectedCircuitGroup.PowerCapacity.toFixed(1) }} MW</el-descriptions-item>
      <el-descriptions-item label="Потребление">{{ selectedCircuitGroup.PowerConsumed.toFixed(1) }} MW</el-descriptions-item>
      <el-descriptions-item label="Макс. потребление">{{ selectedCircuitGroup.PowerMaxConsumed.toFixed(1) }} MW</el-descriptions-item>
      <el-descriptions-item label="Производство">{{ selectedCircuitGroup.PowerProduction.toFixed(1) }} MW</el-descriptions-item>
    </el-descriptions>
    <el-descriptions v-if="selectedCircuitGroup" title="Генераторы" direction="vertical" :column="3">
      <el-descriptions-item label="Атомные" align="center">
        <div class="flex flex-col items-center">
          <el-image style="width: 100px; height: 100px" :src="`http://${store.hostname}/Icons/Build_GeneratorNuclear_C.png`" />
          {{ nuclearGenerators.length }} шт. ({{ nuclearGeneratorsCapacitySum }} MW)
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="Геотермальные" align="center">
        <div class="flex flex-col items-center">
          <el-image style="width: 100px; height: 100px" :src="`http://${store.hostname}/Icons/Build_GeneratorGeoThermal_C.png`" />
          {{ geoThermalGenerators.length }} шт. ({{ geoThermalGeneratorsCapacitySum.toFixed(0) }} MW)
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="Топливные" align="center">
        <div class="flex flex-col items-center">
          <el-image style="width: 100px; height: 100px" :src="`http://${store.hostname}/Icons/Build_GeneratorFuel_C.png`" />
          {{ fuelPoweredGenerators.length }} шт. ({{ fuelPoweredGeneratorsCapacitySum }} MW)
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="Угольные" align="center">
        <div class="flex flex-col items-center">
          <el-image style="width: 100px; height: 100px" :src="`http://${store.hostname}/Icons/Build_GeneratorCoal_C.png`" />
          {{ coalGenerators.length }} шт. ({{ coalGeneratorsCapacitySum }} MW)
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="Биомассовые" align="center">
        <div class="flex flex-col items-center">
          <el-image style="width: 100px; height: 100px" :src="`http://${store.hostname}/Icons/Build_GeneratorBiomass_Automated_C.png`" />
          {{ biomassGenerators.length }} шт. ({{ biomassGeneratorsCapacitySum }} MW)
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<style scoped></style>
