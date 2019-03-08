<template>
  <div style="position:relative">
    <div class="lifebar" :style="{width:width+'px'}" />
    <div class="life" :style="{width:lifeWidth+'px'}" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import layout from '@/models/Layout';
import Unit from '@/models/paz/Unit';
import Game from '@/models/paz/Game';

@Component
export default class extends Vue {
  @Prop() private game: Game;

  private layout = layout;

  private get width() {
    return this.layout.containerSize - 10;
  }
  private get lifeWidth() {
    return this.game.unit.life / this.game.unit.lifeMax * this.width;
  }
}
</script>

<style>
.lifebar {
  position: absolute;
  margin: 4px;
  height: 5px;
  border: 1px solid rgb(51, 51, 51);
  background: rgb(87, 87, 87);
  z-index: 1;
}
.life {
  position: absolute;
  margin: 5px;
  height: 5px;
  background: rgb(22, 214, 141);
  transition: all 200ms 0s ease;
  z-index: 2;
}
</style>
