<template>
  <div style="height:calc(100vh - 78px)">

    <div class="header" :style="headerStyle">
      <span>size</span>
      <input type="number" style="margin:0 0.5em" v-model="sizeAsText" />
      <a @click="onResetCellsButton">reset</a>

    </div>

    <div class="container" :style="containerStyle" @mouseout="selectedGroup=undefined">
      <play-area :game="game" />
    </div>

    <div class="footer" :style="footerStyle">
      <unit :game="game" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import layout from '@/models/Layout';
import PlayAreaVue from '@/components/PlayArea.vue';
import UnitVue from '@/components/Unit.vue';
import Game from '@/models/paz/Game';

@Component({
  components: {
    playArea: PlayAreaVue,
    unit: UnitVue
  }
})
export default class extends Vue {
  private sizeAsText: any = 8;
  private game = new Game();
  private layout = layout;

  private get headerStyle() {
    return {
      height: layout.headerHeight + 'px',
      left: this.layout.sideWidth + 'px',
      right: this.layout.sideWidth + 'px'
    };
  }

  private get footerStyle() {
    return {
      height: layout.footerHeight + 'px',
      left: this.layout.sideWidth + 'px',
      right: this.layout.sideWidth + 'px'
    };
  }

  private get containerStyle() {
    return {
      left: this.layout.sideWidth + 'px',
      right: this.layout.sideWidth + 'px'
    };
  }

  private created() {
    this.onResetCellsButton();
  }

  private onResetCellsButton() {
    const size = parseInt(this.sizeAsText, 10);
    this.game.cells.initialize(size, size);
    this.layout.setSize(size);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  user-select: none;
}
.header {
  position: absolute;
  z-index: 10;
  background: gainsboro;
}
.footer {
  position: absolute;
  bottom: 0;
  z-index: 10;
  background: gainsboro;
}
.leftside {
  background: gray;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: auto;
  z-index: 100;
}
.rightside {
  background: gray;
  position: absolute;
  top: 0;
  bottom: 0;
  left: auto;
  right: 0;
  z-index: 100;
}
</style>
