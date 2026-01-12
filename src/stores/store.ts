import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import type { Player, Power, Generator, SessionInfo, Sink, ProdStat, ResourceNode, SocketAnswer } from '../types'

export const useStore = defineStore('store', () => {
  // Refs
  let socket: WebSocket | null = null

  const players = ref<Player[]>([])
  const power = ref<Power[]>([])
  const selectedCircuitGroupIndex = ref<number>(0)
  const generators = ref<Generator[]>([])
  const sessionInfo = ref<SessionInfo>()
  const resourceSink = ref<Sink>()
  const explorationSink = ref<Sink>()
  const prodStats = ref<ProdStat[]>([])
  const resourceNodes = ref<ResourceNode[]>([])

  const hostname = ref<string>(import.meta.env.DEV ? 'localhost:5173' : `${location.hostname}:8080`)
  // Computed
  const onlinePlayers = computed(() => players.value.filter((p) => p.Online))

  // Methods
  const connectToSocket = async (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      socket = new WebSocket(`ws://${import.meta.env.DEV ? '178.47.142.231:8080' : hostname.value}`)
      socket.onopen = function (e) {
        console.log('socket connected')
        resolve(true)
      }
      socket.onerror = function (e) {
        reject(false)
      }
      socket.onmessage = parseSocketMessage
    })
  }

  const parseSocketMessage = (e: MessageEvent): void => {
    const data: SocketAnswer = JSON.parse(e.data)
    switch (data.endpoint) {
      case 'getPlayer':
        players.value = data.data
        break
      case 'getPower':
        power.value = data.data
        selectedCircuitGroupIndex.value = findMaxPowerCapacityIndex(power.value)
        break
      case 'getGenerators':
        generators.value = data.data
        break
      case 'getResourceSink':
        resourceSink.value = data.data[0]
        break
      case 'getExplorationSink':
        explorationSink.value = data.data[0]
        break
      case 'getProdStats':
        prodStats.value = data.data
        break
      case 'getResourceNode':
        resourceNodes.value = data.data
        unsubscribeResourceNodes()
        break
      default:
        if (data.SessionName) sessionInfo.value = data
    }
  }

  const subscribeAll = () => {
    socket?.send(
      JSON.stringify({
        action: 'subscribe',
        endpoints: [
          'getPlayer',
          'getPower',
          'getGenerators',
          'getSessionInfo',
          'getResourceSink',
          'getExplorationSink',
          'getProdStats',
          'getResourceNode',
        ],
      })
    )
  }
  const unsubscribeResourceNodes = () => {
    socket?.send(
      JSON.stringify({
        action: 'unsubscribe',
        endpoints: 'getResourceNode',
      })
    )
  }
  // const subscribePower = () => {
  //   socket?.send(
  //     JSON.stringify({
  //       action: 'subscribe',
  //       endpoints: 'getPower',
  //     })
  //   )
  // }
  // const subscribeGenerators = () => {
  //   socket?.send(
  //     JSON.stringify({
  //       action: 'subscribe',
  //       endpoints: 'getGenerators',
  //     })
  //   )
  // }
  // const subscribeSessionInfo = () => {
  //   socket?.send(
  //     JSON.stringify({
  //       action: 'subscribe',
  //       endpoints: 'getSessionInfo',
  //     })
  //   )
  // }

  const getColor = (percent: number): string => {
    if (percent >= 85) return '#13ce66'
    else if (percent >= 50) return '#20a0ff'
    else if (percent >= 25) return '#e6a23c'
    else return '#ff4949'
  }

  const findMaxPowerCapacityIndex = (power: Power[]): number => {
    if (!Array.isArray(power) || power.length === 0) return -1

    let maxIndex = 0
    let maxCapacity = power[0].PowerCapacity

    for (let i = 1; i < power.length; i++) {
      const currentCapacity = power[i].PowerCapacity

      if (currentCapacity > maxCapacity) {
        maxCapacity = currentCapacity
        maxIndex = i
      }
    }

    return maxIndex
  }

  return {
    players,
    power,
    selectedCircuitGroupIndex,
    generators,
    onlinePlayers,
    sessionInfo,
    resourceSink,
    explorationSink,
    prodStats,
    resourceNodes,
    connectToSocket,
    subscribeAll,
    unsubscribeResourceNodes,
    // subscribePlayers,
    // subscribePower,
    // subscribeGenerators,
    // subscribeSessionInfo,
    getColor,
    hostname,
  }
})
