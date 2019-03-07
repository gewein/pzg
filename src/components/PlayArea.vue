<template>
  <div v-if="game">
    <div style="z-index:1000">{{selectedGroup}}</div>
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

@Component
export default class extends Vue {
  @Prop() private game: Game;
  private layout = layout;

  private selectedGroup: number | undefined = -1; // undefinedにするとなぜか動かない
  private freeze = false;

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private onMouseOver(c: Cell) {
    if (this.freeze) {
      return;
    }

    this.selectedGroup = c.group;
  }

  private async onClick(selected: Cell) {
    if (this.freeze) {
      return;
    }

    this.freeze = true;

    const eracedCells = this.game.cells.resolve1_erace(selected);
    this.$forceUpdate();

    await this.delay(300);

    this.game.unit.resolveCells(eracedCells);

    await this.delay(300);

    this.game.cells.resolve2_drop();
    this.$forceUpdate();

    await this.delay(300);

    this.game.cells.resolve3_generateDamage(true);
    this.$forceUpdate();

    await this.delay(300);

    this.game.cells.resolve4_dropDamage();
    this.$forceUpdate();

    this.freeze = false;
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
.cell {
  cursor: pointer;
  position: absolute;
  transition: all 200ms 0s ease;
  border-radius: 10px;
  border: 1px solid rgb(136, 154, 255);
}
.cell:hover {
  color: #42b983;
}
.mine {
  border: 1px solid rgb(255, 136, 136);
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
</style>
