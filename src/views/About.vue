<template>
  <div @resize="onResize" style="height:calc(100vh - 78px)">

    <div class="header" :style="{height:headerHeight+'px'}">
      <span>size</span>
      <input type="number" style="margin:0 0.5em" v-model="size" />
      <a @click="onResetCellsButton">reset</a>

    </div>
    <div class="container" @mouseout="selectedGroup=undefined">
      <div>
        <template v-for="(c,i) in cells.items" v-if="c.isEraced === false">
          <div :key="i" :class="asClass(c)" :style="asStyle(c)" @click="onClick(c)" @mouseover="onMouseOver(c)">
            {{c.type}}
          </div>
        </template>
      </div>

      <div class="leftside" :style="{width: sideWidth+'px'}"></div>
      <div class="rightside" :style="{width: sideWidth+'px'}"></div>
    </div>

    <div class="footer" :style="{height: footerHeight+'px'}">
      <div>{{cells.items.length}}}</div>
      <div>{{stat}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Cells from '@/models/cells';
import Cell from '@/models/cell';

@Component
export default class HelloWorld extends Vue {
  private size: any = 8;
  private cells = new Cells();
  private stat = '';
  private freeze = false;
  private selectedGroup: number | undefined = undefined;

  private footerHeight = 60;
  private headerHeight = 0;
  private sideWidth = 0;
  private cellSize = 0;
  private containerSize = 0;

  private timer = 0;

  private onResize() {
    if (this.timer > 0) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      const doc = document.documentElement;
      this.containerSize = doc.clientHeight / 16 * 9;
      this.sideWidth = (doc.clientWidth - this.containerSize) / 2;
      this.cellSize = (this.containerSize - this.size * 3) / this.size;
      this.headerHeight =
        doc.clientHeight - this.footerHeight - this.containerSize;
    }, 200);
  }

  private get sizeAsInt() {
    // 明示的にキャストしないと文字列になる事がある
    return parseInt(this.size, 10);
  }

  private created() {
    this.onResetCellsButton();
    window.addEventListener('resize', this.onResize);
  }

  private beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  }

  private onResetCellsButton() {
    this.cells.initialize(this.sizeAsInt, this.sizeAsInt);
    this.onResize();
  }

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private onMouseOver(c: Cell) {
    if (this.freeze) {
      return;
    }
    this.stat = c.stat;
    this.selectedGroup = c.group;
  }

  private async onClick(selected: Cell) {
    if (this.freeze) {
      return;
    }

    const eracedCells = this.cells.resolve1_erace(selected);
    this.$forceUpdate();

    await this.delay(300);

    this.cells.resolve2_drop();
    this.$forceUpdate();

    await this.delay(300);

    this.cells.resolve3_generateDamage(true);
    this.$forceUpdate();

    await this.delay(300);

    this.cells.resolve4_dropDamage();
    this.$forceUpdate();
  }

  private asStyle(c: Cell) {
    return {
      top: this.headerHeight + c.row * (this.cellSize + 3) + 'px',
      left: this.sideWidth + c.col * (this.cellSize + 3) + 'px',
      width: this.cellSize + 'px',
      height: this.cellSize + 'px'
    };
  }

  private asClass(c: Cell) {
    return {
      cell: true,
      mine: c.isMine,
      selectedGroup: c.group === this.selectedGroup
      // type0: c.type === 0,
      // type1: c.type === 1,
      // type2: c.type === 2,
      // type3: c.type === 3,
      // type4: c.type === 4
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.container {
  user-select: none;
}
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
.header {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 10;
  background: gainsboro;
}
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
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
