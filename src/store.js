import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const fillRandomPattern = (matrix, patternSize) => {
  const totalTiles = matrix.length * 2;
  let leftPatternTiles = patternSize;
  while (leftPatternTiles > 0) {
    const newRowRandom = Math.round(Math.random() * (totalTiles - 1));
    const newColumnRandom = Math.round(Math.random() * (totalTiles - 1));
    if (newRowRandom >= matrix.length ||
      newColumnRandom >= matrix.length) {
      // Avoid going above the matrix boundaries due to rounding
      continue; // eslint-disable-line no-continue
    }
    // Only update the count on cells that are empty
    const cell = matrix[newRowRandom][newColumnRandom];
    if (cell.content !== 'pattern') {
      cell.content = 'pattern';
      leftPatternTiles -= 1;
    }
  }
};

const initMatrix = (gameSize) => {
  const matrix = [];
  for (let row = 0; row < gameSize; row += 1) {
    const rowColumns = [];
    for (let col = 0; col < gameSize; col += 1) {
      rowColumns.push({
        display: true,
        content: 'empty',
        showResult: false,
      });
    }
    matrix.push(rowColumns);
  }
  fillRandomPattern(matrix, GAME_SIZE);
  return matrix;
};

const GAME_SIZE = 4;

const matrixState = {
  matrix: initMatrix(GAME_SIZE),
  revealedTiles: 0,
  successTiles: 0
};


export default new Vuex.Store({
  state: matrixState,
  mutations: {
    updateMatrix(state, newMatrix) {
      state.matrix = newMatrix
    },
    setRevealedTiles(state, result) {
      state.revealedTiles = result.revealed;
      state.successTiles = result.success;
    },
    updateTile(state, {row, column, updatedTile}) {
      const updatedMatrix = Object.assign({}, state.matrix);
      updatedMatrix[row][column] = updatedTile;
      state.matrix = updatedMatrix;
    },
  },
  actions: {
    newGame(context) {
      const newMatrix = initMatrix(GAME_SIZE);
      context.commit('updateMatrix', newMatrix);
      context.commit('setRevealedTiles', {
        revealed: 0,
        success: 0
      });

      // Función “newGame”, al final de todo
      setTimeout(() => {
        context.dispatch('togglePatternVisibility', false);
      }, 2500)

    },
    // Nueva “action”
    togglePatternVisibility(context, doShow) {
      // Opción 1: usando Array.map
      const updatedMatrix = context.state.matrix.map((row) => {
        return row.map((cell) => Object.assign({}, cell, {display: doShow}));
      });
      context.commit('updateMatrix', updatedMatrix);
      // Opción 2: https://github.com/celdrake/i-love-vue/blob/master/src/store.js#L75
    },
    revealTile(context, tile) {
      const state = context.state;
      if (state.revealedTiles === GAME_SIZE) {
        return;
      }
      const isSuccess = tile.content === 'pattern';
      const totalrevealed = state.revealedTiles + 1;

      //mutate the tile
      tile.content = isSuccess ? 'click-success' : 'click-error';
      tile.display = true;
      context.commit('setRevealedTiles', {
        revealed: totalrevealed,
        success: isSuccess,
      });

      if (totalrevealed === GAME_SIZE) {
        context.dispatch('onEndGame')
      }
    },
    onEndGame(context) {
      context.state.matrix.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          const cellCount = (rowIndex * GAME_SIZE) + cellIndex;
          // Podemos mutar directamente (o usar “updateTile”)
          setTimeout(() => {
            cell.display = true;
            // TODO definir propiedad a nivel de “matrix”
            cell.showResult = true;
          }, 200 * cellCount);
        });
      });
    }
  }
})
