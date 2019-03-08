<template>
  <div class="playarea" v-if="game">
    <div class="select1" :style="asSelectStyle(game.actions.select1)" />
    <div class="select2" :style="asSelectStyle(game.actions.select2)" />
    <div class="enemySelect1" :style="asSelectStyle(game.actions.enemySelect1)" />
    <div class="enemySelect2" :style="asSelectStyle(game.actions.enemySelect2)" />

    <template v-for="(c,i) in game.cells.items" v-if="c.isEraced === false">
      <div :key="i" :class="asClass(c)" :style="asStyle(c)" @click="onClick(c)" @mouseover="onMouseOver(c)">
        {{c.type}}
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Cells from '@/models/paz/Cells';
import Cell from '@/models/paz/Cell';
import layout from '@/models/Layout';
import Game from '@/models/paz/Game';
import EracedCells from '@/models/paz/EracedCells';

@Component
export default class extends Vue {
  @Prop() private game: Game;
  private layout = layout;

  private selectedGroup: number | undefined = -1; // undefinedにするとなぜか動かない
  private freeze = false;

  private onMouseOver(c: Cell) {
    if (this.game.freeze === false) {
      this.selectedGroup = c.group;
    }
  }

  private async onClick(selected: Cell) {
    if (this.game.freeze === false) {
      this.game.actions.select(selected);
    }
  }

  private asSelectStyle(c: Cell | null) {
    if (c) {
      return {
        top:
          this.layout.headerHeight +
          c.row * (this.layout.cellSize + 3) -
          1 +
          'px',
        left:
          this.layout.sideWidth + c.col * (this.layout.cellSize + 3) - 1 + 'px',
        width: this.layout.cellSize + 2 + 'px',
        height: this.layout.cellSize + 2 + 'px'
      };
    } else {
      return {
        display: 'none'
      };
    }
  }

  private asStyle(c: Cell) {
    return {
      top: this.layout.headerHeight + c.row * (this.layout.cellSize + 3) + 'px',
      left: this.layout.sideWidth + c.col * (this.layout.cellSize + 3) + 'px',
      width: this.layout.cellSize + 'px',
      height: this.layout.cellSize + 'px'
    };
  }

  private asClass(c: Cell) {
    return {
      cell: true,
      mine: c.isMine,
      selectedGroup: this.selectedGroup && c.group === this.selectedGroup
      // type0: c.type === 0,
      // type1: c.type === 1,
      // type2: c.type === 2,
      // type3: c.type === 3,
      // type4: c.type === 4
    };
  }
}
</script>

<style scoped>
.playarea div {
  transition: all 200ms 0s ease;
}
.cell {
  cursor: pointer;
  position: absolute;
  border-radius: 10px;
  /* border: 1px solid rgb(136, 154, 255); */
}
.cell:hover {
  color: #42b983;
}
.mine {
  /* border: 1px solid rgb(255, 136, 136); */
}
.type0 {
  border: 1px solid rgb(185, 21, 21);
  background: rgb(255, 110, 110);
}
.type1 {
  border: 1px solid rgb(21, 51, 185);
  background: rgb(110, 137, 255);
}
.type2 {
  border: 1px solid rgb(21, 185, 62);
  background: rgb(110, 255, 141);
}
.type3 {
  border: 1px solid rgb(185, 147, 21);
  background: rgb(255, 240, 110);
}
.selectedGroup {
  background: #c3fff4;
}
.select1 {
  position: absolute;
  transition: all 200ms 0s ease;
  border: 1px solid cornflowerblue;
}
.select2 {
  position: absolute;
  transition: all 200ms 0s ease;
  border: 1px solid blue;
}
.enemySelect1 {
  position: absolute;
  transition: all 200ms 0s ease;
  border: 1px solid orange;
}
.enemySelect2 {
  position: absolute;
  transition: all 200ms 0s ease;
  border: 1px solid red;
}
</style>
