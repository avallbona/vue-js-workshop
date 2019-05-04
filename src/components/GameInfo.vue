<template>
    <div class="game-info">
        <button @click="restartGame">New game</button>
    </div>
</template>

<script>
  export default {
    name: 'GameInfo',
    methods: {
      restartGame() {
         this.$store.dispatch('newGame');
      }
    }
  }
</script>

<style lang="scss">

    .game-info {

    }

</style>