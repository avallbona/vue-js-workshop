<template>
  <div class="memory-matrix">
    <game-info></game-info>
    <game-box></game-box>
  </div>
</template>

<script>
// @ is an alias to /src
import GameInfo from '@/components/GameInfo.vue'
import GameBox from '@/components/GameBox.vue'

export default {
  name: 'MemoryMatrix',
  components: {
    GameInfo,
    GameBox
  }
}
</script>
