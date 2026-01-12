<template>
  <div class="satisfactory-map-container">
    <div v-if="!mapReady" class="loading">Загрузка карты...</div>
    <div class="map-container" :style="{ height: mapHeight + 'px' }">
      <l-map
        ref="mapRef"
        :crs="crs"
        :zoom="zoom"
        :center="center"
        :min-zoom="minZoom"
        :max-zoom="maxZoom"
        :max-bounds="maxBounds"
        @ready="onMapReady"
      >
        <l-image-overlay :url="mapImageUrl" :bounds="imageBounds" :opacity="mapOpacity" />

        <!-- Маркеры ресурсов -->
        <l-marker
          v-for="resource in filteredResources"
          :key="resource.ID"
          :lat-lng="getResourceLatLng(resource)"
          @click="selectResource(resource)"
        >
          <l-icon :icon-url="getIconUrl(resource)" :icon-size="getIconSize(resource)" :icon-anchor="[16, 16]" />

          <l-tooltip>
            <div class="resource-tooltip">
              <h4>{{ resource.Name }}</h4>
              <p>Чистота: {{ getPurityText(resource.EnumPurity) }}</p>
              <p>Форма: {{ getResourceFormText(resource.ResourceForm) }}</p>
              <p v-if="resource.Exploited" class="exploited">Эксплуатируется</p>
              <p>X: {{ Math.round(resource.location.x) }}, Y: {{ Math.round(resource.location.y) }}</p>
            </div>
          </l-tooltip>

          <l-popup>
            <div class="resource-popup">
              <h3>{{ resource.Name }}</h3>
              <div class="resource-details">
                <div class="detail">
                  <span class="label">ID:</span>
                  <span class="value">{{ resource.ID }}</span>
                </div>
                <div class="detail">
                  <span class="label">Чистота:</span>
                  <span class="value purity" :class="getPurityClass(resource.EnumPurity)">
                    {{ getPurityText(resource.EnumPurity) }}
                  </span>
                </div>
                <div class="detail">
                  <span class="label">Форма:</span>
                  <span class="value">{{ getResourceFormText(resource.ResourceForm) }}</span>
                </div>
                <div class="detail">
                  <span class="label">Игровые координаты:</span>
                  <span class="value"> X: {{ Math.round(resource.location.x) }}, Y: {{ Math.round(resource.location.y) }} </span>
                </div>
                <div class="detail">
                  <span class="label">Координаты на карте:</span>
                  <span class="value">
                    X: {{ getMapX(resource.location.x).toFixed(1) }}, Y: {{ getMapY(resource.location.y).toFixed(1) }}
                  </span>
                </div>
                <div class="detail">
                  <span class="label">Статус:</span>
                  <span class="value" :class="{ exploited: resource.Exploited }">
                    {{ resource.Exploited ? 'Эксплуатируется' : 'Свободен' }}
                  </span>
                </div>
              </div>
            </div>
          </l-popup>
        </l-marker>
      </l-map>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { LMap, LImageOverlay, LMarker, LPopup, LTooltip, LControl, LIcon } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'

// Типы для ресурсов
interface ResourceLocation {
  x: number
  y: number
  z: number
  rotation: number
}

interface ResourceGeometry {
  coordinates: {
    x: number
    y: number
    z: number
  }
  type: string
}

interface ResourceProperties {
  name: string
  type: string
}

interface ResourceFeatures {
  properties: ResourceProperties
  geometry: ResourceGeometry
}

interface ResourceNode {
  ID: string
  Name: string
  ClassName: string
  Purity: string
  EnumPurity: string
  ResourceForm: string
  NodeType: string
  Exploited: boolean
  location: ResourceLocation
  features: ResourceFeatures
}

// Пропсы компонента
interface Props {
  resources: ResourceNode[]
  mapHeight?: number
  mapOpacity?: number
  initialZoom?: number
  initialCenter?: [number, number]
}

const props = withDefaults(defineProps<Props>(), {
  mapHeight: 600,
  mapOpacity: 0.8,
  initialZoom: 0,
  initialCenter: () => [0, 0] as [number, number],
})

// Рефы и реактивные переменные
const mapRef = ref<any>(null)
const mapReady = ref(false)
const zoom = ref(props.initialZoom)
const center = ref<[number, number]>(props.initialCenter)
const currentMapCoords = ref({ x: 0, y: 0 })
const currentGameCoords = ref({ x: 0, y: 0 })

// Настройки карты
const mapImageUrl = 'https://satisfactory.wiki.gg/images/Map.jpg?e41e89=&format=original'

// Коэффициент преобразования: 1 пиксель = 150 игровых единиц
const GAME_UNITS_PER_PIXEL = 150

// Размеры изображения карты в пикселях
// Предположим, что изображение имеет размеры 5000x5000 пикселей
const IMAGE_WIDTH_PX = 5000
const IMAGE_HEIGHT_PX = 5000

// Углы карты в игровых координатах
const MAP_CORNERS = {
  topLeft: { x: -325000, y: -375000 }, // Левый верхний
  topRight: { x: 425000, y: -375000 }, // Правый верхний
  bottomLeft: { x: -325000, y: 425000 }, // Левый нижний
  bottomRight: { x: 425000, y: 425000 }, // Правый нижний
}

// Определяем границы карты
const GAME_BOUNDS = {
  minX: MAP_CORNERS.topLeft.x, // -325000
  maxX: MAP_CORNERS.topRight.x, // 425000
  minY: MAP_CORNERS.topLeft.y, // -375000 (верх)
  maxY: MAP_CORNERS.bottomLeft.y, // 425000 (низ)
}

// Ширина и высота карты в игровых единицах
const MAP_WIDTH_GAME = GAME_BOUNDS.maxX - GAME_BOUNDS.minX // 750000
const MAP_HEIGHT_GAME = GAME_BOUNDS.maxY - GAME_BOUNDS.minY // 800000

// Границы изображения в пикселях для CRS.Simple
// Центр изображения в (0,0)
const imageBounds = [
  [-(IMAGE_HEIGHT_PX / 2), -(IMAGE_WIDTH_PX / 2)], // Юго-запад (левый нижний)
  [IMAGE_HEIGHT_PX / 2, IMAGE_WIDTH_PX / 2], // Северо-восток (правый верхний)
] as L.LatLngBoundsExpression

// Настройки отображения
const minZoom = ref(-2)
const maxZoom = ref(3)
const crs = L.CRS.Simple

// Максимальные границы для ограничения области просмотра
const maxBounds = L.latLngBounds(L.latLng(-IMAGE_HEIGHT_PX, -IMAGE_WIDTH_PX), L.latLng(IMAGE_HEIGHT_PX, IMAGE_WIDTH_PX))

// Опции фильтров
const purityOptions = [
  { value: 'RP_Normal', label: 'Нормальная' },
  { value: 'RP_Pure', label: 'Чистая' },
  { value: 'RP_Impure', label: 'Загрязненная' },
  { value: 'RP_Inpure', label: 'Загрязненная' },
]

const resourceFormOptions = [
  { value: 'Solid', label: 'Твердый' },
  { value: 'Liquid', label: 'Жидкий' },
  { value: 'Gas', label: 'Газ' },
]

// Список типов ресурсов
const resourceTypeOptions = [
  'Iron Ore',
  'Copper Ore',
  'Coal',
  'Caterium Ore',
  'Sulfur',
  'Limestone',
  'Crude Oil',
  'Bauxite',
  'Uranium',
  'SAM',
  'Water',
  'Nitrogen Gas',
]

const selectedPurities = ref<string[]>(['RP_Normal', 'RP_Pure', 'RP_Impure', 'RP_Inpure'])
const selectedResourceForms = ref<string[]>(['Solid', 'Liquid', 'Gas'])
const selectedResourceTypes = ref<string[]>(resourceTypeOptions)
const showExploited = ref(true)

// Методы преобразования координат
/**
 * Преобразует игровую координату X в координату на карте (lng в CRS.Simple)
 * X увеличивается на восток (вправо на карте)
 */
const gameXToMapX = (gameX: number): number => {
  // Линейное преобразование: от minX..maxX к -2500..2500
  return ((gameX - GAME_BOUNDS.minX) / MAP_WIDTH_GAME - 0.5) * IMAGE_WIDTH_PX
}

/**
 * Преобразует игровую координату Y в координату на карте (lat в CRS.Simple)
 * В Satisfactory: Y увеличивается на север (вверх на карте)
 * НО! На нашей карте север вверху, а положительный Y игры - это север (вверх)
 * Поэтому положительный Y должен давать положительную lat (север)
 */
const gameYToMapY = (gameY: number): number => {
  // Линейное преобразование: от minY..maxY к 2500..-2500 (инвертируем ось Y)
  // Поскольку в Satisfactory положительный Y - север (вверх), а minY = -375000 (верх карты)
  // то gameY = -375000 (верх) -> lat = 2500 (север/вверх)
  // gameY = 425000 (низ) -> lat = -2500 (юг/вниз)
  return (0.468 - (gameY - GAME_BOUNDS.minY) / MAP_HEIGHT_GAME) * IMAGE_HEIGHT_PX
}

/**
 * Преобразует координату карты X в игровую координату X
 */
const mapXToGameX = (mapX: number): number => {
  // Обратное преобразование для X
  return (mapX / IMAGE_WIDTH_PX) * MAP_WIDTH_GAME + GAME_BOUNDS.minX
}

/**
 * Преобразует координату карты Y в игровую координату Y
 */
const mapYToGameY = (mapY: number): number => {
  // Обратное преобразование для Y
  return (mapY / IMAGE_HEIGHT_PX) * MAP_HEIGHT_GAME + GAME_BOUNDS.minY + GAME_UNITS_PER_PIXEL
}

/**
 * Получает координаты карты из игровых координат
 */
const getResourceLatLng = (resource: ResourceNode): [number, number] => {
  return [
    gameYToMapY(resource.location.y), // lat (Y)
    gameXToMapX(resource.location.x), // lng (X)
  ]
}

/**
 * Получает координату X на карте из игровой координаты X
 */
const getMapX = (gameX: number): number => {
  return gameXToMapX(gameX)
}

/**
 * Получает координату Y на карте из игровой координаты Y
 */
const getMapY = (gameY: number): number => {
  return gameYToMapY(gameY)
}

/**
 * Преобразует координаты карты в игровые координаты
 */
const mapToGameCoords = (lat: number, lng: number): { x: number; y: number } => {
  return {
    x: mapXToGameX(lng),
    y: mapYToGameY(lat),
  }
}

/**
 * Проверяет, находится ли точка в пределах карты
 */
const isWithinMapBounds = (gameX: number, gameY: number): boolean => {
  const mapX = gameXToMapX(gameX)
  const mapY = gameYToMapY(gameY)

  // Проверяем, находится ли точка в пределах изображения
  return mapX >= -(IMAGE_WIDTH_PX / 2) && mapX <= IMAGE_WIDTH_PX / 2 && mapY >= -(IMAGE_HEIGHT_PX / 2) && mapY <= IMAGE_HEIGHT_PX / 2
}

const getIconUrl = (resource: ResourceNode): string => {
  // Иконки для разных типов ресурсов
  const icons: Record<string, string> = {
    // Твердые ресурсы
    'Iron Ore': 'https://satisfactory.wiki.gg/images/Iron_Ore.png',
    'Copper Ore': 'https://satisfactory.wiki.gg/images/Copper_Ore.png',
    Coal: 'https://satisfactory.wiki.gg/images/Coal.png',
    'Caterium Ore': 'https://satisfactory.wiki.gg/images/Caterium_Ore.png',
    Sulfur: 'https://satisfactory.wiki.gg/images/Sulfur.png',
    Limestone: 'https://satisfactory.wiki.gg/images/Limestone.png',
    Bauxite: 'https://satisfactory.wiki.gg/images/Bauxite.png',
    Uranium: 'https://satisfactory.wiki.gg/images/Uranium.png',
    SAM: 'https://satisfactory.wiki.gg/images/SAM.png',
    'Crude Oil': 'https://satisfactory.wiki.gg/images/Crude_Oil.png?9eadf5',
    Water: 'https://satisfactory.wiki.gg/images/Water.png',
    'Nitrogen Gas': 'https://satisfactory.wiki.gg/images/Nitrogen_Gas.png',

    // Общие иконки по типу ресурса
    Solid: '/icons/resource-solid.png',
    Liquid: '/icons/resource-liquid.png',
    Gas: '/icons/resource-gas.png',
  }

  return icons[resource.Name] || icons[resource.ResourceForm] || '/icons/resource-solid.png'
}

const getIconSize = (resource: ResourceNode): [number, number] => {
  // Размер иконки в зависимости от чистоты
  switch (resource.EnumPurity) {
    case 'RP_Pure':
      return [32, 32]
    case 'RP_Normal':
      return [28, 28]
    case 'RP_Impure':
    case 'RP_Inpure':
      return [24, 24]
    default:
      return [28, 28]
  }
}

const getPurityText = (enumPurity: string): string => {
  switch (enumPurity) {
    case 'RP_Pure':
      return 'Чистая'
    case 'RP_Normal':
      return 'Нормальная'
    case 'RP_Impure':
    case 'RP_Inpure':
      return 'Загрязненная'
    default:
      return enumPurity
  }
}

const getPurityClass = (enumPurity: string): string => {
  const purityMap: Record<string, string> = {
    RP_Pure: 'rp_pure',
    RP_Normal: 'rp_normal',
    RP_Impure: 'rp_inpure',
    RP_Inpure: 'rp_inpure',
  }
  return `purity-${purityMap[enumPurity] || 'normal'}`
}

const getResourceFormText = (resourceForm: string): string => {
  switch (resourceForm) {
    case 'Solid':
      return 'Твердый'
    case 'Liquid':
      return 'Жидкий'
    case 'Gas':
      return 'Газ'
    default:
      return resourceForm
  }
}

const selectResource = (resource: ResourceNode) => {
  console.log('Выбран ресурс:', resource)
  emit('resource-selected', resource)
}

const onMapReady = () => {
  mapReady.value = true

  // Обновление координат при движении карты
  const map = mapRef.value?.leafletObject
  if (map) {
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      currentMapCoords.value = { x: lng, y: lat }
      currentGameCoords.value = mapToGameCoords(lat, lng)
    })
  }
}

// Вычисляемые свойства
const filteredResources = computed(() => {
  return props.resources.filter((resource) => {
    // Фильтр по чистоте
    if (!selectedPurities.value.includes(resource.EnumPurity)) {
      return false
    }

    // Фильтр по форме ресурса
    if (!selectedResourceForms.value.includes(resource.ResourceForm)) {
      return false
    }

    // Фильтр по типу ресурса (по названию)
    if (!selectedResourceTypes.value.includes(resource.Name)) {
      return false
    }

    // Фильтр по статусу эксплуатации
    if (!showExploited.value && resource.Exploited) {
      return false
    }

    // Проверка, что ресурс находится в пределах карты
    return isWithinMapBounds(resource.location.x, resource.location.y)
  })
})

// Метод для центрирования карты на конкретном ресурсе
const centerOnResource = (resourceId: string) => {
  const resource = props.resources.find((r) => r.ID === resourceId)
  if (resource && mapRef.value?.leafletObject) {
    const map = mapRef.value.leafletObject
    const latLng = getResourceLatLng(resource)
    map.setView(latLng, 2)
  }
}

// Метод для центрирования на конкретных координатах игры
const centerOnGameCoords = (gameX: number, gameY: number) => {
  if (mapRef.value?.leafletObject) {
    const map = mapRef.value.leafletObject
    const latLng: [number, number] = [gameYToMapY(gameY), gameXToMapX(gameX)]
    map.setView(latLng, 2)
  }
}

// Метод для получения границ всех отфильтрованных ресурсов
const getResourcesBounds = () => {
  if (filteredResources.value.length === 0) return null

  const bounds = L.latLngBounds([])
  filteredResources.value.forEach((resource) => {
    bounds.extend(getResourceLatLng(resource))
  })
  return bounds
}

// Метод для автоматического определения размеров изображения
const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = reject
    img.src = url
  })
}

// Инициализация при монтировании
onMounted(async () => {
  try {
    // Можно автоматически определить размеры изображения
    const dimensions = await getImageDimensions(mapImageUrl)
    console.log('Размеры изображения:', dimensions)
  } catch (error) {
    console.error('Не удалось загрузить размеры изображения:', error)
  }
})

// Экспортируем методы
defineExpose({
  centerOnResource,
  centerOnGameCoords,
  getResourcesBounds,
  filteredResources,
  isWithinMapBounds,
  gameXToMapX,
  gameYToMapY,
  mapXToGameX,
  mapYToGameY,
})

// Очистка при размонтировании
onUnmounted(() => {
  const map = mapRef.value?.leafletObject
  if (map) {
    map.off('mousemove')
  }
})

// Emit события
const emit = defineEmits<{
  'resource-selected': [resource: ResourceNode]
  'map-ready': []
}>()

watch(mapReady, (newVal) => {
  if (newVal) {
    emit('map-ready')
  }
})
</script>

<style scoped>
.satisfactory-map-container {
  width: 100%;
  position: relative;
}

.map-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px 40px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 8px;
  z-index: 1000;
}

.coordinates-display {
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 12px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  line-height: 1.4;
}

.filter-controls {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 300px;
  max-height: 80vh;
  overflow-y: auto;
}

.filters-panel h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  border-bottom: 2px solid #4caf50;
  padding-bottom: 5px;
}

.filter-group {
  margin-bottom: 15px;
}

.filter-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #555;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 150px;
  overflow-y: auto;
  padding: 5px;
}

.filter-options label {
  display: flex;
  align-items: center;
  font-weight: normal;
  cursor: pointer;
  font-size: 14px;
}

.filter-options input[type='checkbox'] {
  margin-right: 8px;
}

.filter-stats {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #eee;
  font-size: 14px;
  color: #666;
  text-align: center;
}

.legend-controls {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 10px 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.legend-panel h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 14px;
  text-align: center;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.legend-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-block;
}

.legend-icon.purity-rp_pure {
  background-color: #4caf50;
  border: 2px solid #2e7d32;
}

.legend-icon.purity-rp_normal {
  background-color: #ffc107;
  border: 2px solid #ff8f00;
}

.legend-icon.purity-rp_inpure {
  background-color: #795548;
  border: 2px solid #5d4037;
}

.legend-icon.resource-solid {
  background-color: #2196f3;
  border: 2px solid #0d47a1;
}

.legend-icon.resource-liquid {
  background-color: #00bcd4;
  border: 2px solid #006064;
}

.legend-icon.resource-gas {
  background-color: #9c27b0;
  border: 2px solid #4a148c;
}

.resource-tooltip {
  padding: 8px;
  min-width: 200px;
}

.resource-tooltip h4 {
  margin: 0 0 8px 0;
  color: #2196f3;
  font-size: 14px;
}

.resource-tooltip p {
  margin: 4px 0;
  font-size: 12px;
  color: #666;
}

.resource-tooltip .exploited {
  color: #f44336;
  font-weight: bold;
}

.resource-popup {
  min-width: 280px;
  padding: 10px;
}

.resource-popup h3 {
  margin: 0 0 12px 0;
  color: #2196f3;
  border-bottom: 2px solid #2196f3;
  padding-bottom: 5px;
  font-size: 16px;
}

.resource-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail:last-child {
  border-bottom: none;
}

.detail .label {
  font-weight: 600;
  color: #555;
  font-size: 13px;
  flex-shrink: 0;
}

.detail .value {
  font-size: 13px;
  color: #333;
  text-align: right;
  flex-grow: 1;
  margin-left: 10px;
  word-break: break-word;
}

.detail .value.exploited {
  color: #f44336;
  font-weight: bold;
}

.purity {
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
}

.purity-rp_pure {
  background-color: rgba(76, 175, 80, 0.2);
  color: #2e7d32;
  border: 1px solid #4caf50;
}

.purity-rp_normal {
  background-color: rgba(255, 193, 7, 0.2);
  color: #ff8f00;
  border: 1px solid #ffc107;
}

.purity-rp_inpure {
  background-color: rgba(121, 85, 72, 0.2);
  color: #5d4037;
  border: 1px solid #795548;
}

/* Стили для Leaflet */
:deep(.leaflet-container) {
  background: #1a1a1a;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

:deep(.leaflet-popup-content) {
  margin: 0;
  line-height: 1.4;
}

:deep(.leaflet-tooltip) {
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-size: 12px;
  padding: 0;
}

:deep(.leaflet-tooltip-top:before) {
  border-top-color: rgba(255, 255, 255, 0.95);
}

:deep(.leaflet-control-attribution) {
  font-size: 11px;
  background: rgba(255, 255, 255, 0.9);
}

/* Адаптивность */
@media (max-width: 768px) {
  .filter-controls {
    max-width: 250px;
    padding: 10px;
  }

  .filters-panel h4 {
    font-size: 14px;
  }

  .filter-group label {
    font-size: 13px;
  }

  .filter-options label {
    font-size: 12px;
  }

  .coordinates-display {
    font-size: 10px;
    padding: 6px 8px;
  }

  .legend-controls {
    padding: 8px 10px;
  }

  .legend-panel h4 {
    font-size: 12px;
  }

  .legend-item {
    font-size: 11px;
  }
}
</style>
